const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/it-questions.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    let db = JSON.parse(data);

    if (!db.questions || !Array.isArray(db.questions)) {
        console.error('structure of it-questions.json is incorrect');
        process.exit(1);
    }

    const { questions } = db;
    const q16Index = questions.findIndex(q => q.id === 16);

    if (q16Index === -1) {
        console.error('Q16 not found');
        process.exit(1);
    }

    // Structured compactContent based on user's exact text input for Q16
    const newCompactContent = {
        "sections": [
            {
                "title": "1. Transportní vrstva (L4 – Transport Layer)",
                "text": "Zajišťuje přenos dat mezi koncovými aplikacemi. Zatímco síťová vrstva doručí paket na správné PC, transportní vrstva ho doručí správnému programu.",
                "items": [
                    {
                        "term": "PDU (Jednotka)",
                        "definition": "Segment."
                    },
                    {
                        "term": "Identifikace",
                        "definition": "Pomocí čísel portů (např. HTTP = 80, HTTPS = 443)."
                    },
                    {
                        "term": "Socket",
                        "definition": "Spojení IP adresy a portu (např. 192.168.1.10:80)."
                    }
                ]
            },
            {
                "title": "Hlavní funkce (Transportní vrstva)",
                "items": [
                    {
                        "term": "Segmentace",
                        "definition": "Rozdělení dat na menší kusy a jejich očíslování (sekvenční čísla)."
                    },
                    {
                        "term": "Řízení toku (Flow Control)",
                        "definition": "Příjemce říká odesílateli, jak rychle může data posílat."
                    },
                    {
                        "term": "Kontrolní součet (Checksum)",
                        "definition": "Detekce poškození segmentu."
                    }
                ]
            },
            {
                "title": "Srovnání klíčových protokolů",
                "items": [
                    {
                        "term": "Typ",
                        "definition": "TCP: Spojovaný (před přenosem se naváže spojení) | UDP: Nespojovaný (data se prostě pošlou)"
                    },
                    {
                        "term": "Spolehlivost",
                        "definition": "TCP: Vysoká – potvrzuje přijetí (ACK), chyby opravuje | UDP: Nízká – nic nepotvrzuje, ztráty neřeší"
                    },
                    {
                        "term": "Rychlost",
                        "definition": "TCP: Pomalý (kvůli režii a potvrzování) | UDP: Velmi rychlý (minimální hlavička)"
                    },
                    {
                        "term": "Využití",
                        "definition": "TCP: Web (HTTP), E-mail, soubory (FTP) | UDP: Streaming, online hry, VoIP, DNS"
                    }
                ]
            },
            {
                "title": "2. Relační vrstva (L5 – Session Layer)",
                "text": "Spravuje dialog mezi aplikacemi. Organizuje zahájení, průběh a ukončení komunikace.",
                "items": [
                    {
                        "term": "Správa relací",
                        "definition": "Udržuje spojení otevřené (např. přihlášení uživatele k serveru)."
                    },
                    {
                        "term": "Synchronizace",
                        "definition": "Vkládá do dat \"záchytné body\". Pokud spojení vypadne, přenos se nemusí opakovat od začátku, ale od posledního bodu."
                    },
                    {
                        "term": "Řízení komunikace",
                        "definition": "Určuje, kdo zrovna mluví (poloduplex / plný duplex)."
                    }
                ]
            },
            {
                "title": "3. Prezentační vrstva (L6 – Presentation Layer)",
                "text": "Zajišťuje, aby data byla pro obě strany čitelná (\"překladatelská služba\").",
                "items": [
                    {
                        "term": "Kódování",
                        "definition": "Převod znakových sad (ASCII, Unicode/UTF-8)."
                    },
                    {
                        "term": "Komprese",
                        "definition": "Zmenšení objemu dat (např. ZIP, JPEG, MP3)."
                    },
                    {
                        "term": "Šifrování",
                        "definition": "Zajištění bezpečnosti (standardy TLS – dříve SSL)."
                    }
                ]
            },
            {
                "title": "Formáty a standardy",
                "items": [
                    {
                        "term": "MIME",
                        "definition": "Umožňuje e-mailu přenášet i fotky a přílohy, ne jen holý text."
                    },
                    {
                        "term": "Base64",
                        "definition": "Metoda kódování binárních dat (obrázků) do textových znaků."
                    },
                    {
                        "term": "Datové typy",
                        "definition": "JPEG, GIF (obrázky), MPEG (video), XML, JSON (strukturovaná data)."
                    }
                ]
            },
            {
                "title": "Tip k maturitě 💡",
                "text": "Pokud se tě zeptají, kde probíhá šifrování HTTPS, správná odpověď je, že moderní protokol TLS začíná na pomezí Transportní a Prezentační vrstvy. A nezapomeň: TCP garantuje pořadí (pokud segmenty dorazí \"napřeskáčku\", TCP je podle sekvenčních čísel seřadí)."
            }
        ]
    };

    questions[q16Index].compactContent = newCompactContent;

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated Q16 compactContent with exact text.');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
