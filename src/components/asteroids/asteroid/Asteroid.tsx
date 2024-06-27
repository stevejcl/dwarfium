import { AsteroidData } from "@/components/asteroids/api/types";
import { comparisonSize } from "@/components/asteroids/functions/comparison";
import Image from "next/image";
import React from "react";

import imgBullet from "/public/images/rifle-bullet.png";

type AsteroidProps = {
    data: AsteroidData;
};

export const Asteroid: React.FC<AsteroidProps> = ({ data }) => {
    const asteroidEstimatedSize = Math.round(
        ((data.estimated_diameter?.meters?.estimated_diameter_max || 0) +
            (data.estimated_diameter?.meters?.estimated_diameter_min || 0)) /
        2
    );

    const asteroidApproachTime =
        data.close_approach_data?.[0]?.close_approach_date_full?.split(" ")[1];

    const asteroidSpeed = Math.round(
        data.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second || 0
    );

    const asteroidMissDistance =
        Math.round(
            (data.close_approach_data?.[0]?.miss_distance?.astronomical || 0) * 100
        ) / 100;

    const compareSize = comparisonSize(asteroidEstimatedSize);

    const handleGotoClick = async () => {
        const asteroidName = data.name?.match(/\(([^)]+)\)/)?.[1] || "";
        try {
            const response = await fetch(
                `http://localhost:8090/api/objects/info?name=${encodeURIComponent(asteroidName)}&format=json`
            );
            const stellariumData = await response.json();
            if (stellariumData && stellariumData.ra && stellariumData.dec) {
                const responseGoto = await fetch(
                    `http://localhost:8090/api/main/view?ra=${stellariumData.ra}&dec=${stellariumData.dec}`
                );
                if (responseGoto.ok) {
                    console.log(`Asteroid ${asteroidName} centered in Stellarium`);
                } else {
                    console.error(`Failed to center asteroid ${asteroidName} in Stellarium`);
                }
            } else {
                console.error(`Asteroid ${asteroidName} coordinates not found in Stellarium database`);
            }
        } catch (error) {
            console.error(`Error centering asteroid ${asteroidName} in Stellarium:`, error);
        }
    };

    return (
        <div className="asteroid">
            <div className="container">
                <div className="details">
                    <h3 className="name">{data.name?.match(/\(([^)]+)\)/)?.[1] || ""}</h3>
                    <p>Estimated Size - {asteroidEstimatedSize} м</p>
                    <p>Approach Time - {asteroidApproachTime} UTC</p>
                    <p>Distance - {asteroidMissDistance} au</p>
                    <p>Speed - {asteroidSpeed} KM/Sec</p>
                    {data.is_potentially_hazardous_asteroid ? (
                        <div className="dangerous">Potentially Dangerous</div>
                    ) : (
                        <div className="notDangerous">Not Dangerous</div>
                    )}
                    <button
                        type="button"
                        className="btn btn-more02 w-40"
                        onClick={handleGotoClick}
                    >
                        Goto
                    </button>
                </div>
                <div className="comparison">
                    <Image
                        className="comparisonSizeImage"
                        src={compareSize.img || ""}
                        alt={compareSize.text}
                    />
                    <div>{compareSize.text}</div>
                </div>
                <div className="comparison">
                    <Image
                        className="comparisonSpeedImage"
                        src={imgBullet}
                        alt={"Asteroid speed"}
                    />
                    <div>{asteroidSpeed > 1 && `${asteroidSpeed}X`} Bullet speed</div>
                </div>
            </div>
        </div>
    );
};

export default Asteroid;
