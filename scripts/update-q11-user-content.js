/**
 * Update Question 11 with User's specific content
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '..', 'src', 'data', 'it-questions.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const q11Content = {
    sections: [
        {
            title: "1. Základní pojmy a komunikace 🗣️",
            items: [
                { term: "Data", definition: "Surová fakta (čísla, znaky) bez kontextu." },
                { term: "Informace", definition: "Data s přidaným významem a interpretací." },
                { term: "Protokoly", definition: "Pravidla komunikace (např. TCP/IP)." },
                { term: "Fáze komunikace", definition: "1. Vysílání → 2. Přenos → 3. Příjem." },
                { term: "Klíčové faktory", definition: "Rychlost, spolehlivost a bezpečnost." }
            ]
        },
        {
            title: "2. Dělení sítí (Velikost a Řízení) 📏",
            items: [
                { term: "LAN (Local)", definition: "Malá oblast (byt, firma)." },
                { term: "MAN (Metropolitan)", definition: "Městská síť (propojuje LAN)." },
                { term: "WAN (Wide)", definition: "Globální dosah (Internet)." },
                { term: "Peer-to-Peer (P2P)", definition: "Zařízení jsou si rovna." },
                { term: "Klient-Server", definition: "Centrální server obsluhuje klienty." }
            ]
        },
        {
            title: "3. Topologie sítí (Uspořádání) 🕸️",
            items: [
                { term: "Sběrnicová (Bus)", definition: "Vše na jednom kabelu. Jednoduchá, ale náchylná na přerušení." },
                { term: "Hvězdicová (Star)", definition: "Vše do centrálního prvku (switch). Dnes nejběžnější." },
                { term: "Kruhová (Ring)", definition: "Data putují v uzavřeném kruhu." },
                { term: "Stromová (Tree)", definition: "Hierarchická struktura, kombinuje hvězdy." },
                { term: "Mesh (Síťová)", definition: "Každý s každým. Vysoká odolnost (redundance)." }
            ]
        },
        {
            title: "4. Internet – Historie a správa 🌍",
            items: [
                { term: "1969", definition: "Vznik ARPANETu (první přepojování paketů)." },
                { term: "1983", definition: "Přechod na TCP/IP – vznik moderního Internetu." },
                { term: "1991", definition: "Tim Berners-Lee představuje WWW." },
                { term: "Správa", definition: "Decentralizovaná (více organizací)." },
                { term: "IANA/ICANN", definition: "Správa IP adres a domén." },
                { term: "IETF", definition: "Vývoj standardů." },
                { term: "W3C", definition: "Standardy pro web." },
                { term: "RFC", definition: "Veřejné dokumenty definující standardy." }
            ]
        },
        {
            title: "5. Klíčové historické sítě 🏛️",
            items: [
                { term: "ARPANET (1969)", definition: "Základ internetu, první přepojování paketů (US ministerstvo obrany)." },
                { term: "CYCLADES (1972)", definition: "Francouzská síť, zavedla koncept end-to-end (spolehlivost řeší koncová zařízení)." },
                { term: "NPL Network (1968)", definition: "Britský experiment s přepojováním paketů." },
                { term: "X.25 (70. léta)", definition: "Mezinárodní standard pro bankomaty a telekomunikace." },
                { term: "USENET (1979)", definition: "Distribuované diskusní skupiny (newsgroups)." },
                { term: "BITNET (1981)", definition: "Akademická síť pro sdílení souborů a e-mailů." },
                { term: "FidoNet (1984)", definition: "Amatérská síť přes modemy (BBS)." },
                { term: "NSFNET (1986)", definition: "Akademická páteřní síť USA, urychlila rozvoj internetu." },
                { term: "EUNET (1982)", definition: "První evropská síť umožňující komunikaci přes hranice." },
                { term: "MILNET (1983)", definition: "Vojenská větev oddělená od ARPANETu kvůli bezpečnosti." }
            ]
        }
    ]
};

const questionIndex = data.questions.findIndex(q => q.id === 11);
if (questionIndex !== -1) {
    data.questions[questionIndex].compactContent = q11Content;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('✅ Question 11 updated with user content');
} else {
    console.error('❌ Question 11 not found');
}
