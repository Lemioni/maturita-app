
import { useState, useEffect } from 'react';
import { FaSave, FaFolderOpen, FaCheck, FaTimes, FaGamepad, FaSoap, FaStickyNote, FaBuilding } from 'react-icons/fa';
import itQuestionsData from '../../data/it-questions.json';
import cjBooksData from '../../data/cj-books.json';

const DopamineConfig = ({ onStartGame }) => {
    const [category, setCategory] = useState(null); // 'IT' or 'CJ'
    const [gameMode, setGameMode] = useState('bubbles'); // 'bubbles', 'notepad', 'tower'
    const [selectedIds, setSelectedIds] = useState([]);
    const [saveSlots, setSaveSlots] = useState([null, null, null]);

    // Load saves from local storage
    useEffect(() => {
        const saved = localStorage.getItem('dopamine_saves');
        if (saved) {
            try {
                setSaveSlots(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saves", e);
            }
        }
    }, []);

    const saveToSlot = (index) => {
        if (!category || selectedIds.length === 0) return;
        const newSlots = [...saveSlots];
        newSlots[index] = {
            category,
            selectedIds,
            gameMode,
            date: new Date().toLocaleDateString(),
            name: `${category} - ${gameMode} (${selectedIds.length})`
        };
        setSaveSlots(newSlots);
        localStorage.setItem('dopamine_saves', JSON.stringify(newSlots));
    };

    const loadFromSlot = (index) => {
        const slot = saveSlots[index];
        if (slot) {
            setCategory(slot.category);
            setSelectedIds(slot.selectedIds);
            if (slot.gameMode) setGameMode(slot.gameMode);
        }
    };

    const toggleId = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (category === 'IT') {
            setSelectedIds(itQuestionsData.questions.map(q => q.id));
        } else if (category === 'CJ') {
            setSelectedIds(cjBooksData.books.map(b => b.id));
        }
    };

    const deselectAll = () => setSelectedIds([]);

    const getItems = () => {
        if (category === 'IT') return itQuestionsData.questions.map(q => ({ id: q.id, label: q.question }));
        if (category === 'CJ') return cjBooksData.books.map(b => ({ id: b.id, label: `${b.title} (${b.author})` }));
        return [];
    };

    const handleStart = () => {
        if (!category) return;

        let finalIds = selectedIds;
        if (selectedIds.length === 0) {
            if (category === 'IT') {
                finalIds = itQuestionsData.questions.map(q => q.id);
            } else {
                finalIds = cjBooksData.books.map(b => b.id);
            }
        }

        onStartGame(category, finalIds, gameMode);
    };

    if (!category) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fadeIn">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
                    Vyber kategorii
                </h2>
                <div className="flex gap-8">
                    <button
                        onClick={() => setCategory('IT')}
                        className="w-48 h-48 flex items-center justify-center text-3xl font-bold border-2 border-cyan-500/50 hover:bg-cyan-500/20 text-cyan-400 rounded-2xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                    >
                        IT
                    </button>
                    <button
                        onClick={() => setCategory('CJ')}
                        className="w-48 h-48 flex items-center justify-center text-3xl font-bold border-2 border-orange-500/50 hover:bg-orange-500/20 text-orange-400 rounded-2xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(249,115,22,0.2)]"
                    >
                        ČJ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto p-4 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => setCategory(null)} className="text-gray-400 hover:text-white">
                    ← Zpět
                </button>
                <div className="flex gap-4">
                    {/* Mode Selection */}
                    <button onClick={() => setGameMode('bubbles')} className={`p-2 rounded ${gameMode === 'bubbles' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`} title="Bubbles">
                        <FaSoap />
                    </button>
                    <button onClick={() => setGameMode('notepad')} className={`p-2 rounded ${gameMode === 'notepad' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`} title="Notepad">
                        <FaStickyNote />
                    </button>
                    <button onClick={() => setGameMode('tower')} className={`p-2 rounded ${gameMode === 'tower' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`} title="Tower">
                        <FaBuilding />
                    </button>
                </div>
                <button
                    onClick={handleStart}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-transform"
                >
                    <FaGamepad /> HRÁT
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
                {/* Save Slots */}
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-gray-300 mb-2">Uložené výběry</h3>
                    {saveSlots.map((slot, idx) => (
                        <div key={idx} className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex flex-col gap-2 relative group">
                            <div className="text-sm font-mono text-gray-400">Slot {idx + 1}</div>
                            {slot ? (
                                <>
                                    <div className="font-bold text-white truncate">{slot.name}</div>
                                    <div className="text-xs text-gray-500">{slot.date}</div>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => loadFromSlot(idx)}
                                            className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 py-1 rounded text-xs border border-blue-500/30"
                                        >
                                            Načíst
                                        </button>
                                        <button
                                            onClick={() => saveToSlot(idx)}
                                            className="flex-1 bg-green-600/20 hover:bg-green-600/40 text-green-400 py-1 rounded text-xs border border-green-500/30"
                                        >
                                            Přepsat
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col justify-center items-center py-4">
                                    <span className="text-gray-600 text-sm mb-2">Prázdný slot</span>
                                    <button
                                        onClick={() => saveToSlot(idx)}
                                        className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 rounded text-xs"
                                    >
                                        Uložit aktuální
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Selection List */}
                <div className="col-span-1 md:col-span-2 bg-gray-900/50 p-4 rounded-xl border border-gray-700 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400 text-sm">Vybráno: {selectedIds.length}</span>
                        <div className="flex gap-2">
                            <button onClick={selectAll} className="text-xs px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Vše</button>
                            <button onClick={deselectAll} className="text-xs px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Nic</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {getItems().map(item => (
                            <div
                                key={item.id}
                                onClick={() => toggleId(item.id)}
                                className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors border ${selectedIds.includes(item.id)
                                        ? 'bg-purple-900/30 border-purple-500/50'
                                        : 'bg-gray-800/50 border-transparent hover:bg-gray-800'
                                    }`}
                            >
                                <span className={selectedIds.includes(item.id) ? 'text-white' : 'text-gray-400'}>
                                    {item.label}
                                </span>
                                {selectedIds.includes(item.id) && <FaCheck className="text-purple-400" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DopamineConfig;
