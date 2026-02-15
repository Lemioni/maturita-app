import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaLaptopCode, FaBook, FaSearch, FaRocket, FaStar } from 'react-icons/fa';

const FrutigerSidebar = () => {
    const location = useLocation();
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    // Maturita countdown
    const maturitaDate = new Date('2026-05-15');
    const daysLeft = Math.ceil((maturitaDate - currentDate) / (1000 * 60 * 60 * 24));

    const dayNames = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
    const monthNames = ['Ledna', 'Února', 'Března', 'Dubna', 'Května', 'Června', 'Července', 'Srpna', 'Září', 'Října', 'Listopadu', 'Prosince'];

    const navGroups = [
        {
            label: 'Main Content',
            items: [
                { path: '/', imgSrc: '/aero-icons/vista_bench.ico', label: 'Home' },
                { path: '/cj', imgSrc: '/aero-icons/vista_book_3.ico', label: 'Čeština' },
                { path: '/it', imgSrc: '/aero-icons/vista_pc_1.ico', label: 'IT Otázky' },
                { path: '/search', imgSrc: '/aero-icons/vista_search_globe.ico', label: 'Vyhledávání' },
                { path: '/presentations', imgSrc: '/aero-icons/vista_info.ico', label: 'Prezentace (PDF)' },
            ]
        },
        {
            label: 'Entertainment',
            items: [
                { path: '/dopamine', imgSrc: '/aero-icons/roblox1.ico', label: 'Dopamine' },
            ]
        },
        {
            label: 'Community',
            items: [
                { path: '/chat', imgSrc: '/aero-icons/vista_messenger.ico', label: 'Live Chat' },
            ]
        },
        {
            label: 'Website',
            items: [
                { path: '/progress', imgSrc: '/aero-icons/vista_perf_center.ico', label: 'Progress' },
            ]
        }
    ];

    return (
        <aside id="navigationMenu" className="bg-black/80 p-2 rounded-lg border border-gray-600">
            {navGroups.map((group) => (
                <div key={group.label} className="mb-4">
                    {/* Glossy Header */}
                    <div className="bg-gradient-to-b from-gray-700 to-black text-white text-xs font-bold px-2 py-1 rounded-t border border-gray-600 border-b-0 shadow-inner">
                        {group.label}
                    </div>
                    {/* Items Container */}
                    <div className="bg-black/50 border border-gray-600 rounded-b p-1 space-y-1">
                        {group.items.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-2 py-1.5 rounded transition-all border border-transparent 
                                    ${isActive(item.path)
                                        ? 'bg-gradient-to-b from-green-600 to-green-900 border-green-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]'
                                        : 'bg-gradient-to-b from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 border-gray-700 hover:border-gray-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                                    }`}
                            >
                                <img src={item.imgSrc} alt="" className="w-5 h-5 mr-2 drop-shadow-md" />
                                <span className="text-white text-sm font-medium shadow-black drop-shadow-md">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}

            {/* Bottom Section — Date & Countdown */}
            <div className="nav-bottom-info">
                <div className="nav-date-display">
                    <img src="/aero-logo.png" alt="" className="nav-bottom-logo" />
                    <div>
                        <span className="nav-day-name">{dayNames[currentDate.getDay()]}</span>
                        <span className="nav-date-text">{currentDate.getDate()}. {monthNames[currentDate.getMonth()]}</span>
                    </div>
                </div>
                <div className="nav-countdown">
                    {daysLeft > 0 ? `${daysLeft} dní do maturity` : 'Maturita!'}
                </div>
            </div>
        </aside>
    );
};

export default FrutigerSidebar;
