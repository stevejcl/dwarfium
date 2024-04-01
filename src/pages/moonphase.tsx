
import Script from 'next/script'
export default function Moonphase() {


    return (
        <div>
            <section className="daily-horp d-inline-block w-100">
                <br />
                <br />
                <br />
                <br />
                <br />

                <div className="container">
                    <main>
                       
                            
                            <div className="weather-by-city">
                                <h2 className="is-size-3 ml-3 is-inline is-mobile">Moon Phase by City : </h2>
                                <form className="form is-inline is-mobile ml-4">
                                    <input name="city" type="text" id="input" />
                                    <div className="form-buttons is-inline is-mobile" />
                                    <button
                                        type="submit"
                                        id="search-btn"
                                        className="city-search-btn is-inline"
                                    >
                                        Search
                                    </button>
                                    <button
                                        id="clear-city"
                                        className="city-search-btn is-inline ml-2"
                                        type="button"
                                    >
                                        Clear City
                                    </button>
                                </form>
                            </div>
                            {/* container for modal*/}
                            <div className="error-modal-container">
                                <div className="error-modal">
                                    <h3>Please search a valid city!</h3>
                                    <button id="error-close">Close</button>
                                </div>
                            </div>
                        
                        <div className="month-input">
                            <label htmlFor="start" className="is-size-3">
                                Select Month : 
                            </label>
                            <input
                                type="month"
                                id="start"
                                name="start"
                                min="2021-01"
                                defaultValue="2021-10"
                                onChange="loadPage()"
                            />
                        </div>
                        <div className="columns is-mobile">
                            <div className="calendar">
                                <div className="monthYear columns is-mobile">
                                    <div className="month column">Month</div>
                                    <div className="year column">Year</div>
                                </div>
                                <div className="weekDays columns is-mobile">
                                    <div className="column">SUN</div>
                                    <div className="column">MON</div>
                                    <div className="column">TUE</div>
                                    <div className="column">WED</div>
                                    <div className="column">THU</div>
                                    <div className="column">FRI</div>
                                    <div className="column">SAT</div>
                                </div>
                                <div className="weeks first columns is-mobile">
                                    <div className="days column" data-wom={1} data-dow={0}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={1} data-dow={1}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={1} data-dow={2}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={1} data-dow={3}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={1} data-dow={4}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={1} data-dow={5}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={1} data-dow={6}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                </div>
                                <div className="weeks second columns is-mobile">
                                    <div className="days column" data-wom={2} data-dow={0}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={2} data-dow={1}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={2} data-dow={2}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={2} data-dow={3}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={2} data-dow={4}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={2} data-dow={5}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={2} data-dow={6}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                </div>
                                <div className="weeks third columns is-mobile">
                                    <div className="days column" data-wom={3} data-dow={0}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={3} data-dow={1}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={3} data-dow={2}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={3} data-dow={3}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={3} data-dow={4}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={3} data-dow={5}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={3} data-dow={6}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                </div>
                                <div className="weeks fourth columns is-mobile">
                                    <div className="days column" data-wom={4} data-dow={0}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={4} data-dow={1}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={4} data-dow={2}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={4} data-dow={3}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={4} data-dow={4}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={4} data-dow={5}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={4} data-dow={6}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                </div>
                                <div className="weeks fifth columns is-mobile">
                                    <div className="days column" data-wom={5} data-dow={0}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={5} data-dow={1}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={5} data-dow={2}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={5} data-dow={3}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={5} data-dow={4}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={5} data-dow={5}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={5} data-dow={6}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                </div>
                                <div className="weeks sixth columns is-mobile">
                                    <div className="days column" data-wom={6} data-dow={0}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={6} data-dow={1}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={6} data-dow={2}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={6} data-dow={3}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={6} data-dow={4}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={6} data-dow={5}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                    <div className="days column" data-wom={6} data-dow={6}>
                                        <code className="dayBox is-pulled-left" />
                                        <img
                                            src=""
                                            alt=""
                                            className="is-pulled-right img-moon"
                                            height={80}
                                            width={80}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div id="weather-container" className="weather ml-2">
                                {/* error modal for any other errors */}
                                <div id="error-catch-container">
                                    <div className="error-catch-modal">
                                        <h2>There has been an error!</h2>
                                        <button id="error-catch-close">Try again</button>
                                    </div>
                                </div>
                                <h3 className="weather-background">Daily Moon Phase</h3>
                                <div id="weather-data-container" className="weather-background">
                                    <div id="city-name" className="is-inline mb-4 weather-background" /><br/>
                                    <div id="weather-today" className="is-inline mb-4 weather-background" />
                                    <div id="weather-info">
                                        <div
                                            id="moon-phase"
                                            className="has-text-left mb-3 weather-background"
                                        />
                                        <div
                                            id="moon-rise"
                                            className="has-text-left mb-3 weather-background"
                                        />
                                        <div
                                            id="moon-set"
                                            className="has-text-left mb-3 weather-background"
                                        />
                                        <div
                                            id="cloud-coverage"
                                            className="has-text-left mb-3 weather-background"
                                        />
                                        <div
                                            id="air-temp"
                                            className="has-text-left mb-3 weather-background"
                                        />
                                        <div
                                            id="precipitation"
                                            className="has-text-left mb-3 weather-background"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </main>
                    {""}
                    <br/>
                    <br />
                    <br />
                    <br />
                </div>
            </section >
            
<Script src="../assets/js/moonphase.js" async />
        </div>
            
                
    );
}
