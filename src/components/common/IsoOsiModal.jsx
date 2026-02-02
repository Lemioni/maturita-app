import React, { useState } from 'react';
import { FaTimes, FaLayerGroup, FaNetworkWired, FaServer, FaGlobe, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa';
import { BiNetworkChart, BiData } from 'react-icons/bi';
import { BsHddNetwork, BsCpu } from 'react-icons/bs';

/**
 * ISO/OSI Reference Model Visualization
 * Redesigned for mobile-first experience with rich data cards.
 */
const ISO_LAYERS = [
    {
        id: 7,
        name: 'Aplikační',
        nameEn: 'Application',
        pdu: 'Data',
        desc: 'Rozhraní pro aplikace a uživatele. Zajišťuje síťové služby (mail, web).',
        protocols: ['HTTP/S', 'DNS', 'SMTP', 'FTP', 'DHCP', 'SSH', 'Telnet'],
        devices: ['PC', 'Mobil', 'Server'],
        color: 'text-pink-400',
        bg: 'bg-pink-400/10',
        border: 'border-pink-400/30',
        icon: FaGlobe
    },
    {
        id: 6,
        name: 'Prezentační',
        nameEn: 'Presentation',
        pdu: 'Data',
        desc: 'Formátování, šifrování a komprese dat (překladatelská služba).',
        protocols: ['SSL/TLS', 'JPEG', 'MPEG', 'ASCII', 'Unicode'],
        devices: ['OS Kernel', 'Software'],
        color: 'text-purple-400',
        bg: 'bg-purple-400/10',
        border: 'border-purple-400/30',
        icon: FaShieldAlt
    },
    {
        id: 5,
        name: 'Relační',
        nameEn: 'Session',
        pdu: 'Data',
        desc: 'Řízení relace (session), synchronizace a udržování spojení.',
        protocols: ['NetBIOS', 'RPC', 'SQL', 'NFS'],
        devices: ['OS Socket', 'Firewall'],
        color: 'text-indigo-400',
        bg: 'bg-indigo-400/10',
        border: 'border-indigo-400/30',
        icon: FaExchangeAlt
    },
    {
        id: 4,
        name: 'Transportní',
        nameEn: 'Transport',
        pdu: 'Segment',
        desc: 'Spolehlivý přenos (TCP) nebo rychlý přenos (UDP). Adresace porty.',
        protocols: ['TCP', 'UDP'],
        devices: ['Firewall', 'Load Balancer'],
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        border: 'border-blue-400/30',
        icon: FaServer
    },
    {
        id: 3,
        name: 'Síťová',
        nameEn: 'Network',
        pdu: 'Paket',
        desc: 'Logické směrování (Routing) a adresace (IP). Spojuje různé sítě.',
        protocols: ['IPv4', 'IPv6', 'ICMP', 'IPSec', 'OSPF', 'RIP', 'BGP'],
        devices: ['Router', 'L3 Switch', 'Firewall'],
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/30',
        icon: FaNetworkWired
    },
    {
        id: 2,
        name: 'Linková',
        nameEn: 'Data Link',
        pdu: 'Rámec (Frame)',
        desc: 'Fyzická adresace (MAC). Přenos v lokální síti (LAN).',
        protocols: ['Ethernet', 'Wi-Fi (802.11)', 'ARP', 'MAC'],
        devices: ['Switch', 'Bridge', 'NIC (Síťovka)'],
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/30',
        icon: BiNetworkChart
    },
    {
        id: 1,
        name: 'Fyzická',
        nameEn: 'Physical',
        pdu: 'Bit',
        desc: 'Přenos surového signálu (elektrický, optický, rádiový).',
        protocols: ['Signál', 'Napětí', 'Frekvence'],
        devices: ['Hub', 'Repeater', 'Kabeláž (UTP/Optika)', 'Konektory'],
        color: 'text-orange-400',
        bg: 'bg-orange-400/10',
        border: 'border-orange-400/30',
        icon: BsHddNetwork
    }
];

const IsoOsiModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-terminal-bg border border-terminal-accent/30 sm:rounded-lg shadow-2xl w-full max-w-5xl h-full sm:h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-terminal-border/20 flex items-center justify-between bg-terminal-surface shrink-0">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2 text-terminal-accent">
                            <FaLayerGroup />
                            ISO/OSI Model
                        </h2>
                        <p className="text-xs text-terminal-text/50 hidden sm:block">Open Systems Interconnection Reference Model</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-terminal-border/20 rounded-full transition-colors text-terminal-text/60 hover:text-terminal-alert"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto overflow-x-hidden p-4 flex-1 space-y-3 sm:space-y-4 bg-terminal-bg custom-scrollbar">

                    {ISO_LAYERS.map((layer) => (
                        <div
                            key={layer.id}
                            className={`relative group rounded-lg border ${layer.border} ${layer.bg} p-3 sm:p-4 transition-all hover:brightness-110 hover:translate-x-1 sm:hover:translate-x-0 sm:hover:scale-[1.01]`}
                        >
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">

                                {/* Layer ID & Icon */}
                                <div className="flex items-center gap-3 w-full sm:w-48 shrink-0">
                                    <div className={`text-2xl font-bold font-mono ${layer.color} border-r border-terminal-border/20 pr-4`}>
                                        L{layer.id}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className={`font-bold text-lg ${layer.color} flex items-center gap-2`}>
                                            <layer.icon className="opacity-80" />
                                            {layer.name}
                                        </h3>
                                        <span className="text-[10px] uppercase tracking-wider text-terminal-text/40 font-mono">{layer.nameEn}</span>
                                    </div>
                                </div>

                                {/* Main Description */}
                                <div className="flex-1 border-t sm:border-t-0 sm:border-l border-terminal-border/10 pt-2 sm:pt-0 sm:pl-4 mt-2 sm:mt-0">
                                    <p className="text-sm text-terminal-text/90 leading-relaxed font-medium">
                                        {layer.desc}
                                    </p>

                                    {/* Badges container */}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {/* PDU Badge */}
                                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-terminal-bg/50 border border-terminal-border/30 text-terminal-text/60">
                                            <BiData /> PDU: <strong className="text-terminal-text/90">{layer.pdu}</strong>
                                        </div>

                                        {/* Hardware/Devices Badges */}
                                        {layer.devices.map(dev => (
                                            <span key={dev} className="px-2 py-0.5 rounded text-[10px] bg-terminal-surface border border-terminal-border/20 text-terminal-text/70">
                                                {dev}
                                            </span>
                                        ))}

                                        {/* Protocols Badges (Highlighted) */}
                                        {layer.protocols.map(prot => (
                                            <span key={prot} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${layer.border} ${layer.color} bg-terminal-bg`}>
                                                {prot}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Mnemonic / Footer */}
                    <div className="mt-8 p-4 rounded-lg bg-terminal-surface border border-terminal-border/20">
                        <h4 className="text-sm font-bold text-terminal-accent mb-3 flex items-center gap-2">
                            🧠 Jak si to zapamatovat?
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-1">
                                <p className="text-terminal-text/60 text-xs uppercase tracking-wide">Vrstvy (1 → 7)</p>
                                <p className="italic">"<strong>P</strong>rosím, <strong>N</strong>enechte <strong>T</strong>átu <strong>S</strong>hazovat <strong>N</strong>aše <strong>A</strong>ligátory."</p>
                                <div className="flex gap-1 text-[10px] font-mono text-terminal-accent/50 mt-1">
                                    <span>Fyzická</span> • <span>Linková</span> • <span>Síťová</span> • <span>Transportní</span> • <span>Relační</span> • <span>Prezentační</span> • <span>Aplikační</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-terminal-text/60 text-xs uppercase tracking-wide">PDU (Jednotky)</p>
                                <p className="italic">"<strong>D</strong>on't <strong>S</strong>ome <strong>P</strong>eople <strong>F</strong>ear <strong>B</strong>irthdays?"</p>
                                <div className="flex gap-1 text-[10px] font-mono text-terminal-accent/50 mt-1">
                                    <span>Data</span> • <span>Segment</span> • <span>Packet</span> • <span>Frame</span> • <span>Bits</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default IsoOsiModal;
