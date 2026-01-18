# Maturitní aplikace - IT + Čeština

Webová aplikace pro přípravu na maturitu z IT a Češtiny.

## 🚀 Funkce

### IT Otázky (47 otázek)
- **3 režimy učení:**
  - Seznam otázek - klasické prohlížení s rozbalením odpovědí
  - Flashcard režim - kartičky s otočením
  - Kvíz režim - testování s vyhodnocením

- **Filtry a organizace:**
  - Podle zkoušky (IKT 1, IKT 2)
  - Podle kategorie (Hardware, Sítě, OS, Programování, DB)
  - Chronologicky (1-47)

- **Progress tracking:**
  - Označování otázek jako "Znám/Neznám"
  - Automatické ukládání pokroku do localStorage

### Čeština
- Připraveno na rozbory knih z milujemecestinu
- Strukturované zobrazení rozborů
- (Čeká na data)

### Další funkce
- **Dashboard** - přehled pokroku
- **Progress tracking** - detailní statistiky, grafy
- **Vyhledávání** - fulltextové vyhledávání (Fuse.js)
- **Responzivní design** - mobil, tablet, desktop
- **LocalStorage** - ukládání pokroku v prohlížeči

## 🛠️ Technologie

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Icons:** React Icons
- **Search:** Fuse.js
- **Data:** JSON soubory + localStorage

## 📦 Instalace a spuštění

```bash
# Instalace dependencies
npm install

# Spuštění dev serveru
npm run dev

# Build pro produkci
npm run build

# Preview produkčního buildu
npm run preview
```

Aplikace poběží na `http://localhost:5173`

## 🌐 Deploy na Vercel

### Varianta 1: Přes Vercel CLI
```bash
# Instalace Vercel CLI (globálně)
npm i -g vercel

# Deploy
vercel

# Produkční deploy
vercel --prod
```

### Varianta 2: Přes GitHub
1. Push projektu do GitHub repository
2. Přihlaš se na [vercel.com](https://vercel.com)
3. Import projektu z GitHubu
4. Vercel automaticky detekuje Vite projekt
5. Klikni "Deploy"

Po deployi dostaneš URL typu: `https://maturita-app.vercel.app`

## 📁 Struktura projektu

```
maturita-app/
├── src/
│   ├── components/
│   │   ├── layout/         # Header, Layout
│   │   ├── it/             # IT otázky komponenty
│   │   ├── cj/             # ČJ komponenty
│   │   └── common/         # Společné komponenty
│   ├── pages/              # Stránky (Home, IT, CJ, Progress, Search)
│   ├── data/
│   │   ├── it-questions.json  # 47 IT otázek
│   │   └── cj-books.json      # Rozbory knih (prázdné)
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Pomocné funkce
├── public/                 # Statické soubory
└── package.json
```

## 🔄 Přidávání materiálů

### IT otázky - přidání odpovědí
Otevři `src/data/it-questions.json` a u každé otázky doplň pole `answer`:

```json
{
  "id": 1,
  "question": "Napájecí zdroje PC...",
  "answer": "Tvoje detailní odpověď zde...",
  ...
}
```

### ČJ - přidání rozborů knih
Otevři `src/data/cj-books.json` a přidej knihy:

```json
{
  "books": [
    {
      "id": 1,
      "title": "Název díla",
      "author": "Autor",
      "genre": "Žánr",
      "literaryPeriod": "Období",
      "analysis": {
        "děj": "...",
        "postavy": [...],
        "téma": "..."
      }
    }
  ]
}
```

## 💾 Data persistence

- Pokrok se ukládá do **localStorage** v prohlížeči
- Klíč: `maturita-progress`
- Data zahrnují: které otázky znáš, kdy naposledy procvičováno, atd.
- Při smazání cache přijdeš o pokrok!

## 🎨 Další vylepšení (TODO)

- [ ] Export/tisk materiálů
- [ ] Tmavý režim
- [ ] Pokročilé statistiky (grafy v čase)
- [ ] Možnost importu/exportu pokroku
- [ ] PWA podpora (offline režim)
- [ ] Spaced repetition algoritmus

## 📝 Poznámky

- Aplikace je připravena na 47 IT otázek (odpovědi je třeba doplnit)
- ČJ sekce čeká na rozbory knih z milujemecestinu
- Flashcard režim je integrován do IT otázek
- Progress se ukládá lokálně v prohlížeči

## 🐛 Problémy?

Pokud narazíš na problém:
1. Zkontroluj konzoli v prohlížeči (F12)
2. Zkus smazat `node_modules` a `package-lock.json` a znovu `npm install`
3. Ujisti se, že máš aktuální verzi Node.js (v18+)

---

Vytvořeno pro přípravu na maturitu 2026 🎓
