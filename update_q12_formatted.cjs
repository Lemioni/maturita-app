const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/it-questions.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    let db = JSON.parse(data);

    // Ensure db.questions exists and is an array
    if (!db.questions || !Array.isArray(db.questions)) {
        console.error('structure of it-questions.json is incorrect');
        process.exit(1);
    }

    const { questions } = db;
    const q12Index = questions.findIndex(q => q.id === 12);

    if (q12Index === -1) {
        console.error('Q12 not found');
        process.exit(1);
    }

    // New formatted answer (Markdown) based on user's text
    // "Do what you did for link layer" -> Convert • to * and 1) to 1.
    const newAnswerQ12 = `## 12. Fyzická vrstva modelu ISO/OSI (Physical Layer)

### Pozice v modelu ISO/OSI
* Fyzická vrstva je první a nejnižší vrstva sedmivrstvého modelu ISO/OSI. 
* **Hl. Funkce:** je zodpovědná za přenos dat ve formě signálů mezi síťovými zařízeními.

### Funkce:
1. Převod dat na signály – Tato vrstva převádí digitální data na fyzické signály (elektrické, optické, či rádiové)
2. Definice přenosových médií – Stanovuje, jaké typy kabelů nebo bezdrátových médií budou použity,
3. Synchronizace bitů – Zajišťuje správnou synchronizaci při přenosu dat, aby přijímač vědel kde datový bit začíná a kde končí.
4. Přenosová rychlost – Určuje maximální rychlost přenosu dat v síti
5. Fyzická topologie – Řídí uspořádání připojení mezi zařízenímí (např. hvězda, sběrnice, kruh) – zde lze popsat jednotlivé topologie

### Druhy Kabeláže:
1. Kroucená dvojlinka (Twisted Pair)
    * Složení: Páry měděných vodičů kroucených do spirály, které minimalizují elektromagnetické rušení.
    * A. UTP (Unshielded Twisted Pair): bez stínění, vhodné pro kancelářské a domácí sítě
    * B. STP (Shielded Twisted Pair): S ochranou proti rušení, vhodné pro průmyslové prostředí.
    * Maximální rychlost: až 10 Gbps na krátké vzdálenosti
2. Koaxiální kabel (Coaxial Cable):
    * Složení: Centrální vodič obklopený izolací, stíněním a pláštěm.
    * Použití: Kabelové televize a starší sítě.
    * Výhody: Odolnost proti rušení
    * Nevýhody: Omezená flexibilita.
3. Optické vlákno (Fiber Optic Cable):
    * Přenáší data skrz světelné pulzy.
    * Typy:
        * Single-mode: Přenos na dlouhé vzdálenosti (páteřní sítě)
        * Multi-mode: Kratší vzdálenost, datové centra
    * Výhody: Vysoká přenosová rychlost, nízké zpoždění
    * Nevýhody: Vyšší cena, náročnější instalace.

### Druhy Konektorů:
1. RJ-45
    * Použití: s kroucenou dvojlinkou pro Ethernet
    * Přenosová rychlost: od 10 Mbps do 10 Gbps
2. BNC
    * Použití: s koaxiálním kabelem, CCTV či starší sítě
3. SC, LC, ST
    * Použití: s optickými vlákny, rozdíly v konstrukci a velikosti konektorů

### Vlastnosti přenosových médií:
1. Šírka pásma – Max. kapacita přenosu dat, např. 1 Gbps u měděného kabelu, 100 Gbps u optického vlákna
2. Rušení (EMI/RFI): Elektrická a rádiová interference, která může narušit přenos
3. Vzdálenost: Omezená délkou kabelu (dvoulinka do 100 m, optické vlákno až stovky km)
4. Latence: Doba zpoždení signálu mezi odesláním a přijetím (odezva)

### Typy přenosů:
1. Simplexní
    * Data proudí jedním směrem (např. vysílání rádia)
2. Half-Duplex
    * Data mohou proudit oběma směry, ale ne současně (např. vysílačky)
3. Plný duplex:
    * Obousměrná komunikace v reálném čase (např. telefonní hovory)

### Analogové sítě:
* Přenos: plynulé signály, např. zvuk telefonních hovorů
* Používají amplitudu (výška sinusiody) a frekvenci (na ose x) pro přenos dat

### Digitální sítě:
* Přenos: diskrétní signály (1 a 0)
* Výhody: nižší šum, vyšší spolehlivost

### Kódování:
* Definice: Převod digitálních dat na signály.
* Typy:
    1. NRZ (Non return to Zero): Jednoduché kódování binárních hodnot.
    2. Manchester: Data kódována s vloženými hodinami.

### Modulace:
* Funkce: Přízpůsobuje signál přenosovému médiu:
    1. AM (Amplitudová modulace): Změna amplitudy signálu.
    2. FM (Frekvenční modulace): Změna frekvence signálu.
    3. QAM (Kvadraturní amplitudová modulace): Změny amplitudy a fáze

### Síťové prvky a jejich funkce:
1. Repeater (Opakovač) – Zesiluje signál a prodlužuje dosah sítě.
2. Hub (Rozbočovač) – Přeposílá data všem zařízením v síti bez ohledu na cíl.
3. Switch (Linková vrstva) - Inteligentně přeposílá data pouze cílovému zařízení.
4. Router (Síťová vrstva) – Směruje datové pakety mezi různými sítěmi.
5. Modem – Převádí digitální data na analogový signál a naopak.
6. Přístupový bod (Access Point) – Slouží k propojení bezdrátových zařízení s kabelovou sítí.`;

    questions[q12Index].answer = newAnswerQ12;

    // Remove legacy 'content' object if consistent with Q13 cleanup, 
    // but keep compactContent (user didn't ask to clear it for Q12, unlike Q13)
    if (questions[q12Index].content) {
        delete questions[q12Index].content;
        console.log('Removed legacy Q12 content.');
    }

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated Question 12.');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
