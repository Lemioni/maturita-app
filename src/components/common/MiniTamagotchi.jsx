import { useEffect, useMemo, useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';

const DEFAULT_PET = {
    name: 'Maturko',
    hunger: 80,
    happiness: 75,
    energy: 70,
    lastTick: Date.now(),
};

const clamp = (value) => Math.max(0, Math.min(100, value));

const withDecay = (pet, now = Date.now()) => {
    const elapsedMinutes = Math.floor((now - (pet?.lastTick || now)) / 60000);
    if (elapsedMinutes <= 0) {
        return pet;
    }

    return {
        ...pet,
        hunger: clamp((pet.hunger ?? 0) - elapsedMinutes),
        happiness: clamp((pet.happiness ?? 0) - Math.floor(elapsedMinutes * 0.8)),
        energy: clamp((pet.energy ?? 0) - Math.floor(elapsedMinutes * 0.7)),
        lastTick: now,
    };
};

const MiniTamagotchi = () => {
    const [pet, setPet] = useLocalStorage('mini-tamagotchi-v1', DEFAULT_PET);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        setPet((previousPet) => withDecay(previousPet || DEFAULT_PET));
    }, [setPet]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setPet((previousPet) => withDecay(previousPet || DEFAULT_PET));
        }, 30000);

        return () => clearInterval(intervalId);
    }, [setPet]);

    const mood = useMemo(() => {
        const avg = ((pet?.hunger ?? 0) + (pet?.happiness ?? 0) + (pet?.energy ?? 0)) / 3;
        if (avg >= 70) return '😄';
        if (avg >= 40) return '🙂';
        return '😵';
    }, [pet]);

    const updatePet = (changes) => {
        setPet((previousPet) => {
            const basePet = withDecay(previousPet || DEFAULT_PET);
            return {
                ...basePet,
                hunger: clamp(basePet.hunger + (changes.hunger || 0)),
                happiness: clamp(basePet.happiness + (changes.happiness || 0)),
                energy: clamp(basePet.energy + (changes.energy || 0)),
                lastTick: Date.now(),
            };
        });
    };

    const safePet = pet || DEFAULT_PET;

    if (!expanded) {
        return (
            <button
                onClick={() => setExpanded(true)}
                className="fixed bottom-16 left-4 z-40 px-2.5 py-1.5 border border-terminal-border/40 bg-terminal-bg/95 text-terminal-text text-xs hover:border-terminal-border/70 hover:text-terminal-accent transition-colors"
                aria-label="Otevřít mini tamagotchi"
            >
                {mood} Tamagotchi
            </button>
        );
    }

    return (
        <div className="fixed bottom-16 left-4 z-40 w-56 border border-terminal-border/40 bg-terminal-bg/95 backdrop-blur-sm p-3 text-xs">
            <div className="flex items-center justify-between mb-2">
                <p className="text-terminal-accent font-semibold">{safePet.name} {mood}</p>
                <button
                    onClick={() => setExpanded(false)}
                    className="text-terminal-text/60 hover:text-terminal-text"
                    aria-label="Sbalit mini tamagotchi"
                >
                    ×
                </button>
            </div>

            <div className="space-y-1 mb-3 text-terminal-text/80">
                <p>Hlad: {safePet.hunger}%</p>
                <p>Radost: {safePet.happiness}%</p>
                <p>Energie: {safePet.energy}%</p>
            </div>

            <div className="grid grid-cols-3 gap-1">
                <button
                    onClick={() => updatePet({ hunger: 12, happiness: 2 })}
                    className="px-2 py-1 border border-terminal-border/30 hover:border-terminal-accent/60 hover:text-terminal-accent transition-colors"
                >
                    Krmit
                </button>
                <button
                    onClick={() => updatePet({ happiness: 10, energy: -4 })}
                    className="px-2 py-1 border border-terminal-border/30 hover:border-terminal-accent/60 hover:text-terminal-accent transition-colors"
                >
                    Hrát
                </button>
                <button
                    onClick={() => updatePet({ energy: 12, hunger: -3 })}
                    className="px-2 py-1 border border-terminal-border/30 hover:border-terminal-accent/60 hover:text-terminal-accent transition-colors"
                >
                    Spát
                </button>
            </div>
        </div>
    );
};

export default MiniTamagotchi;