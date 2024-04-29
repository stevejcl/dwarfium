import React, { useState, useEffect } from 'react';

const Modal: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState('standard');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [fontSize, setFontSize] = useState<number>(16);
    const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('language') || 'en';
        }
        return 'en'; // Default language for server-side rendering
    });
    const [availableLanguages] = useState<string[]>(['en', 'es', 'fr']); // Example list of available languages

    const handleBackgroundChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBackgroundImage(event.target.value);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const applyBackground = () => {
        closeModal();
    };

    useEffect(() => {
        document.body.className = `bg-${backgroundImage} ${theme}-theme`;
    }, [backgroundImage, theme]);

    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme);
    };

    const increaseFontSize = () => {
        setFontSize(fontSize + 1);
    };

    const decreaseFontSize = () => {
        if (fontSize > 1) {
            setFontSize(fontSize - 1);
        }
    };

    const resetFontSize = () => {
        setFontSize(18); // Reset to default font size
    };

    useEffect(() => {
        document.body.style.fontSize = `${fontSize}px`;
    }, [fontSize]);

    const changeLanguage = (lang: string) => {
        setSelectedLanguage(lang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', lang);
        }
    };

    return (
        <div className="modal-wrapper-theme">
            {/* Sidebar cogwheel button */}
            <button className="cogwheel-button" onClick={() => setShowModal(!showModal)}>
                <i className="fas fa-cog"></i>
            </button>

            {/* Modal container */}
            {showModal && (
                <div className="modal-overlay-theme">
                    <div className="modal-content-theme">
                        <h2>Theme Settings</h2>
                        <div className="background-select">
                            <label htmlFor="background-select">Select Background Image:</label>
                            <select id="background-select" onChange={handleBackgroundChange}>
                                <option value="standard">Standard</option>
                                <option value="stars">Stars</option>
                                <option value="stars2">Stars 2</option>
                            </select>
                        </div>
                        <div className="theme-con">
                            <div className="theme-options">
                                <button
                                    className={`btn btn-more02 ${theme === 'light' ? 'active' : ''}`}
                                    onClick={() => handleThemeChange('light')}
                                >
                                    Light Theme
                                </button>
                                <button
                                    className={`btn btn-more02 ${theme === 'dark' ? 'active' : ''}`}
                                    onClick={() => handleThemeChange('dark')}
                                >
                                    Dark Theme
                                </button>
                            </div>
                        </div>
                        <h2>Font Size</h2>
                        <div className="font-size-options">
                            <button className="font-size-button" onClick={increaseFontSize}>
                                <i className="fas fa-plus"></i>
                            </button>
                            <button className="font-size-button" onClick={decreaseFontSize}>
                                <i className="fas fa-minus"></i>
                            </button>
                            <button className="font-size-reset-button" onClick={resetFontSize}>
                                <i className="fas fa-sync-alt"></i>
                            </button>
                        </div>
                        <div className="language-options">
                            <h2>Language</h2>
                            <select value={selectedLanguage} onChange={(e) => changeLanguage(e.target.value)}>
                                {availableLanguages.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="apply-button" onClick={applyBackground}>
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;
