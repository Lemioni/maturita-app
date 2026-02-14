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
                { path: '/', icon: FaHome, label: 'Home' },
                { path: '/cj', icon: FaBook, label: 'Čeština' },
                { path: '/it', icon: FaLaptopCode, label: 'IT Otázky' },
                { path: '/search', icon: FaSearch, label: 'Vyhledávání' },
            ]
        },
        {
            label: 'Entertainment',
            items: [
                { path: '/dopamine', icon: FaRocket, label: 'Dopamine' },
            ]
        },
        {
            label: 'Website',
            items: [
                { path: '/progress', icon: FaStar, label: 'Progress' },
            ]
        }
    ];

    return (
        <aside id="navigationMenu">
            {navGroups.map((group) => (
                <div key={group.label} className="nav-categories">
                    <div className="navbar-titles">{group.label}</div>
                    {group.items.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={isActive(item.path) ? 'nav-active' : 'nav-inactive'}
                        >
                            <item.icon className="nav-icons" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
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
