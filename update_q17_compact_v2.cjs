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
    const q17Index = questions.findIndex(q => q.id === 17);

    if (q17Index === -1) {
        console.error('Q17 not found');
        process.exit(1);
    }

    // Structured compactContent based on user's V2 plain text input for Q17
    const newCompactContent = {
        "sections": [
            {
                "title": "1. Funkce a význam",
                "text": "Aplikační vrstva je rozhraním mezi člověkem a sítí. Zajišťuje, aby data z programů (Chrome, Outlook) byla srozumitelná pro zbytek sítě.",
                "items": [
                    {
                        "term": "Sběr dat",
                        "definition": "Příprava dat pro přenos."
                    },
                    {
                        "term": "Identifikace partnerů",
                        "definition": "Ověření, zda je server na druhé straně \"na příjmu\"."
                    }
                ]
            },
            {
                "title": "2. DNS (Domain Name System)",
                "text": "Účel: Překlad textových adres (www.seznam.cz) na číselné IP adresy.",
                "items": [
                    {
                        "term": "Hierarchie",
                        "definition": "* Kořenový server (.) → TLD (.cz, .com) → 2. úroveň (google, idnes)."
                    },
                    {
                        "term": "Záznam A",
                        "definition": "Překlad jména na IPv4."
                    },
                    {
                        "term": "Záznam AAAA",
                        "definition": "Překlad jména na IPv6."
                    },
                    {
                        "term": "Záznam MX",
                        "definition": "Určuje poštovní server pro danou doménu."
                    }
                ]
            },
            {
                "title": "3. WWW, HTTP a HTTPS",
                "items": [
                    {
                        "term": "URL",
                        "definition": "Unikátní adresa (Protokol + Doména + Cesta)."
                    },
                    {
                        "term": "HTTP",
                        "definition": "Protokol pro přenos webu."
                    },
                    {
                        "term": "HTTPS",
                        "definition": "Šifrovaná varianta (port 443)."
                    },
                    {
                        "term": "Stavové kódy",
                        "definition": "200 OK (Vše v pořádku), 301/302 (Přesměrování), 403 Forbidden (Zakázaný), 404 Not Found (Nenalezeno), 500 Internal Error (Chyba serveru)."
                    }
                ]
            },
            {
                "title": "4. Elektronická pošta (E-mail)",
                "items": [
                    {
                        "term": "SMTP",
                        "definition": "Odesílání (od klienta na server)."
                    },
                    {
                        "term": "POP3",
                        "definition": "Stažení pošty (stáhne a ze serveru smaže)."
                    },
                    {
                        "term": "IMAP",
                        "definition": "Synchronizace (vše zůstává na serveru). Dnes standard."
                    }
                ]
            },
            {
                "title": "5. \"Bonusové\" protokoly pro L7",
                "items": [
                    {
                        "term": "DHCP",
                        "definition": "Automaticky přiděluje IP adresy, masky a brány."
                    },
                    {
                        "term": "SSH",
                        "definition": "Bezpečný vzdálený přístup k příkazové řádce."
                    },
                    {
                        "term": "Telnet",
                        "definition": "Starší, nezabezpečená verze SSH (nepoužívat!)."
                    },
                    {
                        "term": "FTP",
                        "definition": "Přenos souborů (Port 21 – řízení, Port 20 – data)."
                    }
                ]
            },
            {
                "title": "Tip k maturitě 💡",
                "text": "Pokud se tě zeptají, jestli aplikační vrstva obsahuje i samotný prohlížeč (např. Google Chrome), odpověď je NE. Prohlížeč je aplikace, která vrstvu L7 pouze využívá (pomocí jejích protokolů)."
            }
        ]
    };

    questions[q17Index].compactContent = newCompactContent;

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated Q17 compactContent (V2).');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
