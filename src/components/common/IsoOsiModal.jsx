import React from 'react';
import { FaTimes, FaLayerGroup } from 'react-icons/fa';

/**
 * IsoOsiModal - Displays the ISO/OSI Reference Model table
 * Shows all 7 layers, their units (PDU), function, and typical devices/protocols.
 */
const IsoOsiModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
            <div className="bg-terminal-bg border border-terminal-accent/30 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-terminal-border/20 flex items-center justify-between bg-terminal-surface">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-terminal-accent">
                        <FaLayerGroup />
                        Referenční model ISO/OSI
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-terminal-border/20 rounded-full transition-colors text-terminal-text/60 hover:text-terminal-alert"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Content - Scrollable Table */}
                <div className="overflow-auto p-0 flex-1">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-terminal-surface/50 sticky top-0 z-10">
                            <tr>
                                <th className="p-3 border-b border-terminal-border/30 text-xs text-terminal-text/60">#</th>
                                <th className="p-3 border-b border-terminal-border/30 text-xs text-terminal-text/60">Vrstva</th>
                                <th className="p-3 border-b border-terminal-border/30 text-xs text-terminal-text/60">Jednotka (PDU)</th>
                                <th className="p-3 border-b border-terminal-border/30 text-xs text-terminal-text/60">Funkce</th>
                                <th className="p-3 border-b border-terminal-border/30 text-xs text-terminal-text/60">Zařízení / Protokoly</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-terminal-border/10 text-sm">
                            {/* Layer 7 */}
                            <tr className="hover:bg-terminal-accent/5">
                                <td className="p-3 font-mono text-terminal-accent font-bold">7</td>
                                <td className="p-3 font-bold">Aplikační</td>
                                <td className="p-3 font-mono text-xs opacity-80">Data</td>
                                <td className="p-3">Služby pro aplikace/uživatele (mail, web)</td>
                                <td className="p-3 font-mono text-xs">PC, Telefon, <span className="text-terminal-accent">HTTP, DNS, SMTP, FTP</span></td>
                            </tr>
                            {/* Layer 6 */}
                            <tr className="hover:bg-terminal-accent/5">
                                <td className="p-3 font-mono text-terminal-accent font-bold">6</td>
                                <td className="p-3 font-bold">Prezentační</td>
                                <td className="p-3 font-mono text-xs opacity-80">Data</td>
                                <td className="p-3">Formátování, šifrování, komprese</td>
                                <td className="p-3 font-mono text-xs">OS (Kernel), <span className="text-terminal-accent">SSL/TLS, JPEG, ASCII</span></td>
                            </tr>
                            {/* Layer 5 */}
                            <tr className="hover:bg-terminal-accent/5">
                                <td className="p-3 font-mono text-terminal-accent font-bold">5</td>
                                <td className="p-3 font-bold">Relační</td>
                                <td className="p-3 font-mono text-xs opacity-80">Data</td>
                                <td className="p-3">Řízení relace (session), synchronizace</td>
                                <td className="p-3 font-mono text-xs">OS (Socket), <span className="text-terminal-accent">RPC, NetBIOS, SQL</span></td>
                            </tr>
                            {/* Layer 4 */}
                            <tr className="bg-terminal-accent/5 hover:bg-terminal-accent/10">
                                <td className="p-3 font-mono text-terminal-accent font-bold">4</td>
                                <td className="p-3 font-bold">Transportní</td>
                                <td className="p-3 font-mono text-xs opacity-80">Segment / Datagram</td>
                                <td className="p-3">End-to-end doručení, spolehlivost</td>
                                <td className="p-3 font-mono text-xs">Firewall, <span className="text-terminal-accent">TCP, UDP, Porty</span></td>
                            </tr>
                            {/* Layer 3 */}
                            <tr className="hover:bg-terminal-accent/5">
                                <td className="p-3 font-mono text-terminal-accent font-bold">3</td>
                                <td className="p-3 font-bold">Síťová</td>
                                <td className="p-3 font-mono text-xs opacity-80">Paket</td>
                                <td className="p-3">Logické směrování (Routing), IP adresace</td>
                                <td className="p-3 font-mono text-xs"><span className="text-terminal-alert font-bold">Router</span>, L3 Switch, <span className="text-terminal-accent">IPv4, IPv6, ICMP</span></td>
                            </tr>
                            {/* Layer 2 */}
                            <tr className="hover:bg-terminal-accent/5">
                                <td className="p-3 font-mono text-terminal-accent font-bold">2</td>
                                <td className="p-3 font-bold">Linková</td>
                                <td className="p-3 font-mono text-xs opacity-80">Rámec (Frame)</td>
                                <td className="p-3">Fyzická adresace (MAC), přístup k médiu</td>
                                <td className="p-3 font-mono text-xs"><span className="text-terminal-alert font-bold">Switch</span>, Bridge, NIC, <span className="text-terminal-accent">Ethernet, Wi-Fi, MAC</span></td>
                            </tr>
                            {/* Layer 1 */}
                            <tr className="hover:bg-terminal-accent/5">
                                <td className="p-3 font-mono text-terminal-accent font-bold">1</td>
                                <td className="p-3 font-bold">Fyzická</td>
                                <td className="p-3 font-mono text-xs opacity-80">Bit</td>
                                <td className="p-3">Přenos signálu (El/Opt/Radio)</td>
                                <td className="p-3 font-mono text-xs"><span className="text-terminal-alert font-bold">Hub, Repeater</span>, Kabely, Konektory</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Mnemonics / Info Footer */}
                    <div className="p-4 border-t border-terminal-border/20 bg-terminal-surface/30">
                        <h4 className="text-sm font-bold text-terminal-accent mb-2">Jak si to zapamatovat?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-terminal-text/80">
                            <div>
                                <strong className="block mb-1 text-terminal-text">PDU (Jednotky):</strong>
                                <p>Don't Some People Fear Birthdays?</p>
                                <p className="text-terminal-accent/70">(Data, Segment, Packet, Frame, Bits)</p>
                            </div>
                            <div>
                                <strong className="block mb-1 text-terminal-text">Vrsty (1→7):</strong>
                                <p>Prosím, nenechte tátu shazovat naše aligátory.</p>
                                <p className="text-terminal-accent/70">(Fyzická, Linková, Síťová, Transportní, Relační, Prezentační, Aplikační)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IsoOsiModal;
