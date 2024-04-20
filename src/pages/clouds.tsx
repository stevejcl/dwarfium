import { useState, useEffect } from 'react';
import axios from 'axios';
import "chart.js/auto";
import Chart from '../components/clouds/Chart';
import Daypicker from '../components/clouds/Daypicker';


const Clouds = () => {
   

    const [forecastTimes, setForecastTimes] = useState([]);
    const [cloudArray, setCloudArray] = useState([]);
    const [humidityArray, setHumidityArray] = useState([]);
    const [windArray, setWindArray] = useState([]);

    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const [error, setError] = useState(null);

    useEffect(() => {
        
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/forecast?q=Aalst&appid=`
            )
            .then(response => {
                selectedDate.setHours(23, 0, 0, 0);

                const weatherTonight = response.data.list.filter(
                    (weathersingle: any) => {
                        return (
                            new Date(weathersingle.dt * 1000).getTime() >=
                            selectedDate.getTime() - 3600000 * 6 &&
                            new Date(weathersingle.dt * 1000).getTime() <=
                            selectedDate.getTime() + 3600000 * 12
                        );
                    }
                );

                setForecastTimes(
                    weatherTonight.map((hr: any) => hr.dt_txt.substring(11, 16))
                );
                setCloudArray(weatherTonight.map((hr: any) => hr.clouds.all));
                setHumidityArray(weatherTonight.map((hr: any) => hr.main.humidity));
                setWindArray(weatherTonight.map((hr: any) => hr.wind.speed));

                
            })
            .catch(error => {
                setError(error.message);
                
            });

        
    }, [selectedDate]);

    const clearError = () => {
        setError(null);
    };

   
    

    return (
        <>
            {error }
            
            <section className="daily-horp d-inline-block w-100">
                <div className="container">
            
                        {""}
                        <br />
                        <br />
                        <br/>
                <form className="searchform">
                        <div className="Weather">
                            <form >
                                <div className="row">
                                    <div className="col-3">
                                        <input
                                            type="search"
                                            value=""
                                            placeholder="Enter a city..."
                                            className="form-control-weather"
                                            autoFocus={true}
                                            
                                        />
                                    </div>
                                    <div className="col-search">
                                        <input
                                            type="submit"
                                            value="Search"
                                            className="btn btn-more02 w-100"
                                        />
                                    </div>
                                    <div className="col-3">
                                        <input
                                            type="text"
                                            value=""
                                            
                                            placeholder="Enter API-key"
                                            className="form-control-weather"
                                        />
                                    </div>
                                    <div className="col-api">
                                        <button
                                            type="submit"
                                            
                                            className="btn btn-more02 w-100"
                                        >
                                            Save API Key
                                        </button>
                                    </div>
                                    <div className="col-1">
                                        <Daypicker
                                            selectedDate={selectedDate}
                                            setSelectedDate={setSelectedDate}
                                        />
                                    </div>
                                </div>
                            </form>
                            
                        </div>
                    
                </form>
                    
                </div>
                <Chart
                forecastTimes={forecastTimes}
                cloudArray={cloudArray}
                humidityArray={humidityArray}
                windArray={windArray}
                />
                {""}
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                

            </section>


            
        </>
    );
};

export default Clouds;
