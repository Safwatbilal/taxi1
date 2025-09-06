import React, { useState } from "react";
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
  Button,
  Dialog,
  DialogContent,
  DialogActions,
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
import TripNotification from "@/components/ui/tripNotificaton";
import ProgressBar from "@/components/ui/progressBar";
import { AlarmCheck, Bell, DollarSign, Map, MapPin, Timer } from "lucide-react";

// const earningsData = [
//   { day: "الإثنين", earnings: 100 },
//   { day: "الثلاثاء", earnings: 150 },
//   { day: "الأربعاء", earnings: 120 },
//   { day: "الخميس", earnings: 200 },
//   { day: "الجمعة", earnings: 180 },
//   { day: "السبت", earnings: 220 },
//   { day: "الأحد", earnings: 240 },
// ];

// const recentTrips = [
//   {
//     date: "01 أغسطس 2025",
//     pickup: "الجادة الخامسة",
//     dropoff: "الشارع العاشر",
//     fare: "18.40$",
//   },
//   {
//     date: "02 أغسطس 2025",
//     pickup: "الحديقة المركزية",
//     dropoff: "شارع وول",
//     fare: "22.10$",
//   },
//   {
//     date: "03 أغسطس 2025",
//     pickup: "الشارع الرئيسي",
//     dropoff: "جسر بروكلين",
//     fare: "16.75$",
//   },
// ];

// const summary = [
//   { label: "رحلات اليوم", value: "6" },
//   { label: "أرباح اليوم", value: "135.00$" },
//   { label: "رحلات الأسبوع", value: "42" },
//   { label: "أرباح الأسبوع", value: "845.50$" },
// ];

const DriverDashboard = () => {
  const [notificationIsOpen,setNotificaionIsOpne]=useState<boolean>();
  const onRejectTrip=()=>{
    setNotificaionIsOpne(false);
  }
    const onOpenNote=()=>{
    setNotificaionIsOpne(!notificationIsOpen);
  }
  console.log(notificationIsOpen)
  return (<>
  <Button onClick={onOpenNote}>Open trip</Button>
   {notificationIsOpen &&    <>
      <Dialog
        open={notificationIsOpen}
        onClose={onRejectTrip}
        maxWidth="sm"
        fullWidth
        sx={{fontSize:18}}
      >
        <DialogContent className="space-y-4">
          {/* Countdown progress bar */}
          <ProgressBar
            Timer={10000}
            timeout={() => setNotificaionIsOpne(false)}
          />

         <div className="flex justify-center gap-3"> <h2 className="font-bold text-lg text-center">يوجد رحلة جديدة</h2><Bell className="alarm-moving"/></div>

          <div className="text-right">
            <ul className="space-y-1">
              <li className="flex gap-1 justify-between">
                <div className="flex">
                  <MapPin className="w-5 h-5 text-red-600" /><p> من : </p>
                </div>
                <p> حلب الجديدة</p>
                </li>
              <li className="flex  gap-1 justify-between">
                <div className="flex">
                  <Map className="w-6 h-6 text-green-600" /><p> إلى : </p></div>
                <p>الفرقان</p>
                </li>
              <li className="flex  gap-1  justify-between">
                <div className="flex">
                  <DollarSign className="w-6 h-6 text-green-600" />
                <p> الكلفة المتوقعة : </p>
                </div>
                <p> 12000ل.س</p>
              </li>
              <li className="flex  gap- justify-between">
                <div className="flex">
                  <Timer className="w-6 h-6 text-gray-600" /><p> الوقت التقريبي للرحلة : </p>
                  </div>
                <p> 40 د</p>
              </li>
            </ul>
          </div>
        </DialogContent>

        <DialogActions>
          <div className="w-full flex justify-around">
          <Button
            variant="contained"
            color="success"
            >
            قبول
          </Button>
          <Button variant="contained" onClick={onRejectTrip} color="error">
            رفض
          </Button>
            </div>
        </DialogActions>
      </Dialog>
    </>} 
  </>

    
  ) }

export default DriverDashboard;
// // 
//     <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", py: 4, direction: "rtl" }}>
//       <Container maxWidth="lg">
//         <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
//           لوحة تحكم السائق
//         </Typography>

//         {/* Summary Cards using Flexbox */}
//         <Box
//           sx={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: 3,
//             justifyContent: "space-between",
//             mb: 4,
//           }}
//         >
//           {summary.map((item, index) => (
//             <Card
//               key={index}
//               sx={{
//                 flex: "1 1 200px",
//                 minWidth: "200px",
//               }}
//             >
//               <CardContent>
//                 <Typography variant="subtitle2" color="textSecondary" textAlign="right">
//                   {item.label}
//                 </Typography>
//                 <Typography variant="h5" fontWeight="bold" textAlign="right">
//                   {item.value}
//                 </Typography>
//               </CardContent>
//             </Card>
//           ))}
//         </Box>

//         {/* Main Content Row (Trips & Sidebar) */}
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: { xs: "column", md: "row" },
//             gap: 3,
//           }}
//         >
//           {/* Recent Trips Table */}
//           <Box sx={{ flex: 2 }}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="right">
//                   الرحلات الأخيرة
//                 </Typography>
//                 <Divider sx={{ mb: 2 }} />
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell align="right">التاريخ</TableCell>
//                       <TableCell align="right">مكان الانطلاق</TableCell>
//                       <TableCell align="right">مكان الوصول</TableCell>
//                       <TableCell align="right">الأجرة</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {recentTrips.map((trip, index) => (
//                       <TableRow key={index}>
//                         <TableCell align="right">{trip.date}</TableCell>
//                         <TableCell align="right">{trip.pickup}</TableCell>
//                         <TableCell align="right">{trip.dropoff}</TableCell>
//                         <TableCell align="right">{trip.fare}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//                 <Typography
//                   variant="body2"
//                   color="primary"
//                   sx={{ mt: 2, cursor: "pointer" }}
//                   textAlign="right"
//                 >
//                   عرض جميع الرحلات
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Box>

//           {/* Sidebar (Earnings Chart + Rating) */}
//           <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
//             {/* Weekly Earnings Chart */}
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="right">
//                   أرباح الأسبوع
//                 </Typography>
//                 <ResponsiveContainer width="100%" height={200}>
//                   <LineChart data={earningsData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="day" reversed />
//                     <YAxis />
//                     <Tooltip />
//                     <Line
//                       type="monotone"
//                       dataKey="earnings"
//                       stroke="#1976d2"
//                       strokeWidth={2}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             {/* Driver Rating */}
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="right">
//                   تقييم السائق
//                 </Typography>
//                 <Typography variant="h3" fontWeight="bold" textAlign="right">4.9</Typography>
//                 <Rating value={4.9} precision={0.1} readOnly size="large" sx={{ justifyContent: 'flex-end', display: 'flex' }} />
//                 <Typography variant="body2" color="textSecondary" textAlign="right">
//                   بناءً على 320 تقييم
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Box>
//         </Box>
//       </Container>
//     </Box>
//   );
// };