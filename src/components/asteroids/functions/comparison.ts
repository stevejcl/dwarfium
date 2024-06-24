import { StaticImageData } from 'next/image'

import img5StoreyBuilding from '/public/images/5-storey-building.png'
import img10StoreyBuilding from '/public/images/10-storey-building.png'
import imgAeroplane from '/public/images/aeroplane.png'
import imgBurjKhalifa from '/public/images/burj-khalifa.png'
import imgCar from '/public/images/car.png'
import imgDoor from '/public/images/door.png'
import imgEiffelTower from '/public/images/eiffel-tower.png'
import imgElectricPole from '/public/images/electric-pole.png'
import imgFootballField from '/public/images/football-field.png'
import imgGiraffe from '/public/images/giraffe.png'
import imgPyramids from '/public/images/great-pyramids-of-giza.png'
import imgGuitar from '/public/images/guitar.png'
import imgKilimanjaro from '/public/images/kilimanjaro.png'
import imgPisaTower from '/public/images/leaning-tower-of-pisa.png'
import imgLondonBus from '/public/images/london-bus.png'
import imgMountEverest from '/public/images/mount-everest.png'
import imgSemiTrailerTruck from '/public/images/semi-trailer-truck.png'
import imgStatueLiberty from '/public/images/statue-of-liberty.png'
import imgTajMahal from '/public/images/taj-mahal.png'

export type TComparison = {
    img: StaticImageData | any
    text: string
}

export const comparisonSize = (asteroidSize: number): TComparison => {
    if (asteroidSize <= 1) {
        return {
            img: imgGuitar,
            text: 'Guitar'
        }
    }
    if (asteroidSize === 2) {
        return {
            img: imgDoor,
            text: 'Door'
        }
    }
    if (asteroidSize >= 3 && asteroidSize <= 4) {
        return {
            img: imgCar,
            text: 'Car'
        }
    }
    if (asteroidSize >= 5 && asteroidSize <= 7) {
        return {
            img: imgGiraffe,
            text: 'Giraffe'
        }
    }
    if (asteroidSize >= 8 && asteroidSize <= 9) {
        return {
            img: imgLondonBus,
            text: 'Bus'
        }
    }
    if (asteroidSize >= 10 && asteroidSize <= 12) {
        return {
            img: imgElectricPole,
            text: 'Power Line'
        }
    }
    if (asteroidSize >= 13 && asteroidSize <= 15) {
        return {
            img: img5StoreyBuilding,
            text: '5 Storey Building'
        }
    }
    if (asteroidSize >= 16 && asteroidSize <= 20) {
        return {
            img: imgSemiTrailerTruck,
            text: 'Truck with trailer'
        }
    }
    if (asteroidSize >= 21 && asteroidSize <= 40) {
        return {
            img: img10StoreyBuilding,
            text: '10 Storey Building'
        }
    }
    if (asteroidSize >= 41 && asteroidSize <= 50) {
        return {
            img: imgAeroplane,
            text: 'Aeroplane'
        }
    }
    if (asteroidSize >= 51 && asteroidSize <= 70) {
        return {
            img: imgPisaTower,
            text: 'Leaning Tower of Pisa'
        }
    }
    if (asteroidSize >= 71 && asteroidSize <= 80) {
        return {
            img: imgTajMahal,
            text: 'Taj Mahal'
        }
    }
    if (asteroidSize >= 81 && asteroidSize <= 90) {
        return {
            img: imgStatueLiberty,
            text: 'Statue of Liberty'
        }
    }
    if (asteroidSize >= 91 && asteroidSize <= 180) {
        return {
            img: imgFootballField,
            text: 'Footballfield'
        }
    }
    if (asteroidSize >= 181 && asteroidSize <= 200) {
        return {
            img: imgPyramids,
            text: 'Pyramid'
        }
    }
    if (asteroidSize >= 201 && asteroidSize <= 400) {
        return {
            img: imgEiffelTower,
            text: 'Eiffeltower'
        }
    }
    if (asteroidSize >= 401 && asteroidSize <= 700) {
        return {
            img: imgEiffelTower,
            text: '2X Eiffeltower'
        }
    }
    if (asteroidSize >= 701 && asteroidSize <= 900) {
        return {
            img: imgBurjKhalifa,
            text: 'Burj Khalifa'
        }
    }
    if (asteroidSize >= 901 && asteroidSize <= 1000) {
        return {
            img: imgFootballField,
            text: '10X Footballfield'
        }
    }
    if (asteroidSize >= 1001 && asteroidSize <= 2000) {
        return {
            img: imgBurjKhalifa,
            text: '2X Burj Khalifa'
        }
    }
    if (asteroidSize >= 2001 && asteroidSize <= 3000) {
        return {
            img: imgBurjKhalifa,
            text: '3X Burj Khalifa'
        }
    }
    if (asteroidSize >= 3001 && asteroidSize <= 4000) {
        return {
            img: imgBurjKhalifa,
            text: '4X Burj Khalifa'
        }
    }
    if (asteroidSize >= 4001 && asteroidSize <= 6000) {
        return {
            img: imgKilimanjaro,
            text: 'Kilimanjaro'
        }
    }
    if (asteroidSize >= 6001 && asteroidSize <= 9000) {
        return {
            img: imgMountEverest,
            text: 'MountEverest'
        }
    }

    return {
        img: imgMountEverest,
        text: `${Math.round(asteroidSize / 8000)}X MountEverest`
    }
}
