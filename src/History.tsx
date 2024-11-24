import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function History() {
  const [meals, setMeals] = useState<{ date: string; meal: string[] }[]>([]);

  const fetchMeals = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const filteredKeys = keys.filter(key => key !== 'totalLunch' && key !== 'totalDinner');
      const result = await AsyncStorage.multiGet(filteredKeys);
      const mealsData = result.map(([key, value]) => {
        const parsedValue = value ? JSON.parse(value) : [];
        return {
          date: key,
          meal: parsedValue
        };
      }).flat();
      mealsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setMeals(mealsData);
    } catch (error) {
      console.error('Error fetching meal data', error);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const renderItem = (item: { date: string; meal: string[] }) => (
    <ListItem key={item.date} sx={{ mb: 2 }}>
      <ListItemAvatar>
        <Avatar>
          {item.meal.includes("Lunch") ? "L" : "D"}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={item.date}
        secondary={
          <>
            {item.meal.includes("Lunch") && <Typography component="span" sx={{ backgroundColor: 'blue', borderRadius: 1, color: 'white', p: 1, mr: 1 }}>Lunch</Typography>}
            {item.meal.includes("Dinner") && <Typography component="span" sx={{ backgroundColor: 'green', borderRadius: 1, color: 'white', p: 1 }}>Dinner</Typography>}
          </>
        }
      />
    </ListItem>
  );

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
      <Typography variant="h4" gutterBottom>
        Meal History
      </Typography>
      <Paper sx={{ width: '100%' }}>
        <List>
          {meals.map(renderItem)}
        </List>
      </Paper>
    </Box>
    </Box>
  );
}