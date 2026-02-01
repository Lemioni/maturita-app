/**
 * Ultra-compact mobile content for questions 11-20
 * Format: Bold terms first, no helper words, maximum compression
 * Run: node scripts/update-compact-content.js
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
                title: "Dělení sítí",
                subsections: [
                    {
                        title: "Velikost",
                        items: [
                            { term: "LAN", definition: "lokální (budova, kancelář)" },
                            { term: "MAN", definition: "metropolitní (město)" },
                            { term: "WAN", definition: "globální (Internet)" }
                        ]
                    },
                    {
                        title: "Topologie",
                        items: [
                            { term: "Sběrnicová", definition: "1 kabel, kolize → CSMA/CD" },
                            { term: "Hvězdicová", definition: "centrální switch/hub, +spolehlivost" },
                            { term: "Kruhová", definition: "data v kruhu, token passing" }
                        ]
                    },
                    {
                        title: "Řízení",
                        items: [
                            { term: "Peer-to-peer", definition: "rovnocenná zařízení" },
                            { term: "Klient-server", definition: "centrální server" }
                        ]
                    }
                ]
            },
            {
                title: "Historie Internetu",
                numberedItems: [
                    "1969: ARPANET (US DoD, přepojování paketů)",
                    "1972: CYCLADES (end-to-end → základ TCP/IP)",
                    "1979: USENET (diskusní skupiny, UUCP)",
                    "1981: BITNET (univerzitní síť)",
                    "1983: TCP/IP jako standard",
                    "1986-95: NSFNET (páteř Internetu)",
                    "1990: veřejný Internet"
                ]
            },
            {
                title: "Historické sítě",
                items: [
                    { term: "ARPANET", definition: "1969-90, US DoD, NCP→TCP/IP" },
                    { term: "CYCLADES", definition: "1972, FR, end-to-end protokol" },
                    { term: "X.25", definition: "1970s, banky/telco → Frame Relay" },
                    { term: "NSFNET", definition: "1986-95, akademická páteř TCP/IP" },
                    { term: "USENET", definition: "1979, newsgroups, UUCP" },
                    { term: "BITNET", definition: "1981, uni e-mail/soubory" },
                    { term: "FidoNet", definition: "1984, BBS komunity" },
                    { term: "EUNET", definition: "1982, evropská akademická" },
                    { term: "MILNET", definition: "1983, vojenská část ARPANET" }
                ]
            },
            {
                title: "Organizace",
                items: [
                    { term: "IANA", definition: "správa IP bloků" },
                    { term: "ICANN", definition: "správa domén" },
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
                    "převod dat → signály (elektrické/optické/rádiové)",
                    "synchronizace bitů, topologie, rychlost"
                ]
            },
            {
                title: "Kabeláž",
                subsections: [
                    {
                        title: "Kroucená dvojlinka",
                        items: [
                            { term: "UTP", definition: "bez stínění, kanceláře" },
                            { term: "STP/FTP", definition: "stíněná, průmysl, EMI ochrana" },
                            "max 10 Gbps, do 100 m"
                        ]
                    },
                    {
                        title: "Koaxiální",
                        items: [
                            "centrální vodič + stínění + plášť",
                            "TV, CCTV, starší sítě",
                            "+odolnost EMI, -flexibilita"
                        ]
                    },
                    {
                        title: "Optické vlákno",
                        items: [
                            { term: "Single-mode", definition: "dlouhé vzdálenosti, páteř" },
                            { term: "Multi-mode", definition: "kratší, datacentra" },
                            "100+ Gbps, nízká latence, drahé"
                        ]
                    }
                ]
            },
            {
                title: "Konektory",
                items: [
                    { term: "RJ-45", definition: "Ethernet, dvojlinka" },
                    { term: "BNC", definition: "koaxiální, CCTV" },
                    { term: "SC/LC/ST", definition: "optika (různé velikosti)" }
                ]
            },
            {
                title: "Vlastnosti médií",
                items: [
                    { term: "Šířka pásma", definition: "max kapacita (Gbps)" },
                    { term: "EMI/RFI", definition: "elektromagnetické rušení" },
                    { term: "Vzdálenost", definition: "dvojlinka 100m, optika km" },
                    { term: "Latence", definition: "zpoždění signálu" }
                ]
            },
            {
                title: "Typy přenosů",
                items: [
                    { term: "Simplex", definition: "jednosměrný (rádio)" },
                    { term: "Half-duplex", definition: "střídavě (vysílačky)" },
                    { term: "Full-duplex", definition: "obousměrný současně (telefon)" }
                ]
            },
            {
                title: "Kódování",
                items: [
                    { term: "NRZ", definition: "Non-Return to Zero, jednoduché" },
                    { term: "Manchester", definition: "s vloženými hodinami" },
                    { term: "4B/5B", definition: "Fast Ethernet" }
                ]
            },
            {
                title: "Modulace",
                items: [
                    { term: "AM", definition: "změna amplitudy" },
                    { term: "FM", definition: "změna frekvence" },
                    { term: "QAM", definition: "kombinace amplitudy + fáze" }
                ]
            },
            {
                title: "Síťové prvky L1",
                items: [
                    { term: "Repeater", definition: "zesiluje signál" },
                    { term: "Hub", definition: "broadcast všem" },
                    { term: "Modem", definition: "digital ↔ analog" }
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
                    "spolehlivá komunikace v LAN",
                    "data → rámce (frames)"
                ]
            },
            {
                title: "Funkce",
                items: [
                    { term: "Rámcování", definition: "hlavička + data + trailer (FCS)" },
                    { term: "MAC adresace", definition: "48-bit fyzická adresa" },
                    { term: "Detekce chyb", definition: "CRC kontrolní součet" },
                    { term: "Řízení toku", definition: "prevence zahlcení" }
                ]
            },
            {
                title: "Podvrstvy",
                items: [
                    { term: "MAC", definition: "přístup k médiu, fyzické adresy, kolize" },
                    { term: "LLC", definition: "rozhraní k L3+, multiplexování protokolů" }
                ]
            },
            {
                title: "MAC adresa",
                items: [
                    "48 bitů = 6 bajtů (00:1A:2B:3C:4D:5E)",
                    { term: "OUI (24b)", definition: "prefix výrobce (IEEE)" },
                    { term: "NIC (24b)", definition: "jedinečné ID zařízení" }
                ]
            },
            {
                title: "Přístupové metody",
                items: [
                    { term: "CSMA/CD", definition: "Ethernet, detekce kolizí" },
                    { term: "CSMA/CA", definition: "Wi-Fi, předcházení kolizím (RTS/CTS)" },
                    { term: "Token Passing", definition: "Token Ring, token pro vysílání" }
                ]
            },
            {
                title: "Síťové prvky L2",
                items: [
                    { term: "Switch", definition: "přeposílá dle MAC, CAM tabulka" },
                    { term: "Bridge", definition: "propojuje segmenty, filtruje" },
                    { term: "NIC", definition: "síťová karta, obsahuje MAC" },
                    { term: "AP (Access Point)", definition: "Wi-Fi ↔ kabelová síť" }
                ]
            },
            {
                title: "Protokoly L2",
                items: [
                    { term: "Ethernet", definition: "IEEE 802.3, LAN standard" },
                    { term: "Wi-Fi", definition: "IEEE 802.11, bezdrátový" },
                    { term: "PPP", definition: "Point-to-Point, sériové linky" },
                    { term: "HDLC", definition: "High-Level Data Link Control" }
                ]
            }
        ]
    },
    14: {
        sections: [
            {
                title: "Síťová vrstva (L3)",
                items: [
                    "3. vrstva ISO/OSI",
                    "směrování paketů mezi sítěmi",
                    "logická adresace (IP)"
                ]
            },
            {
                title: "Funkce",
                items: [
                    { term: "Směrování", definition: "výběr nejlepší cesty" },
                    { term: "Logická adresace", definition: "IPv4/IPv6" },
                    { term: "Fragmentace", definition: "dělení paketů (MTU)" },
                    { term: "QoS", definition: "prioritizace provozu" }
                ]
            },
            {
                title: "IPv4",
                items: [
                    "32 bitů = 4 oktety (192.168.1.1)",
                    "~4.3 mld. adres",
                    { term: "Třída A", definition: "0-126.x.x.x, /8, velké sítě" },
                    { term: "Třída B", definition: "128-191.x.x.x, /16, střední" },
                    { term: "Třída C", definition: "192-223.x.x.x, /24, malé" },
                    { term: "Třída D", definition: "224-239.x.x.x, multicast" },
                    { term: "Třída E", definition: "240-255.x.x.x, experimentální" }
                ]
            },
            {
                title: "Speciální IPv4",
                items: [
                    { term: "Privátní", definition: "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16" },
                    { term: "Loopback", definition: "127.0.0.1" },
                    { term: "Broadcast", definition: "x.x.x.255 (vše v síti)" }
                ]
            },
            {
                title: "IPv6",
                items: [
                    "128 bitů, 8×16b bloků (2001:db8::1)",
                    { term: "Unicast", definition: "jeden příjemce (2000::/3)" },
                    { term: "Multicast", definition: "skupina (FF00::/8)" },
                    { term: "Anycast", definition: "nejbližší z více" },
                    { term: "Link-local", definition: "FE80::/10, pouze LAN" }
                ]
            },
            {
                title: "Protokoly L3",
                items: [
                    { term: "IP", definition: "přenos paketů" },
                    { term: "ICMP", definition: "diagnostika (ping, traceroute)" },
                    { term: "ARP", definition: "IP → MAC" },
                    { term: "RARP", definition: "MAC → IP (zastaralé)" },
                    { term: "NAT", definition: "privátní → veřejná IP" }
                ]
            },
            {
                title: "Síťové prvky L3",
                items: [
                    { term: "Router", definition: "směruje mezi sítěmi dle IP" },
                    { term: "L3 Switch", definition: "switch + routing" },
                    { term: "Firewall", definition: "filtrování provozu" },
                    { term: "Gateway", definition: "překlad protokolů" }
                ]
            }
        ]
    },
    15: {
        sections: [
            {
                title: "Adresace IPv4",
                items: [
                    "32 bitů = síťová + hostitelská část",
                    { term: "Maska", definition: "odděluje síť/host (/24 = 255.255.255.0)" },
                    { term: "CIDR", definition: "beztřídní, prefix (192.168.1.0/24)" }
                ]
            },
            {
                title: "Subnetting",
                items: [
                    "dělení sítě na menší podsítě",
                    { term: "VLSM", definition: "Variable Length Subnet Mask, různé masky" },
                    { term: "Hostitelů", definition: "2^(32-prefix) - 2" },
                    "příklad: /26 = 64 adres, 62 hostů"
                ]
            },
            {
                title: "Privátní rozsahy",
                items: [
                    "10.0.0.0/8 (třída A)",
                    "172.16.0.0/12 (třída B)",
                    "192.168.0.0/16 (třída C)"
                ]
            },
            {
                title: "Směrovací tabulka",
                items: [
                    { term: "Cíl", definition: "síťová adresa" },
                    { term: "Maska", definition: "prefix sítě" },
                    { term: "Next hop", definition: "adresa dalšího routeru" },
                    { term: "Metrika", definition: "kvalita cesty (hopy, bandwidth)" }
                ]
            },
            {
                title: "Druhy směrování",
                items: [
                    { term: "Statické", definition: "ruční konfigurace, malé sítě" },
                    { term: "Dynamické", definition: "automatické, protokoly" }
                ]
            },
            {
                title: "Směrovací protokoly",
                items: [
                    { term: "RIP", definition: "distance-vector, max 15 hopů, pomalý" },
                    { term: "OSPF", definition: "link-state, SPF algoritmus, velké sítě" },
                    { term: "BGP", definition: "mezi AS, Internet routing" },
                    { term: "EIGRP", definition: "Cisco, rychlejší než RIP" }
                ]
            },
            {
                title: "Metody směrování",
                items: [
                    { term: "Unicast", definition: "1:1" },
                    { term: "Broadcast", definition: "1:všichni" },
                    { term: "Multicast", definition: "1:skupina" }
                ]
            },
            {
                title: "NAT/PAT",
                items: [
                    { term: "NAT", definition: "Network Address Translation" },
                    { term: "SNAT", definition: "source NAT, privátní→veřejná" },
                    { term: "DNAT", definition: "destination NAT, port forwarding" },
                    { term: "PAT", definition: "NAT s porty (overload)" }
                ]
            }
        ]
    },
    16: {
        sections: [
            {
                title: "Transportní vrstva (L4)",
                items: [
                    "4. vrstva ISO/OSI",
                    "end-to-end komunikace",
                    "segmentace dat, porty 0-65535"
                ]
            },
            {
                title: "TCP vs UDP",
                items: [
                    { term: "TCP", definition: "spolehlivý, spojovaný, potvrzování" },
                    { term: "UDP", definition: "nespolehlivý, rychlý, streaming/VoIP" }
                ]
            },
            {
                title: "TCP detaily",
                items: [
                    "3-way handshake: SYN → SYN-ACK → ACK",
                    { term: "Sekvenční čísla", definition: "pořadí segmentů" },
                    { term: "Flow control", definition: "sliding window" },
                    { term: "Checksum", definition: "detekce chyb" },
                    { term: "ACK + retransmit", definition: "spolehlivost" }
                ]
            },
            {
                title: "Známé porty",
                items: [
                    { term: "20/21", definition: "FTP (data/control)" },
                    { term: "22", definition: "SSH" },
                    { term: "23", definition: "Telnet" },
                    { term: "25", definition: "SMTP" },
                    { term: "53", definition: "DNS" },
                    { term: "80", definition: "HTTP" },
                    { term: "443", definition: "HTTPS" }
                ]
            },
            {
                title: "Relační vrstva (L5)",
                items: [
                    "správa sessions (zahájení/ukončení)",
                    "synchronizační body",
                    { term: "Protokoly", definition: "NetBIOS, RPC, PPTP" }
                ]
            },
            {
                title: "Prezentační vrstva (L6)",
                items: [
                    "formátování, kódování, komprese",
                    { term: "Šifrování", definition: "SSL/TLS, AES, RSA" },
                    { term: "Formáty", definition: "ASCII, Unicode, JPEG, MPEG" },
                    { term: "MIME", definition: "e-mail přílohy" }
                ]
            }
        ]
    },
    17: {
        sections: [
            {
                title: "Aplikační vrstva (L7)",
                items: [
                    "7. vrstva ISO/OSI",
                    "rozhraní pro uživatele/aplikace",
                    "síťové služby a protokoly"
                ]
            },
            {
                title: "HTTP/HTTPS",
                items: [
                    { term: "HTTP", definition: "port 80, nešifrovaný" },
                    { term: "HTTPS", definition: "port 443, TLS šifrování" },
                    { term: "Metody", definition: "GET, POST, PUT, DELETE, PATCH" },
                    { term: "Kódy", definition: "200 OK, 404 Not Found, 500 Error" }
                ]
            },
            {
                title: "DNS",
                items: [
                    "Domain Name System, port 53",
                    "překlad doména → IP",
                    { term: "A", definition: "doména → IPv4" },
                    { term: "AAAA", definition: "doména → IPv6" },
                    { term: "MX", definition: "mail server" },
                    { term: "CNAME", definition: "alias" },
                    { term: "NS", definition: "nameserver" }
                ]
            },
            {
                title: "E-mail protokoly",
                items: [
                    { term: "SMTP", definition: "odesílání, port 25/587" },
                    { term: "POP3", definition: "příjem, stahuje, port 110/995" },
                    { term: "IMAP", definition: "příjem, synchronizuje, port 143/993" }
                ]
            },
            {
                title: "Přenos souborů",
                items: [
                    { term: "FTP", definition: "port 20/21, nešifrovaný" },
                    { term: "SFTP", definition: "přes SSH, šifrovaný" },
                    { term: "FTPS", definition: "FTP + TLS" },
                    { term: "TFTP", definition: "UDP port 69, jednoduchý" }
                ]
            },
            {
                title: "Další protokoly L7",
                items: [
                    { term: "DHCP", definition: "automatické přidělení IP, port 67/68" },
                    { term: "SSH", definition: "šifrované vzdálené připojení, port 22" },
                    { term: "Telnet", definition: "nešifrované, port 23, zastaralé" },
                    { term: "SNMP", definition: "správa síťových zařízení, port 161" },
                    { term: "NTP", definition: "synchronizace času, port 123" },
                    { term: "LDAP", definition: "adresářové služby, port 389" }
                ]
            }
        ]
    },
    18: {
        sections: [
            {
                title: "Síťové prvky",
                items: [
                    { term: "Repeater (L1)", definition: "zesiluje signál" },
                    { term: "Hub (L1)", definition: "broadcast všem" },
                    { term: "Bridge (L2)", definition: "propojuje segmenty, MAC" },
                    { term: "Switch (L2)", definition: "přepíná dle MAC, CAM" },
                    { term: "Router (L3)", definition: "směruje dle IP" },
                    { term: "L3 Switch", definition: "switch + routing" },
                    { term: "Gateway (L7)", definition: "překlad protokolů" },
                    { term: "Firewall", definition: "filtrování, bezpečnost" }
                ]
            },
            {
                title: "Strukturovaná kabeláž",
                items: [
                    { term: "Horizontální", definition: "do 90 m, patch kabely 10 m" },
                    { term: "Vertikální (páteř)", definition: "mezi patry/budovami" },
                    { term: "Patch panel", definition: "ukončení kabelů v racku" },
                    { term: "Datová zásuvka", definition: "RJ-45 pro koncová zařízení" }
                ]
            },
            {
                title: "Kategorie kabelů",
                items: [
                    { term: "Cat 5e", definition: "1 Gbps, 100 m, 100 MHz" },
                    { term: "Cat 6", definition: "10 Gbps (55 m), 250 MHz" },
                    { term: "Cat 6a", definition: "10 Gbps (100 m), 500 MHz" },
                    { term: "Cat 7", definition: "10 Gbps, 600 MHz, stíněný" },
                    { term: "Cat 8", definition: "25-40 Gbps, datacentra" }
                ]
            },
            {
                title: "Zapojení RJ-45",
                items: [
                    { term: "T568A", definition: "zelená-oranžová (vzácnější)" },
                    { term: "T568B", definition: "oranžová-zelená (standard)" },
                    { term: "Přímý kabel", definition: "stejné standardy obou konců" },
                    { term: "Křížený kabel", definition: "různé standardy (PC-PC)" }
                ]
            },
            {
                title: "Rozvaděče (Rack)",
                items: [
                    "19\" standard šířky",
                    "1U = 44.45 mm výšky",
                    { term: "Obsah", definition: "switch, router, patch panel, UPS, server" }
                ]
            }
        ]
    },
    19: {
        sections: [
            {
                title: "Ethernet",
                items: [
                    "IEEE 802.3, LAN standard",
                    "CSMA/CD přístupová metoda",
                    "nejrozšířenější technologie"
                ]
            },
            {
                title: "Rychlosti",
                items: [
                    { term: "10BASE-T", definition: "10 Mbps, Cat 3" },
                    { term: "100BASE-TX", definition: "100 Mbps, Cat 5" },
                    { term: "1000BASE-T", definition: "1 Gbps, Cat 5e/6" },
                    { term: "10GBASE-T", definition: "10 Gbps, Cat 6a/7" },
                    { term: "25/40/100 GbE", definition: "datacentra, optika" }
                ]
            },
            {
                title: "Ethernet rámec",
                items: [
                    { term: "Preambule", definition: "7 B synchronizace" },
                    { term: "SFD", definition: "1 B start frame delimiter" },
                    { term: "MAC dest", definition: "6 B cílová adresa" },
                    { term: "MAC src", definition: "6 B zdrojová adresa" },
                    { term: "Type/Length", definition: "2 B (EtherType)" },
                    { term: "Data", definition: "46-1500 B payload (MTU)" },
                    { term: "FCS", definition: "4 B CRC kontrolní součet" }
                ]
            },
            {
                title: "VLAN",
                items: [
                    "802.1Q, virtuální LAN",
                    "logické oddělení sítě",
                    { term: "Tag", definition: "4 B vložený do rámce (VLAN ID 12b)" },
                    { term: "Access port", definition: "1 VLAN" },
                    { term: "Trunk port", definition: "více VLAN tagovaných" }
                ]
            },
            {
                title: "PoE (Power over Ethernet)",
                items: [
                    "napájení přes datový kabel",
                    { term: "802.3af", definition: "15.4 W" },
                    { term: "802.3at (PoE+)", definition: "25.5 W" },
                    { term: "802.3bt (PoE++)", definition: "71-90 W" }
                ]
            },
            {
                title: "STP (Spanning Tree)",
                items: [
                    "prevence smyček v síti",
                    "802.1D → RSTP (802.1w)",
                    { term: "Root Bridge", definition: "hlavní switch" },
                    { term: "Blocked ports", definition: "prevence smyček" }
                ]
            }
        ]
    },
    20: {
        sections: [
            {
                title: "Wi-Fi standardy (IEEE 802.11)",
                items: [
                    { term: "802.11b", definition: "11 Mbps, 2.4 GHz" },
                    { term: "802.11a", definition: "54 Mbps, 5 GHz" },
                    { term: "802.11g", definition: "54 Mbps, 2.4 GHz" },
                    { term: "802.11n (Wi-Fi 4)", definition: "600 Mbps, 2.4/5 GHz, MIMO" },
                    { term: "802.11ac (Wi-Fi 5)", definition: "3.5 Gbps, 5 GHz, MU-MIMO" },
                    { term: "802.11ax (Wi-Fi 6)", definition: "9.6 Gbps, 2.4/5/6 GHz, OFDMA" }
                ]
            },
            {
                title: "Frekvenční pásma",
                items: [
                    { term: "2.4 GHz", definition: "lepší dosah, rušení, 14 kanálů (1,6,11)" },
                    { term: "5 GHz", definition: "rychlejší, kratší dosah, více kanálů" },
                    { term: "6 GHz", definition: "Wi-Fi 6E, nejméně rušení" }
                ]
            },
            {
                title: "Zabezpečení",
                items: [
                    { term: "WEP", definition: "zastaralé, RC4, nebezpečné" },
                    { term: "WPA", definition: "TKIP, přechodné" },
                    { term: "WPA2", definition: "AES-CCMP, standard" },
                    { term: "WPA3", definition: "SAE, 192-bit, nejbezpečnější" }
                ]
            },
            {
                title: "CSMA/CA",
                items: [
                    "předchází kolizím (vs CSMA/CD)",
                    { term: "RTS/CTS", definition: "Request/Clear to Send" },
                    { term: "ACK", definition: "potvrzení přijetí" }
                ]
            },
            {
                title: "Komponenty",
                items: [
                    { term: "AP (Access Point)", definition: "bezdrátový přístupový bod" },
                    { term: "SSID", definition: "název sítě (32 znaků)" },
                    { term: "BSSID", definition: "MAC adresa AP" },
                    { term: "Controller", definition: "centrální správa AP" }
                ]
            },
            {
                title: "Další bezdrátové",
                items: [
                    { term: "Bluetooth", definition: "2.4 GHz, krátký dosah, 5.x BLE" },
                    { term: "NFC", definition: "Near Field, bezdotykové platby" },
                    { term: "Zigbee", definition: "IoT, 250 kbps, mesh" },
                    { term: "Z-Wave", definition: "smart home, 868/908 MHz" },
                    { term: "LoRa", definition: "IoT, dlouhý dosah, nízká rychlost" },
                    { term: "LTE/5G", definition: "mobilní sítě, Gbps" }
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
console.log('✅ Updated compactContent with ultra-condensed format for questions 11-20');
