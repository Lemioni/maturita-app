import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { FaDice, FaEye, FaEyeSlash, FaRedo, FaEraser, FaClipboardList, FaBook, FaLaptopCode, FaArrowLeft, FaListUl, FaFileAlt, FaNetworkWired } from 'react-icons/fa';
import MarkdownRenderer from '../components/common/MarkdownRenderer';
import cjBooks from '../data/cj-books.json';
import itQuestions from '../data/it-questions.json';

const STORAGE_KEY = 'exam-practice-session';

// PSI = questions 11–20
const PSI_IDS = new Set([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

// Generate key points from a CJ book for the notepad pre-fill
const generateBookKeyPoints = (book) => {
  const a = book.analysis;
  if (!a) return '';
  const lines = [];
  lines.push(`# ${book.title} – ${book.author}`);
  lines.push('');
  lines.push(`## Základní info`);
  lines.push(`- Autor: `);
  lines.push(`- Žánr: `);
  lines.push(`- Období: `);
  lines.push(`- Rok: `);
  lines.push(`- Literární forma: `);
  lines.push('');
  lines.push(`## Děj`);
  lines.push(`- `);
  lines.push('');
  lines.push(`## Téma`);
  lines.push(`- Hlavní téma: `);
  if (a.themes?.motifs?.length) {
    lines.push(`- Motivy: `);
  }
  lines.push('');
  lines.push(`## Postavy`);
  if (a.characters?.length) {
    a.characters.forEach(c => {
      lines.push(`- ${c.name}: `);
    });
  }
  lines.push('');
  lines.push(`## Prostor a čas`);
  lines.push(`- Místo: `);
  lines.push(`- Čas: `);
  lines.push('');
  lines.push(`## Vypravěč`);
  lines.push(`- `);
  lines.push('');
  lines.push(`## Kompozice`);
  lines.push(`- `);
  lines.push('');
  lines.push(`## Jazykové prostředky`);
  lines.push(`- `);
  lines.push('');
  lines.push(`## Literární kontext`);
  lines.push(`- Směr: `);
  lines.push(`- Další autoři: `);
  lines.push('');
  lines.push(`## Kontext autora`);
  lines.push(`- Další díla: `);
  return lines.join('\n');
};

// Generate key points from IT question headings
const generateITKeyPoints = (question) => {
  const lines = [];
  lines.push(`# ${question.question}`);
  lines.push('');
  const headings = question.answer.split('\n')
    .filter(l => l.trim().startsWith('###') || l.trim().startsWith('## '))
    .map(l => l.replace(/^#{1,4}\s*/, '').trim())
    .filter(h => h.length > 0 && h.length < 120);

  if (headings.length > 0) {
    headings.forEach(h => {
      lines.push(`## ${h}`);
      lines.push(`- `);
      lines.push('');
    });
  } else {
    lines.push('## Hlavní body');
    lines.push('- ');
    lines.push('');
  }
  return lines.join('\n');
};

const ExamPracticePage = () => {
  // Restore saved session from localStorage
  const savedSession = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }, []);

  const [phase, setPhase] = useState(savedSession?.phase || 'select');

  // Selection — sources are multi-select now
  const [sources, setSources] = useState({ it: true, psi: true, cj: true });
  const [selectedITIds, setSelectedITIds] = useState(new Set());
  const [selectedBookIds, setSelectedBookIds] = useState(new Set());
  const [showITPicker, setShowITPicker] = useState(false);
  const [showBookPicker, setShowBookPicker] = useState(false);

  // Practice state — restore from saved session
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    if (!savedSession?.question) return null;
    const q = savedSession.question;
    if (q.type === 'it') {
      const found = itQuestions.questions.find(x => x.id === q.id);
      return found ? { type: 'it', data: found } : null;
    }
    if (q.type === 'cj') {
      const found = cjBooks.books.find(x => x.id === q.id);
      return found ? { type: 'cj', data: found } : null;
    }
    return null;
  });
  const [isRevealed, setIsRevealed] = useState(false);
  const [notepadContent, setNotepadContent] = useState(savedSession?.notepad || '');
  const notepadRef = useRef(null);

  // Auto-save session to localStorage whenever practice state changes
  useEffect(() => {
    if (phase === 'practice' && currentQuestion) {
      const session = {
        phase: 'practice',
        question: {
          type: currentQuestion.type,
          id: currentQuestion.data.id,
        },
        notepad: notepadContent,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }, [phase, currentQuestion, notepadContent]);

  // Clear saved session when going back to select
  const goToSelect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPhase('select');
  }, []);

  const toggleSource = (key) => {
    setSources(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Build question pool
  const pool = useMemo(() => {
    const items = [];
    if (sources.it) {
      // HW questions (1-10) + IKT2 (25-47)
      let qs = itQuestions.questions.filter(q => !PSI_IDS.has(q.id));
      if (selectedITIds.size > 0) {
        qs = qs.filter(q => selectedITIds.has(q.id));
      }
      qs.forEach(q => items.push({ type: 'it', data: q }));
    }
    if (sources.psi) {
      // PSI questions (11-20)
      let qs = itQuestions.questions.filter(q => PSI_IDS.has(q.id));
      if (selectedITIds.size > 0) {
        qs = qs.filter(q => selectedITIds.has(q.id));
      }
      qs.forEach(q => items.push({ type: 'it', data: q }));
    }
    if (sources.cj) {
      let books = cjBooks.books;
      if (selectedBookIds.size > 0) {
        books = books.filter(b => selectedBookIds.has(b.id));
      }
      books.forEach(b => items.push({ type: 'cj', data: b }));
    }
    return items;
  }, [sources, selectedITIds, selectedBookIds]);

  // Draw random question
  const draw = useCallback(() => {
    if (pool.length === 0) return;
    const item = pool[Math.floor(Math.random() * pool.length)];
    setCurrentQuestion(item);
    setIsRevealed(false);
    setNotepadContent('');
    setPhase('practice');
  }, [pool]);

  // Pre-fill notepad with skeleton
  const prefillNotepad = useCallback(() => {
    if (!currentQuestion) return;
    if (currentQuestion.type === 'cj') {
      setNotepadContent(generateBookKeyPoints(currentQuestion.data));
    } else {
      setNotepadContent(generateITKeyPoints(currentQuestion.data));
    }
    setTimeout(() => notepadRef.current?.focus(), 100);
  }, [currentQuestion]);

  // Get material content for right panel
  const getMaterialContent = () => {
    if (!currentQuestion) return '';
    if (currentQuestion.type === 'it') {
      return currentQuestion.data.answer;
    }
    const b = currentQuestion.data;
    const a = b.analysis;
    if (!a) return 'Žádná analýza k dispozici.';
    const parts = [];
    parts.push(`# ${b.title} – ${b.author}\n`);
    parts.push(`**Žánr:** ${b.genre} | **Forma:** ${b.literaryForm} | **Rok:** ${b.year} | **Období:** ${b.period}\n`);

    if (a.titleAnalysis) parts.push(`## Význam názvu\n${a.titleAnalysis}\n`);
    if (a.plot) parts.push(`## Děj\n${a.plot}\n`);
    if (a.themes) {
      parts.push(`## Téma\n**Hlavní:** ${a.themes.main}\n`);
      if (a.themes.motifs?.length) parts.push(`**Motivy:** ${a.themes.motifs.join(', ')}\n`);
    }
    if (a.setting) {
      parts.push(`## Prostor a čas\n- **Místo:** ${a.setting.place}\n- **Čas:** ${a.setting.time}\n`);
    }
    if (a.characters?.length) {
      parts.push(`## Postavy`);
      a.characters.forEach(c => {
        if (c.description) {
          parts.push(`- **${c.name}** ${c.isMain ? '(hlavní)' : ''}: ${c.description}`);
        } else if (c.traits) {
          const t = Object.entries(c.traits).map(([k, v]) => `${k}: ${v}`).join(', ');
          parts.push(`- **${c.name}**: ${t}`);
        }
      });
      parts.push('');
    }
    if (a.narration) parts.push(`## Vypravěč\n${a.narration.narrator}\n**Styl:** ${a.narration.style}\n`);
    if (a.composition) parts.push(`## Kompozice\n- **Struktura:** ${a.composition.structure}\n- **Časová posloupnost:** ${a.composition.timeline}\n`);
    if (a.languageDevices?.length) parts.push(`## Jazykové prostředky\n${a.languageDevices.map(d => `- ${d}`).join('\n')}\n`);
    if (a.literaryDevices?.length) {
      parts.push(`## Literární prostředky`);
      a.literaryDevices.forEach(d => parts.push(`- **${d.name}:** ${d.example}`));
      parts.push('');
    }
    if (a.excerpt) parts.push(`## Ukázka\n> ${a.excerpt.text}\n\n*${a.excerpt.context}*\n`);
    if (a.literaryContext) {
      parts.push(`## Literární kontext\n**Směr:** ${a.literaryContext.movement}\n`);
      if (a.literaryContext.description) parts.push(`${a.literaryContext.description}\n`);
      if (a.literaryContext.otherAuthors?.length) {
        parts.push('**Další autoři:**');
        a.literaryContext.otherAuthors.forEach(au => {
          parts.push(`- **${au.name}** (${au.years}): ${au.note}`);
        });
        parts.push('');
      }
    }
    if (a.authorContext) {
      parts.push(`## Kontext autora`);
      if (a.authorContext.bio) parts.push(a.authorContext.bio);
      if (a.authorContext.otherWorks?.length) {
        parts.push('\n**Další díla:**');
        a.authorContext.otherWorks.forEach(w => {
          parts.push(`- **${w.title}** (${w.year}) – ${w.note}`);
        });
      }
      parts.push('');
    }
    return parts.join('\n');
  };

  const getQuestionTitle = () => {
    if (!currentQuestion) return '';
    if (currentQuestion.type === 'it') return currentQuestion.data.question;
    return `${currentQuestion.data.title} – ${currentQuestion.data.author}`;
  };

  const getQuestionSubtitle = () => {
    if (!currentQuestion) return '';
    if (currentQuestion.type === 'it') {
      const isPsi = PSI_IDS.has(currentQuestion.data.id);
      return `${isPsi ? 'PSI' : currentQuestion.data.exam} · ${currentQuestion.data.category} · Otázka č. ${currentQuestion.data.id}`;
    }
    return `${currentQuestion.data.period} · ${currentQuestion.data.genre} · Kniha č. ${currentQuestion.data.id}`;
  };

  const toggleIT = (id) => {
    setSelectedITIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleBook = (id) => {
    setSelectedBookIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // ==================== SELECT PHASE ====================
  if (phase === 'select') {
    const itHWQuestions = itQuestions.questions.filter(q => !PSI_IDS.has(q.id));
    const psiQuestions = itQuestions.questions.filter(q => PSI_IDS.has(q.id));

    return (
      <div className="max-w-4xl mx-auto mt-4 px-4 pb-24">
        <h1 className="text-2xl font-bold text-terminal-accent flex items-center gap-2 mb-6">
          <FaDice /> Zkouška – Cvičný mód
        </h1>

        {/* Source toggles */}
        <div className="terminal-card mb-4">
          <h2 className="text-sm font-bold text-terminal-text/70 mb-3">Zdroj otázek</h2>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'it', label: 'IT (HW + IKT2)', icon: FaLaptopCode, count: itHWQuestions.length },
              { key: 'psi', label: 'PSI (Sítě)', icon: FaNetworkWired, count: psiQuestions.length },
              { key: 'cj', label: 'Knihy (ČJ)', icon: FaBook, count: cjBooks.books.length },
            ].map(s => (
              <button key={s.key} onClick={() => toggleSource(s.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded border text-sm transition-all ${
                  sources[s.key]
                    ? 'bg-terminal-accent text-terminal-bg border-terminal-accent font-bold'
                    : 'border-terminal-border/30 text-terminal-text/60 hover:border-terminal-accent/50'
                }`}>
                <s.icon /> {s.label}
                <span className={`text-[10px] ${sources[s.key] ? 'text-terminal-bg/60' : 'text-terminal-text/30'}`}>({s.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* IT question picker */}
        {(sources.it || sources.psi) && (
          <div className="terminal-card mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-terminal-text/70">
                {sources.it && sources.psi ? 'IT + PSI otázky' : sources.psi ? 'PSI otázky' : 'IT otázky'}
              </h2>
              <button onClick={() => setShowITPicker(!showITPicker)}
                className="text-xs text-terminal-accent hover:underline">
                {showITPicker ? 'Skrýt výběr' : `Vybrat konkrétní (${selectedITIds.size || 'vše'})`}
              </button>
            </div>
            {showITPicker && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-60 overflow-y-auto pr-1">
                {itQuestions.questions
                  .filter(q => (sources.it && !PSI_IDS.has(q.id)) || (sources.psi && PSI_IDS.has(q.id)))
                  .map(q => (
                    <button key={q.id} onClick={() => toggleIT(q.id)}
                      className={`text-left px-2 py-1.5 rounded border text-xs transition-all ${
                        selectedITIds.has(q.id)
                          ? 'bg-terminal-accent/15 border-terminal-accent/50 text-terminal-text'
                          : 'border-terminal-border/10 text-terminal-text/50 hover:border-terminal-border/30'
                      }`}>
                      <span className="text-terminal-text/30 mr-1">{q.id}.</span>
                      {PSI_IDS.has(q.id) && <span className="text-blue-400/70 mr-1 text-[10px]">PSI</span>}
                      {q.question}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Book picker */}
        {sources.cj && (
          <div className="terminal-card mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-terminal-text/70">Knihy</h2>
              <button onClick={() => setShowBookPicker(!showBookPicker)}
                className="text-xs text-terminal-accent hover:underline">
                {showBookPicker ? 'Skrýt výběr' : `Vybrat konkrétní (${selectedBookIds.size || 'vše'})`}
              </button>
            </div>
            {showBookPicker && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-60 overflow-y-auto pr-1">
                {cjBooks.books.map(b => (
                  <button key={b.id} onClick={() => toggleBook(b.id)}
                    className={`text-left px-2 py-1.5 rounded border text-xs transition-all ${
                      selectedBookIds.has(b.id)
                        ? 'bg-terminal-accent/15 border-terminal-accent/50 text-terminal-text'
                        : 'border-terminal-border/10 text-terminal-text/50 hover:border-terminal-border/30'
                    }`}>
                    <span className="font-bold">{b.title}</span>
                    <span className="text-terminal-text/30 ml-1 text-[10px]">{b.author}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Draw button */}
        <button onClick={draw} disabled={pool.length === 0}
          className="w-full py-4 bg-terminal-accent text-terminal-bg font-bold text-lg rounded-lg
            hover:bg-terminal-accent/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed
            flex items-center justify-center gap-3 active:scale-[0.98]">
          <FaDice className="text-xl" />
          Losovat otázku ({pool.length} v poolu)
        </button>
      </div>
    );
  }

  // ==================== PRACTICE PHASE ====================
  const materialContent = getMaterialContent();

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Top bar */}
      <div className="flex-none bg-terminal-bg border-b border-terminal-border/20 px-4 py-2">
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={goToSelect}
            className="text-terminal-text/50 hover:text-terminal-accent transition p-1">
            <FaArrowLeft />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {currentQuestion?.type === 'it' ? <FaLaptopCode className="text-terminal-accent flex-shrink-0" /> : <FaBook className="text-terminal-accent flex-shrink-0" />}
              <h1 className="text-sm md:text-base font-bold text-terminal-text truncate">{getQuestionTitle()}</h1>
            </div>
            <p className="text-[10px] text-terminal-text/40 truncate">{getQuestionSubtitle()}</p>
          </div>

          {/* Next question */}
          <button onClick={draw} title="Další otázka"
            className="p-2 text-terminal-text/50 hover:text-terminal-accent border border-terminal-border/20 rounded transition flex-shrink-0">
            <FaRedo />
          </button>
        </div>
      </div>

      {/* Main content - split view */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT: Notepad */}
        <div className="md:w-1/2 w-full flex flex-col border-r border-terminal-border/10 overflow-hidden h-1/2 md:h-full">
          <div className="flex-none flex items-center justify-between px-3 py-2 bg-terminal-dim/30 border-b border-terminal-border/10">
            <span className="text-xs text-terminal-text/50 font-bold tracking-wide flex items-center gap-1.5">
              <FaClipboardList className="text-terminal-accent" /> POZNÁMKY
            </span>
            <div className="flex gap-1">
              <button onClick={prefillNotepad} title="Načíst základní body"
                className="px-2 py-1 text-[10px] border border-terminal-border/20 rounded text-terminal-text/50
                  hover:border-terminal-accent/50 hover:text-terminal-accent transition flex items-center gap-1">
                <FaListUl /> Šablona
              </button>
              <button onClick={() => setNotepadContent('')} title="Vymazat"
                className="px-2 py-1 text-[10px] border border-terminal-border/20 rounded text-terminal-text/50
                  hover:border-red-400/50 hover:text-red-400 transition flex items-center gap-1">
                <FaEraser /> Smazat
              </button>
            </div>
          </div>
          <textarea
            ref={notepadRef}
            value={notepadContent}
            onChange={e => setNotepadContent(e.target.value)}
            placeholder="Piš si poznámky... Klikni na 'Šablona' pro předvyplnění základních bodů z materiálu."
            className="flex-1 w-full bg-transparent text-terminal-text text-sm p-4 resize-none
              focus:outline-none placeholder:text-terminal-text/20 font-mono leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* RIGHT: Material — click to toggle blur */}
        <div className="md:w-1/2 w-full flex flex-col overflow-hidden h-1/2 md:h-full">
          <div className="flex-none flex items-center justify-between px-3 py-2 bg-terminal-dim/30 border-b border-terminal-border/10">
            <span className="text-xs text-terminal-text/50 font-bold tracking-wide flex items-center gap-1.5">
              <FaFileAlt className="text-terminal-accent" /> MATERIÁL
              {!isRevealed && (
                <span className="text-[10px] text-yellow-500/70 ml-2">(skryté – klikni pro odkrytí)</span>
              )}
            </span>
            <button
              onClick={() => setIsRevealed(r => !r)}
              className="px-2 py-1 text-[10px] border border-terminal-border/20 rounded text-terminal-text/50
                hover:border-terminal-accent/50 hover:text-terminal-accent transition flex items-center gap-1">
              {isRevealed ? <FaEyeSlash /> : <FaEye />}
              {isRevealed ? 'Skrýt' : 'Odkrýt'}
            </button>
          </div>
          <div
            onClick={() => setIsRevealed(r => !r)}
            className={`flex-1 overflow-y-auto p-4 transition-all duration-500 cursor-pointer
              ${isRevealed ? '' : 'blur-md select-none'}`}
          >
            <MarkdownRenderer content={materialContent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPracticePage;
