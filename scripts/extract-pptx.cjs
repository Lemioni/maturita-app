const fs = require('fs');
const path = require('path');
const { DOMParser } = require('@xmldom/xmldom');

// Use JSZip or manual zip reading
const AdmZip = require('adm-zip');

try {
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

        // Extract all text nodes
        const allNodes = [];
        function walk(node) {
            if (node.nodeType === 1) { // Element
                if (node.localName === 't' && node.namespaceURI === 'http://schemas.openxmlformats.org/drawingml/2006/main') {
                    allNodes.push(node.textContent || '');
                }
                for (let i = 0; i < node.childNodes.length; i++) {
                    walk(node.childNodes[i]);
                }
            }
        }
        walk(doc.documentElement);

        const slideNum = entry.entryName.match(/slide(\d+)/)[1];
        console.log(`\n=== SLIDE ${slideNum} ===`);
        console.log(allNodes.join('\n'));
    });
} catch (e) {
    console.error('Error:', e.message);
}
