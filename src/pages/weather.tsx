import React from "react";
import Weather from "@/components/Weather";

export default function WeatherForeCast() {
  return (
    <section className="daily-horp d-inline-block w-100">
          <div className="container"><br /><br /><br /><br />
              
                  <Weather defaultCity="Belgium" />

              
              <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                      
                

          </div>        
    </section>
  );
}
