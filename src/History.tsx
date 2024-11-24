import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
} from "@mui/material";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

export default function History() {
  const [meals, setMeals] = useState<{ date: string; meal: string[] }[]>([]);

  const fetchMeals = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const filteredKeys = keys.filter(
        (key) => key !== "totalLunch" && key !== "totalDinner"
      );
      const result = await AsyncStorage.multiGet(filteredKeys);
      const mealsData = result
        .map(([key, value]) => {
          const parsedValue = value ? JSON.parse(value) : [];
          return {
            date: key,
            meal: parsedValue,
          };
        })
        .flat();
      mealsData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setMeals(mealsData);
    } catch (error) {
      console.error("Error fetching meal data", error);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const renderItem = (item: { date: string; meal: string[] }) => (
    <ListItem key={item.date}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingInline: "100px",
          paddingBlock: "8px",
          width: "100%",
          mr: 2,
          fontSize: "16px",
        }}
      >
        <ListItemText
          primary={
            <Typography sx={{fontSize:'18px'}}>{dayjs(item.date).format("DD MMMM YYYY")}</Typography>
          }
          secondary={
            <Box sx={{ marginTop: "14px" }}>
              {item.meal.includes("Lunch") && (
                <Typography
                  component="span"
                  sx={{
                    backgroundColor: "blue",
                    borderRadius: 1,
                    color: "white",
                    p: "6px",
                    mr: 1,
                    fontSize: "14px",
                  }}
                >
                  Lunch
                </Typography>
              )}
              {item.meal.includes("Dinner") && (
                <Typography
                  component="span"
                  sx={{
                    backgroundColor: "green",
                    borderRadius: 1,
                    color: "white",
                    p: "6px",
                    fontSize: "14px",
                  }}
                >
                  Dinner
                </Typography>
              )}
            </Box>
          }
        />
      </Card>
    </ListItem>
  );

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Box sx={{ padding: "40px", width: "100%" }}>
        <Typography
          sx={{ fontSize: "24px", color: "#000000", textAlign: "center" }}
        >
          Meal History
        </Typography>
        <Box sx={{
            marginBlock: "10px",
            height: "calc(100vh - 100px)",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
          }}>
        <List>{meals.map(renderItem)}</List>
        </Box>
      </Box>
    </Box>
  );
}
