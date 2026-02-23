const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/data/it-questions.json', 'utf8'));

const q19 = data.questions.find(x => x.id === 19);
const q20 = data.questions.find(x => x.id === 20);

q19.answer = `## Ethernet

Ethernet je nejrozšířenější standard pro lokální sítě (LAN). Definuje způsob komunikace zařízení přes sdílené médium pomocí MAC adres a rámců dat.

## Historie a vývoj

- **1973** – Robert Metcalfe (Xerox PARC) vytvořil první Ethernet (2,94 Mbps)
- **1980** – Standard **IEEE 802.3** – oficiální uznání jako LAN standard
- **Ethernet 2** – 10 Mbps (10BASE-T), rozšíření na velké množství zařízení
- **Fast Ethernet (1995)** – 100BASE-TX, 100 Mbps
- **Gigabit Ethernet** – 1000BASE-T, 1 Gbps
- **10 Gigabit Ethernet** – 10GBASE-T, 10 Gbps

## Značení standardů

Formát: **rychlost + BASE + médium** (např. 1000BASE-T = 1000 Mbps, přes kroucenou dvojlinku)

- **10BASE-T** – 10 Mbps, kroucená dvojlinka
- **100BASE-TX** – 100 Mbps, kroucená dvojlinka
- **1000BASE-T** – 1 Gbps, kroucená dvojlinka
- **10GBASE-T** – 10 Gbps, kroucená dvojlinka
- **100BASE-FX** – 100 Mbps, optické vlákno
- **1000BASE-SX** – 1 Gbps, optické vlákno (krátká vzdálenost)

## Kabeláž

- **Kroucená dvojlinka (UTP/STP)** – nejčastější typ pro Ethernet
  - **Cat 5e** – podporuje až 1 Gbps
  - **Cat 6** – podporuje až 10 Gbps (kratší vzdálenosti)
  - **Cat 6a** – 10 Gbps na delší vzdálenosti
- **Optické vlákno** – pro vyšší rychlosti a delší vzdálenosti (100BASE-FX, 1000BASE-SX)

## Ethernet rámec (blok dat)

Každý přenos probíhá v rámcích. Struktura rámce:

- **Preámbule** (7 B) – synchronizace na začátku rámce
- **Destinační MAC adresa** (6 B) – adresa příjemce
- **Zdrojová MAC adresa** (6 B) – adresa odesílatele
- **Typ / Délka** (2 B) – protokol vyšší vrstvy (IP, ARP…)
- **Data / Payload** (až 1500 B) – skutečně přenášená data
- **FCS – Kontrolní součet** (4 B) – detekce chyb

## Princip činnosti a CSMA/CD

Ethernet používá **CSMA/CD** (Carrier Sense Multiple Access with Collision Detection):

1. **Carrier Sense** – zařízení naslouchá, zda je kanál volný
2. **Multiple Access** – všechna zařízení sdílejí společné médium
3. **Collision Detection** – při kolizi obě zařízení přestanou vysílat, počkají náhodnou dobu a vysílají znovu

**Switch** eliminuje kolize – každý port má svou kolizní doménu, data jsou přesměrována jen cílovému zařízení.

## Varianty 10 / 100 / 1000 Ethernet

### 10BASE-T (10 Mbps)
- Nejstarší standard, dnes zastaralý
- Kabeláž: Cat 3 nebo Cat 5

### 100BASE-TX – Fast Ethernet (100 Mbps)
- Nejčastější standard pro domácnosti a malé firmy
- Kabeláž: Cat 5e nebo vyšší

### 1000BASE-T – Gigabit Ethernet (1 Gbps)
- Nejrozšířenější pro moderní LAN (kanceláře, datacentra)
- Kabeláž: Cat 5e a vyšší

### 10GBASE-T (10 Gbps)
- Datová centra a páteřní sítě
- Kabeláž: Cat 6a

## Kódování a přenos dat

- **Manchester kódování** – každý bit = přechod signálu, zajišťuje synchronizaci (10BASE-T)
- **4B/5B kódování** – Fast Ethernet (100BASE-TX), lepší signál, snížení chybovosti
- **PAM-5** – Gigabit Ethernet, 5 úrovní amplitudy přes 4 páry vodičů`;

q20.answer = `## Bezdrátové síťové technologie

Bezdrátové sítě přenášejí data pomocí elektromagnetických vln bez fyzického kabelu. Využívají se v domácnostech, firmách, mobilních sítích i IoT zařízeních.

## Elektromagnetické spektrum

Elektromagnetické vlny se dělí do pásem podle frekvence:

- **30 Hz – 300 Hz** – velmi nízké frekvence, AM rádio, dlouhé vzdálenosti
- **30 MHz – 3 GHz (VHF/UHF)** – televize, mobilní sítě, Wi-Fi
- **1 GHz – 300 GHz (mikrovlny)** – Wi-Fi, Bluetooth, satelity, radar

Každé pásmo má jiné vlastnosti při průchodu materiálem, dosah a přenosovou kapacitu.

## Metody modulace

- **AM (Amplitudová modulace)** – mění amplitudu nosné vlny podle přenášených dat
- **FM (Frekvenční modulace)** – mění frekvenci nosné vlny
- **PM (Fázová modulace)** – mění fázi nosné vlny
- **QAM (Quadrature Amplitude Modulation)** – kombinuje amplitudu i fázi, vysoké přenosové rychlosti (Wi-Fi)

## Bluetooth

**Účel:** Krátká vzdálenost, propojení osobních zařízení – sluchátka, klávesnice, myš, telefony (PAN – Personal Area Network)

- **Frekvenční pásmo:** 2,4 GHz (ISM – volně dostupné pásmo)
- **Přenosová rychlost:** až 3 Mbps (Bluetooth 5: až 50 Mbps)
- **Rozsah:** 1–100 m (závisí na verzi a výkonu)
- **Modulace:** **FHSS** (Frequency Hopping Spread Spectrum) – přenos skáče mezi frekvencemi, odolnost vůči rušení a bezpečnost

### Topologie Bluetooth sítě

- **Piconet** – 1 master zařízení + až 7 aktivních slave zařízení
- **Scatternet** – propojení více piconetů dohromady

## Wi-Fi (IEEE 802.11)

**Účel:** Bezdrátová lokální síť (WLAN), přístup k internetu bez kabelů – domácnosti, kanceláře, veřejná místa.

### Standardy Wi-Fi

- **802.11b** – 11 Mbps, 2,4 GHz
- **802.11g** – 54 Mbps, 2,4 GHz
- **802.11n (Wi-Fi 4)** – 600 Mbps, 2,4 / 5 GHz
- **802.11ac (Wi-Fi 5)** – 3,5 Gbps, 5 GHz
- **802.11ax (Wi-Fi 6)** – 9,6 Gbps, 2,4 / 5 / 6 GHz

### Klíčové technologie

- **OFDM** (Orthogonal Frequency Division Multiplexing) – signál rozdělen na více nosných frekvencí, vyšší rychlost a odolnost vůči rušení
- **MIMO** (Multiple Input Multiple Output) – více antén současně, větší kapacita a rychlost
- **Topologie:** hvězdicová – klienti komunikují přes **Access Point (AP)**, který je připojen k routeru

### Antény

- **Omnidirekcionální** – vyzařují signál rovnoměrně do všech směrů
- **Direkcionální** – soustředí signál do jednoho směru, větší dosah v dané oblasti

## Další bezdrátové technologie

- **ZigBee** – nízká spotřeba, krátká vzdálenost (10–100 m), IoT senzory a chytré domácnosti
- **Z-Wave** – podobné ZigBee, chytré domácnosti a automatizace (~30 m)
- **NFC** (Near Field Communication) – vzdálenost do 10 cm, bezkontaktní platby a přihlašování
- **LoRa** (Long Range) – velmi dlouhé vzdálenosti (km) při nízké spotřebě, monitoring IoT zařízení`;

fs.writeFileSync('./src/data/it-questions.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Done – Q19 and Q20 updated');
