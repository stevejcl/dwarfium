import React, { useEffect, useRef } from 'react';

const MosaicPlanner: React.FC = () => {
    const aladinContainerRef = useRef<HTMLDivElement | null>(null);

    // Load external scripts dynamically
    const loadScript = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.type = 'text/javascript';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.body.appendChild(script);
        });
    };

    const initializeAladin = () => {
        if (aladinContainerRef.current) {
            const aladin = (window as any).A?.aladin || (window as any).aladin;

            if (aladin) {
                const containerId = 'aladin_div'; // Consistent naming
                aladinContainerRef.current.id = containerId; // Set ID to match

                // Initialize AladinLite
                const aladinInstance = aladin({
                    target: `#${containerId}`, // Use correct ID selector
                    fov: 60,
                    cooFrame: 'ICRS',
                    survey: 'P/DSS2/color',
                });

                console.log('AladinLite instance:', aladinInstance);
            } else {
                console.error('AladinLite is not available');
            }
        } else {
            console.error('Aladin container is not accessible');
        }
    };


    // Load external scripts when component mounts
    useEffect(() => {
        const loadScripts = async () => {
            try {
                await loadScript('https://code.jquery.com/jquery-1.12.1.min.js');
                await loadScript('https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.js');
                await loadScript('https://www.gstatic.com/charts/loader.js');
                await loadScript('/js/DwarfiumMosaicEngine.js');
                await loadScript('/js/inline.js');
                initializeAladin();
            } catch (error) {
                console.error('Error loading scripts:', error);
            }
        };
        loadScripts();
    }, []);


    return (
        <div id="allDiv" className="all_div">
            
            <div id="DivOne" className="containerMosaic">
                <div className="form-group">
                    <form title="Enter target name or coordinates, click info icon for more info.">
                        <label htmlFor="target">Target:</label>
                        <div className="input-container">
                            <input type="text" id="target" className="input-field" />
                            <button
                                type="button"
                                onClick={() => alert('target_info_text')}
                                className="icon-button"
                            >
                                <img src="img/information-outline.png" alt="Info" />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="form-group">
                    <form title="Select telescope service.">
                        <label htmlFor="current-telescope-service">Service:</label>
                        <select id="current-telescope-service" className="input-select">
                            {/* Options will be added dynamically */}
                        </select>
                    </form>
                </div>

                <div className="form-group">
                    <form title="Select telescope.">
                        <label htmlFor="current-telescope">Telescope:</label>
                        <select id="current-telescope" className="input-select">
                            {/* Options will be added dynamically */}
                        </select>
                    </form>
                </div>

                <div className="form-group">
                    <form title="Select grid type: telescope field of view, mosaic grid or separate mosaic panels.">
                        <label htmlFor="grid_type">View:</label>
                        <select id="grid_type" className="input-select">
                            <option value="fov">FoV</option>
                            <option value="mosaic">Mosaic grid</option>
                        </select>
                    </form>
                </div>

                <div className="form-group">
                    <form title="Select mosaic overlap, a recommended value is to use 20% overlap.">
                        <label htmlFor="overlap_percentage">Mosaic overlap (%):</label>
                        <input type="number" id="overlap_percentage" className="input-field" min="1" max="100" />
                    </form>
                </div>

                <div className="form-group">
                    <form title="Select mosaic grid size.">
                        <label htmlFor="size_x">Grid size (x,y):</label>
                        <div className="input-row">
                            <input type="number" id="size_x" className="input-small" min="1" max="10" />
                            <input type="number" id="size_y" className="input-small" min="1" max="10" />
                        </div>
                    </form>
                </div>

                <div className="form-group">
                    <form title="Select date for target visibility view.">
                        <label htmlFor="view_date">Date (YYYY-MM-DD):</label>
                        <input type="text" id="view_date" className="input-field" />
                    </form>
                </div>
            </div>

            <div id="DivTwo" className="containerMosaicSec">
                <div className="form-group">
                    <label htmlFor="catalog">Catalog:</label>
                    <form title="Select catalog.">
                        <select className="input-select" id="catalog-selection">
                            {/* Options will be added dynamically */}
                        </select>
                    </form>
                </div>
                <div className="form-group">
                    <label htmlFor="object">Object:</label>
                    <div id="catalogDiv" className="catalogDiv"></div>
                </div>
                <div className="form-group">
                    <form title="Show only catalog objects that are higher than selected altitude.">
                        <label htmlFor="Altitude">Altitude:</label>
                        <select id="catalogFilterDegrees" className="input-select">
                            <option value="all">All</option>
                            <option value="0">0°</option>
                            <option value="10">10°</option>
                            <option value="20">20°</option>
                            <option value="30">30°</option>
                            <option value="40">40°</option>
                            <option value="50">50°</option>
                            <option value="60">60°</option>
                            <option value="70">70°</option>
                            <option value="80">80°</option>
                        </select>
                    </form>
                </div>
                <div className="form-group">
                    <form title="Show only catalog objects that are visible at selected time.">
                        <label htmlFor="time">Time:</label>
                        <input type="text" id="catalogFilterTime" size={5} className="input-field" />
                    </form>
                </div>
                <div className="form-group">
                    <label htmlFor="moon">Moon:</label>
                    <form title="Show only catalog objects that are further away from the moon than selected angle.">
                        <select id="catalogFilterMoon" className="input-select">
                            <option value="all">All</option>
                            <option value="45">45°</option>
                            <option value="90">90°</option>
                            <option value="135">135°</option>
                        </select>
                    </form>
                </div>
                <div className="form-group">
                    <label htmlFor="repositionCheckbox">Reposition:</label>
                    <form title="If selected, reposition image framing by moving the image using the mouse.">
                        <div className="checkbox-container">
                            <input type="checkbox" id="repositionCheckbox" />
                        </div>
                    </form>
                </div>
                <div className="button-group">
                    <button
                        title="Refresh current view."
                        onClick={() => console.log('Refresh view clicked')}
                        className="primary-button"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            <div>
                <p id="startup_info_text"></p>
            </div>
            <div>
                <p id="error_text"></p>
            </div>
            <div id="DivLoadPanels"></div>
            
        </div>
    );
};

export default MosaicPlanner;
