const path = require('path');
const AdmZip = require('adm-zip');
const { DOMParser } = require('@xmldom/xmldom');

const zip = new AdmZip(path.join(__dirname, '..', 'public', 'Typy .pptx'));
const entries = zip.getEntries();

const slideEntries = entries
    .filter(e => /ppt\/slides\/slide\d+\.xml/.test(e.entryName))
    .sort((a, b) => {
        const numA = parseInt(a.entryName.match(/slide(\d+)/)[1]);
        const numB = parseInt(b.entryName.match(/slide(\d+)/)[1]);
        return numA - numB;
    });

slideEntries.forEach(entry => {
    const xml = entry.getData().toString('utf8');
    const doc = new DOMParser().parseFromString(xml, 'text/xml');

    const slideNum = entry.entryName.match(/slide(\d+)/)[1];
    console.log(`\n========== SLIDE ${slideNum} ==========`);

    // Get shape tree
    function extractTexts(node, depth) {
        if (!node) return;
        // For each shape (sp), extract paragraph text
        if (node.localName === 'sp' || node.localName === 'graphicFrame') {
            let shapeText = [];
            extractParagraphs(node, shapeText);
            if (shapeText.length > 0) {
                console.log(shapeText.join('\n'));
                console.log('---');
            }
        } else {
            if (node.childNodes) {
                for (let i = 0; i < node.childNodes.length; i++) {
                    extractTexts(node.childNodes[i], depth + 1);
                }
            }
        }
    }

    function extractParagraphs(node, result) {
        if (!node) return;
        if (node.localName === 'p' && node.namespaceURI === 'http://schemas.openxmlformats.org/drawingml/2006/main') {
            let paraText = '';
            collectText(node, t => paraText += t);
            if (paraText.trim()) {
                result.push(paraText.trim());
            }
            return; // Don't recurse into p children
        }
        if (node.childNodes) {
            for (let i = 0; i < node.childNodes.length; i++) {
                extractParagraphs(node.childNodes[i], result);
            }
        }
    }

    function collectText(node, cb) {
        if (node.localName === 't' && node.namespaceURI === 'http://schemas.openxmlformats.org/drawingml/2006/main') {
            cb(node.textContent || '');
        }
        if (node.childNodes) {
            for (let i = 0; i < node.childNodes.length; i++) {
                collectText(node.childNodes[i], cb);
            }
        }
    }

    extractTexts(doc.documentElement, 0);
});
