import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUESTIONS_PATH = path.join(__dirname, '../src/data/it-questions.json');

// Q14 - Síťová vrstva modelu ISO/OSI
const q14Content = {
    sections: [
        {
            title: "Pozice vrstvy v modelech, funkce",
            subsections: [
                {
                    title: "Pozice",
                    items: [
                        "Síťová vrstva je třetí vrstva modelu ISO/OSI, nad linkovou vrstvou a pod transportní vrstvou.",
                        "Zatímco linková vrstva se stará o přenos dat mezi zařízeními na stejné síti (lokálně), síťová vrstva se zabývá komunikací mezi různými sítěmi."
                    ]
                },
                {
                    title: "Funkce",
                    items: [
                        { term: "Směrování (Routing)", definition: "Určuje nejvhodnější cestu, kterou se data dostanou z jednoho uzlu do druhého." },
                        { term: "Logická adresace", definition: "Přiděluje síťové adresy zařízením (např. IPv4, IPv6). Tato adresace je nezávislá na fyzickém umístění zařízení." },
                        { term: "Fragmentace a sestavení paketů", definition: "Rozděluje velké datové bloky na menší části (MTU) a po přenosu je sestavuje zpět." },
                        { term: "Detekce a řízení přetížení", definition: "Sleduje síťové zatížení a minimalizuje přetížení." },
                        { term: "Přenos dat mezi různými typy sítí", definition: "Zajišťuje kompatibilitu mezi sítěmi s různými technologiemi." }
                    ]
                }
            ]
        },
        {
            title: "Adresní prostory/třídy IPv4 adres",
            text: "IPv4 používá 32bitové adresy, což umožňuje přibližně 4,3 miliardy unikátních adres. Adresa je rozdělena do 4 osmibitových bloků oddělených tečkami (např. 192.168.1.1).",
            subsections: [
                {
                    title: "Třídy IPv4 adres",
                    items: [
                        { term: "Třída A", definition: "Rozsah: 0.0.0.0 – 127.255.255.255. Použití: Velké sítě. Maska: 255.0.0.0 (/8)." },
                        { term: "Třída B", definition: "Rozsah: 128.0.0.0 – 191.255.255.255. Použití: Středně velké sítě. Maska: 255.255.0.0 (/16)." },
                        { term: "Třída C", definition: "Rozsah: 192.0.0.0 – 223.255.255.255. Použití: Malé sítě. Maska: 255.255.255.0 (/24)." },
                        { term: "Třída D", definition: "Rozsah: 224.0.0.0 – 239.255.255.255. Použití: Multicast." },
                        { term: "Třída E", definition: "Rozsah: 240.0.0.0 – 255.255.255.255. Použití: Experimentální adresy." }
                    ]
                },
                {
                    title: "Typy IPv4 adres",
                    items: [
                        { term: "Veřejné adresy", definition: "Globálně unikátní a směrovatelné na internetu." },
                        { term: "Soukromé adresy", definition: "Používají se v lokálních sítích. Rozsahy: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16." },
                        { term: "Broadcast adresy", definition: "Adresování všech zařízení v síti (např. 192.168.1.255)." },
                        { term: "Loopback adresy", definition: "Testovací adresa zařízení (127.0.0.1)." }
                    ]
                },
                {
                    title: "Maska podsítě (Subnet Mask)",
                    text: "Slouží k rozdělení adresního prostoru na menší podsítě. Např. maska 255.255.255.0 (/24) znamená, že první tři oktety určují síť a poslední oktet určuje hostitele."
                }
            ]
        },
        {
            title: "Adresní prostory IPv6 adres",
            text: "IPv6 používá 128bitové adresy, což umožňuje přibližně 3.4×10^38 unikátních adres. Adresa je zapsána v osmi 16bitových blocích oddělených dvojtečkami (např. 2001:0db8:85a3:0000:0000:8a2e:0370:7334).",
            subsections: [
                {
                    title: "Typy IPv6 adres",
                    items: [
                        { term: "Unicast", definition: "Identifikuje jediné zařízení. Rozsah: např. 2001::/16." },
                        { term: "Multicast", definition: "Adresuje skupinu zařízení. Rozsah: FF00::/8." },
                        { term: "Anycast", definition: "Adresuje nejbližší zařízení ve skupině." }
                    ]
                },
                {
                    title: "Adresní bloky IPv6",
                    items: [
                        { term: "Globálně unikátní adresy", definition: "2000::/3" },
                        { term: "Link-local adresy", definition: "FE80::/10 (pouze pro lokální komunikaci)." },
                        { term: "Soukromé adresy", definition: "FC00::/7" }
                    ]
                }
            ]
        },
        {
            title: "Bloky dat, protokoly",
            text: "Na síťové vrstvě se přenáší pakety (packets). Struktura paketu obsahuje hlavičku (zdrojová a cílová IP adresa, délka, kontrolní součet) a data.",
            subsections: [
                {
                    title: "Protokoly",
                    items: [
                        { term: "IP (Internet Protocol)", definition: "Směrování a doručení paketů. Hlavička obsahuje IP adresy, verzi, délku." },
                        { term: "ICMP", definition: "Internet Control Message Protocol - diagnostika a hlášení chyb (např. ping)." },
                        { term: "ARP", definition: "Address Resolution Protocol - převod IP adres na MAC adresy." },
                        { term: "NAT", definition: "Network Address Translation - převádí privátní IP adresy na veřejné." }
                    ]
                }
            ]
        },
        {
            title: "Síťové prvky a jejich funkce",
            items: [
                { term: "Router (Směrovač)", definition: "Směruje pakety mezi různými sítěmi. Analyzuje IP adresy a určuje nejlepší cestu." },
                { term: "Firewall", definition: "Chrání síť před neoprávněnými přístupy a útoky." },
                { term: "Gateway (Brána)", definition: "Překládá protokoly mezi různými sítěmi." },
                { term: "Layer 3 Switch", definition: "Kombinace switch a routeru. Přepíná data na základě IP adres." }
            ]
        },
        {
            title: "Shrnutí",
            text: "Síťová vrstva modelu ISO/OSI je zodpovědná za logickou adresaci, směrování a přenos dat mezi sítěmi. Používá adresy IPv4 a IPv6, protokoly jako IP, ICMP a ARP a pracuje s prvky jako routery nebo firewally."
        }
    ]
};

// Q15 - Adresace a směrování v sítích
const q15Content = {
    sections: [
        {
            title: "Schéma sítě (PC, switch, routery)",
            text: "Schéma sítě zobrazuje fyzické a logické uspořádání síťových prvků.",
            items: [
                { term: "PC (Personal Computer)", definition: "Koncová zařízení, která generují a přijímají data. Mají unikátní IP adresu." },
                { term: "Switch (Přepínač)", definition: "Pracuje na 2. vrstvě (linková). Spojuje zařízení v rámci jedné LAN a přepíná data na základě MAC adres." },
                { term: "Router (Směrovač)", definition: "Pracuje na 3. vrstvě (síťová). Propojuje různé sítě a směruje data mezi nimi pomocí IP adres." }
            ]
        },
        {
            title: "VLSM maska, určení IPv4 adres sítě, subnetting",
            subsections: [
                {
                    title: "VLSM (Variable Length Subnet Mask)",
                    text: "Umožňuje použít různě dlouhé masky podsítě v rámci jedné sítě. Efektivní využití adresního prostoru přidělením přesného počtu adres pro každou podsíť."
                },
                {
                    title: "Určení IPv4 adres sítě",
                    items: [
                        { term: "Síťová část", definition: "Identifikuje síť (např. 192.168.1.0/24)." },
                        { term: "Hostitelská část", definition: "Identifikuje zařízení v síti." }
                    ]
                },
                {
                    title: "Subnetting",
                    text: "Rozdělení jedné sítě na menší podsítě pomocí masky. Příklad: Síť 192.168.1.0/24 rozdělena na 192.168.1.0/26 (64 adres) a 192.168.1.64/26 (64 adres)."
                }
            ]
        },
        {
            title: "CIDR adresace, síťové výpočty",
            subsections: [
                {
                    title: "CIDR (Classless Inter-Domain Routing)",
                    text: "Nahrazuje tradiční třídní adresování (A, B, C). Používá se pro agregaci adres do větších bloků (supernetting) nebo dělení na menší (subnetting). Zápis: Síťová adresa/prefix (např. 192.168.1.0/24)."
                },
                {
                    title: "Síťové výpočty",
                    items: [
                        { term: "Počet hostitelů", definition: "2^(32-prefix) - 2. Např. /24: 2^8 - 2 = 254 hostitelů." },
                        { term: "Rozsah adres", definition: "Od první adresy sítě (např. 192.168.1.0) po broadcast adresu (např. 192.168.1.255)." },
                        { term: "Maska podsítě", definition: "/24 = 255.255.255.0, /26 = 255.255.255.192" }
                    ]
                }
            ]
        },
        {
            title: "Druhy směrování, směrovací tabulka, metrika",
            subsections: [
                {
                    title: "Druhy směrování",
                    items: [
                        { term: "Statické směrování", definition: "Administrátor ručně nastaví cesty. Jednoduché pro malé sítě, ale není flexibilní." },
                        { term: "Dynamické směrování", definition: "Směrovače automaticky upravují směrovací tabulky. Používá protokoly jako OSPF, RIP." }
                    ]
                },
                {
                    title: "Směrovací tabulka",
                    text: "Obsahuje záznamy o směrech k cílovým sítím: cílová síť, maska sítě, next hop (adresa následujícího routeru), metrika."
                },
                {
                    title: "Metrika",
                    text: "Parametr pro určení nejlepší cesty.",
                    items: [
                        { term: "Počet skoků (Hop Count)", definition: "Počet routerů, kterými data procházejí." },
                        { term: "Šířka pásma", definition: "Rychlost dostupného spojení." },
                        { term: "Zpoždění", definition: "Čas potřebný pro přenos dat." }
                    ]
                }
            ]
        },
        {
            title: "Směrovací metody a protokoly",
            subsections: [
                {
                    title: "Směrovací metody",
                    items: [
                        { term: "Unicast", definition: "Přenos mezi dvěma zařízeními." },
                        { term: "Multicast", definition: "Přenos z jednoho zařízení na skupinu zařízení." },
                        { term: "Broadcast", definition: "Přenos na všechna zařízení v síti." }
                    ]
                },
                {
                    title: "Směrovací protokoly",
                    items: [
                        { term: "RIP", definition: "Routing Information Protocol. Metoda 'počet skoků', max 15 skoků. Jednoduchý, ale pomalý." },
                        { term: "OSPF", definition: "Open Shortest Path First. Protokol typu link-state, rychlé a přesné směrování." },
                        { term: "BGP", definition: "Border Gateway Protocol. Používá se mezi autonomními systémy (Internet). Klíčový pro globální směrování." },
                        { term: "EIGRP", definition: "Enhanced Interior Gateway Routing Protocol. Cisco proprietární, rychlejší než RIP." }
                    ]
                }
            ]
        },
        {
            title: "Shrnutí",
            text: "Adresace zahrnuje přidělování IP adres a subnetting pro optimalizaci adresního prostoru. Směrování využívá statické a dynamické metody, směrovací tabulky a protokoly (RIP, OSPF, BGP) k určení nejlepší cesty pro přenos dat."
        }
    ]
};

// Q16 - Transportní, relační a prezentační vrstva
const q16Content = {
    sections: [
        {
            title: "Transportní vrstva (4. vrstva ISO/OSI)",
            text: "Zajišťuje spolehlivou a efektivní komunikaci mezi aplikacemi. Umožňuje segmentaci dat, kontrolu toku a opakování přenosu při chybách.",
            subsections: [
                {
                    title: "Pozice a funkce",
                    items: [
                        "Nachází se mezi síťovou vrstvou (3.) a relační vrstvou (5.).",
                        { term: "Spolehlivost", definition: "Zajišťuje, že data jsou doručena bez chyb, v pořadí a kompletní." },
                        { term: "Segmentace a rekonstrukce", definition: "Rozděluje data na segmenty a zajišťuje jejich správné sestavení." },
                        { term: "Řízení toku", definition: "Zabraňuje zahlcení příjemce daty (flow control)." },
                        { term: "Detekce a oprava chyb", definition: "Identifikuje chyby a provádí opakované přenosy." }
                    ]
                },
                {
                    title: "Bloky dat a jejich identifikace",
                    text: "Data přenášená transportní vrstvou jsou segmenty.",
                    items: [
                        { term: "Čísla portů", definition: "Určují, která aplikace je zdrojem a cílem (např. port 80 pro HTTP, 443 pro HTTPS)." },
                        { term: "Sekvenční čísla", definition: "Zajišťují doručení dat ve správném pořadí." },
                        { term: "Kontrolní součet (checksum)", definition: "Slouží k detekci chyb." }
                    ]
                },
                {
                    title: "Protokoly",
                    items: [
                        { term: "TCP (Transmission Control Protocol)", definition: "Spolehlivý, orientovaný na připojení. Potvrzování, řízení toku, sekvenční číslování, detekce a oprava chyb." },
                        { term: "UDP (User Datagram Protocol)", definition: "Nespojovaný, lehký protokol. Rychlý přenos bez potvrzování. Vhodný pro streaming, VoIP, online hry." }
                    ]
                },
                {
                    title: "Zabezpečení spolehlivé komunikace",
                    items: [
                        { term: "Potvrzování (ACK)", definition: "Odesílatel očekává potvrzení přijetí dat." },
                        { term: "Opakovaný přenos", definition: "Pokud potvrzení nepřijde, data jsou znovu odeslána." },
                        { term: "Kontrola toku", definition: "Příjemce reguluje množství dat, která může přijmout." }
                    ]
                }
            ]
        },
        {
            title: "Relační vrstva (5. vrstva ISO/OSI)",
            text: "Zodpovědná za řízení a udržování relace (session) mezi dvěma zařízeními nebo aplikacemi.",
            subsections: [
                {
                    title: "Pozice a funkce",
                    items: [
                        "Nachází se nad transportní vrstvou a pod prezentační vrstvou.",
                        { term: "Správa relací", definition: "Zahájení, udržování a ukončení relací mezi aplikacemi." },
                        { term: "Synchronizace", definition: "Vkládání synchronizačních bodů pro pokračování přenosu po přerušení." },
                        { term: "Řízení komunikace", definition: "Určuje, která strana může aktuálně posílat nebo přijímat data." }
                    ]
                }
            ]
        },
        {
            title: "Prezentační vrstva (6. vrstva ISO/OSI)",
            text: "Zodpovědná za formátování a kódování dat, aby je aplikace mohly snadno interpretovat.",
            subsections: [
                {
                    title: "Pozice a funkce",
                    items: [
                        "Nachází se nad relační vrstvou a pod aplikační vrstvou.",
                        { term: "Kódování a dekódování", definition: "Převod mezi různými datovými formáty (např. ASCII, Unicode)." },
                        { term: "Komprese dat", definition: "Snižuje velikost dat pro rychlejší přenos." },
                        { term: "Šifrování a dešifrování", definition: "Zvyšuje bezpečnost přenosu." }
                    ]
                },
                {
                    title: "Protokoly",
                    items: [
                        { term: "TLS (Transport Layer Security)", definition: "Šifrování komunikace a ověření identity stran." },
                        { term: "SSL (Secure Sockets Layer)", definition: "Předchůdce TLS, dnes méně používaný." },
                        { term: "JPEG, GIF, MP3", definition: "Standardy pro formátování dat (obrázky, audio)." }
                    ]
                },
                {
                    title: "Tabulky znaků a bezpečnostní funkce",
                    items: [
                        { term: "Tabulky znaků", definition: "ASCII, Unicode, EBCDIC." },
                        { term: "Šifrování dat", definition: "Pomocí algoritmů AES, RSA." },
                        { term: "Ochrana integrity", definition: "Kontrola, zda data nebyla během přenosu změněna." }
                    ]
                },
                {
                    title: "Rozšíření elektronické pošty, typy kódování",
                    items: [
                        { term: "MIME", definition: "Multipurpose Internet Mail Extensions - umožňuje posílat ne-textové formáty." },
                        { term: "Base64", definition: "Kódování binárních dat do textového formátu." },
                        { term: "Quoted-Printable", definition: "Umožňuje přenos znaků mimo ASCII." }
                    ]
                }
            ]
        },
        {
            title: "Shrnutí",
            text: "Transportní vrstva se zaměřuje na segmentaci, řízení toku a spolehlivost (TCP/UDP). Relační vrstva spravuje a synchronizuje relace. Prezentační vrstva provádí konverze a zajišťuje bezpečnost dat. Tyto vrstvy tvoří základ pro efektivní komunikaci aplikací."
        }
    ]
};

async function main() {
    console.log("Reading questions...");
    const data = JSON.parse(fs.readFileSync(QUESTIONS_PATH, 'utf8'));

    for (const question of data.questions) {
        if (question.id === 14) {
            question.content = q14Content;
            console.log("Updated Q14 - Síťová vrstva");
        }
        if (question.id === 15) {
            question.content = q15Content;
            console.log("Updated Q15 - Adresace a směrování");
        }
        if (question.id === 16) {
            question.content = q16Content;
            console.log("Updated Q16 - Transportní, relační a prezentační vrstva");
        }
    }

    fs.writeFileSync(QUESTIONS_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log("Saved to it-questions.json");
}

main();
