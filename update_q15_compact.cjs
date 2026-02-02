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
    const q15Index = questions.findIndex(q => q.id === 15);

    if (q15Index === -1) {
        console.error('Q15 not found');
        process.exit(1);
    }

    // Structured compactContent based on user's plain text input for Q15
    const newCompactContent = {
        "sections": [
            {
                "title": "1. Klíčové prvky v síti",
                "items": [
                    {
                        "term": "PC (Hostitel)",
                        "definition": "Koncové zařízení, generuje/přijímá data, má unikátní IP."
                    },
                    {
                        "term": "Switch (L2)",
                        "definition": "Spojuje zařízení v LAN (Mac adresy). Nepřiděluje IP."
                    },
                    {
                        "term": "Router (L3)",
                        "definition": "Propojuje sítě (IP adresy). Rozhoduje o cestě."
                    }
                ]
            },
            {
                "title": "2. Pokročilá adresace",
                "text": "Flexibilní metody místo starých tříd (A, B, C).",
                "items": [
                    {
                        "term": "CIDR",
                        "definition": "Zápis s prefixem (např. /24). Umožňuje supernetting."
                    },
                    {
                        "term": "Subnetting",
                        "definition": "Dělení velké sítě na menší podsítě."
                    },
                    {
                        "term": "VLSM",
                        "definition": "Maska s proměnnou délkou (různé masky v jedné síti)."
                    },
                    {
                        "term": "Počet hostitelů",
                        "definition": "2^(32 - prefix) - 2"
                    }
                ]
            },
            {
                "title": "3. Směrování (Routing)",
                "text": "Proces hledání cesty v směrovací tabulce (Cíl, Maska, Next Hop, Metrika).",
                "items": [
                    {
                        "term": "Statické",
                        "definition": "Ručně zadané cesty. Bezpečné, ale nepružné."
                    },
                    {
                        "term": "Dynamické",
                        "definition": "Automatická reakce na změny (protokoly)."
                    }
                ]
            },
            {
                "title": "4. Směrovací protokoly",
                "items": [
                    {
                        "term": "RIP",
                        "definition": "Distance-Vector (Počet skoků, max 15). Pomalý."
                    },
                    {
                        "term": "OSPF",
                        "definition": "Link-State (Cena/Bandwidth). Rychlý, algoritmus SPF."
                    },
                    {
                        "term": "EIGRP",
                        "definition": "Hybridní (Cisco). Rychlý (Bandwidth + Delay)."
                    },
                    {
                        "term": "BGP",
                        "definition": "Path-Vector. Protokol internetu (ISP)."
                    }
                ]
            },
            {
                "title": "5. Směrovací metody",
                "items": [
                    {
                        "term": "Unicast",
                        "definition": "1 ↔ 1 (jeden cíl)."
                    },
                    {
                        "term": "Multicast",
                        "definition": "1 ↔ Skupina (IPTV)."
                    },
                    {
                        "term": "Broadcast",
                        "definition": "1 ↔ Všichni (v IPv6 není)."
                    }
                ]
            },
            {
                "title": "Tip k maturitě 💡",
                "text": "Pokud se tě zeptají na Default Gateway (Výchozí bránu), je to IP adresa routeru, na kterou tvůj počítač posílá všechna data, která nejsou určena pro tvou lokální síť (vše co jde ven do internetu)."
            }
        ]
    };

    questions[q15Index].compactContent = newCompactContent;

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated Q15 compactContent.');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
