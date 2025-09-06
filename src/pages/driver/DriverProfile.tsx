import React from "react";
import {
  Box,
  Avatar,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Rating,
  Button,
} from "@mui/material";

const DriverProfile: React.FC = () => {
  // بيانات السائق (ثابتة داخل الصفحة)
  const driver = {
    name: "محمد الأحمد",
    photoUrl: ".",
    licenseNumber: "رخصة 231123",
    phone: "+123 123 123 123",
    email: "mohammad@example.com",
    vehicle: "تويوتا بريوس 234",
    licensePlate: "أ ب ج 243",
    rating: 4.8,
    totalTrips: '234',
    joined: "يناير 2020",
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5, direction: "rtl" }}>
      <Card>
        <CardContent>
          {/* الصورة والاسم */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
            <Avatar
              src={driver.photoUrl}
              alt={driver.name}
              sx={{ width: 100, height: 100, mb: 1 }}
            />
            <Typography variant="h5" fontWeight="bold">
              {driver.name}
            </Typography>
            <Rating value={driver.rating} precision={0.1} readOnly />
            <Typography variant="body2" color="textSecondary">
              التقييم: {driver.rating}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* تفاصيل السائق */}
          <Stack spacing={1}>
            <Typography>
              <strong>رقم الجوال:</strong> {driver.phone}
            </Typography>
            <Typography>
              <strong>البريد الإلكتروني:</strong> {driver.email}
            </Typography>
            <Typography>
              <strong>رقم الرخصة:</strong> {driver.licenseNumber}
            </Typography>
            <Typography>
              <strong>نوع المركبة:</strong> {driver.vehicle}
            </Typography>
            <Typography>
              <strong>رقم اللوحة:</strong> {driver.licensePlate}
            </Typography>
            <Typography>
              <strong>إجمالي الرحلات:</strong> {driver.totalTrips}
            </Typography>
            <Typography>
              <strong>تاريخ الانضمام:</strong> {driver.joined}
            </Typography>
          </Stack>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button variant="contained" color="primary">
              تعديل الملف الشخصي
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DriverProfile;
