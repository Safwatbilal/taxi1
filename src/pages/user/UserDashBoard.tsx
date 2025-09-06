import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const earningsData = [
  { day: "الإثنين", earnings: 100 },
  { day: "الثلاثاء", earnings: 150 },
  { day: "الأربعاء", earnings: 120 },
  { day: "الخميس", earnings: 200 },
  { day: "الجمعة", earnings: 180 },
  { day: "السبت", earnings: 220 },
  { day: "الأحد", earnings: 240 },
];

const recentTrips = [
  {
    date: "01 أغسطس 2025",
    pickup: "الجادة الخامسة",
    dropoff: "الشارع العاشر",
    fare: "18.40$",
  },
  {
    date: "02 أغسطس 2025",
    pickup: "الحديقة المركزية",
    dropoff: "شارع وول",
    fare: "22.10$",
  },
  {
    date: "03 أغسطس 2025",
    pickup: "الشارع الرئيسي",
    dropoff: "جسر بروكلين",
    fare: "16.75$",
  },
];

const summary = [
  { label: "رحلات اليوم", value: "6" },
  { label: "أرباح اليوم", value: "135.00$" },
  { label: "رحلات الأسبوع", value: "42" },
  { label: "أرباح الأسبوع", value: "845.50$" },
];

const UserDashboard = () => {
  return (
    <p>HomePage</p>
  );
};

export default UserDashboard;
