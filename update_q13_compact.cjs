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
    const q13Index = questions.findIndex(q => q.id === 13);

    if (q13Index === -1) {
        console.error('Q13 not found');
        process.exit(1);
    }

    // Structured compactContent based on user's plain text input
    const newCompactContent = {
        "sections": [
            {
                "title": "1. Funkce a podvrstvy",
                "text": "Linková vrstva (L2) zajišťuje přenos dat mezi sousedními uzly v rámci jedné lokální sítě (LAN). Pracuje s celky zvanými rámce (frames).",
                "items": [
                    {
                        "term": "LLC (Horní)",
                        "definition": "Komunikuje s L3 (síťovou). Zajišťuje multiplexování a řízení toku."
                    },
                    {
                        "term": "MAC (Dolní)",
                        "definition": "Komunikuje s L1 (fyzickou). Řeší fyzické adresování a přístup k médiu."
                    },
                    {
                        "term": "Rámcování",
                        "definition": "Balí data do rámců (Hlavička + Data + Patička/Trailer)."
                    },
                    {
                        "term": "Detekce chyb",
                        "definition": "CRC v patičce. Pokud nesedí, rámec se zahodí."
                    },
                    {
                        "term": "Řízení toku",
                        "definition": "Brání zahlcení pomalého příjemce."
                    }
                ]
            },
            {
                "title": "2. Adresace (MAC adresa)",
                "text": "Fyzická adresa vypálená v síťové kartě (NIC). Je 48bitová a zapisuje se v šestnáctkové soustavě (HEX).",
                "items": [
                    {
                        "term": "Struktura",
                        "definition": "24 bitů OUI (Výrobce) + 24 bitů NIC (Sériové číslo)."
                    },
                    {
                        "term": "Příklad",
                        "definition": "00:1A:2B:3C:4D:5E"
                    }
                ]
            },
            {
                "title": "3. Přístupové metody (Media Access)",
                "text": "Určují pravidla pro sdílení kabelu/vzduchu, aby nedocházelo ke kolizím.",
                "items": [
                    {
                        "term": "CSMA/CD",
                        "definition": "Ethernet. Detekce kolize -> Stop -> Náhodný čas."
                    },
                    {
                        "term": "CSMA/CA",
                        "definition": "Wi-Fi. Předcházení kolizím (signál „budu vysílat“)."
                    },
                    {
                        "term": "Token Passing",
                        "definition": "Předávání „peška“ (token). Vysílá jen ten, kdo ho má."
                    }
                ]
            },
            {
                "title": "4. Síťové prvky na L2",
                "items": [
                    {
                        "term": "Switch",
                        "definition": "Inteligentní. Učí se MAC adresy (CAM tabulka), posílá adresně."
                    },
                    {
                        "term": "Bridge",
                        "definition": "Propojuje dva segmenty (dnes nahrazen switchem)."
                    },
                    {
                        "term": "NIC",
                        "definition": "Síťová karta (dává PC MAC adresu)."
                    },
                    {
                        "term": "Access Point",
                        "definition": "Převádí rámce z Wi-Fi (802.11) na Ethernet (802.3)."
                    }
                ]
            },
            {
                "title": "5. Protokoly",
                "items": [
                    {
                        "term": "Ethernet",
                        "definition": "Nejpoužívanější standard pro drátové sítě (IEEE 802.3)."
                    },
                    {
                        "term": "Wi-Fi",
                        "definition": "Standard pro bezdrátové sítě (IEEE 802.11)."
                    },
                    {
                        "term": "PPP",
                        "definition": "Point-to-Point (přímé spojení, např. modem)."
                    },
                    {
                        "term": "HDLC",
                        "definition": "Starší protokol pro sériové linky."
                    }
                ]
            },
            {
                "title": "Tip k maturitě 💡",
                "text": "Pamatuj, že switch pracuje s MAC adresami, zatímco router (L3) pracuje s IP adresami. To je nejčastější otázka zkoušejících."
            }
        ]
    };

    questions[q13Index].compactContent = newCompactContent;

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated Q13 compactContent.');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
