/**
 * Ultra-compact mobile content v2 for questions 11-20
 * Strict telegraphic style, vertical layout, emojis, 100% facts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '..', 'src', 'data', 'it-questions.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const compactContents = {
    11: {
        sections: [
            {
                title: "Dělení sítí  🌐",
                subsections: [
                    {
                        title: "Podle velikosti",
                        items: [
                            { term: "🏠 LAN", definition: "Lokální (budova) → Switch" },
                            { term: "🏙️ MAN", definition: "Metropolitní (město) → Propojení LAN" },
                            { term: "🌍 WAN", definition: "Globální (Internet) → Router" }
                        ]
                    },
                    {
                        title: "Podle topologie",
                        items: [
                            { term: "🚌 Sběrnicová (Bus)", definition: "1 kabel → Koax" },
                            { term: "⚠️ Nevýhoda", definition: "Kolize → řeší CSMA/CD" },
                            { term: "⭐ Hvězdicová (Star)", definition: "Centrál (Switch/Hub)" },
                            { term: "✅ Výhoda", definition: "Selhání 1 PC neovlivní síť" },
                            { term: "💍 Kruhová (Ring)", definition: "Token passing → Jednosměrný" },
                            { term: "⚠️ Nevýhoda", definition: "Výpadek přeruší kruh" }
                        ]
                    },
                    {
                        title: "Podle řízení",
                        items: [
                            { term: "🤝 Peer-to-peer", definition: "Rovnocenná zařízení" },
                            { term: "👑 Klient-server", definition: "Centrální Server → Služby" }
                        ]
                    }
                ]
            },
            {
                title: "Historie Internetu 📜",
                items: [
                    { term: "1969 📅", definition: "ARPANET (US DoD) → Packet switching" },
                    { term: "1983 📅", definition: "Přechod na TCP/IP" },
                    { term: "1990 📅", definition: "Konec ARPANET → Veřejný Internet" }
                ]
            },
            {
                title: "Historické sítě 🏛️",
                items: [
                    { term: "🇺🇸 ARPANET (69-90)", definition: "Paketový přenos (NCP → TCP/IP)" },
                    { term: "🇫🇷 CYCLADES (72)", definition: "End-to-end → inspirace TCP/IP" },
                    { term: "💳 X.25 (70s)", definition: "Banky/Telco → Frame Relay základ" },
                    { term: "🎓 NSFNET (86-95)", definition: "Akademická páteř → TCP/IP" },
                    { term: "📰 USENET (79)", definition: "Diskuze (Newsgroups) → UUCP" },
                    { term: "🏫 BITNET (81)", definition: "Univerzity → IBM Mainframe" }
                ]
            },
            {
                title: "Organizace 🏢",
                items: [
                    { term: "🔢 IANA", definition: "Správa IP bloků + Portů" },
                    { term: "🌐 ICANN", definition: "Správa domén (DNS root)" },
                    { term: "📄 RFC", definition: "Request for Comments (Standardy)" }
                ]
            }
        ]
    },
    12: {
        sections: [
            {
                title: "Fyzická vrstva (L1) 🔌",
                items: [
                    "1. vrstva ISO/OSI",
                    { term: "Funkce", definition: "Data (bity) → Signál" },
                    { term: "Signály", definition: "Elektrické / Optické / Rádiové" },
                    { term: "Definuje", definition: "Konektory, napětí, frekvence" }
                ]
            },
            {
                title: "Kabeláž: Metalická 🧵",
                subsections: [
                    {
                        title: "Kroucená dvojlinka (Twisted Pair)",
                        items: [
                            { term: "UTP", definition: "Nestíněná → Kanceláře" },
                            { term: "STP/FTP", definition: "Stíněná → Průmysl (EMI)" },
                            { term: "Rychlost", definition: "Max 10 Gbps (Cat 6a)" },
                            { term: "Dosah", definition: "Max 100 m" }
                        ]
                    },
                    {
                        title: "Koaxiální kabel",
                        items: [
                            { term: "Konstrukce", definition: "Vodič + Izolace + Stínění" },
                            { term: "Použití", definition: "TV, CCTV, Staré sítě (Bus)" },
                            { term: "Konektor", definition: "BNC" }
                        ]
                    }
                ]
            },
            {
                title: "Kabeláž: Optická 💡",
                items: [
                    { term: "Princip", definition: "Světelné pulzy (odraz)" },
                    { term: "Single-mode (SM)", definition: "1 paprsek → Dlouhé trasy (km)" },
                    { term: "Multi-mode (MM)", definition: "Více paprsků → Datacentra" },
                    { term: "Konektory", definition: "SC / LC / ST" },
                    { term: "Výhoda", definition: "Rychlost, Imunita vůči EMI" }
                ]
            },
            {
                title: "Vlastnosti přenosu 📊",
                items: [
                    { term: "Šířka pásma", definition: "Kapacita (bps/Gbps)" },
                    { term: "Latence", definition: "Zpoždění (ms)" },
                    { term: "EMI/RFI", definition: "Elmag. rušení" },
                    { term: "Útlum", definition: "Slábnutí signálu (vzdálenost)" }
                ]
            },
            {
                title: "Směr přenosu ↔️",
                items: [
                    { term: "Simplex", definition: "1 směr (Rádio) 📻" },
                    { term: "Half-Duplex", definition: "Střídavě (Vysílačka) 📟" },
                    { term: "Full-Duplex", definition: "Obousměrně (Telefon) 📱" },
                    { term: "Auto-negotiation", definition: "Dohoda rychlosti/duplexu" }
                ]
            },
            {
                title: "Kódování & Modulace 🔢",
                items: [
                    { term: "NRZ", definition: "Non-Return to Zero (Binární)" },
                    { term: "Manchester", definition: "Vložené hodiny (Synchro)" },
                    { term: "AM", definition: "Amplitudová modulace" },
                    { term: "FM", definition: "Frekvenční modulace" },
                    { term: "QAM", definition: "Fáze + Amplituda (Wi-Fi/LTE)" }
                ]
            },
            {
                title: "Prvky L1 📦",
                items: [
                    { term: "Repeater", definition: "Zesílení signálu (Opakovač)" },
                    { term: "Hub", definition: "Broadcast bitů všem (Hloupý)" }
                ]
            }
        ]
    },
    13: {
        sections: [
            {
                title: "Linková vrstva (L2) 🔗",
                items: [
                    "2. vrstva ISO/OSI",
                    { term: "Jednotka", definition: "Rámec (Frame) 📦" },
                    { term: "Adresace", definition: "Fyzická (MAC)" },
                    { term: "Scope", definition: "Lokální síť (LAN)" }
                ]
            },
            {
                title: "Funkce L2 ⚙️",
                items: [
                    { term: "Rámcování", definition: "Hlavička + Data + Trailer" },
                    { term: "Flow Control", definition: "Řízení toku (Buffer)" },
                    { term: "Error Det.", definition: "CRC (Trailer) → Detekce" }
                ]
            },
            {
                title: "Podvrstvy 🍰",
                items: [
                    { term: "LLC", definition: "Logika + Multiplex (L3 interface)" },
                    { term: "MAC", definition: "Přístup k médiu + Adresace" }
                ]
            },
            {
                title: "MAC Adresa 🏷️",
                items: [
                    { term: "Délka", definition: "48 bitů (6 bajtů)" },
                    { term: "Formát", definition: "Hex (např. 00:1A:2B:3C:4D:5E)" },
                    { term: "OUI (24b)", definition: "Výrobce (IEEE přiděluje)" },
                    { term: "NIC (24b)", definition: "Sériové číslo karty" },
                    { term: "Broadcast", definition: "FF:FF:FF:FF:FF:FF" }
                ]
            },
            {
                title: "Přístup k médiu 🚦",
                items: [
                    { term: "CSMA/CD", definition: "Ethernet (kabel) → Detekce kolizí" },
                    { term: "CSMA/CA", definition: "Wi-Fi (bezdrát) → Předcházení (RTS/CTS)" },
                    { term: "Token Passing", definition: "Token Ring → Předávání žetonu" }
                ]
            },
            {
                title: "Prvky L2 🖧",
                items: [
                    { term: "Switch", definition: "Přepínání dle MAC (CAM tabulka)" },
                    { term: "Bridge", definition: "Propojení segmentů (SW switch)" },
                    { term: "NIC", definition: "Síťová karta (Burned-in Address)" },
                    { term: "WAP", definition: "Wi-Fi Access Point (většinou L2)" }
                ]
            }
        ]
    },
    14: {
        sections: [
            {
                title: "Síťová vrstva (L3) 🌐",
                items: [
                    "3. vrstva ISO/OSI",
                    { term: "Jednotka", definition: "Paket (Packet) 📦" },
                    { term: "Adresace", definition: "Logická (IP adresy)" },
                    { term: "Scope", definition: "Mezi sítěmi (Internet)" }
                ]
            },
            {
                title: "Hlavní funkce 🛠️",
                items: [
                    { term: "Routing", definition: "Směrování (Cesta grafem)" },
                    { term: "Adresace", definition: "Unikátní ID (IPv4/IPv6)" },
                    { term: "Fragmentace", definition: "Dělení paketů (MTU limit)" },
                    { term: "TTL", definition: "Time To Live (Prevence smyček)" }
                ]
            },
            {
                title: "IPv4 🔢",
                items: [
                    { term: "Délka", definition: "32 bitů (4 bajty)" },
                    { term: "Formát", definition: "Dotted Decimal (192.168.1.1)" },
                    { term: "Počet", definition: "~4.3 miliardy (vyčerpáno)" }
                ]
            },
            {
                title: "IPv4 Třídy (Classful) 📚",
                items: [
                    { term: "Class A", definition: "0.0.0.0 - 127... (/8) → Giganti" },
                    { term: "Class B", definition: "128... - 191... (/16) → Střední" },
                    { term: "Class C", definition: "192... - 223... (/24) → Malé" },
                    { term: "Class D", definition: "224... (Multicast)" },
                    { term: "Class E", definition: "240... (Exp./Future)" }
                ]
            },
            {
                title: "IPv6 🚀",
                items: [
                    { term: "Délka", definition: "128 bitů (16 bajtů)" },
                    { term: "Formát", definition: "Hex (2001:db8::1)" },
                    { term: "Počet", definition: "3.4 × 10^38 (Nekonečno)" },
                    { term: "Složení", definition: "Prefix (Síť) + Interface ID (Host)" }
                ]
            },
            {
                title: "Typy komunikace 🗣️",
                items: [
                    { term: "Unicast", definition: "1 → 1 (Target)" },
                    { term: "Broadcast", definition: "1 → Všichni (v subnetu)" },
                    { term: "Multicast", definition: "1 → Skupina (Video)" },
                    { term: "Anycast", definition: "1 → Nejbližší z clusteru (CDN)" }
                ]
            },
            {
                title: "Protokoly L3 📜",
                items: [
                    { term: "IP", definition: "Internet Protocol (Non-reliable)" },
                    { term: "ICMP", definition: "Ping / Traceroute (Chyby)" },
                    { term: "ARP", definition: "IP → MAC (L3 → L2)" },
                    { term: "NAT", definition: "Privátní IP ↔ Veřejná IP" }
                ]
            },
            {
                title: "Prvky L3 🖧",
                items: [
                    { term: "Router", definition: "Směrovač (Routing Table)" },
                    { term: "L3 Switch", definition: "Rychlý routing (Hardware)" }
                ]
            }
        ]
    },
    15: {
        sections: [
            {
                title: "Adresace: Subnetting 🔪",
                items: [
                    { term: "Subnet Mask", definition: "Odděluje Síť / Host" },
                    { term: "Příklad", definition: "/24 = 255.255.255.0" },
                    { term: "CIDR", definition: "Prefix notace (/XX)" },
                    { term: "VLSM", definition: "Různé masky v jedné síti (Efektivita)" }
                ]
            },
            {
                title: "Privátní rozsahy (RFC 1918) 🔒",
                items: [
                    { term: "10.0.0.0/8", definition: "Velké firmy (A)" },
                    { term: "172.16.0.0/12", definition: "AWS / Docker (B)" },
                    { term: "192.168.0.0/16", definition: "Domácnosti (C)" },
                    { term: "Loopback", definition: "127.0.0.0/8 (localhost)" },
                    { term: "APIPA", definition: "169.254.x.x (DHCP fail)" }
                ]
            },
            {
                title: "Směrování (Routing) 🗺️",
                items: [
                    { term: "Statické", definition: "Admin ručně (Small nets)" },
                    { term: "Dynamické", definition: "Protokoly (Large nets)" },
                    { term: "Default Route", definition: "0.0.0.0/0 (Gateway of last resort)" }
                ]
            },
            {
                title: "Směrovací tabulka 📋",
                items: [
                    { term: "Network ID", definition: "Cílová síť" },
                    { term: "Metrika", definition: "Cena cesty (Cost/Hop)" },
                    { term: "Next Hop", definition: "IP souseda / Interface" }
                ]
            },
            {
                title: "Dynamické protokoly 🤖",
                items: [
                    { term: "RIP", definition: "Distance Vector | Hops (max 15)" },
                    { term: "OSPF", definition: "Link State | Bandwidth (Cost) | Areas" },
                    { term: "EIGRP", definition: "Hybrid (Cisco) | Bandwidth + Delay" },
                    { term: "BGP", definition: "Path Vector | Internet (AS path)" }
                ]
            },
            {
                title: "NAT (Překlad adres) 🎭",
                items: [
                    { term: "SNAT", definition: "Source NAT (LAN → Internet)" },
                    { term: "DNAT", definition: "Dest. NAT (Port Forwarding)" },
                    { term: "PAT", definition: "Port Address Translation (Overload)" }
                ]
            }
        ]
    },
    16: {
        sections: [
            {
                title: "Transportní vrstva (L4) 🚚",
                items: [
                    "4. vrstva ISO/OSI",
                    { term: "Jednotka", definition: "Segment (TCP) / Datagram (UDP)" },
                    { term: "Adresace", definition: "Porty (0 - 65535)" },
                    { term: "Funkce", definition: "End-to-End komunikace" }
                ]
            },
            {
                title: "TCP (Transmission Control) 🛡️",
                items: [
                    { term: "Typ", definition: "Spojovaný (Connection-oriented)" },
                    { term: "Spolehlivost", definition: "Garantuje doručení (ACK)" },
                    { term: "Pořadí", definition: "Sekvenční čísla (SEQ)" },
                    { term: "Řízení toku", definition: "Windowing (Flow Control)" },
                    { term: "Handshake", definition: "SYN → SYN-ACK → ACK" }
                ]
            },
            {
                title: "UDP (User Datagram) 🚀",
                items: [
                    { term: "Typ", definition: "Nespojovaný (Connectionless)" },
                    { term: "Rychlost", definition: "Maximální (žádný overhead)" },
                    { term: "Spolehlivost", definition: "Negarantuje (Best effort)" },
                    { term: "Použití", definition: "Streaming, VoIP, DNS, DHCP" }
                ]
            },
            {
                title: "Porty (IANA) 🚪",
                items: [
                    { term: "20/21", definition: "FTP (File Transfer)" },
                    { term: "22", definition: "SSH (Secure Shell)" },
                    { term: "23", definition: "Telnet (Insecure)" },
                    { term: "25", definition: "SMTP (Mail Send)" },
                    { term: "53", definition: "DNS (Domain Name)" },
                    { term: "80", definition: "HTTP (Web)" },
                    { term: "443", definition: "HTTPS (Secure Web)" }
                ]
            },
            {
                title: "Relační vrstva (L5) 🤝",
                items: [
                    "Správa relací (Session)",
                    { term: "Funkce", definition: "Start/Stop/Sync komunikace" },
                    { term: "Režimy", definition: "Simplex / Half / Full-Duplex" },
                    { term: "Příklad", definition: "NetBIOS, RPC, SQL Session" }
                ]
            },
            {
                title: "Prezentační vrstva (L6) 🎨",
                items: [
                    "Formátování a syntaxe dat",
                    { term: "Kódování", definition: "ASCII, EBCDIC, Unicode" },
                    { term: "Komprese", definition: "ZIP, JPEG, MP3" },
                    { term: "Šifrování", definition: "TLS/SSL (často zde řazeno)" }
                ]
            }
        ]
    },
    17: {
        sections: [
            {
                title: "Aplikační vrstva (L7) 🖥️",
                items: [
                    "7. vrstva ISO/OSI",
                    { term: "Funkce", definition: "Interface pro uživatele/aplikace" },
                    { term: "Data", definition: "Aplikační data (Message)" }
                ]
            },
            {
                title: "Webové služby 🌐",
                items: [
                    { term: "HTTP (80)", definition: "HyperText Transfer Protocol" },
                    { term: "HTTPS (443)", definition: "HTTP + TLS (Šifrováno)" },
                    { term: "Metody", definition: "GET (čti), POST (apiš)" },
                    { term: "Kódy", definition: "200 (OK), 404 (Not Found), 500 (Err)" }
                ]
            },
            {
                title: "DNS (Domain Name System) 📒",
                items: [
                    { term: "Port", definition: "53 (UDP/TCP)" },
                    { term: "Funkce", definition: "Doména (google.com) → IP" },
                    { term: "Record A", definition: "Jméno → IPv4" },
                    { term: "Record AAAA", definition: "Jméno → IPv6" },
                    { term: "Record MX", definition: "Mail Exchange" },
                    { term: "Record CNAME", definition: "Alias (Canonical Name)" }
                ]
            },
            {
                title: "E-mail služby ✉️",
                items: [
                    { term: "SMTP (25)", definition: "Odesílání (Push)" },
                    { term: "POP3 (110)", definition: "Stažení + Smazání (lokální)" },
                    { term: "IMAP (143)", definition: "Synchro se serverem (vzdálené)" }
                ]
            },
            {
                title: "Přenos souborů 📁",
                items: [
                    { term: "FTP (20/21)", definition: "File Transfer (Plaintext)" },
                    { term: "SFTP (22)", definition: "FTP přes SSH (Secure)" },
                    { term: "TFTP (69)", definition: "Trivial FTP (UDP, Boot)" }
                ]
            },
            {
                title: "Správa a Ostatní 🛠️",
                items: [
                    { term: "SSH (22)", definition: "Secure Shell (Komandní řádek)" },
                    { term: "Telnet (23)", definition: "Remote (Plaintext - NEPOUŽÍVAT)" },
                    { term: "DHCP (67/68)", definition: "Auto-config IP (DORA process)" },
                    { term: "RDP (3389)", definition: "Remote Desktop (Windows)" },
                    { term: "SNMP (161)", definition: "Monitoring prvků" }
                ]
            }
        ]
    },
    18: {
        sections: [
            {
                title: "Síťové prvky (Hardware) 🧰",
                subsections: [
                    {
                        title: "Vrstva 1 (L1)",
                        items: [
                            { term: "Repeater", definition: "Prodlužuje dosah (Zesilovač)" },
                            { term: "Hub", definition: "Multi-port repeater (Kolize!)" }
                        ]
                    },
                    {
                        title: "Vrstva 2 (L2)",
                        items: [
                            { term: "Bridge", definition: "Odděluje kolizní domény (SW)" },
                            { term: "Switch", definition: "ASIC chipy, Wirespeed přepínání" },
                            { term: "WAP", definition: "Wireless Access Point (Bridge)" }
                        ]
                    },
                    {
                        title: "Vrstva 3 (L3)",
                        items: [
                            { term: "Router", definition: "Směrování, Odděluje broadcast" },
                            { term: "L3 Switch", definition: "VLAN routing, Inter-VLAN" }
                        ]
                    },
                    {
                        title: "Bezpečnost",
                        items: [
                            { term: "Firewall", definition: "Filtrování paketů/stavů (SPI)" },
                            { term: "IPS/IDS", definition: "Prevence/Detekce průniku" }
                        ]
                    }
                ]
            },
            {
                title: "Strukturovaná kabeláž 🏗️",
                items: [
                    { term: "Topologie", definition: "Hvězda (Star)" },
                    { term: "Horizontální", definition: "Zásuvka → Patch panel (max 90m)" },
                    { term: "Vertikální", definition: "Páteř (Backbone) → Mezi patry" },
                    { term: "Patch Cord", definition: "Propojovací kabel (max 5m)" }
                ]
            },
            {
                title: "Kategorie (Twisted Pair) 🧵",
                items: [
                    { term: "Cat 5e", definition: "1 Gbps | 100 MHz" },
                    { term: "Cat 6", definition: "1 Gbps (10G na 55m) | 250 MHz" },
                    { term: "Cat 6a", definition: "10 Gbps | 500 MHz" },
                    { term: "Cat 7", definition: "Stíněný | 600 MHz" },
                    { term: "Cat 8", definition: "40 Gbps | Datacentra" }
                ]
            },
            {
                title: "Standardy zapojení (T568) 🌈",
                items: [
                    { term: "T568A", definition: "Zelená / Zelená / Oranžová..." },
                    { term: "T568B", definition: "Oranžová / Oranžová / Zelená (ČR)" },
                    { term: "Straight", definition: "A-A nebo B-B (PC ↔ Switch)" },
                    { term: "Crossover", definition: "A-B (PC ↔ PC, Switch ↔ Switch)" }
                ]
            }
        ]
    },
    19: {
        sections: [
            {
                title: "Ethernet (IEEE 802.3) 🔗",
                items: [
                    "LAN standard",
                    { term: "Metoda", definition: "CSMA/CD (Carrier Sense...)" },
                    { term: "Topologie", definition: "Logická sběrnice / Fyzická hvězda" }
                ]
            },
            {
                title: "Rychlosti Ethernetu ⚡",
                items: [
                    { term: "10Base-T", definition: "10 Mbps" },
                    { term: "Fast Eth.", definition: "100 Mbps (100Base-TX)" },
                    { term: "Gigabit", definition: "1 Gbps (1000Base-T)" },
                    { term: "10 Gig", definition: "10 Gbps (10GBase-T)" }
                ]
            },
            {
                title: "Ethernet Rámec 📦",
                items: [
                    { term: "Preamble", definition: "Synchronizace (101010...)" },
                    { term: "Dest MAC", definition: "6 B (Cíl)" },
                    { term: "Src MAC", definition: "6 B (Zdroj)" },
                    { term: "Type/Len", definition: "EtherType (IPv4/Arp...)" },
                    { term: "Payload", definition: "Data (46 - 1500 B)" },
                    { term: "FCS", definition: "CRC check (4 B)" }
                ]
            },
            {
                title: "VLAN (802.1Q) 🛡️",
                items: [
                    { term: "Definice", definition: "Virtuální LAN (Logická síť)" },
                    { term: "Výhody", definition: "Bezpečnost, Segmentace, < Broadcast" },
                    { term: "Tagging", definition: "Vložení 4B tagu do rámce" },
                    { term: "Trunk", definition: "Linka pro více VLAN (Tagged)" },
                    { term: "Access", definition: "Linka pro 1 VLAN (Untagged)" }
                ]
            },
            {
                title: "PoE (Power over Ethernet) ⚡",
                items: [
                    { term: "Definice", definition: "Napájení po datovém kabelu" },
                    { term: "Použití", definition: "Kamery, VoIP telefony, WAP" },
                    { term: "Standardy", definition: "802.3af (15W) / 802.3at (30W)" }
                ]
            }
        ]
    },
    20: {
        sections: [
            {
                title: "Wi-Fi (IEEE 802.11) 📡",
                items: [
                    "WLAN (Wireless LAN)",
                    { term: "Metoda", definition: "CSMA/CA (Collision Avoidance)" },
                    { term: "Medium", definition: "Rádiové vlny (RF)" },
                    { term: "Režimy", definition: "Ad-hoc (P2P) / Infrastructure (AP)" }
                ]
            },
            {
                title: "Standardy & Rychlosti 🚀",
                items: [
                    { term: "802.11b", definition: "11 Mbps (2.4 GHz)" },
                    { term: "802.11g", definition: "54 Mbps (2.4 GHz)" },
                    { term: "802.11n", definition: "600 Mbps (WiFi 4) | MIMO" },
                    { term: "802.11ac", definition: "Gbps (WiFi 5) | 5 GHz" },
                    { term: "802.11ax", definition: "WiFi 6 | OFDMA | High efficiency" }
                ]
            },
            {
                title: "Frekvenční pásma 〰️",
                items: [
                    { term: "2.4 GHz", definition: "Dosah ++ | Rušení ++ | 3 kanály (1,6,11)" },
                    { term: "5 GHz", definition: "Rychlost ++ | Dosah -- | Více kanálů" },
                    { term: "6 GHz", definition: "WiFi 6E | Žádné rušení" }
                ]
            },
            {
                title: "Zabezpečení 🔒",
                items: [
                    { term: "Open", definition: "Žádné (Riziko)" },
                    { term: "WEP", definition: "Prolomené (NEPOUŽÍVAT)" },
                    { term: "WPA2", definition: "AES šifrování (Standard)" },
                    { term: "WPA3", definition: "SAE handshake (Bezpečné)" },
                    { term: "Enterprise", definition: "Radius server (Login/Pass)" }
                ]
            },
            {
                title: "Terminologie 📖",
                items: [
                    { term: "SSID", definition: "Název sítě (Service Set ID)" },
                    { term: "BSSID", definition: "MAC adresa vysílače" },
                    { term: "Roaming", definition: "Přechod mezi AP bez výpadku" },
                    { term: "MIMO", definition: "Více antén (in/out)" }
                ]
            }
        ]
    }
};

// Update questions with new compactContent
data.questions.forEach(q => {
    if (compactContents[q.id]) {
        q.compactContent = compactContents[q.id];
    }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('✅ Updated compactContent v2 for questions 11-20');
