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
    const q17Index = questions.findIndex(q => q.id === 17);

    // If Q17 doesn't exist, we might need to handle it, but assuming it exists based on user request.
    if (q17Index === -1) {
        console.error('Q17 not found');
        process.exit(1);
    }

    // New formatted answer (Markdown) for Q17 (Aplikační vrstva)
    const newAnswerQ17 = `## 17. Aplikační vrstva modelu ISO/OSI

### Pozice v modelu ISO/OSI
* Nachází se na 7. a poslední pozici v modelu ISO/OSI.

### Funkce:
1. Poskytování rozhraní pro aplikace – Poskytuje aplikacím služby pro komunikaci přes síť. Požadavky se zasílají na jiné zařízení či server.
2. Sběr a zpracování dat – Sbírá data a připravuje je na přenos do nižších vrstev, může zahrnovat kódování dat do určitého formátu či šifrování.
3. Řízení komunikace mezi aplikacemi – Zařizuje správné směrování mezi aplikacemi na různých zařízeních v síti.

### DNS Systém:
* Účel: Slouží k překladu doménových jmen na IP adresy.
* Funkce: Umožňuje uživateli připojit se k webovce či jiné službě pomocí lehkého jména místo IP adres.
* Struktura: Používá hierarchickou strukturu domén, nejvyšší úroveň např .com, .org, následuje název domény a případné subdomény.
* Princip komunikace: Zadání doménového jména -> odešle DNS dotaz na DNS server -> vráti odpověď v IP adrese.

### WWW (World Wide Web):
* Účel: Způsob pro vyhledávání a zobrazení dokumentů pomocí prohlížeče, obsah obvykle dostupný ve formátu HTML (HyperText Markup Language).
* Funkce: Webovky jsou hostovány na serverech a jsou přístupné skrz prohlížeč, který používá protokol HTTP / HTTPS
* Protokol a použití: HTTP (HyperText Transfer Protocol) – Je na přenos stránek mezi webovými servery a klienty .

### URL (Uniform Resource Locator):
* Účel: Jedinečný identifikátor pro zdroje na internetu.
* Struktura:
    1. Protokol (HTTP, HTTPS, FTP aj.) – Určuje jaký protokol použijeme při komunikaci.
    2. Doménové jméno (např www.google.com) – Určuje server.
    3. Cesta – Určuje konkrétní soubor/stránku serveru (např. /about)
    4. Porty a parametry (např. ?id=123).

### Základní protokoly:
1. HTTP (HyperText Transfer Protocol)
    * Účel: Přenos hypertextových dokumentů.
    * Funkce: Určuje jak jsou požadavky/odpovědi na serveru zpracovány.
    * Struktura komunikace:
        1. Požadavek – Klient (prohlížeč) odešle požadavek s metodou (GET, POST, PUT, DELETE) a cílovou URL
        2. Odpověď – Server vrací odpověď ve formě HTML dokumentu, obrázků, souborů.
    * Stavové kódy:
        1. 200 OK – Požadavek zpracován úspěšně.
        2. 404 Not Found – Požadavek nenalezen.
        3. 500 Internal Server Error – Chyba na straně serveru.
2. FTP (File Transfer Protocol):
    * Účel: Přenos souborů mezi klientem a serverem.
    * Funkce: Umožňuje uživatelům nahrávat, stahovat, přejmenovávat, mazat soubory na serveru.
    * Struktura: Používá komunikační spojení pro příkazy a pro přenos dat.
    * Princip komunikace: Klient odešle příkaz serveru pro přenos souborů a server vrací odpověď.

### Elektronická pošta:
* Účel: Umožňuje uživatelům odesílat/přijímat zprávy, přílohy mezi zařízeními a uživ. účty, je to rychlý a efektivní způsob jak komunikovat na dálku.
* Protokoly:
    1. SMTP (Simple Mail Transfer Protocol)
        * Účel: Pro odesílání emailů ze serveru na server.
        * Princip: Odesílá zprávy mezi e-mailovými servery.
    2. POP3 (Post Office Protocol 3)
        * Účel: Stahování emailů ze serveru na kleinta.
        * Princip: Kliente si stáhne zprávy na své zařízení a zprávy jsou na serveru smazány (obvykle).
    3. IMAP (Internet Message Access Protocol)
        * Účel: Přístup pro klienta k emailům uloženým na serveru bez stahování.
        * Princip: Uživatel má přístup k emailům na serveru a může je třídit a spravovat.
    * Princip komunikace:
        1. Odesílatel použije SMTP pro odeslání zprávy na e-mailový server.
        2. Server jí doručí na příjemcův server.
        3. Příjemce může stáhnout POP3 či IMAP.
        4. E-mailové klienty komunikují se servery skrz tyto protokoly.`;

    questions[q17Index].answer = newAnswerQ17;

    // Remove content/compactContent
    if (questions[q17Index].content) delete questions[q17Index].content;
    if (questions[q17Index].compactContent) delete questions[q17Index].compactContent;

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated Question 17.');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
