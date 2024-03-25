import React from "react";

interface IBatteryMeterProperties {
  batteryLevel: number | null;
  isCharging: boolean;
  isFastCharging: boolean;
}

export const grey = "#5C5C60";
export const green = "#6FC829";
export const white = "#FFFFFF";
export const red = "#ff533f";

const getColorForSegment =
  (batteryLevel: number, isCharging: boolean) =>
  (segment: 1 | 2 | 3 | 4 | 5) => {
    if (batteryLevel >= 0.8) {
      return isCharging ? green : grey;
    }
    if (batteryLevel >= 0.6) {
      if (segment < 5) {
        return isCharging ? green : grey;
      } else {
        return white;
      }
    }
    if (batteryLevel >= 0.4) {
      if (segment < 4) {
        return isCharging ? green : grey;
      } else {
        return white;
      }
    }
    if (batteryLevel >= 0.2) {
      if (segment < 3) {
        return isCharging ? green : grey;
      } else {
        return white;
      }
    }
    if (batteryLevel >= 0.05 && segment < 2) {
      return isCharging ? green : red;
    }
    return white;
  };

export default class BatteryMeter extends React.Component<IBatteryMeterProperties> {
  static defaultProps = {
    batteryLevel: null,
    isCharging: false,
    isFastCharging: false,
  };

  render() {
    const { batteryLevel, isCharging, isFastCharging } = this.props;

    const getColor = getColorForSegment(batteryLevel || 0, isCharging);

    if (batteryLevel === null) {
      return null;
    }

    return (
      <div className="battery-meter" data-cy="battery-meter">
        <svg width="50px" height="50px" viewBox="0 0 144 144">
          <g>
            <path
              fill={grey}
              d="M13.4,109h104.7c6.8,0,12.2-5.4,12.2-12.2v-9.9
                            c0.2,0,0.3,0,0.7,0h6.6c2.8,0,5.2-2.3,5.2-5.2V62.4
                    		c0-2.8-2.3-5.2-5.2-5.2H131c-0.2,0-0.5,0-0.7,
                            0v-9.9c0-6.8-5.4-12.2-12.2-12.2H13.4C6.5,35,1.1,40.4,1.1,47.2v49.4
                    		C1.1,103.6,6.5,109,13.4,109z M6,47.6c0-4,3.3-7.3,
                            7.3-7.3h104.7c4,0,7.3,3.3,7.3,7.3V97c0,4-3.3,7.3-7.3,7.3H13.4
                    		c-4,0-7.3-3.3-7.3-7.3V47.6z"
            />
            <path
              data-cy="block-5"
              fill={getColor(5)}
              d="M106.9,44.6h9.8c2.4,0,4.5,2.1,4.5,4.5V95c0,2.4-2.1,
                            4.5-4.5,4.5h-9.8c-2.4,0-4.5-2.1-4.5-4.5V49.1
                    		C102.4,46.7,104.5,44.6,106.9,44.6z"
            />
            <path
              data-cy="block-4"
              fill={getColor(4)}
              d="M84.4,44.6h9.8c2.4,0,4.5,2.1,4.5,4.5V95c0,2.4-2.1,
                            4.5-4.5,4.5h-9.8c-2.4,0-4.5-2.1-4.5-4.5V49.1
                    		C79.7,46.7,81.8,44.6,84.4,44.6z"
            />
            <path
              data-cy="block-3"
              fill={getColor(3)}
              d="M61.4,44.6h9.8c2.4,0,4.5,2.1,4.5,4.5V95c0,2.4-2.1,
                            4.5-4.5,4.5h-9.8c-2.4,0-4.5-2.1-4.5-4.5V49.1
                    		C56.6,46.7,58.7,44.6,61.4,44.6z"
            />
            <path
              data-cy="block-2"
              fill={getColor(2)}
              d="M38.5,44.6h9.8c2.4,0,4.5,2.1,4.5,4.5V95c0,2.4-2.1,
                            4.5-4.5,4.5h-9.8c-2.4,0-4.5-2.1-4.5-4.5V49.1
                    		C33.9,46.7,36,44.6,38.5,44.6z"
            />
            <path
              data-cy="block-1"
              fill={getColor(1)}
              d="M15.6,44.6h9.8c2.4,0,4.5,2.1,4.5,4.5V95c0,
                            2.4-2.1,4.5-4.5,4.5h-9.8c-2.4,0-4.5-2.1-4.5-4.5V49.1
                    		C11.1,46.7,13.2,44.6,15.6,44.6z"
            />
          </g>
          {isCharging && !isFastCharging && (
            <g className="lightning-bolt" data-cy="charging-underlay">
              <polygon
                fill={green}
                points="101.1,13.8 39.4,79.3 70.8,79.2 42.9,130.2 104.6,64.7 73.2,64.7 	"
              />
              <path
                fill={white}
                d="M78.2,61.7l25.5-46.5l1.6-2.9h-7L37.3,
                            77.2l-4.8,5.1l7,0l26.3,0l-25.5,46.5l-1.6,2.9h7l61.1-64.8l4.8-5.1H78.2
                    		z M42.9,130.2l27.9-50.9l-31.4,0l61.6-65.4L73.2,64.7h31.4L42.9,130.2z"
              />
            </g>
          )}
          {isCharging && isFastCharging && (
            <g className="lightning-bolt-fast" data-cy="charging-underlay">
              <polygon
                fill={green}
                points="101.1,13.8 39.4,79.3 70.8,79.2 42.9,130.2 104.6,64.7 73.2,64.7 	"
              />
              <path
                fill={white}
                d="M78.2,61.7l25.5-46.5l1.6-2.9h-7L37.3,
                            77.2l-4.8,5.1l7,0l26.3,0l-25.5,46.5l-1.6,2.9h7l61.1-64.8l4.8-5.1H78.2
                    		z M42.9,130.2l27.9-50.9l-31.4,0l61.6-65.4L73.2,64.7h31.4L42.9,130.2z"
              />
            </g>
          )}
        </svg>
        {batteryLevel < 6 && (
          <div data-cy="low-battery-notice" className="low-battery-notice">
            &nbsp;LOW BATTERY
          </div>
        )}
        {batteryLevel > 6 && (
          <div className="battery-meter--value">&nbsp;{batteryLevel}%</div>
        )}
      </div>
    );
  }
}
