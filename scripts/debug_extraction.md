**Maturitní otázka č. 22 – Indexy a omezení v relačních databázích**

**Úvod**  

- **Indexy** a **omezení (constraints)** jsou důležité nástroje pro správu dat v relačních databázích.  

- Indexy zvyšují **výkonnost dotazů**, omezení zajišťují **integritu a správnost dat**.  

- Obojí je nedílnou součástí návrhu databáze.

**Indexy (INDEX)**  

- **Definice:** Index je speciální datová struktura, která urychluje **vyhledávání** a **třídění** dat v tabulce.  

- **Účel:** Funguje podobně jako rejstřík v knize – místo procházení všech řádků umožňuje rychlý přístup ke konkrétním hodnotám.

**Typy indexů v MySQL:**

<table><tbody><tr><td><p><strong>Typ indexu</strong></p></td><td><p><strong>Popis</strong></p></td></tr><tr><td><p>PRIMARY KEY</p></td><td><p>Hlavní index – jednoznačně identifikuje řádek</p></td></tr><tr><td><p>UNIQUE</p></td><td><p>Zajišťuje unikátnost hodnot ve sloupci</p></td></tr><tr><td><p>INDEX</p></td><td><p>Běžný index pro rychlé hledání</p></td></tr><tr><td><p>FULLTEXT</p></td><td><p>Pro vyhledávání v textu (např. články)</p></td></tr></tbody></table>

_Vytvoření indexu:_

```sql
CREATE INDEX idx_jmeno ON Student(jmeno);
```

_Smazání indexu:_

```sql
DROP INDEX idx_jmeno ON Student;
```

**Automaticky vytvářené indexy:**  

- Primární a unikátní klíče automaticky vytvářejí index.  

- Cizí klíče často také.

**Omezení (Constraints)**

**Účel omezení:**  

- Definují pravidla, která musí být **dodržena při vkládání nebo úpravě dat**.  

- Zajišťují **datovou integritu** a **správnost vztahů** mezi tabulkami.

**Hlavní typy omezení:**

<table><tbody><tr><td><p><strong>Omezení</strong></p></td><td><p><strong>Popis</strong></p></td></tr><tr><td><p>PRIMARY KEY</p></td><td><p>Jedinečný identifikátor záznamu</p></td></tr><tr><td><p>FOREIGN KEY</p></td><td><p>Vztah mezi dvěma tabulkami (referenční integrita)</p></td></tr><tr><td><p>UNIQUE</p></td><td><p>Hodnota ve sloupci musí být jedinečná</p></td></tr><tr><td><p>NOT NULL</p></td><td><p>Sloupec nesmí být prázdný</p></td></tr><tr><td><p>CHECK</p></td><td><p>Hodnota musí splňovat určitou podmínku</p></td></tr><tr><td><p>DEFAULT</p></td><td><p>Výchozí hodnota, pokud není zadána</p></td></tr></tbody></table>

**Příklady omezení v SQL**

**Primární klíč:**

```sql
CREATE TABLE Student (
id INT PRIMARY KEY,
jmeno TEXT
);
```

**Cizí klíč:**

```sql
CREATE TABLE Znamky (
id INT PRIMARY KEY,
student_id INT,
FOREIGN KEY (student_id) REFERENCES Student(id)
);
```

**Unikátní omezení:**

```sql
CREATE TABLE Uzivatel (
id INT PRIMARY KEY,
email TEXT UNIQUE
);
```

**NOT NULL + DEFAULT:**

```sql
CREATE TABLE Produkt (
id INT PRIMARY KEY,
nazev TEXT NOT NULL,
cena DECIMAL(10,2) DEFAULT 0.00
);
```

**CHECK (podmínka):**

```sql
CREATE TABLE Objednavka (
id INT PRIMARY KEY,
mnozstvi INT CHECK (mnozstvi > 0)
);
```

**Shrnutí**

- **Indexy** zrychlují dotazy, ale mohou zpomalit operace zápisu (INSERT, UPDATE).  

- **Omezení** zajišťují, že data v databázi budou **korektní a konzistentní**.  

- Je důležité volit indexy a omezení s ohledem na **výkon a pravidla datového modelu**.  

- Správný návrh indexů a constraintů je klíčem ke kvalitní a bezpečné databázi.