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
    const q18Index = questions.findIndex(q => q.id === 18);

    if (q18Index === -1) {
        console.error('Q18 not found');
        process.exit(1);
    }

    // Structured compactContent based on user's plain text input for Q18
    const newCompactContent = {
        "sections": [
            {
                "title": "Síťové prvky a strukturovaná kabeláž",
                "text": "Tato otázka se dělí na aktivní prvky (zpracovávají data) a pasivní prvky (kabeláž)."
            },
            {
                "title": "1. Aktivní síťové prvky",
                "items": [
                    {
                        "term": "Hub (Rozbočovač)",
                        "definition": "L1 | Broadcast | \"Hloupý\". Co přijde, pošle na všechny porty. Riziko kolizí."
                    },
                    {
                        "term": "Switch (Přepínač)",
                        "definition": "L2 | MAC adresy | \"Chytrý\". Učí se (CAM tabulka), posílá jen adresátovi. Odděluje kolizní domény."
                    },
                    {
                        "term": "Router (Směrovač)",
                        "definition": "L3 | IP adresy | Propojuje různé sítě (LAN/Internet). Rozhoduje o cestě."
                    },
                    {
                        "term": "Bridge (Most)",
                        "definition": "L2 | MAC adresy | Starší verze switche (2 porty). Spojuje dva segmenty."
                    },
                    {
                        "term": "Firewall",
                        "definition": "L3/L4+ | Pravidla (ACL) | Bezpečnostní brána. Filtruje provoz."
                    }
                ]
            },
            {
                "title": "2. Cisco symboly",
                "items": [
                    {
                        "term": "Router",
                        "definition": "Kruh se čtyřmi šipkami (dovnitř a ven)."
                    },
                    {
                        "term": "Switch",
                        "definition": "Čtverec/obdélník se dvěma protisměrnými šipkami."
                    },
                    {
                        "term": "Hub",
                        "definition": "Obdélník s jednou jednoduchou šipkou."
                    },
                    {
                        "term": "Firewall",
                        "definition": "Symbol cihlové zdi."
                    },
                    {
                        "term": "Cloud",
                        "definition": "Symbol obláčku (internet nebo cizí síť)."
                    }
                ]
            },
            {
                "title": "3. Strukturovaná kabeláž",
                "text": "Univerzální systém v budově pro přenos dat, hlasu i obrazu.",
                "items": [
                    {
                        "term": "Kabely",
                        "definition": "Kroucená dvojlinka (UTP/STP) nebo optické vlákno (páteřní)."
                    },
                    {
                        "term": "Patch panel",
                        "definition": "Ukončení pevných kabelů v rozvaděči."
                    },
                    {
                        "term": "Patch kabel",
                        "definition": "Krátký ohebný kabel pro propojení prvků."
                    },
                    {
                        "term": "Zásuvky",
                        "definition": "Koncové body v kancelářích (RJ-45)."
                    },
                    {
                        "term": "Rozvaděč (Rack)",
                        "definition": "Skříň pro uložení prvků."
                    }
                ]
            },
            {
                "title": "4. Rack a jeho standardy",
                "items": [
                    {
                        "term": "Šířka",
                        "definition": "Standardně 19 palců."
                    },
                    {
                        "term": "Výška",
                        "definition": "Jednotky U (1U = 1,75\" / 44,45 mm). Standard 42U."
                    },
                    {
                        "term": "Funkce",
                        "definition": "Ochrana, uspořádání, chlazení."
                    }
                ]
            },
            {
                "title": "5. Kategorie kroucené dvojlinky",
                "items": [
                    {
                        "term": "Cat 5e",
                        "definition": "1 Gbps | 100 MHz. Nejrozšířenější."
                    },
                    {
                        "term": "Cat 6",
                        "definition": "10 Gbps (do 55m) | 250 MHz. Lepší stínění."
                    },
                    {
                        "term": "Cat 6a / 7",
                        "definition": "10 Gbps (na 100m) | 500–600 MHz. Vysoké stínění."
                    }
                ]
            },
            {
                "title": "Tip k maturitě 💡",
                "text": "Nezapomeň zmínit, že strukturovaná kabeláž se dělí na horizontální (k zásuvkám na patře) a vertikální (páteřní rozvody mezi patry). Vertikální rozvody jsou dnes téměř vždy řešeny optikou."
            }
        ]
    };

    questions[q18Index].compactContent = newCompactContent;

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated Q18 compactContent.');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
