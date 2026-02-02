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

    // Structured compactContent based on user's exact text input for Q15
    const newCompactContent = {
        "sections": [
            {
                "title": "Adresace a směrování v sítích",
                "text": "Adresace a směrování jsou základní mechanismy, které umožňují datům najít cestu od odesílatele k příjemci napříč různými sítěmi."
            },
            {
                "title": "1. Klíčové prvky v síti",
                "items": [
                    {
                        "term": "PC (Hostitel)",
                        "definition": "Koncové zařízení s unikátní IP adresou. Generuje a přijímá data."
                    },
                    {
                        "term": "Switch (L2)",
                        "definition": "Spojuje zařízení v rámci LAN. Přepíná data podle MAC adres. Nepřiděluje IP adresy, jen doručuje rámce v lokálním segmentu."
                    },
                    {
                        "term": "Router (L3)",
                        "definition": "Propojuje různé sítě. Rozhoduje o cestě paketu na základě IP adres."
                    }
                ]
            },
            {
                "title": "2. Pokročilá adresace (Subnetting, CIDR, VLSM)",
                "text": "Místo starého dělení na třídy (A, B, C) dnes používáme flexibilní metody:",
                "items": [
                    {
                        "term": "CIDR (Classless Inter-Domain Routing)",
                        "definition": "Zápis adresy s prefixem (např. /24), který nahrazuje pevnou masku. Umožňuje spojovat sítě (supernetting) nebo je dělit."
                    },
                    {
                        "term": "Subnetting",
                        "definition": "Rozdělení jedné velké sítě na menší podsítě pro lepší správu a bezpečnost."
                    },
                    {
                        "term": "VLSM (Variable Length Subnet Masking)",
                        "definition": "\"Maska s proměnnou délkou\". Umožňuje v jedné síti použít různé masky (např. /30 pro spoj mezi routery a /26 pro kancelář). Šetří adresní prostor."
                    },
                    {
                        "term": "Základní výpočty",
                        "definition": "Počet hostitelů: 2^(32 - prefix) - 2 (odečítáme adresu sítě a broadcast). Maska: Převod prefixu na dekadický tvar (např. /26 = 255.255.255.192)."
                    }
                ]
            },
            {
                "title": "3. Směrování (Routing)",
                "text": "Proces hledání cesty v směrovací tabulce. Ta obsahuje: Cílovou síť a masku. Next Hop: IP adresu sousedního routeru, kam se má paket poslat. Metriku: \"Cena\" cesty. Čím nižší, tím lepší.",
                "items": [
                    {
                        "term": "Typy směrování",
                        "definition": "Statické: Cesty zadává správce ručně. Bezpečné a nenáročné na výkon, ale nepružné (při výpadku linky se nic nezmění). Dynamické: Routery si vyměňují informace o topologii pomocí protokolů a automaticky reagují na změny."
                    }
                ]
            },
            {
                "title": "4. Směrovací protokoly",
                "items": [
                    {
                        "term": "RIP",
                        "definition": "Distance-Vector | Počet skoků (Hopy) | Max. 15 skoků (16 je nekonečno). Jednoduchý, ale pomalý."
                    },
                    {
                        "term": "OSPF",
                        "definition": "Link-State | Cena (šířka pásma) | Rychlá konvergence, počítá nejkratší cestu (algoritmus SPF)."
                    },
                    {
                        "term": "EIGRP",
                        "definition": "Hybridní (Cisco) | Šířka pásma + zpoždění | Velmi rychlý, ale proprietární (primárně pro Cisco zařízení)."
                    },
                    {
                        "term": "BGP",
                        "definition": "Path-Vector | Politiky / Autonomní systémy | Protokol celého Internetu. Směruje data mezi velkými sítěmi (ISP)."
                    }
                ]
            },
            {
                "title": "5. Směrovací metody (Přenosy)",
                "items": [
                    {
                        "term": "Unicast",
                        "definition": "1 ↔ 1 (konkrétní cíl)."
                    },
                    {
                        "term": "Multicast",
                        "definition": "1 ↔ Skupina (např. streamování videa, IPTV)."
                    },
                    {
                        "term": "Broadcast",
                        "definition": "1 ↔ Všichni v síti (v IPv6 nahrazeno multicastem)."
                    }
                ]
            },
            {
                "title": "Tip k maturitě 💡",
                "text": "Pokud se tě zeptají na Default Gateway (Výchozí bránu), je to IP adresa routeru, na kterou tvůj počítač posílá všechna data, která nejsou určena pro tvou lokální síť (tedy vše, co jde \"ven\" do internetu)."
            }
        ]
    };

    questions[q15Index].compactContent = newCompactContent;

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated Q15 compactContent with exact text.');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
