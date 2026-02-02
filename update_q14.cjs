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
    const q14Index = questions.findIndex(q => q.id === 14);

    if (q14Index === -1) {
        console.error('Q14 not found');
        process.exit(1);
    }

    // New formatted answer (Markdown) based on user's text
    // Transformations:
    // • -> *
    // 1) -> 1.
    // o ->    * (indented bullet)

    const newAnswerQ14 = `## 14. Síťová vrstva modelu ISO/OSI (Network Layer)

### Pozice v modelu ISO/OSI
* Síťová vrstva je 3. vrstvou modelu ISO/OSI

### Funkce:
1. Směrování (Routing) – Určuje nejvhodnější cestu, kterou se data dostanou z jednoho bodu do druhého.
2. Logická adresace – Přiděluje síťové adresy zařízením (IPv4, IPv6).
3. Fragmentace a sestavení paketů – Rozděluje velké bloky dat na malé, tzv. pakety.
4. Detekce a řízení přetížení – Sleduje síťové zatížení a minimalizuje přetížení.
5. Přenos dat mezi různými typy sítí – Zajišťuje kompatibilitu mezi sítěmi s odlišnými technologiemi.

### Adresní prostory IPv4:
* Velikost: IPv4 používá 32bit adresy -> 4,3 miliardy unikátních adres
* Rozdělení: IPv4 je rozdělena do 4 „oktetů“ (8bit bloky) oddělenými tečkami (192.168.1.1)

### Třídy IPv4 adres:
1. Třída A
    * Rozsah: 0.0.0.0 – 127.255.255.255
    * Použití: Velké sítě.
    * Maska sítě: 255.0.0.0 (prefix /8 – první oktet)
2. Třída B
    * Rozsah: 128.0.0.0 – 191.255.255.255
    * Použití: Středně velké sítě.
    * Maska sítě: 255.255.0.0 (prefix /16 – první 2 oktety)
3. Třída C
    * Rozsah: 192.0.0.0 – 223.255.255.255
    * Použití: Malé sítě.
    * Maska sítě: 255.255.255.0 (prefix /24 – první 3 oktety)
4. Třída D
    * Rozsah: 224.0.0.0 – 239.255.255.255
    * Použití: Multicast.
5. Třída E
    * Rozsah: 240.0.0.0 – 255.255.255.255
    * Použití: Experimentální adresy.

### Typy IPv4 adres:
1. Veřejné adresy – Globálně unikátní a směrovatelné na internetu.
2. Soukromé adresy (Lokální sítě)
    * Rozsahy:
        * Třída A: 10.0.0.0 – 10.255.255.255 
        * Třída B: 172.16.0.0 – 172.31.255.255
        * Třída C: 192.168.0.0 – 192.168.255.255
3. Broadcast adresy – používají se pro adresaci všech zařízení v síti (192.168.1.255)
4. Loopback adresy – testovací adresa zařízení (127.0.0.1)

### Maska podsítě (Subnet Mask):
* Funkce: Slouží k rozdělení adresního prostoru na menší podsítě
* Příklad: 255.255.255.0 (první 3 oktety určují síť a poslední určuje hostitele)

### Adresní prostory IPv6:
* Velikost: IPv6 používá 128bit adresy
* Rozdělení: IPv6 je rozdělena na 8 16bitových bloků
* Příklad: 2001:0db8:85a3:0000:0000:8a2e:0370:7334

### Typy IPv6 adres:
1. Unicast – Identifikace 1 zařízení, např 2001::/16
2. Multicast – adresace skupiny zařízení,  Rozsah - FF00::/8
3. Anycast – adresuje nejbližší zařízení ve skupině

### Adresní prostory/bloky IPv6:
1. Globálně unikátní adresy: 2000::/3
2. Link-Local adresy: FE80::/10, pouze pro lokální komunikaci
3. Soukromé adresy: FC00::/7

### Maska podsítě:
* používá se prefix (např. /64), který určuje počet bitů pro síťovou část adresy.

### Bloky Dat (PDU):
* Na síťové vrstvě se přenáší pakety (packets).
* Struktura paketu: 
    1. Hlavička – zdrojová a cílová IP adresa, délka paketu, kontrolní součet
    2. Data – Obsahuje užitečná data přenášená vyššími vrstvami.

### Protokoly:
1. IP (Internet Protocol)
    * Účel: Směrování a doručení paketů
    * Struktura: Hlavička obsahuje IP adresy, verzi, délku a další parametry.
2. ICMP (Internet Control Message Protocol)
    * Účel: Diagnostika a hlášení chyb v síti (např. příkaz ping)
3. ARP (Address Resolution Protocol)
    * Účel: Převod IP adres na MAC adresy.
4. NAT (Network Address Translation):
    * Účel: převádí privátní IP adresy na veřejné.

### Síťové prvky:
1. Router – Směruje pakety mezi sítěmi, analyzuje IP adresy, určuje nejlepší cestu pro přenos dat
2. Firewall – Chrání síť před neoprávněnými přístupy a útoky, filtruje provoz na základě pravidel
3. Gateway (Brána) – Překlad protokolů mezi různými sítěmi.
4. Layer 3 switch – kombinace switch a router, přepíná data na základě IP adres`;

    questions[q14Index].answer = newAnswerQ14;

    // Remove content object if it exists
    if (questions[q14Index].content) {
        delete questions[q14Index].content;
        console.log('Removed content object.');
    }

    // Clear compactContent if it exists (waiting for user input)
    if (questions[q14Index].compactContent) {
        delete questions[q14Index].compactContent;
        console.log('Cleared compactContent.');
    }

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Successfully updated Question 14.');

} catch (err) {
    console.error('Error updating file:', err);
    process.exit(1);
}
