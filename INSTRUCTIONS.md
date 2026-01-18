# Návod pro přidávání obsahu do aplikace

Tento dokument popisuje, jak přidávat nové otázky, odpovědi a flashcards do tvé maturitní aplikace.

## Jak přidat odpověď k otázce

### 1. Najdi soubor s otázkami
Otevři soubor: `src/data/it-questions.json`

### 2. Najdi svou otázku
Otázky jsou seřazené podle ID (1-47). Najdi otázku, ke které chceš přidat odpověď.

### 3. Vlož odpověď do pole `answer`
Odpověď může obsahovat **speciální formátování**, které se automaticky převede na hezký vzhled:

#### **Tabulky** - použij `|` pro oddělení sloupců:
```
"answer": "Základní typy kabelů:\n\n| Typ | Popis | Rychlost |\n| UTP | Nestíněný kroucený pár | 1 Gbps |\n| STP | Stíněný kroucený pár | 10 Gbps |"
```

#### **Nadpisy** - číslované sekce:
```
"answer": "1. Hardware\nPopis hardware...\n\n2. Software\nPopis software..."
```

#### **Seznamy** - použij `•` nebo `-` na začátku řádku:
```
"answer": "Výhody:\n• Rychlost\n• Spolehlivost\n• Nízká cena"
```

#### **Tučný text** - obal text pomocí `**`:
```
"answer": "Důležité: **UTP kabel** je nestíněný."
```

### 4. Kompletní příklad otázky s odpovědí:

```json
{
  "id": 12,
  "question": "Fyzická vrstva modelu ISO/OSI",
  "answer": "Fyzická vrstva se zabývá přenosem bitů po fyzickém médiu.\n\n**Základní komponenty:**\n\n| Komponenta | Popis | Příklad |\n| Kabely | Přenosové médium | UTP, optika |\n| Konektory | Připojovací body | RJ-45, SC |\n| Repeater | Zesiluje signál | Hub |\n\n**Typy přenosu:**\n• Simplex - jednosměrný\n• Half-duplex - obousměrný střídavě\n• Full-duplex - obousměrný současně",
  "category": "Počítačové sítě",
  "difficulty": "medium",
  "exam": "IKT1",
  "keywords": ["fyzická vrstva", "ISO/OSI", "kabely", "UTP"]
}
```

## Jak vytvořit flashcards pro otázku

### 1. Najdi soubor s flashcards
Otevři soubor: `src/data/flashcards-data.json`

### 2. Přidej nové flashcards
Každá flashcard má:
- `id` - unikátní číslo (např. "fc-12-1", "fc-12-2" pro otázku #12)
- `questionId` - ID rodičovské otázky (např. 12)
- `front` - krátká otázka (micro-topic)
- `back` - krátká odpověď

### 3. Příklad flashcards pro otázku #12:

```json
{
  "flashcards": [
    {
      "id": "fc-12-1",
      "questionId": 12,
      "front": "Co je UTP kabel?",
      "back": "Unshielded Twisted Pair - nestíněný kroucený pár. Obsahuje 8 vodičů uspořádaných do 4 párů. Nejběžnější typ síťového kabelu."
    },
    {
      "id": "fc-12-2",
      "questionId": 12,
      "front": "Co dělá Repeater?",
      "back": "Repeater zesiluje signál a prodlužuje dosah sítě. Pracuje na fyzické vrstvě modelu ISO/OSI."
    },
    {
      "id": "fc-12-3",
      "questionId": 12,
      "front": "Rozdíl mezi Full-duplex a Half-duplex?",
      "back": "Full-duplex: obousměrná komunikace současně.\nHalf-duplex: obousměrná komunikace střídavě (ne současně)."
    }
  ]
}
```

## Tipy pro tvorbu flashcards

1. **Krátké otázky** - každá flashcard = 1 micro-topic
2. **Konkrétní** - neptej se obecně, ale na specifický detail
3. **Jasná odpověď** - odpověď by měla být 1-3 věty
4. **Propojené** - flashcards společně pokrývají celou otázku

### Špatný příklad:
```json
{
  "front": "Vysvětli fyzickou vrstvu ISO/OSI",
  "back": "Celá dlouhá odpověď..."
}
```

### Dobrý příklad:
```json
{
  "front": "Co je to Manchester encoding?",
  "back": "Kódování, kde se bit kóduje změnou napětí uprostřed bitového intervalu. Používá se v Ethernetu 10BASE-T."
}
```

## Formát pro kategorie a obtížnost

### Kategorie (musí být jedna z těchto):
- "Hardware"
- "Operační systémy"
- "Počítačové sítě"
- "Programování"
- "Databáze"
- "Web"
- "Bezpečnost"

### Obtížnost (musí být jedna z těchto):
- "easy" (snadná)
- "medium" (střední)
- "hard" (těžká)

### Zkouška (musí být jedna z těchto):
- "IKT1" - Hardware, OS, Sítě
- "IKT2" - Programování, DB, Web

## Kontrola před uložením

1. **JSON syntax** - zkontroluj, že:
   - Všechny řetězce jsou v uvozovkách `"text"`
   - Za každým prvkem je čárka (kromě posledního)
   - Všechny závorky jsou správně uzavřené `{}` a `[]`

2. **Speciální znaky**:
   - Nový řádek: `\n`
   - Uvozovky v textu: `\"`
   - Zpětné lomítko: `\\`

3. **Validace** - použij online JSON validator:
   https://jsonlint.com/

## Deployment na Netlify

Po přidání nových odpovědí nebo flashcards:

```bash
git add .
git commit -m "Přidány odpovědi a flashcards pro otázky X, Y, Z"
git push
```

Netlify automaticky nasadí změny do produkce (zabere 1-2 minuty).

## Příklad kompletního workflow

1. Otevřu `src/data/it-questions.json`
2. Najdu otázku #15
3. Přidám formátovanou odpověď s tabulkami a seznamy
4. Uložím soubor
5. Otevřu `src/data/flashcards-data.json`
6. Vytvořím 5-10 micro-topic flashcards pro otázku #15
7. Uložím soubor
8. Zkontroluju JSON syntax na jsonlint.com
9. Spustím lokálně: `npm run dev`
10. Zkontroluju, že vše funguje
11. Commitnu a pushnu:
```bash
git add .
git commit -m "Přidána odpověď a flashcards pro otázku #15 - Databáze"
git push
```

---

**Potřebuješ pomoct?** Vytvoř Issue na GitHubu nebo se zeptej tvého asistenta.
