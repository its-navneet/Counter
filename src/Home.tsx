import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography, Button, Paper} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs, { Dayjs } from 'dayjs';

export default function Home() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));
  const [totalLunch, setTotalLunch] = useState(0);
  const [totalDinner, setTotalDinner] = useState(0);

  useEffect(() => {
    initializeTotals();
  }, []);

  const initializeTotals = async () => {
    try {
      const storedTotalLunch = await AsyncStorage.getItem('totalLunch');
      const storedTotalDinner = await AsyncStorage.getItem('totalDinner');
      if (storedTotalLunch === null) {
        await AsyncStorage.setItem('totalLunch', '0');
      }
      if (storedTotalDinner === null) {
        await AsyncStorage.setItem('totalDinner', '0');
      }
      setTotalLunch(storedTotalLunch ? parseInt(storedTotalLunch) : 0);
      setTotalDinner(storedTotalDinner ? parseInt(storedTotalDinner) : 0);
    } catch (error) {
      console.error('Error initializing totals', error);
    }
  };

  const onPress = async (mealType: string) => {
    try {
      const dateKey = value?.toString() || '';
      const storedMeals = await AsyncStorage.getItem(dateKey);
      const meals = storedMeals ? JSON.parse(storedMeals) : [];
      if (!meals.includes(mealType)) {
        meals.push(mealType);
        await AsyncStorage.setItem(dateKey, JSON.stringify(meals));

        if (mealType === 'Lunch') {
          const newTotalLunch = totalLunch + 1;
          setTotalLunch(newTotalLunch);
          await AsyncStorage.setItem('totalLunch', newTotalLunch.toString());
        } else if (mealType === 'Dinner') {
          const newTotalDinner = totalDinner + 1;
          setTotalDinner(newTotalDinner);
          await AsyncStorage.setItem('totalDinner', newTotalDinner.toString());
        }
      }
    } catch (error) {
      console.error('Error saving meal data', error);
    }
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4" component="div" gutterBottom>
          {value?.format('dddd, MMMM D, YYYY')}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </LocalizationProvider>
        <Box mt={4}>
          <Button variant="contained" color="primary" onClick={() => onPress("Lunch")} sx={{ mr: 2 }}>
            Lunch
          </Button>
          <Button variant="contained" color="secondary" onClick={() => onPress("Dinner")}>
            Dinner
          </Button>
        </Box>
        <Paper elevation={3} sx={{ mt: 4, p: 2, textAlign: 'center' }}>
          <Typography variant="h6">Total Lunch meal: {totalLunch}</Typography>
          <Typography variant="h6">Total Dinner meal: {totalDinner}</Typography>
        </Paper>
      </Box>
    </Box>
  );
}