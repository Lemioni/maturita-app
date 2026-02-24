/**
 * Script to update PSI questions (12-20):
 * 1. Rewrite Q12 answer for better formatting
 * 2. Replace Q12 compactContent with user's version
 * 3. Fix Q19 Ethernet (remove duplicate content field, fix compactContent)
 * 4. Create improved compactContent for Q13-Q20
 */
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'it-questions.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// ============================================================
// Q12 - New answer (better formatted full version)
// ============================================================
const q12Answer = `## 12. Fyzická vrstva modelu ISO/OSI (Physical Layer)

### Pozice v modelu ISO/OSI
Fyzická vrstva je **1. (nejnižší) vrstva** sedmivrstvého modelu ISO/OSI. Je zodpovědná za přenos dat ve formě signálů (elektrických, optických, rádiových) mezi síťovými zařízeními.

### Funkce fyzické vrstvy
- **Převod dat na signály** – Převádí digitální data na fyzické signály (elektrické, optické, rádiové)
- **Definice přenosových médií** – Stanovuje typy kabelů nebo bezdrátových médií
- **Synchronizace bitů** – Zajišťuje, aby přijímač věděl, kde bit začíná a končí
- **Přenosová rychlost** – Určuje maximální rychlost přenosu dat v síti
- **Fyzická topologie** – Řídí uspořádání připojení mezi zařízeními (hvězda, sběrnice, kruh)

### Druhy kabeláže

**1. Kroucená dvojlinka (Twisted Pair)**
- Páry měděných vodičů kroucených do spirály – minimalizují EMI rušení
- **UTP** (Unshielded Twisted Pair) – bez stínění, kanceláře a domácnosti
- **STP** (Shielded Twisted Pair) – se stíněním, průmyslové prostředí
- Rychlost až **10 Gbps** na krátké vzdálenosti

**2. Koaxiální kabel (Coaxial Cable)**
- Centrální vodič obklopený izolací, stíněním a pláštěm
- Použití: kabelová TV, starší sítě
- Výhody: odolnost proti rušení | Nevýhody: omezená flexibilita

**3. Optické vlákno (Fiber Optic)**
- Přenáší data světelnými pulzy
- **Single-mode** – dlouhé vzdálenosti (páteřní sítě)
- **Multi-mode** – kratší vzdálenosti (datová centra)
- Výhody: vysoká rychlost, nízké zpoždění | Nevýhody: vyšší cena, náročnější instalace

### Druhy konektorů
- **RJ-45** – s kroucenou dvojlinkou pro Ethernet, rychlost 10 Mbps – 10 Gbps
- **BNC** – s koaxiálním kabelem, CCTV, starší sítě
- **SC, LC, ST** – s optickými vlákny, rozdíly v konstrukci a velikosti

### Vlastnosti přenosových médií
- **Šířka pásma** – Maximální kapacita přenosu dat (1 Gbps měděný, 100 Gbps optika)
- **Rušení (EMI/RFI)** – Elektrická a rádiová interference narušující přenos
- **Vzdálenost** – Dvojlinka do 100 m, optické vlákno až stovky km
- **Latence** – Doba zpoždění signálu mezi odesláním a přijetím

### Typy přenosů
- **Simplexní** – Data jedním směrem (vysílání rádia)
- **Half-Duplex** – Oběma směry, ale ne současně (vysílačky)
- **Full-Duplex** – Obousměrná komunikace v reálném čase (telefon, moderní Ethernet)

### Analogové vs. digitální sítě
- **Analogové sítě** – Přenos plynulými signály (zvuk tel. hovorů). Používají amplitudu a frekvenci.
- **Digitální sítě** – Přenos diskrétními signály (1 a 0). Výhody: nižší šum, vyšší spolehlivost.

### Kódování
- **NRZ (Non-Return to Zero)** – Jednoduché kódování: 0 = nízký signál, 1 = vysoký
- **Manchester kódování** – Každý bit = přechod signálu → synchronizace. Používá **10BASE-T** Ethernet.

### Modulace
- **AM (Amplitudová modulace)** – Změna amplitudy signálu
- **FM (Frekvenční modulace)** – Změna frekvence signálu
- **QAM (Kvadraturní amplitudová modulace)** – Změny amplitudy a fáze, využíváno u Wi-Fi

### Síťové prvky a jejich funkce
- **Repeater (Opakovač)** – Zesiluje signál a prodlužuje dosah sítě
- **Hub (Rozbočovač)** – Přeposílá data všem zařízením bez ohledu na cíl
- **Switch** (Linková vrstva) – Inteligentně přeposílá data pouze cílovému zařízení
- **Router** (Síťová vrstva) – Směruje datové pakety mezi různými sítěmi
- **Modem** – Převádí digitální data na analogový signál a naopak
- **Přístupový bod (Access Point)** – Propojuje bezdrátová zařízení s kabelovou sítí`;

// ============================================================
// Q12 - CompactContent (user's provided text)
// ============================================================
const q12CompactContent = {
  sections: [
    {
      title: "Fyzická vrstva – přehled",
      text: "1. (nejnižší) vrstva sedmivrstvého modelu ISO/OSI. Zodpovědná za přenos dat ve formě signálů (elektrických, optických, rádiových) mezi síťovými zařízeními."
    },
    {
      title: "Funkce fyzické vrstvy",
      items: [
        "Převod dat na signály – Převádí digitální data na fyzické signály (elektrické, optické, rádiové).",
        "Definice přenosových médií – Stanovuje typy kabelů nebo bezdrátových médií.",
        "Synchronizace bitů – Zajišťuje, aby přijímač věděl, kde bit začíná a končí.",
        "Přenosová rychlost – Určuje maximální rychlost přenosu dat v síti.",
        "Fyzická topologie – Řídí uspořádání připojení mezi zařízeními (hvězda, sběrnice, kruh)."
      ]
    },
    {
      title: "Druhy kabeláže",
      items: [
        { term: "Kroucená dvojlinka (Twisted Pair)", definition: "Páry měděných vodičů kroucených do spirály (minimalizují EMI rušení). UTP = bez stínění (kanceláře, domácnosti). STP = se stíněním (průmysl). Rychlost až 10 Gbps na krátké vzdálenosti." },
        { term: "Koaxiální kabel (Coaxial Cable)", definition: "Centrální vodič obklopený izolací, stíněním a pláštěm. Použití: kabelová TV, starší sítě. + Odolnost proti rušení, − omezená flexibilita." },
        { term: "Optické vlákno (Fiber Optic)", definition: "Přenáší data světelnými pulzy. Single-mode = dlouhé vzdálenosti (páteřní sítě). Multi-mode = kratší vzdálenosti (datová centra). + Vysoká rychlost, nízké zpoždění. − Vyšší cena, náročnější instalace." }
      ]
    },
    {
      title: "Druhy konektorů",
      items: [
        { term: "RJ-45", definition: "S kroucenou dvojlinkou pro Ethernet. Rychlost 10 Mbps – 10 Gbps." },
        { term: "BNC", definition: "S koaxiálním kabelem. CCTV, starší sítě." },
        { term: "SC, LC, ST", definition: "S optickými vlákny. Rozdíly v konstrukci a velikosti konektorů." }
      ]
    },
    {
      title: "Vlastnosti přenosových médií",
      items: [
        { term: "Šířka pásma", definition: "Maximální kapacita přenosu dat – např. 1 Gbps (měděný kabel), 100 Gbps (optické vlákno)." },
        { term: "Rušení (EMI/RFI)", definition: "Elektrická a rádiová interference, která může narušit přenos." },
        { term: "Vzdálenost", definition: "Omezená délkou kabelu – dvojlinka do 100 m, optické vlákno až stovky km." },
        { term: "Latence", definition: "Doba zpoždění signálu mezi odesláním a přijetím (odezva)." }
      ]
    },
    {
      title: "Typy přenosů",
      items: [
        { term: "Simplexní", definition: "Data proudí jedním směrem (např. vysílání rádia)." },
        { term: "Half-Duplex", definition: "Data oběma směry, ale ne současně (např. vysílačky)." },
        { term: "Plný duplex (Full-Duplex)", definition: "Obousměrná komunikace v reálném čase (např. telefonní hovory, moderní Ethernet)." }
      ]
    },
    {
      title: "Analogové vs. digitální sítě",
      items: [
        { term: "Analogové sítě", definition: "Přenos plynulými signály (zvuk telefonních hovorů). Používají amplitudu (výška sinusoidy) a frekvenci pro přenos dat." },
        { term: "Digitální sítě", definition: "Přenos diskrétními signály (1 a 0). + Nižší šum, vyšší spolehlivost." }
      ]
    },
    {
      title: "Kódování",
      items: [
        { term: "NRZ (Non-Return to Zero)", definition: "Jednoduché kódování binárních hodnot. 0 = nízký signál, 1 = vysoký." },
        { term: "Manchester kódování", definition: "Data kódována s vloženými hodinami – každý bit = přechod signálu → synchronizace. Používá 10BASE-T Ethernet." }
      ]
    },
    {
      title: "Modulace",
      items: [
        { term: "AM (Amplitudová modulace)", definition: "Změna amplitudy signálu." },
        { term: "FM (Frekvenční modulace)", definition: "Změna frekvence signálu." },
        { term: "QAM (Kvadraturní amplitudová modulace)", definition: "Změny amplitudy a fáze. Využíváno u Wi-Fi." }
      ]
    },
    {
      title: "Síťové prvky a jejich funkce",
      items: [
        { term: "Repeater (Opakovač)", definition: "Zesiluje signál a prodlužuje dosah sítě." },
        { term: "Hub (Rozbočovač)", definition: "Přeposílá data všem zařízením v síti bez ohledu na cíl." },
        { term: "Switch (Linková vrstva)", definition: "Inteligentně přeposílá data pouze cílovému zařízení." },
        { term: "Router (Síťová vrstva)", definition: "Směruje datové pakety mezi různými sítěmi." },
        { term: "Modem", definition: "Převádí digitální data na analogový signál a naopak." },
        { term: "Přístupový bod (Access Point)", definition: "Propojuje bezdrátová zařízení s kabelovou sítí." }
      ]
    }
  ]
};

// ============================================================
// Q13 - CompactContent (Linková vrstva)
// ============================================================
const q13CompactContent = {
  sections: [
    {
      title: "Linková vrstva – přehled",
      text: "2. vrstva modelu ISO/OSI (mezi fyzickou a síťovou). Zajišťuje spolehlivou komunikaci mezi zařízeními v lokální síti, organizuje bity z fyzické vrstvy do rámců."
    },
    {
      title: "Funkce linkové vrstvy",
      items: [
        "Rámcování (Framing) – Rozděluje data na bloky zvané rámce (hlavička + data + trailer).",
        "Řízení přístupu k médiu (MAC) – Zajišťuje zařízením přístup k přenosovému médiu bez konfliktů.",
        "Detekce chyb (Error Detection) – Identifikuje chyby při přenosu pomocí CRC (kontrolní součet).",
        "Řízení toku dat (Flow Control) – Zabraňuje zahlcení zařízení rychlým přenosem.",
        "Adresace – Používá fyzické adresy (MAC adresy) k identifikaci zařízení v síti."
      ]
    },
    {
      title: "Podvrstvy linkové vrstvy",
      items: [
        { term: "MAC (Media Access Control)", definition: "Spravuje přístup k fyzickému médiu. Fyzická adresace (48bit MAC adresy), řízení kolizí (CSMA/CD), přenos dat v lokální síti." },
        { term: "LLC (Logical Link Control)", definition: "Rozhraní mezi linkovou vrstvou a vyššími vrstvami. Multiplexování protokolů, detekce chyb pomocí kontrolních součtů." }
      ]
    },
    {
      title: "MAC adresa",
      text: "Unikátní identifikátor síťového zařízení, 48 bitů, používá se pro směrování rámců v LAN.",
      items: [
        { term: "OUI (prefix)", definition: "Prvních 24 bitů – identifikátor výrobce (např. 00:1A:2B)." },
        { term: "NIC (suffix)", definition: "Zbývajících 24 bitů – jedinečné číslo přidělené výrobcem." },
        { term: "Formát", definition: "6 dvojic hexadecimálních číslic oddělených dvojtečkou (např. 00:1A:2B:3C:4D:5E)." }
      ]
    },
    {
      title: "Protokoly linkové vrstvy",
      items: [
        { term: "Ethernet (IEEE 802.3)", definition: "Standardizuje přenosové technologie v LAN." },
        { term: "PPP (Point-to-Point Protocol)", definition: "Přímé přepojení mezi dvěma zařízeními." },
        { term: "HDLC", definition: "Protokol pro sériové linky." },
        { term: "Wi-Fi (IEEE 802.11)", definition: "Bezdrátové připojení v lokálních sítích." }
      ]
    },
    {
      title: "Přístupové metody",
      items: [
        { term: "CSMA/CD", definition: "Ethernet – zařízení naslechne médium, při kolizi přenos přeruší a po náhodné prodlevě opakuje." },
        { term: "CSMA/CA", definition: "Wi-Fi – zabraňuje kolizím rezervací přenosového média před odesláním dat." },
        { term: "Token Passing", definition: "Token Ring – speciální rámec (token) potřebný pro zahájení přenosu." }
      ]
    },
    {
      title: "Síťové prvky linkové vrstvy",
      items: [
        { term: "Switch (Přepínač)", definition: "Přeposílá rámce na základě MAC adres cílovému zařízení." },
        { term: "Bridge (Most)", definition: "Propojuje různé segmenty sítě a filtruje data dle MAC adres." },
        { term: "Access Point (AP)", definition: "Propojuje bezdrátová zařízení s kabelovou sítí." },
        { term: "NIC (Síťová karta)", definition: "Zprostředkovává komunikaci mezi počítačem a sítí, obsahuje MAC adresu." }
      ]
    }
  ]
};

// ============================================================
// Q14 - CompactContent (Síťová vrstva)
// ============================================================
const q14CompactContent = {
  sections: [
    {
      title: "Síťová vrstva – přehled",
      text: "3. vrstva modelu ISO/OSI. Směruje data mezi různými sítěmi pomocí logických adres (IP). Pracuje s pakety."
    },
    {
      title: "Funkce síťové vrstvy",
      items: [
        "Směrování (Routing) – Určuje nejvhodnější cestu pro přenos dat.",
        "Logická adresace – Přiděluje síťové adresy zařízením (IPv4, IPv6).",
        "Fragmentace a sestavení paketů – Rozděluje data na pakety a zpětně je skládá.",
        "Detekce a řízení přetížení – Sleduje zatížení sítě a minimalizuje přetížení.",
        "Přenos mezi různými sítěmi – Zajišťuje kompatibilitu mezi odlišnými technologiemi."
      ]
    },
    {
      title: "IPv4 adresy",
      text: "32bitová adresa, 4 oktety oddělené tečkami (např. 192.168.1.1). Celkem ~4,3 miliardy unikátních adres.",
      items: [
        { term: "Třída A", definition: "0.0.0.0 – 127.x.x.x, maska /8, velké sítě." },
        { term: "Třída B", definition: "128.0.0.0 – 191.x.x.x, maska /16, středně velké sítě." },
        { term: "Třída C", definition: "192.0.0.0 – 223.x.x.x, maska /24, malé sítě." },
        { term: "Třída D", definition: "224.0.0.0 – 239.x.x.x, multicast." },
        { term: "Třída E", definition: "240.0.0.0 – 255.x.x.x, experimentální." }
      ]
    },
    {
      title: "Typy IPv4 adres",
      items: [
        { term: "Veřejné adresy", definition: "Globálně unikátní a směrovatelné na internetu." },
        { term: "Soukromé adresy", definition: "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 – pouze pro lokální sítě." },
        { term: "Broadcast adresy", definition: "Adresace všech zařízení v síti (např. 192.168.1.255)." },
        { term: "Loopback adresa", definition: "127.0.0.1 – testovací adresa zařízení." }
      ]
    },
    {
      title: "IPv6",
      text: "128bitová adresa, 8 bloků po 16 bitech (např. 2001:0db8:85a3::8a2e:0370:7334). Prefix místo masky (např. /64).",
      items: [
        { term: "Unicast", definition: "Identifikace jednoho zařízení (2001::/16)." },
        { term: "Multicast", definition: "Adresace skupiny zařízení (FF00::/8)." },
        { term: "Anycast", definition: "Adresuje nejbližší zařízení ve skupině." },
        { term: "Link-Local", definition: "FE80::/10 – pouze lokální komunikace." }
      ]
    },
    {
      title: "Pakety (PDU síťové vrstvy)",
      items: [
        { term: "Hlavička", definition: "Zdrojová a cílová IP adresa, délka paketu, kontrolní součet." },
        { term: "Data", definition: "Užitečná data přenášená z vyšších vrstev." }
      ]
    },
    {
      title: "Protokoly síťové vrstvy",
      items: [
        { term: "IP (Internet Protocol)", definition: "Směrování a doručení paketů na základě IP adres." },
        { term: "ICMP", definition: "Diagnostika a hlášení chyb v síti (příkaz ping)." },
        { term: "ARP", definition: "Převod IP adres na MAC adresy." },
        { term: "NAT", definition: "Překlad privátních IP adres na veřejné." }
      ]
    },
    {
      title: "Síťové prvky",
      items: [
        { term: "Router (Směrovač)", definition: "Směruje pakety mezi sítěmi, analyzuje IP adresy, určuje nejlepší cestu." },
        { term: "Firewall", definition: "Chrání síť před neoprávněnými přístupy, filtruje provoz dle pravidel." },
        { term: "Gateway (Brána)", definition: "Překlad protokolů mezi různými sítěmi." },
        { term: "Layer 3 Switch", definition: "Kombinace switche a routeru, přepíná data na základě IP adres." }
      ]
    }
  ]
};

// ============================================================
// Q15 - CompactContent (Adresace a směrování)
// ============================================================
const q15CompactContent = {
  sections: [
    {
      title: "Adresace – základy",
      text: "Identifikace zařízení v síti pomocí adres. PC generuje/přijímá data, Switch přepíná dle MAC adres (2. vrstva), Router směruje dle IP adres (3. vrstva).",
      items: [
        { term: "Síťová část adresy", definition: "Identifikace sítě (např. 192.168.1.0/24)." },
        { term: "Hostitelská část", definition: "Identifikace konkrétního zařízení v síti." },
        { term: "Maska podsítě", definition: "Odděluje síťovou a hostitelskou část (např. 255.255.255.0 = /24)." }
      ]
    },
    {
      title: "Subnetting a CIDR",
      items: [
        { term: "Subnetting", definition: "Rozdělení jedné sítě na menší podsítě pomocí masky. Příklad: 192.168.1.0/26 = 64 adres, 62 hostitelů." },
        { term: "VLSM", definition: "Variable Length Subnet Masking – různě dlouhé masky v jedné síti pro efektivní využití adres." },
        { term: "CIDR", definition: "Nahrazuje třídní adresování (A/B/C). Zápis: síťová adresa/prefix (192.168.1.0/24). Umožňuje subnetting i supernetting." }
      ]
    },
    {
      title: "Síťové výpočty",
      items: [
        { term: "Počet hostitelů", definition: "2^(32−prefix) − 2. Příklad: /24 → 2^8 − 2 = 254 hostitelů." },
        { term: "Rozsah adres", definition: "Od první adresy sítě (192.168.1.0) po broadcast (192.168.1.255)." },
        { term: "Příklady masek", definition: "/24 = 255.255.255.0, /26 = 255.255.255.192, /28 = 255.255.255.240." }
      ]
    },
    {
      title: "Druhy směrování",
      items: [
        { term: "Statické směrování", definition: "Administrátor ručně nastaví cesty. Jednoduché pro malé sítě, ale není flexibilní." },
        { term: "Dynamické směrování", definition: "Směrovače automaticky upravují tabulky dle topologie. Používají protokoly (OSPF, RIP)." }
      ]
    },
    {
      title: "Směrovací tabulka a metrika",
      items: [
        { term: "Směrovací tabulka", definition: "Záznamy o cestách k cílovým sítím: cílová síť, maska, next hop, metrika." },
        { term: "Počet skoků (Hop Count)", definition: "Počet routerů na cestě k cíli." },
        { term: "Šířka pásma", definition: "Rychlost dostupného spojení." },
        { term: "Zpoždění", definition: "Čas potřebný pro přenos dat." }
      ]
    },
    {
      title: "Směrovací metody",
      items: [
        { term: "Unicast", definition: "Přenos mezi dvěma zařízeními (1:1)." },
        { term: "Multicast", definition: "Přenos z jednoho zařízení na skupinu (1:N)." },
        { term: "Broadcast", definition: "Přenos na všechna zařízení v síti (1:všichni)." }
      ]
    },
    {
      title: "Směrovací protokoly",
      items: [
        { term: "RIP", definition: "Metoda počtu skoků, max 15 hopů. Jednoduchý, ale pomalý." },
        { term: "OSPF", definition: "Link-state protokol, SPF algoritmus. Používá metriku šířky pásma. Rychlé a přesné." },
        { term: "BGP", definition: "Směrování mezi autonomními systémy (internet). Klíčový pro globální směrování." },
        { term: "EIGRP", definition: "Cisco protokol. Rychlejší než RIP, méně náročný než OSPF." }
      ]
    }
  ]
};

// ============================================================
// Q16 - CompactContent (Transportní, relační, prezentační)
// ============================================================
const q16CompactContent = {
  sections: [
    {
      title: "Transportní vrstva (4. vrstva)",
      text: "Mezi síťovou (3.) a relační (5.) vrstvou. Zajišťuje spolehlivé doručení dat, segmentaci a řízení toku. PDU = segmenty."
    },
    {
      title: "Funkce transportní vrstvy",
      items: [
        "Spolehlivost – Zajišťuje doručení dat bez chyb, v pořadí a kompletní.",
        "Segmentace a rekonstrukce – Rozděluje data na segmenty a skládá je zpět.",
        "Řízení toku – Zabraňuje zahlcení příjemce daty (flow control).",
        "Detekce a oprava chyb – Identifikuje chyby a provádí opakované přenosy."
      ]
    },
    {
      title: "TCP vs. UDP",
      items: [
        { term: "TCP (Transmission Control Protocol)", definition: "Spolehlivý, orientovaný na připojení. Potvrzování (ACK), řízení toku, sekvenční číslování. Pro web, e-mail, přenos souborů." },
        { term: "UDP (User Datagram Protocol)", definition: "Nespojovaný, rychlý. Bez potvrzování. Pro streaming, online hry, VoIP." }
      ]
    },
    {
      title: "Porty a segmenty",
      items: [
        { term: "Čísla portů", definition: "Určují aplikaci – port 80 (HTTP), 443 (HTTPS), 25 (SMTP), 53 (DNS)." },
        { term: "Sekvenční čísla", definition: "Zajišťují doručení dat ve správném pořadí." },
        { term: "Kontrolní součet", definition: "Detekce chyb v přeneseném segmentu." }
      ]
    },
    {
      title: "Řízení spolehlivé komunikace",
      items: [
        { term: "Potvrzování (ACK)", definition: "Odesílatel očekává potvrzení přijetí dat." },
        { term: "Opakovaný přenos", definition: "Pokud potvrzení nepřijde, data jsou znovu odeslána." },
        { term: "Kontrola toku", definition: "Příjemce reguluje množství dat, která může přijmout." }
      ]
    },
    {
      title: "Relační vrstva (5. vrstva)",
      text: "Nad transportní, pod prezentační vrstvou.",
      items: [
        { term: "Správa relací", definition: "Zahájení, udržování a ukončení relací mezi aplikacemi." },
        { term: "Synchronizace", definition: "Synchronizační body umožňují pokračovat po přerušení." },
        { term: "Řízení komunikace", definition: "Určuje, která strana může aktuálně posílat/přijímat data." }
      ]
    },
    {
      title: "Prezentační vrstva (6. vrstva)",
      text: "Nad relační, pod aplikační vrstvou.",
      items: [
        { term: "Kódování/dekódování", definition: "Převod mezi formáty (ASCII, Unicode, EBCDIC)." },
        { term: "Komprese dat", definition: "Snižuje velikost dat pro rychlejší přenos." },
        { term: "Šifrování", definition: "TLS/SSL – šifruje komunikaci. AES (symetrické), RSA (asymetrické)." },
        { term: "MIME", definition: "Umožňuje posílat ne-textové formáty (obrázky, zvuk) v e-mailech." },
        { term: "Base64", definition: "Kódování binárních dat do textového formátu." }
      ]
    }
  ]
};

// ============================================================
// Q17 - CompactContent (Aplikační vrstva)
// ============================================================
const q17CompactContent = {
  sections: [
    {
      title: "Aplikační vrstva – přehled",
      text: "7. (nejvyšší) vrstva modelu ISO/OSI. Poskytuje rozhraní pro aplikace ke komunikaci přes síť. Sbírá, zpracovává data a řídí komunikaci mezi aplikacemi."
    },
    {
      title: "DNS systém",
      items: [
        { term: "Účel", definition: "Překlad doménových jmen na IP adresy (např. google.com → 142.250.x.x)." },
        { term: "Struktura", definition: "Hierarchická – nejvyšší úroveň (.com, .org), název domény, subdomény." },
        { term: "Princip", definition: "Zadání jména → DNS dotaz na server → odpověď s IP adresou." }
      ]
    },
    {
      title: "WWW a URL",
      items: [
        { term: "WWW", definition: "Vyhledávání a zobrazení dokumentů (HTML) pomocí prohlížeče přes HTTP/HTTPS." },
        { term: "Protokol v URL", definition: "HTTP, HTTPS, FTP – určuje způsob komunikace." },
        { term: "Doménové jméno", definition: "Určuje server (např. www.google.com)." },
        { term: "Cesta a parametry", definition: "Konkrétní stránka (/about) a parametry (?id=123)." }
      ]
    },
    {
      title: "HTTP protokol",
      items: [
        { term: "Účel", definition: "Přenos hypertextových dokumentů mezi serverem a klientem." },
        { term: "Metody", definition: "GET (načtení), POST (odeslání), PUT (aktualizace), DELETE (smazání)." },
        { term: "Stavové kódy", definition: "200 OK, 404 Not Found, 500 Internal Server Error." }
      ]
    },
    {
      title: "FTP (File Transfer Protocol)",
      items: [
        { term: "Účel", definition: "Přenos souborů mezi klientem a serverem." },
        { term: "Funkce", definition: "Nahrávání, stahování, přejmenovávání, mazání souborů na serveru." }
      ]
    },
    {
      title: "Elektronická pošta",
      text: "Odesílání a přijímání zpráv a příloh mezi zařízeními.",
      items: [
        { term: "SMTP", definition: "Odesílání e-mailů ze serveru na server." },
        { term: "POP3", definition: "Stahování e-mailů ze serveru na klienta (zprávy obvykle smazány ze serveru)." },
        { term: "IMAP", definition: "Přístup k e-mailům uloženým na serveru bez stahování. Možnost třídění a správy." },
        { term: "Princip komunikace", definition: "Odesílatel → SMTP → server příjemce → POP3/IMAP → příjemce." }
      ]
    }
  ]
};

// ============================================================
// Q18 - CompactContent (Síťové prvky a kabeláž)
// ============================================================
const q18CompactContent = {
  sections: [
    {
      title: "Síťové prvky – přehled",
      items: [
        { term: "Hub (Rozbočovač)", definition: "Přeposílá data na všechny porty bez rozlišení cíle. Menší, nezabezpečené sítě." },
        { term: "Switch (Přepínač)", definition: "2. vrstva ISO/OSI. Směruje rámce dle MAC adres, efektivně minimalizuje kolize." },
        { term: "Router (Směrovač)", definition: "3. vrstva ISO/OSI. Směruje pakety mezi sítěmi dle IP adres." },
        { term: "Firewall", definition: "Filtruje síťovou komunikaci dle bezpečnostních pravidel. Ochrana před neoprávněným přístupem." },
        { term: "Bridge (Most)", definition: "Propojuje síťové segmenty na linkové vrstvě, snižuje kolize." }
      ]
    },
    {
      title: "Cisco schématické značky",
      items: [
        { term: "Switch", definition: "Čtvercová ikona s porty." },
        { term: "Router", definition: "Čtverec s ikonou směrování / trojúhelník." },
        { term: "Hub", definition: "Malé zařízení s porty, bez pokročilých funkcí." },
        { term: "Firewall", definition: "Ikona s ochranným zámkem." },
        { term: "Modem", definition: "Dvě připojení – PC + telefonní linka." }
      ]
    },
    {
      title: "Strukturovaná kabeláž",
      text: "Standardizovaný způsob uspořádání a instalace kabelů. Umožňuje snadnou údržbu, flexibilitu a správu sítě.",
      items: [
        { term: "Kabely", definition: "Kroucená dvojlinka, optické vlákno – podle potřeby." },
        { term: "Racks", definition: "19\" rack pro uložení síťových zařízení, až 42U jednotek výšky." },
        { term: "Patch panely a kabely", definition: "Organizace připojení, krátké propojovací kabely mezi zařízeními." },
        { term: "Jacks a zásuvky", definition: "Připojení koncových zařízení k síťové infrastruktuře." }
      ]
    },
    {
      title: "Topologie",
      items: [
        { term: "Hvězdicová", definition: "Všechna zařízení připojena k centrálnímu prvku (switch/hub). Nejčastější pro LAN." },
        { term: "Sběrnicová", definition: "Zařízení na jednom kabelu (sběrnici). Starší Ethernet sítě." },
        { term: "Kruhová", definition: "Zařízení propojena do kruhu, data putují jedním směrem." }
      ]
    },
    {
      title: "Kategorie kabeláže",
      items: [
        { term: "Cat 5e", definition: "Rychlost až 1 Gbps (1000BASE-T). Běžné místní sítě." },
        { term: "Cat 6", definition: "Až 10 Gbps na kratší vzdálenosti. Vylepšená verze." },
        { term: "Cat 6a", definition: "10 Gbps na delší vzdálenosti. Datová centra." },
        { term: "Cat 7 / Cat 8", definition: "Nejvyšší přenosové rychlosti a šířka pásma. Profesionální aplikace." }
      ]
    }
  ]
};

// ============================================================
// Q19 - CompactContent (Ethernet) - rewritten, fixed typo
// ============================================================
const q19CompactContent = {
  sections: [
    {
      title: "Ethernet – přehled",
      text: "Nejrozšířenější standard pro lokální sítě (LAN). Definuje komunikaci zařízení přes sdílené médium pomocí MAC adres a rámců dat. Standard IEEE 802.3."
    },
    {
      title: "Historie a vývoj",
      items: [
        "1973 – Robert Metcalfe (Xerox PARC) vytvořil první Ethernet (2,94 Mbps).",
        "1980 – Standard IEEE 802.3 – oficiální uznání jako LAN standard.",
        "Ethernet 2 – 10 Mbps (10BASE-T).",
        "Fast Ethernet (1995) – 100 Mbps (100BASE-TX).",
        "Gigabit Ethernet – 1 Gbps (1000BASE-T).",
        "10 Gigabit Ethernet – 10 Gbps (10GBASE-T)."
      ]
    },
    {
      title: "Značení standardů",
      text: "Formát: rychlost + BASE + médium (např. 1000BASE-T = 1 Gbps přes kroucenou dvojlinku).",
      items: [
        { term: "10BASE-T", definition: "10 Mbps, kroucená dvojlinka." },
        { term: "100BASE-TX", definition: "100 Mbps, kroucená dvojlinka." },
        { term: "1000BASE-T", definition: "1 Gbps, kroucená dvojlinka." },
        { term: "10GBASE-T", definition: "10 Gbps, kroucená dvojlinka." },
        { term: "100BASE-FX", definition: "100 Mbps, optické vlákno." },
        { term: "1000BASE-SX", definition: "1 Gbps, optické vlákno (krátká vzdálenost)." }
      ]
    },
    {
      title: "Kabeláž",
      items: [
        { term: "Kroucená dvojlinka (UTP/STP)", definition: "Nejčastější kabeláž pro Ethernet." },
        { term: "Cat 5e", definition: "Podporuje až 1 Gbps." },
        { term: "Cat 6 / Cat 6a", definition: "Podporuje až 10 Gbps (Cat 6a na delší vzdálenosti)." },
        { term: "Optické vlákno", definition: "Pro vyšší rychlosti a delší vzdálenosti (100BASE-FX, 1000BASE-SX)." }
      ]
    },
    {
      title: "Ethernet rámec",
      text: "Každý přenos probíhá v rámcích. Struktura:",
      items: [
        { term: "Preámbule (7 B)", definition: "Synchronizace na začátku rámce." },
        { term: "Destinační MAC (6 B)", definition: "Adresa příjemce." },
        { term: "Zdrojová MAC (6 B)", definition: "Adresa odesílatele." },
        { term: "Typ/Délka (2 B)", definition: "Protokol vyšší vrstvy (IP, ARP…)." },
        { term: "Data/Payload (až 1500 B)", definition: "Skutečně přenášená data." },
        { term: "FCS (4 B)", definition: "Kontrolní součet – detekce chyb." }
      ]
    },
    {
      title: "CSMA/CD",
      text: "Carrier Sense Multiple Access with Collision Detection – metoda přístupu k médiu v Ethernetu.",
      items: [
        { term: "Carrier Sense", definition: "Zařízení naslouchá, zda je kanál volný." },
        { term: "Multiple Access", definition: "Všechna zařízení sdílejí společné médium." },
        { term: "Collision Detection", definition: "Při kolizi obě zařízení přestanou vysílat, počkají náhodnou dobu a vysílají znovu." },
        { term: "Switch", definition: "Eliminuje kolize – každý port má svou kolizní doménu." }
      ]
    },
    {
      title: "Varianty Ethernetu",
      items: [
        { term: "10BASE-T (10 Mbps)", definition: "Nejstarší standard, dnes zastaralý. Kabeláž Cat 3/5." },
        { term: "100BASE-TX – Fast Ethernet", definition: "100 Mbps. Domácnosti a malé firmy. Cat 5e+." },
        { term: "1000BASE-T – Gigabit Ethernet", definition: "1 Gbps. Nejrozšířenější pro moderní LAN. Cat 5e+." },
        { term: "10GBASE-T", definition: "10 Gbps. Datová centra a páteřní sítě. Cat 6a." }
      ]
    },
    {
      title: "Kódování přenosu",
      items: [
        { term: "Manchester kódování", definition: "Každý bit = přechod signálu → synchronizace. Používá 10BASE-T." },
        { term: "4B/5B kódování", definition: "Fast Ethernet (100BASE-TX). Lepší signál, nižší chybovost." },
        { term: "PAM-5", definition: "Gigabit Ethernet. 5 úrovní amplitudy přes 4 páry vodičů." }
      ]
    }
  ]
};

// ============================================================
// Q20 - CompactContent (Bezdrátové technologie) - rewritten
// ============================================================
const q20CompactContent = {
  sections: [
    {
      title: "Bezdrátové sítě – přehled",
      text: "Přenos dat pomocí elektromagnetických vln bez fyzického kabelu. Využití: domácnosti, firmy, mobilní sítě, IoT."
    },
    {
      title: "Elektromagnetické spektrum",
      items: [
        { term: "30 Hz – 300 Hz (VLF)", definition: "Velmi nízké frekvence, AM rádio, dlouhé vzdálenosti." },
        { term: "30 MHz – 3 GHz (VHF/UHF)", definition: "Televize, mobilní sítě, Wi-Fi." },
        { term: "1 GHz – 300 GHz (mikrovlny)", definition: "Wi-Fi, Bluetooth, satelity, radar." }
      ]
    },
    {
      title: "Metody modulace",
      items: [
        { term: "AM (Amplitudová modulace)", definition: "Mění amplitudu nosné vlny podle dat." },
        { term: "FM (Frekvenční modulace)", definition: "Mění frekvenci nosné vlny." },
        { term: "PM (Fázová modulace)", definition: "Mění fázi nosné vlny." },
        { term: "QAM", definition: "Kombinuje amplitudu i fázi. Vysoké rychlosti (Wi-Fi)." }
      ]
    },
    {
      title: "Bluetooth",
      text: "Krátká vzdálenost, propojení osobních zařízení (PAN). Frekvenční pásmo 2,4 GHz (ISM).",
      items: [
        { term: "Rychlost", definition: "Až 3 Mbps (Bluetooth 5: až 50 Mbps)." },
        { term: "Dosah", definition: "1–100 m (závisí na verzi a výkonu)." },
        { term: "FHSS", definition: "Frequency Hopping Spread Spectrum – přenos skáče mezi frekvencemi, odolnost vůči rušení." },
        { term: "Piconet", definition: "1 master + až 7 aktivních slave zařízení." },
        { term: "Scatternet", definition: "Propojení více piconetů dohromady." }
      ]
    },
    {
      title: "Wi-Fi standardy (IEEE 802.11)",
      text: "Bezdrátová lokální síť (WLAN). Přístup k internetu bez kabelů.",
      items: [
        { term: "802.11b", definition: "11 Mbps, 2,4 GHz." },
        { term: "802.11g", definition: "54 Mbps, 2,4 GHz." },
        { term: "802.11n (Wi-Fi 4)", definition: "600 Mbps, 2,4 / 5 GHz." },
        { term: "802.11ac (Wi-Fi 5)", definition: "3,5 Gbps, 5 GHz." },
        { term: "802.11ax (Wi-Fi 6)", definition: "9,6 Gbps, 2,4 / 5 / 6 GHz." }
      ]
    },
    {
      title: "Wi-Fi technologie a topologie",
      items: [
        { term: "OFDM", definition: "Signál rozdělen na více nosných frekvencí – vyšší rychlost a odolnost vůči rušení." },
        { term: "MIMO", definition: "Více antén současně – větší kapacita a rychlost." },
        { term: "Topologie", definition: "Hvězdicová – klienti komunikují přes Access Point (AP) připojený k routeru." },
        { term: "Omnidirekcionální antény", definition: "Vyzařují signál rovnoměrně do všech směrů." },
        { term: "Direkcionální antény", definition: "Soustředí signál do jednoho směru, větší dosah." }
      ]
    },
    {
      title: "Další bezdrátové technologie",
      items: [
        { term: "ZigBee", definition: "Nízká spotřeba, 10–100 m. IoT senzory a chytré domácnosti." },
        { term: "Z-Wave", definition: "Podobné ZigBee, chytré domácnosti a automatizace (~30 m)." },
        { term: "NFC", definition: "Near Field Communication – do 10 cm. Bezkontaktní platby a přihlašování." },
        { term: "LoRa", definition: "Long Range – velmi dlouhé vzdálenosti (km) při nízké spotřebě. Monitoring IoT." }
      ]
    }
  ]
};

// ============================================================
// Apply all changes
// ============================================================
for (const q of data.questions) {
  switch (q.id) {
    case 12:
      q.answer = q12Answer;
      q.compactContent = q12CompactContent;
      break;
    case 13:
      q.compactContent = q13CompactContent;
      break;
    case 14:
      q.compactContent = q14CompactContent;
      break;
    case 15:
      q.compactContent = q15CompactContent;
      break;
    case 16:
      q.compactContent = q16CompactContent;
      break;
    case 17:
      q.compactContent = q17CompactContent;
      break;
    case 18:
      q.compactContent = q18CompactContent;
      break;
    case 19:
      q.compactContent = q19CompactContent;
      // Remove the duplicate `content` field
      delete q.content;
      break;
    case 20:
      q.compactContent = q20CompactContent;
      // Remove the duplicate `content` field
      delete q.content;
      break;
  }
}

// Write back
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

// Verify
console.log('✅ Updated questions 12-20');
for (const q of data.questions) {
  if (q.id >= 12 && q.id <= 20) {
    const sections = q.compactContent?.sections?.length ?? 0;
    const totalItems = q.compactContent?.sections?.reduce((acc, s) => acc + (s.items?.length ?? 0), 0) ?? 0;
    const hasContent = q.content ? ' ⚠️ HAS content field' : '';
    console.log(`  Q${q.id}: ${q.question} → ${sections} sections, ${totalItems} items${hasContent}`);
  }
}
