import React from "react";
import { Box, Typography, Card, CardContent, Stack } from "@mui/material";

interface Tip {
  title: string;
  description: string;
}

const tips: Tip[] = [
  {
    title: "قد بأمان",
    description: "اتبع دائمًا قواعد المرور وتجنب الانشغال أثناء القيادة.",
  },
  {
    title: "حافظ على نظافة سيارتك",
    description: "احرص على نظافة داخل وخارج السيارة لتوفير تجربة أفضل للركاب.",
  },
  {
    title: "كن دقيقًا في المواعيد",
    description: "احرص على الوصول في الوقت المحدد لاستلام الركاب لضمان تجربة سلسة.",
  },
  {
    title: "كن مهذبًا",
    description: "رحب بركابك بأدب وحافظ على موقف ودود طوال الرحلة.",
  },
  {
    title: "تحقق من طرقك",
    description: "استخدم تطبيقات الملاحة لتجنب الازدحام وإيجاد أسرع الطرق.",
  },
];

const TipsForDrivers: React.FC = () => {
  return (
    <Box sx={{ p: 4, direction: "rtl" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
        اقتراحات العملاء 
      </Typography>

      <Stack spacing={2}>
        {tips.map((tip, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {tip.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tip.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default TipsForDrivers;
