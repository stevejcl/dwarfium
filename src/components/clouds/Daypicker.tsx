import { useState, useEffect } from 'react';
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import 'react-datepicker/dist/react-datepicker.css';

export interface DaypickerProps {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

const Daypicker = ({ selectedDate, setSelectedDate }: DaypickerProps) => {
  const [finalDay, setFinalDay] = useState(new Date());

  useEffect(() => {
    const today = new Date();
    const fiveDaysAway = new Date();
    fiveDaysAway.setDate(today.getDate() + 4);
    setFinalDay(fiveDaysAway);
  }, []);

  return (
    <DatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      minDate={new Date()}
      maxDate={finalDay}
    />
  );
};

export default Daypicker;
