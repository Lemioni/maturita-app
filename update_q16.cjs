const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/it-questions.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    let db = JSON.parse(data);

    if (!db.questions || !Array.isArray(db.questions)) {
        console.error('structure of it-questions.json is incorrect');
        process.exit(1);
    }

    const { questions } = db;
    const q16Index = questions.findIndex(q => q.id === 16);

    if (q16Index === -1) {
        console.error('Q16 not found');
        process.exit(1);
    }

    // New formatted answer (Markdown) based on user's text for Q16 (Transport, Session, Presentation)
    const newAnswerQ16 = `## 16. Transportní, relační a prezentační vrstva modelu ISO/OSI

### Transportní Vrstva (4. vrstva ISO/OSI)
* Pozice: Nachází se mezi síťovou vrstvou (3. vrstva) a relační vrstvou (5. vrstva).
* Funkce:
    1. Spolehlivost – Zajišťuje, že jsou data doručena bez chyb, v pořadí a kompletní.
    2. Segmentace a rekonstrukce – Rozděluje data na segmenty a zajišťuje jejich sprvné sestavení na straně příjemce.
    3. Řízení toku – Zabraňuje zahlcení příjemce daty (flow control).
    4. Detekce a oprava chyb – Identifikuje chyby během přenosu a provádí opakované přenosy.
* Bloky dat (PDU): Data přenášená transportní vrstvou jsou označována jako segmenty.
* Identifikace: Segment obsahuje 3 části.
    1. Čísla portů – Určují, která aplikace na zařízení je zdrojem a cílem dat, např. port 80 pro http, port 443 pro HTTPS.
    2. Sekvenční čísla – Zajišťují doručení dat ve správném pořadí.
    3. Kontrolní součet (checksum) – Slouží k detekci chyb.
* Protokoly:
    1. TCP (Transmission Control Protocol)
        * Účel: Spolehlivý, orientovaný na připojení.
        * Funkce: Potvrzování, řízení toku a sekvenční číslování, detekce a oprava chyb
        * Struktura segmentu TCP: Hlavička obsahuje čísla portů, sekvenční číslo, potvrzovací číslo, kontrolní součet.
    2. UDP (User Datagram Protocol):
        * Účel: Nespojovaný, lehký protokol.
        * Funkce: Rychlý přenos dat bez potvrzování, vhodný pro streaming, online hry
        * Struktura datagramu UDP: Jednodušší hlavička než TCP, zahrnuje pouze čísla portů, délku a kontrolní součet.
* Zabezpečení spolehlivé komunikace:
    1. Potvrzování (ACK) – Odesílatel očekává potvrzení přijetí dat.
    2. Opakovaný přenos – Pokud potvrzení nepřijde, data jsou znovu odeslána.
    3. Kontrola toku – Příjemce reguluje množství dat, která může přijmout.

### Relační vrstva (5. vrstva ISO/OSI)
* Pozice: Nachází se nad transportní vrstvou a pod prezentační vrstvou.
* Funkce: 
    1. Správa relací – Zahájení, udržování a ukončení relací mezi aplikacemi.
    2. Synchronizace – Synchronizační body, umožňují přenosu pokračovat po přerušení.
    3. Řízení komunikace – Určuje, která strana může aktuálně posílat či přijímat data.

### Prezentační Vrstva (6. vrstva ISO/OSI)
* Pozice: Nachází se nad relační vrstvou a pod aplikační vrstvou.
* Funkce:
    1. Kódování a dekódování – Převod mezi různými datovými formáty (ASCII, Unicode).
    2. Komprese dat – Snižuje velikost dat pro rychlejší přenos.
    3. Šifrování a dešifrování – Zvyšuje bezpečnost přenosu.
* Protokoly:
    1. TLS (Transport Layer Security) – Šifruje komunikaci a oveřuje identitu stran.
    2. SSL (Secure Sockets Layer) – Předchůdce TLS, dnes méně používaný.
    3. JPEG, GIF, MP3 – Standardy pro formátování dat (obrázky, audio)
* Tabulky znaků: ASCII, Unicode, EBCDIC
* Bezpečnostní Funkce:
    1. Šifrování dat – Např. algoritmy AES, RSA.
    2. Ochrana integrity – Kontrola, zda se data během přenosu nezměnila.
* Rozšíření elektronické pošty:
    * MIME – Umožňuje posílat ne-textové formáty (obrázky, zvuk)
* Typy kódování:
    1. Base64 – Kódování binárních dat do textového formátu.
    2. Quoted-Printable – Umožňuje přenos znaků mimo ASCII.`;

    questions[q16Index].answer = newAnswerQ16;

    // cleanup legacy content and compactContent (pending user input for short version)
    if (questions[q16Index].content) delete questions[q16Index].content;
    if (questions[q16Index].compactContent) delete questions[q16Index].compactContent;

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated Question 16.');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
