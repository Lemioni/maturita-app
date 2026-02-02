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
    const q18Index = questions.findIndex(q => q.id === 18);

    if (q18Index === -1) {
        console.error('Q18 not found');
        process.exit(1);
    }

    // New formatted answer (Markdown) for Q18
    const newAnswerQ18 = `## 18. Síťové prvky modelu ISO/OSI a strukturovaná kabeláž

### Síťové Prvky
* Dělí se podle role v síti a funkce, kterou plní při přenosu a směrování dat:

### Režimová zařízení
1. Hub (rozdělovač):
    * Konstrukce: Jednoduché zařízení, skládá se z jednoho centrálního rozbočovače. Porty propojeny na centrální sběrnici.
    * Funkce: Propojení zařízení v síti. Data, která přijdou na jeden port jsou vysílána na všechny ostatní porty.
    * Použití: Menší, nezabezpečené sítě, kde není nutné řídit přístup podle adres.
2. Switch (přepínač):
    * Konstrukce: Obsahuje porty, jsou schopny přijímat a přeposílat data podle MAC adres.
    * Funkce: Pracuje na druhé vrstvě ISO/OSI. Efektivně směruje rámce mezi zařízeními v síti, zvyšuje výkon sítě.
    * Použití: Pro větší sítě, kde je třeba efektivně směrovat data a minimalizovat kolize.
3. Router (směrovač):
    * Konstrukce: Propojuje síťové segmenty a směruje pakety mezi nimi základě IP adres.
    * Funkce: Pracuje na třetí vrstvě modelu ISO/OSI. Směruje pakety mezi podsítěmi či sítěmi.
    * Použití: Propojení lokálních sítí s internetem či různými částmi sítí.
4. Firewall:
    * Konstrukce: Software či hardware zařízení, filtruje síťovou komunikaci podle bezpečnostních pravidel.
    * Funkce: K ochraně sítě před neoprávněným přístupem a zajištění bezpečnosti.
    * Použití: Ochrana sítě před vnějšími hrozbami, např. firemní sítě, domácí sítě, datové centra
5. Bridge:
    * Konstrukce: Propojuje dvě či více síťových segmentů a zajišťuje správný přenos.
    * Funkce: Pracuje na linkové vrstvě ISO/OSI, zajišťuje efektivní rozdělení a správu provozu v síti.
    * Použití: Segmantace sítě, snížení kolizí, zlepšení výkonu sítě.

### Schématické značky CISCO:
1. Switch (Přepínač): Čtvercová ikona s porty.
2. Router (Směrovač): Čtverec s ikonou směrování či trojúhelník co značí síť.
3. Hub (Rozbočovač): Malé zařízení s několika porty, bez pokročilých směrovacích funkcí.
4. Firewall: Zařízení s ochranou ikonkou či zámkem.
5. Modem: Zařízení s dvěma připojeními – 1 pro PC a druhé pro telefonní linku.

### Strukturovaná kabeláž:
* Definice: Způsob a uspořádání a instalace kabelů, umožňuje snadnou údržbu, flexibilitu a správu sítě.

### Komponenty strukturované kabeláže:
1. Kabely – Používají se různé typy podle potřeby, např kroucená dvojlinka či optické vlákno
2. Racks – Pro uložení síťových zařízení.
3. Panely - Organizace připojení.
4. Jacks a zásuvky – Připojení zařízení k síti. Jsou součástí kabeláže co spojuje zařízení s aktivními síťovými prvky.
5. Patch kabely – Krátké kabely, jsou na propojení mezi zařízenímí a patch panely či mezi panely a racky.

### Topologie:
1. Hvězdicová – Všechna zařízení připojena k centrálnímu síťovému prvku (Switch či hub), topologie pro místní sítě.
2. Sběrnicová – Zařízení připojena k jedinému kabelu (sběrnici), méně používaná, v minulosti běžná v ethernet sítích.
3. Kruhová – Zařízení propojena do kruhu, data putují jedním směrem kolem sítě.

### Kategorie kabeláže:
1. Cat 5e (Category 5 Enhanced) – Rychlost až 1000 Mbps, používána v místních sítích.
2. Cat 6 – Vylepšená verze, podporuje rychlosti až 10 Gbps na kratší vzdálenosti.
3. Cat 6a a Cat 7 – Vyšší přenosové rychlosti a větší šířka pásma pro datacentra a profesionální aplikace.

### Rack:
1. Rack Mount – Slouží k montáži síťových zařízení a serverů. Správně splňuje standardy pro správné umístění zařízení, chlazení a správu kabeláže.
2. 19" rack: Nejběžnější standard pro umístění síťových zařízení a serverů. V tomto racku je možné umístit až 42U zařízení (jednotky výšky).`;

    questions[q18Index].answer = newAnswerQ18;

    // Remove legacy fields
    if (questions[q18Index].content) delete questions[q18Index].content;
    if (questions[q18Index].compactContent) delete questions[q18Index].compactContent;

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated Question 18.');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
