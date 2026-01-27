import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUESTIONS_PATH = path.join(__dirname, '../src/data/it-questions.json');

// Q11 structured content
const q11Content = {
    sections: [
        {
            title: "První počítačové sítě, data/informace, komunikace",
            text: "Počítačové sítě začaly vznikat v 60. letech 20. století, kdy byl vyvinut ARPANET (Advanced Research Projects Agency Network). Cílem bylo propojit počítače různých univerzit a vládních institucí, aby mohly sdílet data a výpočetní výkon. ARPANET byl první sítí založenou na technologii přepojování paketů.",
            items: [
                { term: "Data a informace", definition: "Data jsou základní jednotkou přenosu, zatímco informace je jejich interpretace. Přenos dat vyžaduje protokoly (např. TCP/IP)." },
                { term: "Komunikace", definition: "Síťová komunikace zahrnuje vysílání, přenos a příjem datových paketů. Klíčové faktory: rychlost, spolehlivost a bezpečnost." }
            ]
        },
        {
            title: "Princip činnosti sítí a jejich základní dělení",
            text: "Počítačová síť propojuje zařízení pomocí přenosových médií (kabely, Wi-Fi). Umožňuje sdílení zdrojů, komunikaci a přístup k internetu.",
            subsections: [
                {
                    title: "Podle velikosti",
                    items: [
                        { term: "LAN (Local Area Network)", definition: "Lokální síť, omezená na budovu nebo malou oblast." },
                        { term: "MAN (Metropolitan Area Network)", definition: "Propojuje více LAN v rámci města." },
                        { term: "WAN (Wide Area Network)", definition: "Globální síť, jako je internet." }
                    ]
                },
                {
                    title: "Podle topologie",
                    items: [
                        { term: "Sběrnicová", definition: "Všechna zařízení připojena k jednomu kabelu (sběrnici)." },
                        { term: "Hvězdicová", definition: "Zařízení připojena k centrálnímu bodu (např. switch)." },
                        { term: "Kruhová", definition: "Data se přenášejí v kruhu." }
                    ]
                },
                {
                    title: "Podle řízení přístupu",
                    items: [
                        { term: "Peer-to-peer", definition: "Všechna zařízení jsou rovnocenná." },
                        { term: "Klient-server", definition: "Klienti žádají služby od centrálního serveru." }
                    ]
                }
            ]
        },
        {
            title: "Historie Internetu, organizace a správa",
            subsections: [
                {
                    title: "Historie internetu",
                    items: [
                        { term: "1969", definition: "Vznik ARPANETu." },
                        { term: "1983", definition: "Přechod na protokol TCP/IP, základ moderního internetu." },
                        { term: "1990", definition: "Zánik ARPANETu, internet veřejně dostupný." }
                    ]
                },
                {
                    title: "Organizace a správa",
                    text: "Správa internetu je decentralizovaná. IANA a ICANN spravují adresní prostor a domény."
                },
                {
                    title: "Standardy a architektura",
                    text: "RFC dokumenty definují pravidla a standardy. Internet má hierarchickou strukturu s páteřními sítěmi, ISP a koncovými uživateli."
                }
            ]
        },
        {
            title: "Historické sítě",
            subsections: [
                {
                    title: "ARPANET (1969–1990)", items: [
                        { term: "Charakteristika", definition: "První síť založená na přepojování paketů, vytvořena US Ministerstvem obrany." },
                        { term: "Význam", definition: "Položil základ internetu a koncept přepojování paketů." }
                    ]
                },
                {
                    title: "CYCLADES (1972)", items: [
                        { term: "Inovace", definition: "Koncept end-to-end protokolu pro spolehlivost na koncových zařízeních." },
                        { term: "Význam", definition: "Inspirace pro TCP/IP protokol." }
                    ]
                },
                {
                    title: "NPL Network (1968)", items: [
                        { term: "Charakteristika", definition: "Projekt britské Národní fyzikální laboratoře (NPL)." },
                        { term: "Význam", definition: "Testovací prostředí pro rané síťové technologie." }
                    ]
                },
                {
                    title: "X.25 (1970s)", items: [
                        { term: "Charakteristika", definition: "Mezinárodní standard pro přepojování paketů." },
                        { term: "Použití", definition: "Finanční instituce a telekomunikace. Základ pro Frame Relay." }
                    ]
                },
                {
                    title: "USENET (1979)", items: [
                        { term: "Charakteristika", definition: "Distribuovaná síť pro diskusní skupiny (newsgroups)." },
                        { term: "Význam", definition: "Předchůdce moderních fór a e-mailových skupin." }
                    ]
                },
                {
                    title: "BITNET (1981)", items: [
                        { term: "Charakteristika", definition: "Síť propojující univerzity a akademické instituce." },
                        { term: "Význam", definition: "Podpora spolupráce a sdílení informací." }
                    ]
                },
                {
                    title: "FidoNet (1984)", items: [
                        { term: "Charakteristika", definition: "Amatérská síť pro BBS (Bulletin Board System)." },
                        { term: "Význam", definition: "Umožnila komunitám komunikovat před rozšířením internetu." }
                    ]
                },
                {
                    title: "NSFNET (1986–1995)", items: [
                        { term: "Charakteristika", definition: "Akademická síť NSF, páteřní síť internetu založená na TCP/IP." },
                        { term: "Význam", definition: "Položila základy dnešní internetové infrastruktury." }
                    ]
                },
                {
                    title: "EUNET (1982)", items: [
                        { term: "Charakteristika", definition: "Evropská síť propojující akademické instituce." },
                        { term: "Význam", definition: "První evropská síť umožňující komunikaci přes hranice." }
                    ]
                },
                {
                    title: "MILNET (1983)", items: [
                        { term: "Charakteristika", definition: "Vojenská část ARPANETu oddělená kvůli bezpečnosti." },
                        { term: "Význam", definition: "Zabezpečená vojenská síť pro strategické operace." }
                    ]
                }
            ]
        },
        {
            title: "Shrnutí",
            numberedItems: [
                "ARPANET ukázal koncept přepojování paketů.",
                "CYCLADES zdůraznil end-to-end komunikaci.",
                "X.25 vytvořil základ pro komerční datové sítě.",
                "USENET a BITNET podpořily akademickou spolupráci.",
                "NSFNET transformoval akademické sítě na globální internet."
            ]
        }
    ]
};

// Q13 structured content
const q13Content = {
    sections: [
        {
            title: "Pozice vrstvy v modelech, funkce",
            subsections: [
                {
                    title: "Pozice",
                    items: [
                        "Linková vrstva je druhá vrstva v modelu ISO/OSI.",
                        "Nachází se nad fyzickou vrstvou a pod síťovou vrstvou.",
                        "Přemosťuje rozdíly mezi fyzickými médii a vyššími vrstvami."
                    ]
                },
                {
                    title: "Funkce",
                    items: [
                        { term: "Rámcování (Framing)", definition: "Rozděluje data na bloky zvané rámce. Přidává hlavičku a koncový kód." },
                        { term: "Řízení přístupu k médiu (MAC)", definition: "Zajišťuje přístup k přenosovému médiu bez konfliktů." },
                        { term: "Detekce chyb", definition: "Identifikuje chyby při přenosu pomocí CRC (Cyclic Redundancy Check)." },
                        { term: "Řízení toku dat", definition: "Zabraňuje zahlcení zařízení rychlým přenosem dat." },
                        { term: "Adresace", definition: "Používá fyzické adresy (MAC adresy) k identifikaci zařízení." }
                    ]
                }
            ]
        },
        {
            title: "Propojení síťových prvků, kabeláž, protokoly",
            subsections: [
                {
                    title: "Propojení síťových prvků",
                    items: [
                        { term: "Switche", definition: "Přeposílají rámce mezi zařízeními na základě MAC adres." },
                        { term: "Bridge (Mosty)", definition: "Propojují dvě nebo více sítí na úrovni linkové vrstvy." },
                        { term: "Access Pointy (AP)", definition: "Umožňují bezdrátová zařízení připojit k síti." }
                    ]
                },
                {
                    title: "Kabeláž",
                    items: [
                        { term: "Kroucená dvojlinka", definition: "Nejčastěji používaná pro Ethernet." },
                        { term: "Koaxiální kabel", definition: "Používán v starších sítích." },
                        { term: "Optické vlákno", definition: "Pro vysokorychlostní přenosy a dlouhé vzdálenosti." }
                    ]
                },
                {
                    title: "Protokoly",
                    items: [
                        { term: "Ethernet", definition: "Standardizuje přenosové technologie v LAN." },
                        { term: "PPP", definition: "Point-to-Point Protocol pro přímé připojení mezi dvěma zařízeními." },
                        { term: "HDLC", definition: "Protokol pro sériové linky." },
                        { term: "Wi-Fi (IEEE 802.11)", definition: "Bezdrátové připojení." }
                    ]
                }
            ]
        },
        {
            title: "Podvrstvy linkové vrstvy",
            subsections: [
                {
                    title: "MAC (Media Access Control)",
                    text: "Spravuje přístup k fyzickému médiu a definuje, jak data vstupují na přenosové médium.",
                    items: [
                        { term: "Fyzická adresace", definition: "Používá MAC adresy (48bitové)." },
                        { term: "Řízení kolizí", definition: "V sítích jako Ethernet (např. metoda CSMA/CD)." },
                        "Přenos dat mezi zařízeními na stejné síti."
                    ]
                },
                {
                    title: "LLC (Logical Link Control)",
                    text: "Poskytuje rozhraní mezi linkovou vrstvou a vyššími vrstvami.",
                    items: [
                        { term: "Multiplexování", definition: "Umožňuje více protokolům sdílet stejný fyzický kanál." },
                        { term: "Detekce chyb", definition: "Používá kontrolní součty pro zajištění integrity dat." }
                    ]
                }
            ]
        },
        {
            title: "Adresy/adresace, přístupové metody",
            subsections: [
                {
                    title: "MAC adresa",
                    text: "Unikátní identifikátor síťového zařízení. 48bitová adresa rozdělená na OUI (Organizationally Unique Identifier) a NIC (Network Interface Controller). Používá se pro směrování rámců v LAN."
                },
                {
                    title: "Přístupové metody",
                    items: [
                        { term: "CSMA/CD", definition: "Carrier Sense Multiple Access with Collision Detection - používá se v Ethernetu. Zařízení naslouchají na médiu a v případě kolize přenos opakují." },
                        { term: "CSMA/CA", definition: "Collision Avoidance - používá se v Wi-Fi. Zařízení rezervuje médium před odesláním dat." },
                        { term: "Token Passing", definition: "Používá se v Token Ring. Token je speciální rámec potřebný pro zahájení přenosu." }
                    ]
                }
            ]
        },
        {
            title: "Síťové prvky a jejich funkce",
            items: [
                { term: "Switch", definition: "Přeposílá rámce na základě MAC adres. Minimalizuje kolize." },
                { term: "Bridge (Most)", definition: "Propojuje různé segmenty sítě. Filtruje data na základě MAC adres." },
                { term: "Access Point", definition: "Propojuje bezdrátová zařízení s kabelovou sítí." },
                { term: "NIC (Síťová karta)", definition: "Zprostředkovává komunikaci mezi počítačem a sítí. Obsahuje MAC adresu zařízení." }
            ]
        },
        {
            title: "Shrnutí",
            text: "Linková vrstva zajišťuje přenos dat mezi zařízeními v lokální síti a správu přístupu k přenosovému médiu. Klíčové koncepty: rámce, MAC adresy, přístupové metody a protokoly (Ethernet, Wi-Fi). Dělení na podvrstvy (MAC a LLC) umožňuje správu fyzického přístupu i řízení komunikace."
        }
    ]
};

async function main() {
    console.log("Reading questions...");
    const data = JSON.parse(fs.readFileSync(QUESTIONS_PATH, 'utf8'));

    for (const question of data.questions) {
        if (question.id === 11) {
            question.content = q11Content;
            console.log("Updated Q11");
        }
        if (question.id === 13) {
            question.content = q13Content;
            console.log("Updated Q13");
        }
    }

    fs.writeFileSync(QUESTIONS_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log("Saved to it-questions.json");
}

main();
