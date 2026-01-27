import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUESTIONS_PATH = path.join(__dirname, '../src/data/it-questions.json');

// Q17 - Aplikační vrstva modelu ISO/OSI
const q17Content = {
    sections: [
        {
            title: "Pozice vrstvy v modelu a její funkce",
            subsections: [
                {
                    title: "Pozice v modelu",
                    items: [
                        "Aplikační vrstva je na 7. pozici v modelu ISO/OSI.",
                        "Leží nad všemi ostatními vrstvami a zajišťuje přímý přístup aplikací k síti.",
                        "Je jedinou vrstvou, která je v přímém kontaktu s uživatelskými aplikacemi."
                    ]
                },
                {
                    title: "Funkce",
                    items: [
                        { term: "Poskytování rozhraní pro aplikace", definition: "Poskytuje aplikacím služby pro komunikaci přes síť." },
                        { term: "Sběr a zpracování dat", definition: "Podílí se na sběru dat a jejich přípravě pro přenos do nižších vrstev, včetně kódování a šifrování." },
                        { term: "Řízení komunikace mezi aplikacemi", definition: "Stará se o správné směrování dat mezi aplikacemi na různých zařízeních." }
                    ]
                }
            ]
        },
        {
            title: "DNS systém, WWW služba, URL",
            subsections: [
                {
                    title: "DNS (Domain Name System)",
                    items: [
                        { term: "Účel", definition: "Slouží k překladu doménových jmen na IP adresy (např. www.google.com → IP adresa serveru)." },
                        { term: "Funkce", definition: "Umožňuje uživatelům připojit se k webovým stránkám pomocí snadno zapamatovatelných jmen." },
                        { term: "Struktura", definition: "Hierarchická struktura domén - nejvyšší úroveň (.com, .org), název domény, subdomény." },
                        { term: "Princip", definition: "Při zadání doménového jména je odeslán DNS dotaz, který vrátí odpověď ve formě IP adresy." }
                    ]
                },
                {
                    title: "WWW služba (World Wide Web)",
                    items: [
                        { term: "Účel", definition: "Poskytuje způsob pro vyhledávání a zobrazování dokumentů na internetu pomocí prohlížeče." },
                        { term: "Funkce", definition: "Webové stránky jsou hostovány na serverech a přístupné přes HTTP/HTTPS protokoly." },
                        { term: "Protokol", definition: "HTTP (HyperText Transfer Protocol) je protokol pro přenos dat mezi servery a klienty." }
                    ]
                },
                {
                    title: "URL (Uniform Resource Locator)",
                    text: "Jedinečný identifikátor pro zdroje na internetu.",
                    items: [
                        { term: "Protokol", definition: "HTTP, HTTPS, FTP - určuje protokol pro komunikaci." },
                        { term: "Doménové jméno", definition: "Specifikuje server (např. www.google.com)." },
                        { term: "Cesta", definition: "Určuje konkrétní soubor nebo stránku na serveru (např. /about)." },
                        "Volitelně port a parametry (např. ?id=123)."
                    ]
                }
            ]
        },
        {
            title: "Základní protokoly",
            subsections: [
                {
                    title: "HTTP (HyperText Transfer Protocol)",
                    items: [
                        { term: "Účel", definition: "Protokol pro přenos hypertextových dokumentů v rámci WWW." },
                        { term: "Struktura", definition: "Požadavek (metody GET, POST, PUT, DELETE) a odpověď (HTML, obrázky, soubory)." },
                        { term: "Princip", definition: "Klient odešle požadavek, server vrátí odpověď s daty." }
                    ]
                },
                {
                    title: "Stavové kódy HTTP",
                    items: [
                        { term: "200 OK", definition: "Požadavek byl úspěšně zpracován." },
                        { term: "404 Not Found", definition: "Požadovaná stránka nebyla nalezena." },
                        { term: "500 Internal Server Error", definition: "Došlo k chybě na straně serveru." }
                    ]
                },
                {
                    title: "FTP (File Transfer Protocol)",
                    items: [
                        { term: "Účel", definition: "Přenos souborů mezi klientem a serverem." },
                        { term: "Funkce", definition: "Nahrávání, stahování, přejmenovávání nebo mazání souborů." },
                        { term: "Struktura", definition: "Používá dvě spojení - jedno pro příkazy, druhé pro přenos dat." }
                    ]
                }
            ]
        },
        {
            title: "Elektronická pošta",
            text: "E-mail umožňuje uživatelům odesílat a přijímat zprávy a přílohy mezi různými zařízeními.",
            subsections: [
                {
                    title: "Protokoly",
                    items: [
                        { term: "SMTP", definition: "Simple Mail Transfer Protocol - odesílání e-mailů ze serveru na server." },
                        { term: "POP3", definition: "Post Office Protocol 3 - stahování e-mailů ze serveru na klienta (zprávy jsou obvykle smazány)." },
                        { term: "IMAP", definition: "Internet Message Access Protocol - přístup k e-mailům na serveru bez jejich stahování." }
                    ]
                },
                {
                    title: "Princip komunikace",
                    text: "Odesílatel používá SMTP pro odeslání zprávy na server, který ji doručí na příjemcův server, odkud ji příjemce stáhne pomocí POP3 nebo IMAP."
                }
            ]
        },
        {
            title: "Shrnutí",
            text: "Aplikační vrstva zajišťuje konektivitu mezi aplikacemi a podkladovými vrstvami. Používá protokoly DNS, HTTP, FTP, SMTP, IMAP a POP3 pro širokou škálu internetových služeb od webových stránek po elektronickou poštu."
        }
    ]
};

// Q18 - Síťové prvky modelu ISO/OSI a strukturovaná kabeláž
const q18Content = {
    sections: [
        {
            title: "Síťové prvky: dělení, konstrukce, funkce, použití",
            subsections: [
                {
                    title: "Hub (rozdělovač)",
                    items: [
                        { term: "Konstrukce", definition: "Jednoduché zařízení s centrálním rozbočovačem, všechny porty propojeny na sběrnici." },
                        { term: "Funkce", definition: "Data z jednoho portu jsou vysílána na všechny ostatní porty." },
                        { term: "Použití", definition: "Menší, nezabezpečené sítě bez řízení přístupu." }
                    ]
                },
                {
                    title: "Switch (přepínač)",
                    items: [
                        { term: "Konstrukce", definition: "Obsahuje porty schopné přijímat a přeposílat data na základě MAC adresy." },
                        { term: "Funkce", definition: "Operuje na 2. vrstvě (linková). Efektivní směrování paketů, minimalizace kolizí." },
                        { term: "Použití", definition: "Větší sítě vyžadující efektivní směrování dat." }
                    ]
                },
                {
                    title: "Router (směrovač)",
                    items: [
                        { term: "Konstrukce", definition: "Zařízení propojující různé síťové segmenty na základě IP adres." },
                        { term: "Funkce", definition: "Operuje na 3. vrstvě (síťová). Směruje pakety mezi podsíťemi." },
                        { term: "Použití", definition: "Propojení LAN s internetem nebo mezi částmi firemních sítí." }
                    ]
                },
                {
                    title: "Firewall",
                    items: [
                        { term: "Konstrukce", definition: "Software nebo hardware filtrující síťovou komunikaci podle bezpečnostních pravidel." },
                        { term: "Funkce", definition: "Ochrana sítě před neoprávněným přístupem." },
                        { term: "Použití", definition: "Ochrana firemních sítí, domácích sítí, datových center." }
                    ]
                },
                {
                    title: "Bridge (most)",
                    items: [
                        { term: "Funkce", definition: "Operuje na 2. vrstvě. Propojuje síťové segmenty a správně předává data." },
                        { term: "Použití", definition: "Segmentace sítě, snížení kolizí, zlepšení výkonu." }
                    ]
                },
                {
                    title: "Modem",
                    items: [
                        { term: "Funkce", definition: "Převádí digitální signály na analogové pro přenos po telefonní lince." },
                        { term: "Použití", definition: "Dial-up připojení, domácí připojení k internetu." }
                    ]
                }
            ]
        },
        {
            title: "Schematické značky CISCO",
            items: [
                { term: "Switch", definition: "Čtvercová ikona s několika porty." },
                { term: "Router", definition: "Čtverec s ikonou směrování nebo trojúhelníkem." },
                { term: "Hub", definition: "Malé zařízení s porty, bez pokročilých funkcí." },
                { term: "Firewall", definition: "Zařízení s ochrannou ikonkou nebo zámkem." },
                { term: "Modem", definition: "Zařízení se dvěma připojeními (počítač + telefonní linka)." }
            ]
        },
        {
            title: "Strukturovaná kabeláž",
            text: "Systematický způsob uspořádání a instalace kabelů pro snadnou údržbu a flexibilitu.",
            subsections: [
                {
                    title: "Komponenty",
                    items: [
                        { term: "Kabely", definition: "Kroucená dvojlinka (UTP), optické vlákno." },
                        { term: "Racks a panely", definition: "Pro uložení síťových zařízení a organizaci připojení." },
                        { term: "Jacks a zásuvky", definition: "Připojení zařízení k síti." },
                        { term: "Patch kabely", definition: "Krátké kabely pro propojení mezi zařízeními a patch panely." }
                    ]
                },
                {
                    title: "Topologie",
                    items: [
                        { term: "Hvězdicová (Star)", definition: "Všechna zařízení připojena k centrálnímu prvku (switch/hub). Nejběžnější pro LAN." },
                        { term: "Sběrnicová (Bus)", definition: "Všechna zařízení připojena k jednomu kabelu. Dnes méně používaná." },
                        { term: "Kruhová (Ring)", definition: "Zařízení propojena do uzavřeného kruhu, data putují jedním směrem." }
                    ]
                },
                {
                    title: "Kategorie kabeláže",
                    items: [
                        { term: "Cat 5e", definition: "Až 1000 Mbps, běžně používaná v místních sítích." },
                        { term: "Cat 6", definition: "Až 10 Gbps na kratší vzdálenosti." },
                        { term: "Cat 6a a Cat 7", definition: "Vyšší rychlosti a šířka pásma pro datacentra." }
                    ]
                },
                {
                    title: "Rack",
                    items: [
                        { term: "Rack mount", definition: "Slouží k montáži síťových zařízení a serverů." },
                        { term: "19\" rack", definition: "Nejběžnější standard, až 42U zařízení (jednotky výšky)." }
                    ]
                }
            ]
        },
        {
            title: "Shrnutí",
            text: "Síťové prvky a strukturovaná kabeláž tvoří nezbytnou součást každé moderní počítačové sítě. Správné použití switchů, routerů, modemů a správný návrh kabeláže zajišťují optimální výkon, efektivitu a bezpečnost sítě."
        }
    ]
};

// Q19 - Ethernet
const q19Content = {
    sections: [
        {
            title: "Historie a vývoj, značení, kabeláž",
            subsections: [
                {
                    title: "Historie a vývoj",
                    text: "Ethernet byl vyvinut v roce 1973 skupinou inženýrů vedenou Robertem Metcalfem ve společnosti Xerox PARC. První verze fungovala na rychlosti 2,94 Mbps. V roce 1980 byl standard IEEE 802.3 oficiálně uznán.",
                    items: [
                        { term: "Ethernet 2", definition: "Rychlost 10 Mbps (10BASE-T)." },
                        { term: "Fast Ethernet (1995)", definition: "Rychlost 100 Mbps (100BASE-TX)." },
                        { term: "Gigabit Ethernet", definition: "Rychlost 1 Gbps (1000BASE-T)." },
                        { term: "10 Gigabit Ethernet", definition: "Rychlost 10 Gbps." }
                    ]
                },
                {
                    title: "Značení Ethernetu",
                    items: [
                        { term: "10BASE-T", definition: "10 Mbps přes kroucenou dvojlinku." },
                        { term: "100BASE-TX", definition: "100 Mbps přes kroucenou dvojlinku." },
                        { term: "1000BASE-T", definition: "1 Gbps přes kroucenou dvojlinku." },
                        { term: "10GBASE-T", definition: "10 Gbps přes kroucenou dvojlinku." },
                        { term: "100BASE-FX", definition: "100 Mbps přes optické vlákno." },
                        { term: "1000BASE-SX", definition: "1 Gbps přes optické vlákno." }
                    ]
                },
                {
                    title: "Kabeláž",
                    items: [
                        { term: "Kroucená dvojlinka (UTP/STP)", definition: "Nejčastější kabeláž, páry vodičů jsou kroucené pro minimalizaci rušení." },
                        { term: "Cat 5e", definition: "Podporuje 1 Gbps." },
                        { term: "Cat 6", definition: "Podporuje až 10 Gbps na kratší vzdálenosti." },
                        { term: "Optické vlákno", definition: "Pro vyšší rychlosti a delší vzdálenosti (100BASE-FX, 1000BASE-SX)." }
                    ]
                }
            ]
        },
        {
            title: "Bloky dat, princip činnosti, řešení kolizí",
            subsections: [
                {
                    title: "Ethernet rámec (Ethernet frame)",
                    items: [
                        { term: "Preámbule", definition: "Synchronizace zařízení na začátku rámce (7 bajtů)." },
                        { term: "Destinační adresa", definition: "MAC adresa příjemce (6 bajtů)." },
                        { term: "Zdrojová adresa", definition: "MAC adresa odesílatele (6 bajtů)." },
                        { term: "Typ/Délka", definition: "Identifikuje protokol vyšší vrstvy nebo velikost dat (2 bajty)." },
                        { term: "Data (Payload)", definition: "Skutečná data (max. 1500 bajtů)." },
                        { term: "FCS", definition: "Kontrolní součet pro detekci chyb (4 bajty)." }
                    ]
                },
                {
                    title: "Princip činnosti",
                    text: "Zařízení používají MAC adresy k identifikaci. Rámce jsou směrovány na základě této adresy. Všechna zařízení sdílejí společný přenosový kanál, dokud není připojen switch."
                },
                {
                    title: "Řešení kolizí - CSMA/CD",
                    items: [
                        { term: "Carrier Sense", definition: "Zařízení 'poslouchá' kanál, zda je volný." },
                        { term: "Multiple Access", definition: "Všechna zařízení mohou přistupovat k médiu." },
                        { term: "Collision Detection", definition: "Při kolizi oba odesílatelé zastaví vysílání a po náhodné prodlevě znovu pošlou data." }
                    ]
                }
            ]
        },
        {
            title: "10/100/1000 Ethernet",
            subsections: [
                {
                    title: "10BASE-T (10 Mbps)",
                    items: [
                        { term: "Popis", definition: "Nejstarší standard, rychlost až 10 Mbps." },
                        { term: "Kabeláž", definition: "Kroucená dvojlinka (Cat 3 nebo Cat 5)." },
                        { term: "Použití", definition: "Menší a starší sítě, dnes zastaralý." }
                    ]
                },
                {
                    title: "100BASE-TX (Fast Ethernet)",
                    items: [
                        { term: "Popis", definition: "Rychlost až 100 Mbps." },
                        { term: "Kabeláž", definition: "Kroucená dvojlinka (Cat 5e nebo vyšší)." },
                        { term: "Použití", definition: "Nejčastěji pro domácí a malé firemní sítě." }
                    ]
                },
                {
                    title: "1000BASE-T (Gigabit Ethernet)",
                    items: [
                        { term: "Popis", definition: "Rychlost až 1 Gbps." },
                        { term: "Kabeláž", definition: "Kroucená dvojlinka (Cat 5e a vyšší)." },
                        { term: "Použití", definition: "Větší sítě, kancelářské budovy, datacentra." }
                    ]
                },
                {
                    title: "Přenos a kódování dat",
                    items: [
                        { term: "Manchester kódování", definition: "Synchronizace hodinového signálu, každý bit reprezentován přechodem." },
                        { term: "4B/5B kódování", definition: "Používá se ve Fast Ethernetu pro lepší signálový poměr." },
                        { term: "PAM-5", definition: "Používá se v Gigabit Ethernetu, 5 různých hodnot signálu." }
                    ]
                }
            ]
        },
        {
            title: "Shrnutí",
            text: "Ethernet je klíčový protokol pro vytváření a správu počítačových sítí. Od původního 10BASE-T až po moderní 10GBASE-T se stal základem pro většinu LAN sítí a umožnil rychlý přenos dat mezi zařízeními."
        }
    ]
};

// Q20 - Bezdrátové síťové technologie
const q20Content = {
    sections: [
        {
            title: "Elektromagnetická vlna a spektrum",
            subsections: [
                {
                    title: "Elektromagnetická vlna",
                    text: "Oscilující elektrická a magnetická pole, která se šíří prostorem a přenášejí energii. Jsou vyzařovány anténami a mohou cestovat vzduchem."
                },
                {
                    title: "Spektrum",
                    items: [
                        { term: "Nízké frekvence (30 Hz - 300 Hz)", definition: "Používají se pro dlouhé vzdálenosti (např. AM rádio)." },
                        { term: "VHF a UHF (30 MHz - 3 GHz)", definition: "Televize, mobilní telefony, Wi-Fi." },
                        { term: "Mikrovlny (1 GHz - 300 GHz)", definition: "Wi-Fi, Bluetooth, satelitní komunikace, radarové systémy." }
                    ]
                }
            ]
        },
        {
            title: "Datové přenosy a základní metody přenosu",
            items: [
                { term: "Frekvenční modulace (FM)", definition: "Přenos informací změnou frekvence nosné vlny." },
                { term: "Amplitudová modulace (AM)", definition: "Mění amplitudu nosné vlny podle přenášených dat." },
                { term: "Fázová modulace (PM)", definition: "Moduluje fázi nosné vlny k přenosu dat." },
                { term: "Digitální modulace (QAM)", definition: "Vyšší datové rychlosti využitím různých amplitud a fází." }
            ]
        },
        {
            title: "Bluetooth",
            subsections: [
                {
                    title: "Účel a parametry",
                    items: [
                        "Bezdrátová technologie pro krátké vzdálenosti (obvykle do 100 m).",
                        { term: "Frekvenční pásmo", definition: "2.4 GHz (ISM pásmo)." },
                        { term: "Přenosová rychlost", definition: "Až 3 Mbps (Bluetooth 5)." },
                        { term: "Rozsah", definition: "Od několika centimetrů po 100 metrů." }
                    ]
                },
                {
                    title: "Princip činnosti",
                    text: "Používá FHSS (Frequency Hopping Spread Spectrum) - data přenášena na různých frekvencích pro minimalizaci rušení."
                },
                {
                    title: "Topologie sítě",
                    items: [
                        { term: "Piconet", definition: "Síť s jedním master zařízením a několika slave zařízeními." },
                        { term: "Scatternet", definition: "Skupina více piconetů propojených mezi sebou." }
                    ]
                }
            ]
        },
        {
            title: "Wi-Fi",
            subsections: [
                {
                    title: "Účel a parametry",
                    items: [
                        "Standard pro bezdrátové LAN (WLAN), připojení k internetu bez kabelů.",
                        { term: "Frekvenční pásmo", definition: "2.4 GHz, 5 GHz, Wi-Fi 6 může využívat 6 GHz." },
                        { term: "Přenosová rychlost", definition: "Wi-Fi 6 až 9.6 Gbps." },
                        { term: "Rozsah", definition: "Kolem 100 m (2.4 GHz), 50 m (5 GHz) v otevřeném prostoru." }
                    ]
                },
                {
                    title: "Princip činnosti",
                    items: [
                        { term: "OFDM", definition: "Orthogonal Frequency Division Multiplexing - rozdělení signálu na více nosných frekvencí." },
                        { term: "802.11a/b/g/n/ac/ax", definition: "Různé verze Wi-Fi standardů s vylepšením rychlosti a pokrytí." },
                        { term: "MIMO", definition: "Multiple Input Multiple Output - více antén pro vyšší rychlost." }
                    ]
                },
                {
                    title: "Topologie a antény",
                    items: [
                        { term: "Topologie", definition: "Hvězdicová - zařízení komunikují přes Access Point (AP)." },
                        { term: "Omnidirekcionální antény", definition: "Vyzařují signál rovnoměrně ve všech směrech." },
                        { term: "Direkcionální antény", definition: "Soustředí signál do konkrétního směru pro větší dosah." }
                    ]
                }
            ]
        },
        {
            title: "Přehled dalších technologií",
            items: [
                { term: "ZigBee", definition: "Nízká spotřeba energie, krátké vzdálenosti. IoT, chytré domácnosti, senzory." },
                { term: "Z-Wave", definition: "Podobné ZigBee, pro chytré domácnosti." },
                { term: "NFC", definition: "Near Field Communication - velmi krátká vzdálenost (do 10 cm). Bezkontaktní platby, připojování." },
                { term: "LoRa", definition: "Long Range - velmi dlouhé vzdálenosti, nízká spotřeba. IoT, senzory na rozsáhlých územích." }
            ]
        },
        {
            title: "Shrnutí",
            text: "Bezdrátové síťové technologie jsou základem moderní komunikace. Bluetooth a Wi-Fi jsou nejběžnější pro osobní a podnikové sítě, ZigBee a LoRa rozšiřují možnosti v IoT. S rostoucí poptávkou se tyto technologie neustále vyvíjejí."
        }
    ]
};

async function main() {
    console.log("Reading questions...");
    const data = JSON.parse(fs.readFileSync(QUESTIONS_PATH, 'utf8'));

    for (const question of data.questions) {
        if (question.id === 17) {
            question.content = q17Content;
            console.log("Updated Q17 - Aplikační vrstva");
        }
        if (question.id === 18) {
            question.content = q18Content;
            console.log("Updated Q18 - Síťové prvky a strukturovaná kabeláž");
        }
        if (question.id === 19) {
            question.content = q19Content;
            console.log("Updated Q19 - Ethernet");
        }
        if (question.id === 20) {
            question.content = q20Content;
            console.log("Updated Q20 - Bezdrátové síťové technologie");
        }
    }

    fs.writeFileSync(QUESTIONS_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log("Saved to it-questions.json");
}

main();
