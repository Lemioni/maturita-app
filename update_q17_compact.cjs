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

    // Structured compactContent based on user's plain text input for Q17
    const newCompactContent = {
        "sections": [
            {
                "title": "Aplikační vrstva (L7)",
                "text": "Nejvyšší vrstva, poskytuje rozhraní mezi uživatelem a sítí."
            },
            {
                "title": "1. Hlavní funkce",
                "items": [
                    {
                        "term": "Rozhraní pro aplikace",
                        "definition": "Umožňuje programům přistupovat k síťovým službám."
                    },
                    {
                        "term": "Identifikace partnerů",
                        "definition": "Zjišťuje dostupnost cílového zařízení."
                    },
                    {
                        "term": "Sběr dat",
                        "definition": "Formátuje data pro nižší vrstvy."
                    }
                ]
            },
            {
                "title": "2. DNS (Domain Name System)",
                "text": "\"Telefonní seznam internetu\". Překládá jména (google.cz) na IP adresy.",
                "items": [
                    {
                        "term": "Hierarchie",
                        "definition": "Kořenové (.) -> TLD (.cz) -> Domény 2. úrovně (google) -> Subdomény."
                    },
                    {
                        "term": "Princip",
                        "definition": "Dotaz na DNS server -> odpověď s IP adresou -> spojení."
                    }
                ]
            },
            {
                "title": "3. WWW a URL",
                "text": "World Wide Web = systém HTML dokumentů.",
                "items": [
                    {
                        "term": "URL",
                        "definition": "Přesná adresa zdroje. (protokol://doména:port/cesta?parametry)"
                    },
                    {
                        "term": "Příklad",
                        "definition": "https://www.skola.cz:443/maturita/it.html"
                    }
                ]
            },
            {
                "title": "4. Protokol HTTP a HTTPS",
                "text": "Základní protokol pro přenos webových stránek.",
                "items": [
                    {
                        "term": "Metody",
                        "definition": "GET (stažení), POST (odeslání)."
                    },
                    {
                        "term": "Stavové kódy",
                        "definition": "2xx (Success), 3xx (Redirection), 4xx (Client Error - 404), 5xx (Server Error)."
                    },
                    {
                        "term": "HTTPS",
                        "definition": "Šifrovaná varianta (TLS)."
                    }
                ]
            },
            {
                "title": "5. Elektronická pošta (E-mail)",
                "items": [
                    {
                        "term": "SMTP",
                        "definition": "Odesílání pošty (klient -> server, server -> server)."
                    },
                    {
                        "term": "POP3",
                        "definition": "Stahování a mazání ze serveru. Nevhodné pro více zařízení."
                    },
                    {
                        "term": "IMAP",
                        "definition": "Synchronizace se serverem. E-maily zůstávají na serveru. Nejpoužívanější."
                    }
                ]
            },
            {
                "title": "6. Přenos souborů (FTP)",
                "text": "FTP slouží k nahrávání a stahování souborů.",
                "items": [
                    {
                        "term": "Spojení",
                        "definition": "Řídicí (Port 21 - příkazy) a Datové (Port 20 - data)."
                    }
                ]
            },
            {
                "title": "Tip k maturitě 💡",
                "text": "Častá otázka: \"Jaký je rozdíl mezi POP3 a IMAP?\". Odpověď: POP3 stahuje a maže, IMAP synchronizuje. WWW není Internet. Internet je infrastruktura, WWW je služba."
            }
        ]
    };

    questions[q17Index].compactContent = newCompactContent;

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated Q17 compactContent.');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
