/**
 * Script to add compactContent for questions 11-20
 * Run with: node scripts/add-compact-content.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '..', 'src', 'data', 'it-questions.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Compact content for questions 11-20
const compactContents = {
    11: {
        sections: [
            {
                title: "Dělení sítí",
                subsections: [
                    {
                        title: "Podle velikosti",
                        items: [
                            { term: "LAN", definition: "Lokální síť (budova)" },
                            { term: "MAN", definition: "Městská síť" },
                            { term: "WAN", definition: "Globální síť (Internet)" }
                        ]
                    },
                    {
                        title: "Podle topologie",
                        items: [
                            { term: "Sběrnicová (Bus)", definition: "1 kabel, kolize → CSMA/CD" },
                            { term: "Hvězdicová (Star)", definition: "Centrální switch/hub" },
                            { term: "Kruhová (Ring)", definition: "Data v kruhu" }
                        ]
                    },
                    {
                        title: "Podle řízení",
                        items: [
                            { term: "Peer-to-peer", definition: "Rovnocenná zařízení" },
                            { term: "Klient-server", definition: "Centrální server" }
                        ]
                    }
                ]
            },
            {
                title: "Historie Internetu",
                items: [
                    { term: "1969", definition: "ARPANET (přepojování paketů)" },
                    { term: "1983", definition: "Přechod na TCP/IP" },
                    { term: "1990", definition: "Zánik ARPANET, veřejný Internet" }
                ]
            },
            {
                title: "Klíčové historické sítě",
                items: [
                    { term: "ARPANET", definition: "1969, US DoD, základ Internetu" },
                    { term: "CYCLADES", definition: "1972, end-to-end → inspirace TCP/IP" },
                    { term: "X.25", definition: "1970s, banky/telco, → Frame Relay" },
                    { term: "NSFNET", definition: "1986-95, páteř Internetu" },
                    { term: "USENET", definition: "1979, diskusní skupiny" },
                    { term: "BITNET", definition: "1981, universitní síť" }
                ]
            },
            {
                title: "Organizace",
                items: [
                    { term: "IANA + ICANN", definition: "Správa IP adres a domén" },
                    { term: "RFC", definition: "Request for Comments (standardy)" }
                ]
            }
        ]
    },
    12: {
        sections: [
            {
                title: "Fyzická vrstva (L1)",
                items: [
                    "1. vrstva ISO/OSI",
                    "Převod dat → signály (elektrické/optické/rádiové)",
                    "Definuje přenosová média a konektory"
                ]
            },
            {
                title: "Kabeláž",
                subsections: [
                    {
                        title: "Kroucená dvojlinka",
                        items: [
                            { term: "UTP", definition: "Bez stínění, kanceláře" },
                            { term: "STP", definition: "Stíněná, průmysl" },
                            "Max 10 Gbps, do 100 m"
                        ]
                    },
                    {
                        title: "Koaxiální",
                        items: ["TV, starší sítě, odolný proti rušení"]
                    },
                    {
                        title: "Optické vlákno",
                        items: [
                            { term: "Single-mode", definition: "Dlouhé vzdálenosti" },
                            { term: "Multi-mode", definition: "Kratší, datacentra" },
                            "Rychlost 100+ Gbps"
                        ]
                    }
                ]
            },
            {
                title: "Konektory",
                items: [
                    { term: "RJ-45", definition: "Ethernet (dvojlinka)" },
                    { term: "BNC", definition: "Koaxiální" },
                    { term: "SC/LC/ST", definition: "Optika" }
                ]
            },
            {
                title: "Typy přenosů",
                items: [
                    { term: "Simplex", definition: "Jednosměrný (rádio)" },
                    { term: "Half-duplex", definition: "Střídavě (vysílačky)" },
                    { term: "Full-duplex", definition: "Obousměrný současně" }
                ]
            },
            {
                title: "Kódování & Modulace",
                items: [
                    { term: "NRZ", definition: "Jednoduché binární" },
                    { term: "Manchester", definition: "S hodinami" },
                    { term: "AM/FM/QAM", definition: "Amplituda/Frekvence/Kombinace" }
                ]
            },
            {
                title: "Síťové prvky L1",
                items: [
                    { term: "Repeater", definition: "Zesiluje signál" },
                    { term: "Hub", definition: "Broadcast všem" },
                    { term: "Modem", definition: "Digital ↔ Analog" }
                ]
            }
        ]
    },
    13: {
        sections: [
            {
                title: "Linková vrstva (L2)",
                items: [
                    "2. vrstva ISO/OSI",
                    "Spolehlivá komunikace v lokální síti",
                    "Organizuje data do rámců (frames)"
                ]
            },
            {
                title: "Funkce",
                items: [
                    { term: "Rámcování", definition: "Data → rámce (hlavička + data + trailer)" },
                    { term: "MAC adresace", definition: "48-bit fyzická adresa" },
                    { term: "Detekce chyb", definition: "CRC kontrolní součet" },
                    { term: "Řízení toku", definition: "Prevence zahlcení" }
                ]
            },
            {
                title: "Podvrstvy",
                items: [
                    { term: "MAC", definition: "Přístup k médiu, fyzické adresy" },
                    { term: "LLC", definition: "Rozhraní k vyšším vrstvám, multiplexování" }
                ]
            },
            {
                title: "MAC adresa",
                items: [
                    "48 bitů (6 bajtů)",
                    { term: "OUI (24b)", definition: "Identifikátor výrobce" },
                    { term: "NIC (24b)", definition: "Jedinečné číslo zařízení" }
                ]
            },
            {
                title: "Přístupové metody",
                items: [
                    { term: "CSMA/CD", definition: "Ethernet, detekce kolizí" },
                    { term: "CSMA/CA", definition: "Wi-Fi, předcházení kolizím" },
                    { term: "Token Passing", definition: "Token Ring" }
                ]
            },
            {
                title: "Síťové prvky L2",
                items: [
                    { term: "Switch", definition: "Přeposílá podle MAC" },
                    { term: "Bridge", definition: "Propojuje segmenty" },
                    { term: "NIC", definition: "Síťová karta (obsahuje MAC)" }
                ]
            },
            {
                title: "Protokoly",
                items: ["Ethernet", "PPP", "HDLC", "Wi-Fi (802.11)"]
            }
        ]
    },
    14: {
        sections: [
            {
                title: "Síťová vrstva (L3)",
                items: [
                    "3. vrstva ISO/OSI",
                    "Směrování paketů mezi sítěmi",
                    "Logická adresace (IP adresy)"
                ]
            },
            {
                title: "Funkce",
                items: [
                    { term: "Směrování", definition: "Výběr cesty paketu" },
                    { term: "Adresace", definition: "Logické IP adresy" },
                    { term: "Fragmentace", definition: "Dělení velkých paketů" },
                    { term: "QoS", definition: "Prioritizace provozu" }
                ]
            },
            {
                title: "IP adresy",
                subsections: [
                    {
                        title: "IPv4",
                        items: [
                            "32 bitů (4 oktety)",
                            "Formát: 192.168.1.1",
                            "~4.3 mld. adres"
                        ]
                    },
                    {
                        title: "IPv6",
                        items: [
                            "128 bitů",
                            "Formát: 2001:db8::1",
                            "Prakticky neomezený počet"
                        ]
                    }
                ]
            },
            {
                title: "Typy adres",
                items: [
                    { term: "Unicast", definition: "Jeden příjemce" },
                    { term: "Broadcast", definition: "Všichni v síti" },
                    { term: "Multicast", definition: "Skupina příjemců" },
                    { term: "Anycast", definition: "Nejbližší z více" }
                ]
            },
            {
                title: "Protokoly L3",
                items: [
                    { term: "IP", definition: "Přenos paketů" },
                    { term: "ICMP", definition: "Diagnostika (ping)" },
                    { term: "ARP", definition: "IP → MAC" },
                    { term: "RARP", definition: "MAC → IP" }
                ]
            },
            {
                title: "Síťové prvky L3",
                items: [
                    { term: "Router", definition: "Směruje mezi sítěmi" },
                    { term: "L3 Switch", definition: "Switch + routing" }
                ]
            }
        ]
    },
    15: {
        sections: [
            {
                title: "Adresace IPv4",
                items: [
                    "32 bitů = 4 oktety",
                    { term: "Síťová část", definition: "Identifikuje síť" },
                    { term: "Hostitelská část", definition: "Identifikuje zařízení" }
                ]
            },
            {
                title: "Třídy IP adres",
                items: [
                    { term: "A", definition: "1.0.0.0 – 126.x.x.x, velké sítě" },
                    { term: "B", definition: "128.0.0.0 – 191.x.x.x, střední" },
                    { term: "C", definition: "192.0.0.0 – 223.x.x.x, malé sítě" },
                    { term: "D", definition: "Multicast" },
                    { term: "E", definition: "Experimentální" }
                ]
            },
            {
                title: "Privátní adresy",
                items: [
                    "10.0.0.0/8",
                    "172.16.0.0/12",
                    "192.168.0.0/16"
                ]
            },
            {
                title: "Maska podsítě",
                items: [
                    "Odděluje síťovou a hostitelskou část",
                    "CIDR notace: /24 = 255.255.255.0",
                    { term: "Subnetting", definition: "Dělení sítě na menší" }
                ]
            },
            {
                title: "Směrování",
                subsections: [
                    {
                        title: "Statické",
                        items: ["Manuální konfigurace", "Pro malé sítě"]
                    },
                    {
                        title: "Dynamické protokoly",
                        items: [
                            { term: "RIP", definition: "Distance-vector, max 15 hopů" },
                            { term: "OSPF", definition: "Link-state, velké sítě" },
                            { term: "BGP", definition: "Mezi autonomními systémy" }
                        ]
                    }
                ]
            },
            {
                title: "NAT",
                items: [
                    "Network Address Translation",
                    "Privátní → veřejná IP",
                    { term: "PAT", definition: "NAT s porty (přetížení)" }
                ]
            }
        ]
    },
    16: {
        sections: [
            {
                title: "Transportní vrstva (L4)",
                items: [
                    "End-to-end komunikace",
                    "Segmentace a sestavení dat",
                    "Porty (0-65535)"
                ]
            },
            {
                title: "TCP vs UDP",
                items: [
                    { term: "TCP", definition: "Spolehlivý, spojovaný, potvrzování" },
                    { term: "UDP", definition: "Nespolehlivý, rychlý, broadcast" }
                ]
            },
            {
                title: "TCP detaily",
                items: [
                    "3-way handshake: SYN → SYN-ACK → ACK",
                    "Řízení toku (sliding window)",
                    "Detekce chyb (checksum)"
                ]
            },
            {
                title: "Známé porty",
                items: [
                    { term: "HTTP", definition: "80" },
                    { term: "HTTPS", definition: "443" },
                    { term: "FTP", definition: "20/21" },
                    { term: "SSH", definition: "22" },
                    { term: "DNS", definition: "53" }
                ]
            },
            {
                title: "Relační vrstva (L5)",
                items: [
                    "Řízení relací/sessions",
                    "Synchronizace komunikace",
                    "Protokoly: NetBIOS, RPC"
                ]
            },
            {
                title: "Prezentační vrstva (L6)",
                items: [
                    "Formátování dat",
                    "Šifrování (SSL/TLS)",
                    "Komprese",
                    "Kódování: ASCII, JPEG, MPEG"
                ]
            }
        ]
    },
    17: {
        sections: [
            {
                title: "Aplikační vrstva (L7)",
                items: [
                    "Rozhraní pro uživatele",
                    "Přímá interakce s aplikacemi",
                    "Nejvyšší vrstva ISO/OSI"
                ]
            },
            {
                title: "HTTP/HTTPS",
                items: [
                    { term: "HTTP", definition: "Port 80, nešifrovaný" },
                    { term: "HTTPS", definition: "Port 443, TLS šifrování" },
                    "Metody: GET, POST, PUT, DELETE"
                ]
            },
            {
                title: "DNS",
                items: [
                    "Domain Name System",
                    "Překlad domén → IP adresy",
                    "Hierarchická struktura",
                    "Port 53 (UDP/TCP)"
                ]
            },
            {
                title: "E-mail protokoly",
                items: [
                    { term: "SMTP", definition: "Odesílání, port 25/587" },
                    { term: "POP3", definition: "Příjem, stahuje, port 110" },
                    { term: "IMAP", definition: "Příjem, synchronizuje, port 143" }
                ]
            },
            {
                title: "Přenos souborů",
                items: [
                    { term: "FTP", definition: "Porty 20/21, nešifrovaný" },
                    { term: "SFTP", definition: "Přes SSH, šifrovaný" },
                    { term: "TFTP", definition: "UDP, jednoduchý" }
                ]
            },
            {
                title: "Další protokoly",
                items: [
                    { term: "DHCP", definition: "Automatické přidělení IP" },
                    { term: "SSH", definition: "Šifrované vzdálené připojení" },
                    { term: "Telnet", definition: "Nešifrované vzdálené připojení" },
                    { term: "SNMP", definition: "Správa síťových zařízení" }
                ]
            }
        ]
    },
    18: {
        sections: [
            {
                title: "Síťové prvky",
                items: [
                    { term: "Repeater (L1)", definition: "Zesiluje signál" },
                    { term: "Hub (L1)", definition: "Broadcast všem" },
                    { term: "Bridge (L2)", definition: "Propojuje segmenty (MAC)" },
                    { term: "Switch (L2)", definition: "Přepíná podle MAC" },
                    { term: "Router (L3)", definition: "Směruje podle IP" },
                    { term: "Gateway (L7)", definition: "Převod protokolů" }
                ]
            },
            {
                title: "Strukturovaná kabeláž",
                items: [
                    "Horizontální vedení (do 90 m)",
                    "Vertikální páteř (mezi patry)",
                    "Patch panely a zásuvky"
                ]
            },
            {
                title: "Normy kabeláže",
                items: [
                    { term: "Cat 5e", definition: "1 Gbps, 100 m" },
                    { term: "Cat 6", definition: "10 Gbps (55 m)" },
                    { term: "Cat 6a", definition: "10 Gbps (100 m)" },
                    { term: "Cat 7/8", definition: "25-40 Gbps" }
                ]
            },
            {
                title: "Standardy zapojení RJ-45",
                items: [
                    { term: "T568A", definition: "Zelená-Oranžová" },
                    { term: "T568B", definition: "Oranžová-Zelená (častější)" },
                    { term: "Přímý kabel", definition: "Stejný standard obou konců" },
                    { term: "Křížený kabel", definition: "Různé standardy" }
                ]
            },
            {
                title: "Rozvaděče (Rack)",
                items: [
                    "19\" standard šířky",
                    "Výška v U (1U = 44.45 mm)",
                    "Obsahuje: switch, router, patch panel, UPS"
                ]
            }
        ]
    },
    19: {
        sections: [
            {
                title: "Ethernet",
                items: [
                    "IEEE 802.3",
                    "Nejrozšířenější LAN technologie",
                    "CSMA/CD přístupová metoda"
                ]
            },
            {
                title: "Rychlosti",
                items: [
                    { term: "10BASE-T", definition: "10 Mbps, Cat 3" },
                    { term: "100BASE-TX", definition: "100 Mbps, Cat 5" },
                    { term: "1000BASE-T", definition: "1 Gbps, Cat 5e/6" },
                    { term: "10GBASE-T", definition: "10 Gbps, Cat 6a/7" },
                    { term: "25/40/100 GbE", definition: "Datacentra" }
                ]
            },
            {
                title: "Ethernet rámec",
                items: [
                    { term: "Preambule", definition: "7 B synchronizace" },
                    { term: "SFD", definition: "1 B start rámce" },
                    { term: "MAC dest/src", definition: "6+6 B adresy" },
                    { term: "Type/Length", definition: "2 B" },
                    { term: "Data", definition: "46-1500 B" },
                    { term: "FCS", definition: "4 B kontrolní součet" }
                ]
            },
            {
                title: "VLAN",
                items: [
                    "Virtuální LAN",
                    "Logické oddělení sítě",
                    "802.1Q tagging",
                    "Trunk porty mezi switch"
                ]
            },
            {
                title: "PoE (Power over Ethernet)",
                items: [
                    "Napájení přes datový kabel",
                    { term: "802.3af", definition: "15.4 W" },
                    { term: "802.3at (PoE+)", definition: "25.5 W" },
                    { term: "802.3bt (PoE++)", definition: "71-90 W" }
                ]
            }
        ]
    },
    20: {
        sections: [
            {
                title: "Wi-Fi standardy",
                items: [
                    { term: "802.11b", definition: "11 Mbps, 2.4 GHz" },
                    { term: "802.11g", definition: "54 Mbps, 2.4 GHz" },
                    { term: "802.11n (Wi-Fi 4)", definition: "600 Mbps, 2.4/5 GHz" },
                    { term: "802.11ac (Wi-Fi 5)", definition: "3.5 Gbps, 5 GHz" },
                    { term: "802.11ax (Wi-Fi 6)", definition: "9.6 Gbps, 2.4/5/6 GHz" }
                ]
            },
            {
                title: "Frekvenční pásma",
                items: [
                    { term: "2.4 GHz", definition: "Lepší dosah, rušení, 14 kanálů" },
                    { term: "5 GHz", definition: "Rychlejší, kratší dosah" },
                    { term: "6 GHz", definition: "Wi-Fi 6E, nejméně rušení" }
                ]
            },
            {
                title: "Zabezpečení",
                items: [
                    { term: "WEP", definition: "Zastaralé, nebezpečné" },
                    { term: "WPA", definition: "TKIP, lepší než WEP" },
                    { term: "WPA2", definition: "AES, standard" },
                    { term: "WPA3", definition: "SAE, nejbezpečnější" }
                ]
            },
            {
                title: "Komponenty",
                items: [
                    { term: "AP (Access Point)", definition: "Bezdrátový přístupový bod" },
                    { term: "SSID", definition: "Název sítě" },
                    { term: "BSSID", definition: "MAC adresa AP" }
                ]
            },
            {
                title: "Další bezdrátové technologie",
                items: [
                    { term: "Bluetooth", definition: "Krátký dosah, periferie" },
                    { term: "NFC", definition: "Bezdotykové platby" },
                    { term: "Zigbee/Z-Wave", definition: "IoT, chytrá domácnost" },
                    { term: "LTE/5G", definition: "Mobilní sítě" }
                ]
            },
            {
                title: "CSMA/CA",
                items: [
                    "Wi-Fi přístupová metoda",
                    "Předchází kolizím (RTS/CTS)",
                    "Na rozdíl od CSMA/CD (Ethernet)"
                ]
            }
        ]
    }
};

// Add compactContent to questions 11-20
data.questions.forEach(q => {
    if (compactContents[q.id]) {
        q.compactContent = compactContents[q.id];
    }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('✅ Added compactContent for questions 11-20');
