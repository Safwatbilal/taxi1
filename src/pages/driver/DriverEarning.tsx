import React from "react";
import { Box, Card, CardContent, Typography, Divider } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EarningsData {
  day: string;
  earnings: number;
}

const earningsData: EarningsData[] = [
  { day: "Mon", earnings: 100 },
  { day: "Tue", earnings: 150 },
  { day: "Wed", earnings: 120 },
  { day: "Thu", earnings: 200 },
  { day: "Fri", earnings: 180 },
  { day: "Sat", earnings: 220 },
  { day: "Sun", earnings: 240 },
];

const EarningsSection: React.FC = () => {
  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        mt: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        Earnings
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Weekly Earnings Overview
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#1976d2"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Box textAlign="center">
            <Typography variant="subtitle1" color="textSecondary">
              Today's Earnings
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              $120.50
            </Typography>
          </Box>

          <Box textAlign="center">
            <Typography variant="subtitle1" color="textSecondary">
              Weekly Earnings
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              $784.20
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EarningsSection;
