import { useState } from 'react';
import { useExperimental } from '../context/ExperimentalContext';
import { FaFilePdf, FaFolderOpen } from 'react-icons/fa';

const PresentationsPage = () => {
    const { frutigerAero } = useExperimental();

    // Mock data for presentations
    const presentations = [
        { name: 'Introduction to PSI', size: '2.4 MB', date: '2023-10-15' },
        { name: 'Network Topologies', size: '1.8 MB', date: '2023-11-02' },
        { name: 'OSI Model Deep Dive', size: '3.1 MB', date: '2023-11-20' },
        { name: 'TCP/IP Protocol Suite', size: '2.9 MB', date: '2023-12-05' },
        { name: 'Wireless Standards', size: '1.5 MB', date: '2024-01-10' },
    ];

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center gap-3 mb-4 p-2 border-b border-terminal-border/20">
                {frutigerAero ? <img src="/aero-icons/vista_info.ico" className="w-8 h-8" /> : <FaFolderOpen className="text-2xl" />}
                <h1 className="text-xl font-bold text-terminal-accent">Prezentace (PSI)</h1>
            </div>

            <div className={`${frutigerAero ? 'terminal-card' : 'bg-white dark:bg-gray-800'} flex-1 p-0 overflow-hidden flex flex-col`}>
                {/* Toolbar */}
                <div className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-2 border-b border-gray-300 dark:border-gray-600 flex gap-2">
                    <button className="px-3 py-1 bg-white border border-gray-400 rounded hover:bg-blue-50 text-xs text-black">Open</button>
                    <button className="px-3 py-1 bg-white border border-gray-400 rounded hover:bg-blue-50 text-xs text-black">Print</button>
                    <div className="w-[1px] bg-gray-400 mx-2"></div>
                    <button className="px-3 py-1 bg-white border border-gray-400 rounded hover:bg-blue-50 text-xs text-black">Previous</button>
                    <button className="px-3 py-1 bg-white border border-gray-400 rounded hover:bg-blue-50 text-xs text-black">Next</button>
                </div>

                {/* Grid View of Files */}
                <div className="flex-1 p-6 bg-white dark:bg-gray-900 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {presentations.map((p, i) => (
                            <div key={i} className="group flex flex-col items-center p-4 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200 cursor-pointer transition-all">
                                <div className="w-16 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-sm shadow-md flex items-center justify-center mb-3 relative">
                                    <span className="text-white font-bold text-xs">PDF</span>
                                    <div className="absolute top-0 right-0 w-4 h-4 bg-white/20 polygon-[0_0,0_100%,100%_0]"></div>
                                </div>
                                <span className="text-sm font-medium text-center text-gray-700 dark:text-gray-300 group-hover:text-blue-600">{p.name}</span>
                                <span className="text-xs text-gray-400 mt-1">{p.size}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Bar */}
                <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 px-4 py-1 text-xs text-gray-500">
                    {presentations.length} objects
                </div>
            </div>
        </div>
    );
};

export default PresentationsPage;
