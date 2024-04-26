import React, { useState } from 'react';


function Modal() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="modal-wrapper-theme">
            {/* Sidebar cogwheel button */}
            <button
                className="cogwheel-button"
                onClick={() => setShowModal(!showModal)} // Toggle the showModal state
            >
                <i className="fas fa-cog"></i>
            </button>

            {/* Modal container */}
            {showModal && (
                <div className="modal-overlay-theme" style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-content-theme">
                        {/*<span className="close-button" onClick={() => setShowModal(false)}>
                            &times;
                        </span>
                        <h2>Theme Settings</h2>
                        <p>Choose a theme:</p>*/}

                        <div className="container-construction">
                            <h1>This page is under construction</h1>
                            <p>We&#39;ll be here soon with our new awesome site.</p>
                        </div>
                        {/*<div className="theme-buttons"><ul><li>
                            <button className="theme-button red" onClick={() => handleThemeChange('theme1')}>
                                Theme 1
                            </button>
                            <button className="theme-button" onClick={() => handleThemeChange('theme2')}>
                                Theme 2
                            </button>
                            <button className="theme-button" onClick={() => handleThemeChange('theme3')}>
                                Theme 3
                            </button></li></ul>
                            
                        </div>
                        
                        <div className="theme-select">
                            <select>
                                <option value="theme1" onClick={() => handleThemeChange('theme1')}>Theme 1</option>
                                <option value="theme2" onClick={() => handleThemeChange('theme2')}>Theme 2</option>
                                <option value="theme3" onClick={() => handleThemeChange('theme3')}>Theme 3</option>
                            </select>
                        </div>*/}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Modal;

function handleThemeChange(arg0: string): void {
    throw new Error('Function not implemented.');
}
