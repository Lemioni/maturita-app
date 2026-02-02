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
    const q15Index = questions.findIndex(q => q.id === 15);

    if (q15Index === -1) {
        console.error('Q15 not found');
        process.exit(1);
    }

    // New formatted answer (Markdown) based on user's text for Q15
    const newAnswerQ15 = `## 15. Adresace a směrování v sítích

### Adresace/Směrování
* Základní mechanismy pro komunikaci v počítačových sítích.

### Adresace
* Identifikace zařízení v síti (ID)

### Schéma sítě (PC, Switch, Router) + příklad
1. PC (Personal Computer) – Koncová zařízení, generují a přijímají data, mají svojí unikatní IP adresu a připojují se k síti přes switch či bezdrátově.
2. Switch (Přepínač) – Pracuje na 2. vrstvě modelu ISO/OSI, spojuje zařízení v rámci LAN (Local Area Network) a přepíná data na základě MAC adres.
3. Router (Směrovač) – Pracuje na 3. vrstvě modelu ISO/OSI, propojuje sítě a směruje data mezi nimi pomocí IP adres.

### VLSM Maska (Variable Length Subnet Masking)
* Funkce: Umožňuje použít různě dlouhé masky podsítě v jedné síti.
* Využití: Efektivně využije adresní prostor, přiděluje přesný počet adres pro každou podsíť

### Určení IPv4 adres sítě:
1. Síťová část: Identifikace sítě (např. 192.168.1.0/24)
2. Hostitelská část: Identifikace zařízení v sití.

### Subnetting:
* Funkce: Rozdělení jedné sítě na menší podsítě pomocí masky podsítě.
* Příklad: 192.168.1.0/26 (64 adres, 62 hostitelé) –> 192.168.1.64/26 (64 adres, 62 hosti)
* Použití: V případě že víme, že nenaplníme plnou kapacitu sítě tak můžeme efektivně využít adresní prostor.

### CIDR adresace:
* Funkce: nahrazuje tradiční třídní adresování (A, B, C)
* Použití: pro agregaci adres do větších bloků (supernetting) a dělení na menší (subnetting)
* Zápis: Síťová adresa/prefix (např. 192.168.1.0/24)

### Síťové výpočty:
1. Počet hostitelů:
    * Např. prefix 24: 2^(32−24)−2=2^8−2=256−2=254 hostitelů
2. Rozsah adres:
    * Začíná první adresou sítě (např. 192.168.1.0).
    * Končí broadcast adresou (např. 192.168.1.255).
3. Maska podsítě:
    * /24 = 255.255.255.0, /26 = 255.255.255.192

### Směrování
* umožňuje přenos dat mezi zařízeními ve stejné či odlišné síti

### Druhy směrování:
1. Statické směrování
    * Administrátor ručně nastaví cesty.
    * Výhody: Jednoduché pro malé sítě.
    * Nevýhody: Není flexibilní při změnách v síti.
2. Dynamické směrování
    * Směrovače automaticky upravují směrovací tabulky na základě aktuální topologie.
    * Používají se směrovací protokoly (např. OSPF, RIP)

### Směrovací tabulka:
* Obsah: záznamy o směrech k cílovým sítím.
* Položky:
    1. Cílová síť – Např. 192.168.1.0/24
    2. Maska sítě – Např. 255.255.255.0
    3. Next hop – Adresa následujícího routeru
    4. Metrika – Hodnota určující kvalitu cesty (např. počet skoků)

### Metrika:
* Definice: Parametr používaný k určení nejlepší cesty.
* Typy:
    1. Počet skoků (Hop Count) – Počet routerů, kterými data prochází.
    2. Šířka pásma – Rychlost dostupného spojení.
    3. Zpoždění – Čas potřebný pro přenos dat.

### Směrovací metody:
1. Unicast – Přenos mezi dvěma zařízeními.
2. Multicast – Přenos z jednoho zařízení na skupinu zařízení.
3. Broadcast – Přenos na všechna zařízení v síti.

### Směrovací protokoly:
1. RIP
    * Funkce: Používá metodu „počet skoků“.  
    * Kapacita next hop: 15
    * Výhoda/Nevýhoda: Je jednoduchý ale pomalý.
2. OSPF
    * Protokol typu link-state – vypočítává nejkratší cesty ke všem destinacím pomocí SPF (Shortest Path First)
    * Používá metriky jako šířka pásma.
    * Výhoda: Rychlé a přesné směrování.
3. BGP
    * Použití: autonomní systémy (internet)
    * Klíčový protokol pro globální směrování.
4. EIGRP (Enhanced Interior Gateway Routing Protocol):
    * Protokol vlastněný Ciscem.
    * Rychlejší než RIP, méně náročný než OSPF.`;

    questions[q15Index].answer = newAnswerQ15;

    // cleanup legacy
    if (questions[q15Index].content) delete questions[q15Index].content;
    if (questions[q15Index].compactContent) delete questions[q15Index].compactContent;

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated Question 15.');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
