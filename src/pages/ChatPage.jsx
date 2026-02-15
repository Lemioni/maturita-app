import { useState } from 'react';
import { useExperimental } from '../context/ExperimentalContext';

const ChatPage = () => {
    const { frutigerAero } = useExperimental();
    const [messages, setMessages] = useState([
        { user: 'PookieBoo', text: 'Hi', avatar: '/aero-icons/wlm1.ico' },
        { user: 'BumblePums', text: 'I\'m lonely asf', avatar: '/aero-icons/wlm.ico' },
        { user: 'StrayAlchemist', text: 'guys do you like dinosaurs', avatar: '/aero-icons/vista_info.ico' },
        { user: 'NAMETAG', text: 'meow', avatar: '/aero-icons/roblox1.ico' },
    ]);
    const [input, setInput] = useState('');

    const users = [
        { name: 'BumblePums', role: 'admin' },
        { name: 'Aero Bot', role: 'bot' },
        { name: 'WookieBump', role: 'user' },
        { name: 'StrayAlchemist', role: 'user' },
        { name: 'KissieFace', role: 'user' },
        { name: 'PookieBoo', role: 'user' },
        { name: 'SmoochieDumplings', role: 'user' },
    ];

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages([...messages, { user: 'Guest', text: input, avatar: '/aero-icons/vista_pc_1.ico' }]);
        setInput('');
    };

    return (
        <div className={`h-[calc(100vh-100px)] flex flex-col ${frutigerAero ? 'font-sans' : ''}`}>
            {/* Chat Window Container - Xat Style */}
            <div className="flex-1 bg-black/80 rounded-t-lg border-x border-t border-gray-600 overflow-hidden flex flex-col relative">
                {/* Header */}
                <div className="h-8 bg-gradient-to-b from-gray-700 to-black border-b border-gray-600 flex items-center justify-between px-4">
                    <span className="text-white text-xs font-bold">Community Chat Room</span>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex bg-[url('https://wallpapers.com/images/featured/windows-xp-bliss-background-f57k1g5d6b4x6tq7.jpg')] bg-cover relative">
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-2 z-10">
                        {messages.map((msg, i) => (
                            <div key={i} className="flex gap-2 items-start bg-white/40 p-2 rounded backdrop-blur-sm border border-white/30">
                                <img src={msg.avatar} alt="avatar" className="w-8 h-8 rounded border border-gray-400" />
                                <div>
                                    <div className="font-bold text-xs text-black shadow-white drop-shadow-md">{msg.user}</div>
                                    <div className="text-sm text-black font-medium">{msg.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* User List Sidebar */}
                    <div className="w-48 bg-white/20 backdrop-blur-md border-l border-white/30 flex flex-col z-10">
                        <div className="bg-green-600 text-white text-xs font-bold text-center py-1 border-b border-green-700">Frutiger Aero</div>
                        <div className="p-2 space-y-1 overflow-y-auto flex-1">
                            {users.map(u => (
                                <div key={u.name} className="flex items-center gap-2 text-xs text-black font-bold">
                                    <img src="/aero-icons/wlm1.ico" className="w-4 h-4" />
                                    <span className={u.role === 'admin' ? 'text-blue-800' : u.role === 'bot' ? 'text-green-800' : 'text-black'}>
                                        {u.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="p-2 space-y-1">
                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 rounded border border-blue-700">VIP</button>
                            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-1 rounded border border-orange-800">Access Void</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Input Area */}
            <div className="bg-gradient-to-b from-green-600 to-green-800 p-2 rounded-b-lg border-x border-b border-green-900 flex flex-col gap-2">
                {/* Emoticons Bar */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {/* Placeholders for visuals */}
                    <div className="w-6 h-6 bg-yellow-300 rounded-full border border-yellow-600 shadow-inner"></div>
                    <div className="w-6 h-6 bg-yellow-300 rounded-full border border-yellow-600 shadow-inner"></div>
                    <div className="w-6 h-6 bg-yellow-300 rounded-full border border-yellow-600 shadow-inner"></div>
                    <div className="w-6 h-6 bg-black rounded-full border border-white shadow-inner text-white text-[10px] flex items-center justify-center">8</div>
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        className="flex-1 bg-white/50 border border-green-900/30 rounded px-2 py-1 text-sm font-bold text-black placeholder-black/50 focus:outline-none focus:bg-white/80"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button className="bg-green-500 text-white font-bold px-4 py-1 rounded border border-green-700 shadow text-xs">Send</button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
