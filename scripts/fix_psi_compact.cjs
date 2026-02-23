const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/data/it-questions.json', 'utf8'));

// Helper to find question by id
const q = (id) => data.questions.find(x => x.id === id);

// Q11 - Historie a vývoj počítačových sítí, Internet
q(11).compactContent = {
  sections: [
    {
      title: "Dělení sítí podle velikosti",
      items: [
        { term: "LAN (Local Area Network)", definition: "Lokální síť – budovy, domácnosti. Vysoké rychlosti." },
        { term: "MAN (Metropolitan Area Network)", definition: "Městská síť – propojuje více LAN v rámci města." },
        { term: "WAN (Wide Area Network)", definition: "Globální síť – největší je Internet." }
      ]
    },
    {
      title: "Dělení sítí podle topologie",
      items: [
        { term: "Sběrnicová (Bus)", definition: "Zařízení na jednom kabelu. + jednoduchost, − kolize (CSMA/CD), výpadek kabelu = pád sítě." },
        { term: "Hvězdicová (Star)", definition: "Vše do centrálního prvku (Switch). + ostatní přežijí výpadek 1 stanice, − závislost na centru. Dnes nejběžnější." },
        { term: "Kruhová (Ring)", definition: "Data putují v okruhu jedním směrem. − výpadek = celá síť nefunguje." }
      ]
    },
    {
      title: "Dělení sítí podle řízení",
      items: [
        { term: "Peer-to-Peer (P2P)", definition: "Všechna zařízení jsou rovnocenná – každý je klient i server." },
        { term: "Klient-Server", definition: "Centrální server poskytuje služby, klienti o ně žádají." }
      ]
    },
    {
      title: "Internet a správa",
      items: [
        { term: "1969 – ARPANET", definition: "První síť přepojování paketů, Ministerstvo obrany USA. Základ internetu." },
        { term: "1983 – TCP/IP", definition: "Přechod ARPANETu na TCP/IP = základ moderního internetu." },
        { term: "IANA / ICANN", definition: "Organizace spravující adresní prostor a domény na internetu." },
        { term: "RFC (Request for Comments)", definition: "Dokumenty definující standardy a pravidla internetu." }
      ]
    },
    {
      title: "Historické sítě",
      items: [
        { term: "ARPANET (1969–1990)", definition: "První paketová síť, protokol NCP → TCP/IP. Základ internetu." },
        { term: "CYCLADES (1972)", definition: "Francouzská experimentální síť. Inovace: end-to-end komunikace. Inspirace pro TCP/IP." },
        { term: "X.25 (1970)", definition: "Mezinárodní standard přepojování paketů. Využití: bankomaty, telekomunikace." },
        { term: "USENET (1979)", definition: "Distribuovaná diskusní síť (newsgroups). Předchůdce moderních fór." },
        { term: "NSFNET (1986–1995)", definition: "Akademická páteřní síť USA. Základ dnešní internetové infrastruktury." }
      ]
    }
  ]
};

// Q12 - Fyzická vrstva modelu ISO/OSI
q(12).compactContent = {
  sections: [
    {
      title: "Fyzická vrstva – přehled",
      text: "1. vrstva ISO/OSI. Přenáší data jako fyzické signály (elektrické, optické, rádiové). Nestará se o obsah – jen o bity.",
      items: [
        { term: "Hlavní funkce", definition: "Převod bitů na signály, definice médií, synchronizace bitů, přenosová rychlost, fyzická topologie." }
      ]
    },
    {
      title: "Typy kabeláže",
      items: [
        { term: "Kroucená dvojlinka UTP/STP", definition: "Nejběžnější Ethernet kabel. UTP = bez stínění (kanceláře), STP = stíněný (průmysl). Rychlost až 10 Gbps." },
        { term: "Koaxiální kabel", definition: "Centrální vodič + stínění. Kabelová TV, starší sítě. Odolný vůči rušení." },
        { term: "Optické vlákno", definition: "Přenos světelnými pulzy. Single-mode (dlouhé vzdálenosti), Multi-mode (datová centra). Velmi rychlé, ale drahé." }
      ]
    },
    {
      title: "Typy konektorů",
      items: [
        { term: "RJ-45", definition: "Kroucená dvojlinka, Ethernet. 10 Mbps – 10 Gbps." },
        { term: "BNC", definition: "Koaxiální kabel. CCTV, starší sítě." },
        { term: "SC / LC / ST", definition: "Optická vlákna. Různé velikosti a konstrukce konektoru." }
      ]
    },
    {
      title: "Typy přenosů",
      items: [
        { term: "Simplex", definition: "Pouze jeden směr. Příklad: rádio, TV." },
        { term: "Half-Duplex", definition: "Oba směry, ale ne současně. Příklad: vysílačka." },
        { term: "Full-Duplex", definition: "Oba směry současně. Příklad: telefon, moderní Ethernet." }
      ]
    },
    {
      title: "Kódování a modulace",
      items: [
        { term: "NRZ (Non-Return to Zero)", definition: "Jednoduché binární kódování, 0 = nízký signál, 1 = vysoký." },
        { term: "Manchester kódování", definition: "Každý bit = přechod signálu → synchronizace hodin. Používá 10BASE-T." },
        { term: "AM / FM / QAM", definition: "Modulační metody: AM = amplituda, FM = frekvence, QAM = amplituda + fáze (Wi-Fi)." }
      ]
    },
    {
      title: "Síťové prvky fyzické vrstvy",
      items: [
        { term: "Repeater (Opakovač)", definition: "Zesiluje signál a prodlužuje dosah sítě." },
        { term: "Hub (Rozbočovač)", definition: "Přeposílá data všem zařízením bez ohledu na cíl." },
        { term: "Modem", definition: "Převádí digitální signál ↔ analogový." }
      ]
    }
  ]
};

// Q13 - Linková vrstva modelu ISO/OSI
q(13).compactContent = {
  sections: [
    {
      title: "Linková vrstva – přehled",
      text: "2. vrstva ISO/OSI. Spolehlivá komunikace v lokální síti. Organizuje bity do rámců, řídí přístup k médiu.",
      items: [
        { term: "Hlavní funkce", definition: "Rámcování, řízení přístupu (MAC), detekce chyb (CRC), řízení toku, adresace MAC adresami." }
      ]
    },
    {
      title: "Podvrstvy linkové vrstvy",
      items: [
        { term: "MAC (Media Access Control)", definition: "Fyzická adresace (48-bit MAC adresy), řízení kolizí (CSMA/CD), přenos v LAN." },
        { term: "LLC (Logical Link Control)", definition: "Rozhraní k vyšším vrstvám. Multiplexování protokolů, detekce chyb." }
      ]
    },
    {
      title: "MAC adresa",
      items: [
        { term: "OUI (prvních 24 bitů)", definition: "Identifikuje výrobce. Přiděluje IEEE. Příklad: 00:1A:2B" },
        { term: "NIC (posledních 24 bitů)", definition: "Jedinečné číslo přidělené výrobcem konkrétnímu zařízení." },
        { term: "Formát", definition: "6 skupin po 2 hexadecimálních číslicích, např. 00:1A:2B:3C:4D:5E" }
      ]
    },
    {
      title: "Přístupové metody",
      items: [
        { term: "CSMA/CD", definition: "Ethernet. Naslouchá médiu → vysílá → při kolizi přeruší, čeká náhodnou dobu, zkouší znovu." },
        { term: "CSMA/CA", definition: "Wi-Fi. Kolizím předchází – zařízení rezervuje médium před odesláním dat." },
        { term: "Token Passing", definition: "Token Ring. Zařízení potřebuje token (speciální rámec) k zahájení přenosu." }
      ]
    },
    {
      title: "Protokoly linkové vrstvy",
      items: [
        { term: "Ethernet (IEEE 802.3)", definition: "Standard pro drátové LAN sítě. Nejrozšířenější." },
        { term: "Wi-Fi (IEEE 802.11)", definition: "Bezdrátové připojení v LAN." },
        { term: "PPP (Point-to-Point)", definition: "Přímé propojení dvou zařízení." }
      ]
    },
    {
      title: "Síťové prvky linkové vrstvy",
      items: [
        { term: "Switch (Přepínač)", definition: "Přeposílá rámce na základě MAC adres cílovému zařízení. Eliminuje kolize." },
        { term: "Bridge (Most)", definition: "Propojuje segmenty sítě, filtruje provoz podle MAC adres." },
        { term: "Access Point (AP)", definition: "Propojuje bezdrátová zařízení s kabelovou sítí." },
        { term: "NIC (Síťová karta)", definition: "Fyzická komunikace počítač ↔ síť. Obsahuje MAC adresu." }
      ]
    }
  ]
};

// Q14 - Síťová vrstva modelu ISO/OSI
q(14).compactContent = {
  sections: [
    {
      title: "Síťová vrstva – přehled",
      text: "3. vrstva ISO/OSI. Směrování paketů mezi sítěmi. Logická adresace (IPv4/IPv6).",
      items: [
        { term: "Hlavní funkce", definition: "Směrování, logická adresace, fragmentace paketů, detekce přetížení, přenos mezi různými sítěmi." }
      ]
    },
    {
      title: "IPv4 adresa",
      items: [
        { term: "Formát", definition: "32 bitů, 4 oktety oddělené tečkami. Příklad: 192.168.1.1" },
        { term: "Třída A", definition: "0.0.0.0 – 127.255.255.255, maska /8. Velké sítě." },
        { term: "Třída B", definition: "128.0.0.0 – 191.255.255.255, maska /16. Střední sítě." },
        { term: "Třída C", definition: "192.0.0.0 – 223.255.255.255, maska /24. Malé sítě." },
        { term: "Třída D / E", definition: "D = Multicast (224–239), E = Experimentální (240–255)." }
      ]
    },
    {
      title: "Typy IPv4 adres",
      items: [
        { term: "Veřejné", definition: "Globálně unikátní, směrovatelné na internetu." },
        { term: "Soukromé (privátní)", definition: "10.x / 172.16–31.x / 192.168.x – pouze pro LAN, neprojdou na internet." },
        { term: "Loopback", definition: "127.0.0.1 – testovací adresa samotného zařízení." },
        { term: "Broadcast", definition: "Adresace všech zařízení v síti. Příklad: 192.168.1.255" }
      ]
    },
    {
      title: "IPv6",
      items: [
        { term: "Formát", definition: "128 bitů, 8 skupin po 4 hex číslicích. Příklad: 2001:0db8::1" },
        { term: "Unicast / Multicast / Anycast", definition: "Unicast = 1 zařízení, Multicast = skupina, Anycast = nejbližší zařízení ve skupině." },
        { term: "Link-Local adresy", definition: "FE80::/10 – pouze lokální komunikace v segmentu." }
      ]
    },
    {
      title: "Protokoly síťové vrstvy",
      items: [
        { term: "IP (Internet Protocol)", definition: "Základní protokol – směrování a doručení paketů přes sítě." },
        { term: "ICMP", definition: "Diagnostika a hlášení chyb. Příkaz: ping." },
        { term: "ARP", definition: "Překlad IP adresy → MAC adresa." },
        { term: "NAT", definition: "Překlad soukromých IP adres na veřejnou (router)." }
      ]
    },
    {
      title: "Síťové prvky",
      items: [
        { term: "Router (Směrovač)", definition: "Směruje pakety mezi sítěmi na základě IP adres a směrovacích tabulek." },
        { term: "Firewall", definition: "Filtruje síťový provoz podle bezpečnostních pravidel." },
        { term: "Layer 3 Switch", definition: "Kombinace switch + router. Přepíná data na základě IP adres." }
      ]
    }
  ]
};

// Q15 - Adresace a směrování v sítích
q(15).compactContent = {
  sections: [
    {
      title: "Adresace – základy",
      items: [
        { term: "Síťová část adresy", definition: "Identifikuje síť (např. 192.168.1.0/24 = síť)." },
        { term: "Hostitelská část", definition: "Identifikuje konkrétní zařízení v síti." },
        { term: "Maska podsítě", definition: "Odděluje síťovou a hostitelskou část. /24 = 255.255.255.0" }
      ]
    },
    {
      title: "Subnetting a CIDR",
      items: [
        { term: "Subnetting", definition: "Rozdělení sítě na menší podsítě. Příklad: 192.168.1.0/26 = 64 adres, 62 hostitelů." },
        { term: "VLSM", definition: "Variable Length Subnet Masking – různě dlouhé masky v jedné síti. Efektivní využití adresního prostoru." },
        { term: "CIDR", definition: "Classless Inter-Domain Routing. Zápis: adresa/prefix. Nahrazuje třídy A/B/C." }
      ]
    },
    {
      title: "Síťové výpočty",
      items: [
        { term: "Počet hostitelů", definition: "2^(32 – prefix) – 2. Příklad: /24 → 2^8 – 2 = 254 hostitelů." },
        { term: "Broadcast adresa", definition: "Poslední adresa podsítě. Příklad: 192.168.1.255 pro /24." },
        { term: "Masky", definition: "/24 = 255.255.255.0 | /26 = 255.255.255.192 | /28 = 255.255.255.240" }
      ]
    },
    {
      title: "Druhy směrování",
      items: [
        { term: "Statické směrování", definition: "Administrátor ručně nastaví trasy. Vhodné pro malé sítě. Není flexibilní." },
        { term: "Dynamické směrování", definition: "Routery automaticky aktualizují tabulky. Protokoly: RIP, OSPF, BGP." }
      ]
    },
    {
      title: "Směrovací protokoly",
      items: [
        { term: "RIP", definition: "Metrika = počet skoků (max 15). Jednoduchý, pomalý. Vhodný pro malé sítě." },
        { term: "OSPF", definition: "Link-state protokol. Metrika = šířka pásma. Rychlé a přesné. Vhodné pro velké sítě." },
        { term: "BGP", definition: "Směrování mezi autonomními systémy (internet). Klíčový protokol pro globální routing." },
        { term: "EIGRP", definition: "Cisco protokol. Rychlejší než RIP, méně náročný než OSPF." }
      ]
    },
    {
      title: "Směrovací metody",
      items: [
        { term: "Unicast", definition: "Přenos mezi dvěma konkrétními zařízeními." },
        { term: "Multicast", definition: "Přenos z jednoho zdroje na skupinu zařízení." },
        { term: "Broadcast", definition: "Přenos na všechna zařízení v síti." }
      ]
    }
  ]
};

// Q16 - Transportní, relační, prezentační vrstva
q(16).compactContent = {
  sections: [
    {
      title: "Transportní vrstva (4. vrstva)",
      text: "Zajišťuje spolehlivý přenos dat mezi aplikacemi. PDU = segment.",
      items: [
        { term: "TCP (Transmission Control Protocol)", definition: "Spolehlivý, spojovaný. Potvrzování, sekvenční čísla, detekce chyb. Vhodné pro web, e-mail." },
        { term: "UDP (User Datagram Protocol)", definition: "Nespolehlivý, rychlý, bez potvrzování. Vhodné pro streaming, online hry, DNS." },
        { term: "Porty", definition: "Identifikují aplikaci. HTTP = 80, HTTPS = 443, FTP = 21, DNS = 53." },
        { term: "Řízení toku", definition: "Příjemce reguluje množství přijímaných dat – zabraňuje zahlcení." }
      ]
    },
    {
      title: "Relační vrstva (5. vrstva)",
      text: "Správa relací (sessions) mezi aplikacemi.",
      items: [
        { term: "Správa relací", definition: "Zahájení, udržování a ukončení komunikačních relací." },
        { term: "Synchronizace", definition: "Synchronizační body – přenos může pokračovat po přerušení od checkpointu." },
        { term: "Řízení komunikace", definition: "Určuje, která strana aktuálně vysílá nebo přijímá." }
      ]
    },
    {
      title: "Prezentační vrstva (6. vrstva)",
      text: "Převod dat do formátu srozumitelného aplikaci. Šifrování, komprese.",
      items: [
        { term: "Kódování / Dekódování", definition: "Převod mezi datovými formáty: ASCII ↔ Unicode, binární ↔ textový." },
        { term: "Komprese", definition: "Snižuje velikost dat pro rychlejší přenos (JPEG, MP3, GIF)." },
        { term: "Šifrování", definition: "TLS/SSL – zabezpečení přenosu. AES (symetrické), RSA (asymetrické)." },
        { term: "TLS / SSL", definition: "TLS šifruje komunikaci a ověřuje identitu. SSL = starší předchůdce TLS." },
        { term: "Base64", definition: "Kóduje binární data do textového formátu (přílohy e-mailů)." }
      ]
    }
  ]
};

// Q17 - Aplikační vrstva modelu ISO/OSI
q(17).compactContent = {
  sections: [
    {
      title: "Aplikační vrstva – přehled",
      text: "7. (nejvyšší) vrstva ISO/OSI. Rozhraní pro uživatelské aplikace. Sbírá a připravuje data k přenosu.",
      items: []
    },
    {
      title: "Web a HTTP",
      items: [
        { term: "HTTP (HyperText Transfer Protocol)", definition: "Přenos webových stránek. Klient → GET/POST požadavek, server → HTML odpověď." },
        { term: "HTTPS", definition: "HTTP + TLS šifrování. Bezpečný přenos (port 443)." },
        { term: "URL", definition: "Protokol + doména + cesta + parametry. Příklad: https://google.com/search?q=test" },
        { term: "Stavové kódy HTTP", definition: "200 OK | 404 Not Found | 500 Internal Server Error | 301 Redirect" }
      ]
    },
    {
      title: "DNS systém",
      items: [
        { term: "DNS (Domain Name System)", definition: "Překlad doménového jména → IP adresa. Hierarchická struktura: .com → google.com → www.google.com" },
        { term: "Princip DNS dotazu", definition: "Klient → DNS server → IP adresa. Pokud lokální cache neví, ptá se nadřazeného serveru." }
      ]
    },
    {
      title: "Přenos souborů",
      items: [
        { term: "FTP (File Transfer Protocol)", definition: "Upload/download souborů. Dva kanály: příkaz (port 21) + data. Nešifrovaný." },
        { term: "SFTP / FTPS", definition: "Bezpečné varianty FTP se šifrováním." }
      ]
    },
    {
      title: "Elektronická pošta",
      items: [
        { term: "SMTP", definition: "Odesílání emailů. Server → server přenos. Port 25 / 587." },
        { term: "POP3", definition: "Stažení emailů ze serveru na klienta. Zprávy se smažou ze serveru. Port 110." },
        { term: "IMAP", definition: "Přístup k emailům na serveru bez stahování – zprávy zůstávají na serveru. Port 143." }
      ]
    }
  ]
};

// Q18 - Síťové prvky a strukturovaná kabeláž
q(18).compactContent = {
  sections: [
    {
      title: "Síťové prvky – přehled",
      items: [
        { term: "Hub (Rozbočovač)", definition: "1. vrstva. Posílá data na všechny porty bez ohledu na cíl. Zastaralý, způsobuje kolize." },
        { term: "Switch (Přepínač)", definition: "2. vrstva. Směruje rámce podle MAC adres. Eliminuje kolize. Dnes standard v LAN." },
        { term: "Router (Směrovač)", definition: "3. vrstva. Propojuje různé sítě, směruje pakety podle IP adres." },
        { term: "Bridge (Most)", definition: "2. vrstva. Propojuje segmenty sítě, filtruje provoz. Dnes nahrazen switchem." },
        { term: "Firewall", definition: "Filtruje síťový provoz podle bezpečnostních pravidel. HW nebo SW." }
      ]
    },
    {
      title: "Cisco schématické značky",
      items: [
        { term: "Switch", definition: "Čtverec s porty nebo obdélník s šipkami." },
        { term: "Router", definition: "Kruh se šipkami označujícími směrování." },
        { term: "Firewall", definition: "Zařízení s ikonou plamenu nebo zámku." },
        { term: "Access Point", definition: "Antény vyzařující vlny." }
      ]
    },
    {
      title: "Strukturovaná kabeláž",
      text: "Způsob organizace a instalace kabelů pro snadnou správu, údržbu a rozšiřování sítě.",
      items: [
        { term: "Patch kabel", definition: "Krátký kabel pro propojení zařízení s patch panelem nebo switchem." },
        { term: "Patch panel", definition: "Organizační panel s konektory RJ-45. Centralizuje zapojení." },
        { term: "Rack (19\")", definition: "Stojan pro síťová zařízení. Standard 19\", až 42U výška. Chlazení + správa kabelů." }
      ]
    },
    {
      title: "Kategorie kabeláže",
      items: [
        { term: "Cat 5e", definition: "Až 1 Gbps, 100 MHz. Nejrozšířenější pro Gigabit Ethernet." },
        { term: "Cat 6", definition: "Až 10 Gbps na kratší vzdálenosti (55 m). 250 MHz." },
        { term: "Cat 6a", definition: "Až 10 Gbps na 100 m. 500 MHz. Pro profesionální sítě." },
        { term: "Cat 7 / Cat 8", definition: "Datová centra, velmi vysoké rychlosti (40–100 Gbps)." }
      ]
    }
  ]
};

// Q19 - Ethernet
q(19).compactContent = {
  sections: [
    {
      title: "Ethernet – přehled",
      text: "Nejrozšířenější standard pro drátové LAN sítě. Definuje přenos pomocí MAC adres a rámců.",
      items: []
    },
    {
      title: "Historie)",
      items: [
        { term: "1973 – Xerox PARC", definition: "Robert Metcalfe vytvořil první Ethernet (2,94 Mbps)." },
        { term: "1980 – IEEE 802.3", definition: "Oficializace standardu." },
        { term: "1995 – Fast Ethernet", definition: "100BASE-TX, 100 Mbps." },
        { term: "Gigabit / 10G Ethernet", definition: "1000BASE-T = 1 Gbps | 10GBASE-T = 10 Gbps." }
      ]
    },
    {
      title: "Značení standardů",
      text: "Formát: rychlost + BASE + médium. Příklad: 1000BASE-T = 1 Gbps, kroucená dvojlinka.",
      items: [
        { term: "10BASE-T", definition: "10 Mbps, kroucená dvojlinka." },
        { term: "100BASE-TX", definition: "100 Mbps, kroucená dvojlinka. Fast Ethernet." },
        { term: "1000BASE-T", definition: "1 Gbps, kroucená dvojlinka. Gigabit Ethernet." },
        { term: "10GBASE-T", definition: "10 Gbps, kroucená dvojlinka. Datová centra." },
        { term: "1000BASE-SX", definition: "1 Gbps, optické vlákno (krátká vzdálenost)." }
      ]
    },
    {
      title: "Ethernet rámec",
      items: [
        { term: "Preámbule (7 B)", definition: "Synchronizace přijímače na začátku rámce." },
        { term: "Cílová / Zdrojová MAC (6+6 B)", definition: "Adresy příjemce a odesílatele." },
        { term: "Typ / Délka (2 B)", definition: "Protokol vyšší vrstvy (IP, ARP…)." },
        { term: "Data / Payload (až 1500 B)", definition: "Přenášená data." },
        { term: "FCS – kontrolní součet (4 B)", definition: "Detekce chyb v rámci." }
      ]
    },
    {
      title: "CSMA/CD",
      items: [
        { term: "Carrier Sense", definition: "Zařízení naslouchá → vysílá jen pokud je médium volné." },
        { term: "Multiple Access", definition: "Všechna zařízení sdílejí médium." },
        { term: "Collision Detection", definition: "Při kolizi obě stanice přeruší, počkají náhodnou dobu, zkouší znovu." },
        { term: "Switch vs. Hub", definition: "Switch = každý port má vlastní kolizní doménu → žádné kolize." }
      ]
    },
    {
      title: "Kódování přenosu",
      items: [
        { term: "Manchester kódování", definition: "10 Mbps Ethernet. Přechod signálu = 1 bit → synchronizace." },
        { term: "4B/5B kódování", definition: "Fast Ethernet (100BASE-TX). Lepší efektivita signálu." },
        { term: "PAM-5", definition: "Gigabit Ethernet. 5 úrovní signálu přes 4 páry vodičů." }
      ]
    }
  ]
};

// Q20 - Bezdrátové síťové technologie
q(20).compactContent = {
  sections: [
    {
      title: "Přenos a spektrum",
      items: [
        { term: "Elektromagnetické spektrum", definition: "Pásma podle frekvence. VHF/UHF (30 MHz–3 GHz) = TV, mobily, Wi-Fi. Mikrovlny (1–300 GHz) = Wi-Fi, BT, radar." },
        { term: "AM (Amplitudová modulace)", definition: "Mění amplitudu nosné vlny. Rádio, jednoduché přenosy." },
        { term: "FM (Frekvenční modulace)", definition: "Mění frekvenci nosné vlny. Odolnější vůči rušení." },
        { term: "QAM", definition: "Kombinuje amplitudu i fázi → vysoké rychlosti. Používá Wi-Fi." }
      ]
    },
    {
      title: "Bluetooth",
      items: [
        { term: "Účel", definition: "PAN – propojení osobních zařízení na krátkou vzdálenost (sluchátka, klávesnice, telefon)." },
        { term: "Frekvence / rychlost", definition: "2,4 GHz (ISM pásmo). Až 3 Mbps (BT 5: až 50 Mbps). Dosah 1–100 m." },
        { term: "FHSS", definition: "Frequency Hopping Spread Spectrum – přenos skáče mezi 79 kanály → odolnost vůči rušení." },
        { term: "Piconet / Scatternet", definition: "Piconet = 1 master + 7 slave. Scatternet = propojení více piconetů." }
      ]
    },
    {
      title: "Wi-Fi (IEEE 802.11)",
      items: [
        { term: "802.11b/g", definition: "11 / 54 Mbps, 2,4 GHz. Starší standardy." },
        { term: "802.11n (Wi-Fi 4)", definition: "600 Mbps, 2,4 / 5 GHz. Zavedlo MIMO." },
        { term: "802.11ac (Wi-Fi 5)", definition: "3,5 Gbps, pouze 5 GHz. MU-MIMO." },
        { term: "802.11ax (Wi-Fi 6)", definition: "9,6 Gbps, 2,4 / 5 / 6 GHz. OFDMA, nejefektivnější." },
        { term: "OFDM", definition: "Signál rozdělen na více nosných frekvencí → vyšší rychlost, odolnost vůči rušení." },
        { term: "MIMO", definition: "Multiple Input Multiple Output – více antén současně → daleko větší kapacita." }
      ]
    },
    {
      title: "Další bezdrátové technologie",
      items: [
        { term: "ZigBee", definition: "Nízká spotřeba, 10–100 m. IoT senzory, chytré domácnosti." },
        { term: "Z-Wave", definition: "Chytré domácnosti, ~30 m. Podobné ZigBee." },
        { term: "NFC", definition: "Do 10 cm. Bezkontaktní platby, přihlašování, sdílení." },
        { term: "LoRa", definition: "Long Range – km dosah při nízké spotřebě. IoT monitoring na velkých územích." }
      ]
    }
  ]
};

fs.writeFileSync('./src/data/it-questions.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Done – compactContent updated for all PSI questions (11–20)');
