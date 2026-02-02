const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/it-questions.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    let questions = JSON.parse(data);

    const q13Index = questions.findIndex(q => q.id === 13);

    if (q13Index === -1) {
        console.error('Question 13 not found!');
        process.exit(1);
    }

    // Exact text from user, preserving bullets and numbering styles.
    // Using \n\n to ensure logical line breaks in Markdown rendering without creating lists.
    const newAnswer = `## 13. Linková vrstva modelu ISO/OSI (Data Link Layer)

Pozice v modelu ISO/OSI
•	Linková vrstva je 2. vrstvou modelu ISO/OSI (mezi Fyzickou a Síťovou)
•	Hl. Funkce: zajišťuje spolehlivou komunikaci mezi zařízeními v lokální síti, přebírá data z fyzické vrstvy a organizuje je do rámců.

Funkce:
1)	Rámcování (framing) – Rozděluje data na bloky zvané „rámce“, hlavička a trailer (body).
2)	Řízení přístupu k médiu (MAC) – Zajišťuje zařízením přístup k přenosovému médiu bez konfliktů.
3)	Detekce chyb (Error Detection) – Identifikuje chyby vzniklé při přenosu dat pomocí CRC (kontrolní součet).
4)	Řízení toku dat (Flow Control) – Zabraňuje zahlcení zařízení rychlým přenosem dat.
5)	Adresace – Používá fyzické adresy (MAC adresy) k identifikaci zařízení v síti.

Propojení síťových prvků:
1.	Switche – Přeposílají rámce mezi zařízeními na základě jejich MAC adres.
2.	Bridge (Mosty) – Propojují dvě nebo více sítí na úrovni linkové vrstvy.
3.	Access Pointy (AP) – Umožňují bezdrátové zařízení připojit k síti.

Kabeláž:
1)	Kroucená dvojlinka (Twisted Pair) - Nejčastěji používaná pro Ethernet.
2)	Koaxiální kabel - Používán v starších sítích.
3)	Optické vlákno (Fiber Optic) - Pro vysokorychlostní přenosy a dlouhé vzdálenosti.

Protokoly:
1.	Ethernet – Standardizuje přenosové technologie v LAN.
2.	PPP (Point-to-Point Protocol) – Přímé přepojení mezi dvěma zařízeními.
3.	HDLC – Protokol pro sériové linky.
4.	Wi-Fi (IEEE 802.11) – Bezdrátové připojení.

Podvrstvy:
1.	Podvrstva řízení přístupu k médiu (MAC):
•	Účel – Spravuje přístup k fyzickému médiu a definuje jak data vstupují na přenosové médium.
•	Funkce:
1)	Fyzická adresace (MAC adresy 48bitové)
2)	Řízení Kolizí – V sítích jako Ethernet (např. metoda CSMA/CD)
3)	Přenos dat mezi zařízeními ve stejné (lokální) síti.

2.	Podvrstva řízení logického spoje (Logical Link Control, LLC)
•	Účel – Poskytuje rozhraní mezi linkovou vrstvu a vyššími vrstvami.
•	Funkce:
1)	Multiplexování – Umožňuje více protokolům sdílet stejný fyzický přenosový kanál.
2)	Detekce chyb – Používá kontrolní součty pro zajištění integrity dat.

Adresy/adresace:
•	MAC Adresa (Media Access Control Address):
o	Unikátní identifikátor síť. zařízení, používá se pro směrování rámců v LAN
o	2 části:
1) OUI (prefix) – prvních 24 bitů, např. 00:1A:2B, prefix dán firmou
2) NIC – zbývajících 24 bitů – jedničné čísla přidělená výrobcem

Přístupové metody:
1)	CSMA/CD
o	Použití: Ethernet
o	Funkce: zařízení naslechne médiu, zda je volné a v případě kolize přenos přeruší a opakují.

2)	CSMA/CA
o	Použití: Wi-Fi
o	Funkce: Zabraňuje kolizím tím, že zařízení rezervuje přenosové médium před odesláním dat.

3)	Token Passing:
o	Použití: Sítě jako Token Ring.
o	Token je speciální rámec, který zařízení potřebuje pro zahájení přenosu.

Síťové prvky a jejich funkce:
1.	Switch – Přeposílá rámce na základě MAC adres.
2.	Bridge (Most) – Propojuje různé segmenty sítě a filtruje data na základě MAC adres.
3.	Access Point – Slouží k propojení bezdrátových zařízení s kabelovou sítí.
4.	NIC (Síťová karta) – Zprostředkovává komunikaci mezi počítačem a síťovou infrastrukturou a obsahuje MAC adresu zařízeni.`;

    // Update Answer
    questions[q13Index].answer = newAnswer;

    // Remove content object if it exists
    if (questions[q13Index].content) {
        delete questions[q13Index].content;
    }

    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf8');
    console.log('Successfully updated Question 13 (Strict Mode).');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
