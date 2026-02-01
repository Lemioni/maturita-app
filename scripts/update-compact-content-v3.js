/**
 * Ultra-compact mobile content v3 for questions 11-20
 * FIX: Include ALL devices and details from source text, even if they seem redundant.
 * STRICT: 100% information retention + Telegraphic style.
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
                title: "Princip činnosti ⚙️",
                items: [
                    { term: "Síť", definition: "Propojení zařízení (PC/Server/Tiskárna)" },
                    { term: "Média", definition: "Kabely / Wi-Fi" },
                    { term: "Cíl", definition: "Sdílení zdrojů + Komunikace" }
                ]
            },
            {
                title: "Dělení podle velikosti 📏",
                items: [
                    { term: "LAN (Local)", definition: "Budova/Kancelář (Domácí síť)" },
                    { term: "MAN (Metropolitan)", definition: "Město (propojení více LAN)" },
                    { term: "WAN (Wide)", definition: "Globální (Internet)" }
                ]
            },
            {
                title: "Dělení podle topologie 🕸️",
                items: [
                    { term: "Sběrnicová (Bus)", definition: "1 kabel (koax) pro všechna PC" },
                    { term: "⚠️ Nevýhoda", definition: "Kolize (řeší CSMA/CD) + Přerušení kabelu = Konec" },
                    { term: "Hvězdicová (Star)", definition: "Centrální prvek (Switch/Hub)" },
                    { term: "✅ Výhoda", definition: "Výpadek 1 PC nevadí" },
                    { term: "⚠️ Nevýhoda", definition: "Závislost na centrále + Kabeláž" },
                    { term: "Kruhová (Ring)", definition: "Data v kruhu (jednosměrně)" },
                    { term: "⚠️ Nevýhoda", definition: "Výpadek PC = Konec (Nutná záložní cesta)" }
                ]
            },
            {
                title: "Dělení podle řízení 🎮",
                items: [
                    { term: "Peer-to-peer", definition: "Rovnocenná zařízení (PC ↔ PC)" },
                    { term: "Klient-server", definition: "Centrální server poskytuje služby" }
                ]
            },
            {
                title: "Historie Internetu 📜",
                items: [
                    { term: "1969", definition: "ARPANET (Vznik)" },
                    { term: "1983", definition: "TCP/IP (Základ moderního netu)" },
                    { term: "1990", definition: "Konec ARPANETu → Veřejný Internet" }
                ]
            },
            {
                title: "Historické sítě (Detail) 🏛️",
                items: [
                    { term: "ARPANET (69-90)", definition: "US DoD, Přepojování paketů (NCP→TCP/IP)" },
                    { term: "CYCLADES (72)", definition: "Francie, End-to-end → Inspirace pro TCP/IP" },
                    { term: "X.25 (70s)", definition: "Paketová síť (Banky/Telco) → Frame Relay" },
                    { term: "USENET (79)", definition: "UUCP, Newsgroups (Diskuze)" },
                    { term: "BITNET (81)", definition: "Spojení univerzit (Mail/Soubory)" },
                    { term: "NSFNET (86-95)", definition: "Páteřní síť (Akademická) → Dnešní Internet" }
                ]
            },
            {
                title: "Správa a organizace 🏢",
                items: [
                    { term: "Správa", definition: "Decentralizovaná" },
                    { term: "IANA/ICANN", definition: "IP adresy + Domény" },
                    { term: "RFC", definition: "Request for Comments (Standardy)" }
                ]
            }
        ]
    },
    12: {
        sections: [
            {
                title: "Fyzická vrstva (L1) 🔌",
                items: [
                    "Najnižší vrstva (1. ISO/OSI)",
                    { term: "Funkce", definition: "Data → Signály (El./Opt./Rádio)" },
                    { term: "Obsah", definition: "Média + Konektory + Synchronizace bitů" },
                    { term: "Rychlost", definition: "Max přenosová kapacita (bps)" },
                    { term: "Topologie", definition: "Fyzické uspořádání (Hvězda/Sběrnice)" }
                ]
            },
            {
                title: "Kabeláž: Kroucená dvojlinka (Twisted Pair) 🌀",
                items: [
                    { term: "Složení", definition: "Měděné páry ve spirále (proti rušení)" },
                    { term: "UTP", definition: "Unshielded (Kanceláře/Doma)" },
                    { term: "STP", definition: "Shielded (Průmysl - rušení)" },
                    { term: "Rychlost", definition: "Až 10 Gbps (dle kategorie)" }
                ]
            },
            {
                title: "Kabeláž: Koaxiální kabel 📺",
                items: [
                    { term: "Složení", definition: "Vodič + Izolace + Stínění" },
                    { term: "Použití", definition: "TV + Staré sítě" },
                    { term: "✅ / ⚠️", definition: "Odolný / Málo flexibilní" }
                ]
            },
            {
                title: "Kabeláž: Optické vlákno 💡",
                items: [

                    { term: "Princip", definition: "Světelné pulzy" },
                    { term: "Single-mode", definition: "Dlouhé tratě (Páteř)" },
                    { term: "Multi-mode", definition: "Kratší (Datacentra)" },
                    { term: "✅ / ⚠️", definition: "Rychlost+Dosah / Cena+Instalace" }
                ]
            },
            {
                title: "Konektory 🔌",
                items: [
                    { term: "RJ-45", definition: "Ethernet (Dvojlinka)" },
                    { term: "BNC", definition: "Koax (CCTV)" },
                    { term: "SC / LC / ST", definition: "Optika" }
                ]
            },
            {
                title: "Vlastnosti médií 📊",
                items: [
                    { term: "Šířka pásma", definition: "Max kapacita (např. 1Gbps)" },
                    { term: "Rušení (EMI)", definition: "Elmag. interference" },
                    { term: "Vzdálenost", definition: "Limit (UTP 100m, Optika km)" },
                    { term: "Latence", definition: "Zpoždění (Odezva)" }
                ]
            },
            {
                title: "Typy přenosů ↔️",
                items: [
                    { term: "Simplex", definition: "1 směr (Rádio)" },
                    { term: "Half-Duplex", definition: "Střídavě (Vysílačka)" },
                    { term: "Full-Duplex", definition: "Obousměrně (Telefon)" }
                ]
            },
            {
                title: "Signály & Kódování 📡",
                items: [
                    { term: "Analog", definition: "Plynulý (Zvuk/TV) → Amplituda+Frekvence" },
                    { term: "Digitál", definition: "Diskrétní (0/1) → Odolnější" },
                    { term: "Kódování", definition: "NRZ (Binární), Manchester (Hodiny)" },
                    { term: "Modulace", definition: "AM (Amp), FM (Frek), QAM (Kombinace)" }
                ]
            },
            {
                title: "Síťové prvky (Kompletní seznam) 🧰",
                items: [
                    { term: "Repeater", definition: "Zesiluje signál (L1)" },
                    { term: "Hub", definition: "Rozbočovač - Broadcast všem (L1)" },
                    { term: "Switch", definition: "Přepínač - Cíleně dle MAC (L2)" },
                    { term: "Router", definition: "Směrovač - Mezi sítěmi dle IP (L3)" },
                    { term: "Modem", definition: "Digital ↔ Analog (Převodník)" },
                    { term: "Access Point", definition: "Bezdrátový přístup (Wi-Fi ↔ Kabel)" }
                ]
            }
        ]
    },
    13: {
        sections: [
            {
                title: "Linková vrstva (L2) 🔗",
                items: [
                    "2. vrstva ISO/OSI (mezi Fyzickou a Síťovou)",
                    { term: "Cíl", definition: "Spolehlivost v lokální síti (LAN)" },
                    { term: "Jednotka", definition: "Rámec (Frame) 📦" }
                ]
            },
            {
                title: "Hlavní funkce ⚙️",
                items: [
                    { term: "Rámcování", definition: "Data → Hlavička + Payload + Trailer" },
                    { term: "Fyz. Adresace", definition: "MAC adresy" },
                    { term: "Řízení přístupu", definition: "K médiu (MAC sublayer)" },
                    { term: "Detekce chyb", definition: "CRC (Trailer)" },
                    { term: "Flow Control", definition: "Brání zahlcení" }
                ]
            },
            {
                title: "Podvrstvy L2 🍰",
                items: [
                    { term: "MAC (Media Access)", definition: "Řízení přístupu + Fyz. adresy" },
                    { term: "LLC (Logical Link)", definition: "Rozhraní pro L3 + Multiplex + Error check" }
                ]
            },
            {
                title: "MAC Adresa 🏷️",
                items: [
                    { term: "Definice", definition: "Unikátní ID, 48 bitů (6B)" },
                    { term: "OUI (Prefix)", definition: "24 bitů (Výrobce)" },
                    { term: "NIC (Suffix)", definition: "24 bitů (Sériové číslo)" }
                ]
            },
            {
                title: "Přístupové metody 🚦",
                items: [
                    { term: "CSMA/CD", definition: "Ethernet (kabel) → Detekce kolizí" },
                    { term: "CSMA/CA", definition: "Wi-Fi → Předcházení kolizím" },
                    { term: "Token Passing", definition: "Token Ring → Žeton (Token)" }
                ]
            },
            {
                title: "Síťové prvky L2 🧰",
                items: [
                    { term: "Switch", definition: "Přeposílá rámce dle MAC (Unicast)" },
                    { term: "Bridge", definition: "Spojuje segmenty, filtruje dle MAC" },
                    { term: "Access Point", definition: "Wi-Fi připojení do sítě" },
                    { term: "NIC (Karta)", definition: "Rozhraní PC ↔ Síť (má MAC)" }
                ]
            },
            {
                title: "Protokoly 📜",
                items: [
                    { term: "Ethernet", definition: "LAN standard" },
                    { term: "Wi-Fi", definition: "802.11" },
                    { term: "PPP", definition: "Point-to-Point (přímé spojení)" },
                    { term: "HDLC", definition: "Sériové linky" }
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
                    { term: "Cíl", definition: "Směrování mezi sítěmi (Routing)" },
                    { term: "Jednotka", definition: "Paket (Packet) 📦" },
                    { term: "Adresace", definition: "Logická (IP adresy)" }
                ]
            },
            {
                title: "Hlavní funkce 🛠️",
                items: [
                    { term: "Routing", definition: "Hledání nejlepší cesty" },
                    { term: "Adresace", definition: "Unikátní IP (IPv4 / IPv6)" },
                    { term: "Fragmentace", definition: "Dělení paketů (MTU)" },
                    { term: "QoS", definition: "Prioritizace provozu" },
                    { term: "Přetížení", definition: "Detekce a řízení" }
                ]
            },
            {
                title: "IPv4 🔢",
                items: [
                    { term: "Délka", definition: "32 bitů (4 oktety po 8b)" },
                    { term: "Formát", definition: "192.168.1.1 (Dotted Decimal)" },
                    { term: "Kapacita", definition: "~4.3 miliardy adres" }
                ]
            },
            {
                title: "Třídy IPv4 (Classful) 📚",
                items: [
                    { term: "A", definition: "0-127 (Velké sítě, /8)" },
                    { term: "B", definition: "128-191 (Střední, /16)" },
                    { term: "C", definition: "192-223 (Malé, /24)" },
                    { term: "D", definition: "224-239 (Multicast)" },
                    { term: "E", definition: "240-255 (Experimentální)" }
                ]
            },
            {
                title: "Typy adres 🏷️",
                items: [
                    { term: "Veřejné", definition: "Internet (Globální)" },
                    { term: "Privátní", definition: "Lokální (LAN) - nesměrovatelné v netu" },
                    { term: "Loopback", definition: "127.0.0.1 (Localhost)" },
                    { term: "Broadcast", definition: "Všem v síti" }
                ]
            },
            {
                title: "IPv6 🚀",
                items: [
                    { term: "Délka", definition: "128 bitů (16 bajtů)" },
                    { term: "Formát", definition: "Hex (2001:db8::1)" },
                    { term: "Typy", definition: "Unicast / Multicast / Anycast" },
                    { term: "Adresy", definition: "Globální / Link-local (FE80) / Soukromé" }
                ]
            },
            {
                title: "Protokoly L3 📜",
                items: [
                    { term: "IP", definition: "Doručení paketů" },
                    { term: "ICMP", definition: "Ping / Chyby" },
                    { term: "ARP", definition: "IP → MAC" },
                    { term: "RARP", definition: "MAC → IP" },
                    { term: "NAT", definition: "Překlad privátní ↔ veřejná IP" }
                ]
            },
            {
                title: "Síťové prvky L3 🧰",
                items: [
                    { term: "Router", definition: "Směruje (Nejlepší cesta)" },
                    { term: "Firewall", definition: "Filtr (Bezpečnost)" },
                    { term: "Gateway (Brána)", definition: "Překlad protokolů" },
                    { term: "L3 Switch", definition: "Rychlý routing (HW)" }
                ]
            }
        ]
    },
    15: {
        sections: [
            {
                title: "Adresace a Síťová zařízení 🗺️",
                items: [
                    { term: "PC", definition: "Koncový bod, IP + MAC" },
                    { term: "Switch (L2)", definition: "Spojuje LAN (MAC)" },
                    { term: "Router (L3)", definition: "Spojuje sítě (IP)" }
                ]
            },
            {
                title: "Subnetting a Masky 🎭",
                items: [
                    { term: "VLSM", definition: "Různé délky masek (Efektivita)" },
                    { term: "Subnetting", definition: "Dělení sítě na menší podsítě" },
                    { term: "Maska", definition: "Síťová vs Hostitelská část" },
                    { term: "CIDR", definition: "Prefix (/24 místo 255.255.255.0)" }
                ]
            },
            {
                title: "Výpočty sítě 🧮",
                items: [
                    { term: "Rozsah", definition: "Síťová adresa → Broadcast" },
                    { term: "Hostitelé", definition: "2^(bity hosta) - 2" },
                    { term: "Broadcast", definition: "Poslední adresa subnetu" },
                    { term: "Network ID", definition: "První adresa subnetu" }
                ]
            },
            {
                title: "Privátní rozsahy (LAN) 🔒",
                items: [
                    { term: "A", definition: "10.0.0.0 - 10.255.255.255" },
                    { term: "B", definition: "172.16.0.0 - 172.31.255.255" },
                    { term: "C", definition: "192.168.0.0 - 192.168.255.255" }
                ]
            },
            {
                title: "Směrování (Routing) 🚦",
                items: [
                    { term: "Statické", definition: "Ručně zadané (Malé sítě)" },
                    { term: "Dynamické", definition: "Automatické (Protokoly)" }
                ]
            },
            {
                title: "Směrovací tabulka 📋",
                items: [
                    { term: "Cíl", definition: "IP sítě" },
                    { term: "Maska", definition: "Velikost" },
                    { term: "Next Hop", definition: "Další skok (Router)" },
                    { term: "Metrika", definition: "Cena (Hop count / Bandwidth)" },
                    { term: "Metody", definition: "Unicast / Broadcast / Multicast" }
                ]
            },
            {
                title: "Směrovací protokoly 🤖",
                items: [
                    { term: "RIP", definition: "Hops (max 15), Pomalý" },
                    { term: "OSPF", definition: "Link-state, Rychlý, SPF algoritmus" },
                    { term: "BGP", definition: "Internet (Autonomní systémy)" },
                    { term: "EIGRP", definition: "Cisco, Hybridní" }
                ]
            }
        ]
    },
    16: {
        sections: [
            {
                title: "Transportní vrstva (L4) 🚚",
                items: [
                    "4. vrstva - Spolehlivost a doručení dat aplikacím",
                    { term: "Data", definition: "Segmenty (TCP) / Datagramy (UDP)" },
                    { term: "Adresace", definition: "Porty (Služby)" }
                ]
            },
            {
                title: "Funkce L4 🛠️",
                items: [
                    { term: "Spolehlivost", definition: "Garantované doručení" },
                    { term: "Segmentace", definition: "Dělení dat + Rekonstrukce" },
                    { term: "Flow Control", definition: "Řízení toku (aby se nepřeplnil)" },
                    { term: "Error Correction", definition: "Oprava chyb (Retransmise)" }
                ]
            },
            {
                title: "TCP Protokol (Transmission Control) 🛡️",
                items: [
                    { term: "Typ", definition: "Spojovaný (Connection-oriented)" },
                    { term: "Vlastnosti", definition: "Spolehlivý, Potvrzování (ACK)" },
                    { term: "Segment", definition: "Porty + SEQ + ACK + Checksum" },
                    { term: "Handshake", definition: "3-way (SYN, SYN-ACK, ACK)" }
                ]
            },
            {
                title: "UDP Protokol (User Datagram) 🚀",
                items: [
                    { term: "Typ", definition: "Nespojovaný (Connectionless)" },
                    { term: "Vlastnosti", definition: "Rychlý, Bez záruky (Best effort)" },
                    { term: "Použití", definition: "Streaming, Hry, VoIP, DNS" },
                    { term: "Datagram", definition: "Porty + Délka + Checksum" }
                ]
            },
            {
                title: "Relační vrstva (L5) 🤝",
                items: [
                    "5. vrstva - Řízení relace (Session)",
                    { term: "Funkce", definition: "Start/Stop relace, Synchronizace" },
                    { term: "Řízení", definition: "Simplex / Half / Full-Duplex" },
                    { term: "Příklady", definition: "RPC, NetBIOS, SQL Session" }
                ]
            },
            {
                title: "Prezentační vrstva (L6) 🎨",
                items: [
                    "6. vrstva - Formát dat",
                    { term: "Kódování", definition: "Převod (ASCII, Unicode)" },
                    { term: "Komprese", definition: "Zmenšení (ZIP, JPEG)" },
                    { term: "Šifrování", definition: "Bezpečnost (TLS/SSL)" },
                    { term: "MIME", definition: "Typy souborů v mailu" }
                ]
            }
        ]
    },
    17: {
        sections: [
            {
                title: "Aplikační vrstva (L7) 🖥️",
                items: [
                    "7. vrstva - Rozhraní pro uživatele",
                    { term: "Funkce", definition: "Služby (Web, Mail, FS)" },
                    { term: "Interakce", definition: "Přímo s aplikací" }
                ]
            },
            {
                title: "Webové služby (HTTP/S) 🌐",
                items: [
                    { term: "HTTP (80)", definition: "Nešifrovaný text" },
                    { term: "HTTPS (443)", definition: "Šifrovaný (TLS)" },
                    { term: "Metody", definition: "GET, POST, PUT, DELETE" }
                ]
            },
            {
                title: "DNS (Domain Name System) 📒",
                items: [
                    { term: "Port", definition: "53 (UDP/TCP)" },
                    { term: "Funkce", definition: "Překlad Doména ↔ IP" },
                    { term: "Struktura", definition: "Hierarchická (Root .cz .seznam)" },
                    { term: "Záznamy", definition: "A (IPv4), AAAA (IPv6), MX (Mail), CNAME (Alias)" }
                ]
            },
            {
                title: "E-mail ✉️",
                items: [
                    { term: "SMTP (25/587)", definition: "Odesílání pošty" },
                    { term: "POP3 (110)", definition: "Stažení (lokálně)" },
                    { term: "IMAP (143)", definition: "Synchronizace (na serveru)" }
                ]
            },
            {
                title: "Přenos souborů 📁",
                items: [
                    { term: "FTP (20/21)", definition: "File Transfer (Plain)" },
                    { term: "SFTP (22)", definition: "Secure (SSH tunel)" },
                    { term: "TFTP (69)", definition: "Trivial (Boot, UDP)" }
                ]
            },
            {
                title: "Správa a Ostatní 🛠️",
                items: [
                    { term: "DHCP (67/68)", definition: "Auto IP konfigurace" },
                    { term: "SSH (22)", definition: "Secure Shell (Konzole)" },
                    { term: "Telnet (23)", definition: "Nešifrované (Nepoužívat)" },
                    { term: "SNMP (161)", definition: "Monitoring sítě" },
                    { term: "NTP (123)", definition: "Synchronizace času" }
                ]
            }
        ]
    },
    18: {
        sections: [
            {
                title: "Síťové prvky (Přehled) 🧰",
                items: [
                    { term: "Repeater (L1)", definition: "Zesilovač signálu" },
                    { term: "Hub (L1)", definition: "Rozbočovač (Broadcast)" },
                    { term: "Bridge (L2)", definition: "Most (Oddělení segmentů)" },
                    { term: "Switch (L2)", definition: "Přepínač (MAC adresy)" },
                    { term: "Router (L3)", definition: "Směrovač (IP adresy)" },
                    { term: "Gateway (L7)", definition: "Brána (Překlad protokolů)" }
                ]
            },
            {
                title: "Strukturovaná kabeláž 🏗️",
                items: [
                    { term: "Princip", definition: "Univerzální kabeláž budovy" },
                    { term: "Horizontální", definition: "Patro (Zásuvka - Patch panel)" },
                    { term: "Vertikální", definition: "Páteř (Mezi patry/budovami)" },
                    { term: "Prvky", definition: "Patch panel, Zásuvka, Patch kabel" },
                    { term: "Rack", definition: "Rozvaděč 19\" (U = 44.45mm)" }
                ]
            },
            {
                title: "Kategorie kabelů (Cat) 🧵",
                items: [
                    { term: "Cat 5e", definition: "1 Gbps (100 MHz)" },
                    { term: "Cat 6", definition: "1 Gbps / 10 Gbps na 55m" },
                    { term: "Cat 6a", definition: "10 Gbps (500 MHz)" },
                    { term: "Cat 7", definition: "Stíněný (600 MHz)" },
                    { term: "Cat 8", definition: "Datacentra (25/40 Gbps)" }
                ]
            },
            {
                title: "Zapojení RJ-45 (T568) 🌈",
                items: [
                    { term: "T568A", definition: "Zelená / Zelená / Oranžová..." },
                    { term: "T568B", definition: "Oranžová / Oranžová / Zelená (Standard)" },
                    { term: "Přímý", definition: "Stejné (PC ↔ Switch)" },
                    { term: "Křížený", definition: "Opačné (PC ↔ PC, Switch ↔ Switch)" }
                ]
            }
        ]
    },
    19: {
        sections: [
            {
                title: "Ethernet (IEEE 802.3) 🔗",
                items: [
                    "Standard pro LAN sítě",
                    { term: "Metoda", definition: "CSMA/CD (Detekce kolizí)" },
                    { term: "Topologie", definition: "Hvězda (fyzicky), Sběrnice (logicky)" }
                ]
            },
            {
                title: "Rychlosti ⚡",
                items: [
                    { term: "10Base-T", definition: "10 Mbps (Cat 3)" },
                    { term: "100Base-TX", definition: "100 Mbps (Cat 5) - Fast Eth." },
                    { term: "1000Base-T", definition: "1 Gbps (Cat 5e) - Gigabit" },
                    { term: "10GBase-T", definition: "10 Gbps (Cat 6a)" }
                ]
            },
            {
                title: "Ethernet Rámec 📦",
                items: [
                    { term: "Preambule", definition: "Synchronizace (10101010)" },
                    { term: "SFD", definition: "Start Frame Delimiter" },
                    { term: "Adresy", definition: "MAC Cíl (6B) + MAC Zdroj (6B)" },
                    { term: "EtherType", definition: "Protokol (IPv4/Arp) / Délka" },
                    { term: "Data", definition: "Payload (46 - 1500 B)" },
                    { term: "FCS", definition: "CRC Checksum (Konec)" }
                ]
            },
            {
                title: "VLAN (802.1Q) 🛡️",
                items: [
                    { term: "Definice", definition: "Virtuální LAN (Logické dělení)" },
                    { term: "Tagging", definition: "Vložení VLAN ID (4 Byty)" },
                    { term: "Trunk", definition: "Přenáší více VLAN (Tagged)" },
                    { term: "Access", definition: "Pro koncová zařízení (Untagged)" },
                    { term: "Výhody", definition: "Bezpečnost, Méně broadcastu" }
                ]
            },
            {
                title: "PoE (Power over Ethernet) ⚡",
                items: [
                    { term: "Definice", definition: "Napájení po datech" },
                    { term: "Typy", definition: "802.3af (15W) / 802.3at (30W PoE+)" },
                    { term: "Využití", definition: "Wi-Fi AP, Kamery, IP telefony" }
                ]
            }
        ]
    },
    20: {
        sections: [
            {
                title: "Wi-Fi (IEEE 802.11) 📡",
                items: [
                    "WLAN - Bezdrátová síť",
                    { term: "Metoda", definition: "CSMA/CA (Unikání kolizím)" },
                    { term: "Klíč", definition: "RTS / CTS (Request/Clear to Send)" }
                ]
            },
            {
                title: "Standardy 🚀",
                items: [
                    { term: "802.11b", definition: "11 Mbps, 2.4 GHz" },
                    { term: "802.11g", definition: "54 Mbps, 2.4 GHz" },
                    { term: "802.11n", definition: "600 Mbps, 2.4/5 GHz (WiFi 4)" },
                    { term: "802.11ac", definition: "Gbps, 5 GHz (WiFi 5)" },
                    { term: "802.11ax", definition: "Vysoká efektivita (WiFi 6)" }
                ]
            },
            {
                title: "Frekvence 〰️",
                items: [
                    { term: "2.4 GHz", definition: "3 Kanály (1,6,11), Dosah+, Rušení+" },
                    { term: "5 GHz", definition: "19+ Kanálů, Rychlost+, Dosah-" },
                    { term: "6 GHz", definition: "Nové pásmo (WiFi 6E)" }
                ]
            },
            {
                title: "Komponenty & Pojmy 📖",
                items: [
                    { term: "AP (Access Point)", definition: "Přístupový bod (Bridge)" },
                    { term: "SSID", definition: "Název sítě" },
                    { term: "BSSID", definition: "MAC adresa AP" },
                    { term: "MIMO", definition: "Více antén (Více streamů)" }
                ]
            },
            {
                title: "Zabezpečení 🔒",
                items: [
                    { term: "WEP", definition: "Zastaralé (Lze prolomit)" },
                    { term: "WPA2", definition: "AES šifrování (Standard)" },
                    { term: "WPA3", definition: "SAE (Nejnovější, bezpečné)" },
                    { term: "Enterprise", definition: "802.1X (RADIUS server)" }
                ]
            },
            {
                title: "Bezdrátové technologie 📶",
                items: [
                    { term: "Bluetooth", definition: "PAN (Osobní), 2.4 GHz" },
                    { term: "NFC", definition: "Platby, cm dosah" },
                    { term: "Zigbee/Z-Wave", definition: "Smart Home, Mesh" },
                    { term: "LTE/5G", definition: "Mobilní data" }
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
console.log('✅ Updated compactContent v3 (FULL DETAIL) for questions 11-20');
