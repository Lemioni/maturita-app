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
    const q14Index = questions.findIndex(q => q.id === 14);

    if (q14Index === -1) {
        console.error('Q14 not found');
        process.exit(1);
    }

    // Structured compactContent based on user's plain text input for Q14
    const newCompactContent = {
        "sections": [
            {
                "title": "1. Hlavní funkce",
                "text": "Síťová vrstva (L3) zajišťuje komunikaci mezi koncovými zařízeními v různých sítích. Hlavním úkolem je směrování a logická adresace.",
                "items": [
                    {
                        "term": "Logická adresace",
                        "definition": "Každé zařízení dostane unikátní IP adresu."
                    },
                    {
                        "term": "Směrování (Routing)",
                        "definition": "Výběr nejlepší cesty pro paket (provádí router)."
                    },
                    {
                        "term": "Fragmentace",
                        "definition": "Rozdělení paketu na menší části dle MTU."
                    },
                    {
                        "term": "Propojování sítí",
                        "definition": "Komunikace mezi různými technologiemi (Ethernet ↔ Wi-Fi)."
                    }
                ]
            },
            {
                "title": "2. Adresace IPv4",
                "text": "32 bitů (4 oktety, např. 192.168.1.1).",
                "items": [
                    {
                        "term": "Maska podsítě",
                        "definition": "Určuje část sítě a část hostitele."
                    },
                    {
                        "term": "Třídy (Legacy)",
                        "definition": "A (Velké), B (Střední), C (Malé/Domácí)."
                    },
                    {
                        "term": "Soukromé IP",
                        "definition": "10.x.x.x, 172.16-31.x.x, 192.168.x.x (neveřejné)."
                    },
                    {
                        "term": "Loopback",
                        "definition": "127.0.0.1 (vlastní PC)."
                    },
                    {
                        "term": "Broadcast",
                        "definition": "Pro všechny v síti (např. 192.168.1.255)."
                    }
                ]
            },
            {
                "title": "3. Adresace IPv6",
                "text": "128 bitů (8 skupin hex, např. 2001:db8::...). Řeší nedostatek adres.",
                "items": [
                    {
                        "term": "Unicast",
                        "definition": "Jeden → Jeden."
                    },
                    {
                        "term": "Multicast",
                        "definition": "Jeden → Skupina."
                    },
                    {
                        "term": "Anycast",
                        "definition": "Jeden → Nejbližší z příjemců."
                    },
                    {
                        "term": "Link-Local",
                        "definition": "FE80::/10 (jen v rámci sítě)."
                    }
                ]
            },
            {
                "title": "4. Klíčové protokoly",
                "items": [
                    {
                        "term": "IP",
                        "definition": "Samotný přenos paketů."
                    },
                    {
                        "term": "ICMP",
                        "definition": "Diagnostika (PING, Traceroute)."
                    },
                    {
                        "term": "ARP",
                        "definition": "Překlad IP na MAC adresy."
                    },
                    {
                        "term": "NAT",
                        "definition": "Překlad adres (schová síť za 1 veřejnou IP)."
                    }
                ]
            },
            {
                "title": "5. Síťové prvky na L3",
                "items": [
                    {
                        "term": "Router",
                        "definition": "Směruje pakety, odděluje sítě."
                    },
                    {
                        "term": "L3 Switch",
                        "definition": "Rychlé přepínání + Směrování."
                    },
                    {
                        "term": "Firewall",
                        "definition": "Filtruje provoz (bezpečnost)."
                    },
                    {
                        "term": "Gateway",
                        "definition": "Brána do internetu."
                    }
                ]
            },
            {
                "title": "Tip k maturitě 💡",
                "text": "Nezapomeň, že v IPv6 už neexistuje Broadcast. Vše, co dříve dělal broadcast, dnes v IPv6 obstarává speciální Multicast. Je to efektivnější."
            }
        ]
    };

    questions[q14Index].compactContent = newCompactContent;

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated Q14 compactContent.');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
