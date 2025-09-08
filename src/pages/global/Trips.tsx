import queries from "@/api/trips/query";
import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ChevronFirst,
  ChevronLast,
  MoreHorizontal,
} from "lucide-react";

interface Trip {
  _id: string;
  status: string;
  start_location: {
    coordinates: [number, number];
  };
  end_location: {
    coordinates: [number, number];
  };
  price: number;
  duration_min: number;
  distance_km: number;
  createdAt: string;
  updatedAt: string;
  userID?: string;
  driverID?: string;
}

interface TripsData {
  data: Trip[];
  total: number;
}

const Trips: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 2;
  
  const userType = localStorage.getItem("userType") || "";
  const Id = localStorage.getItem("userId") || "";
  //for total 
  const defaultTotalTrips = 100;
    const { data: usersTotalTrips }: { data?: TripsData } = queries.GetUserTrips(
    Id,
    1,
    defaultTotalTrips
  );
  const { data: driverTotalTrips }: { data?: TripsData } = queries.GetDriverTrips(
    Id,
    1,
    defaultTotalTrips)

  const { data: usersTrip }: { data?: TripsData } = queries.GetUserTrips(
    Id,
    currentPage,
    itemsPerPage
  );

  const { data: driverTrip }: { data?: TripsData } = queries.GetDriverTrips(
    Id,
    currentPage,
    itemsPerPage
  );
  const trips = useMemo(() => {
    if (userType === "driver") {
      return driverTrip?.data || [];
    } else {
      return usersTrip?.data || [];
    }
  }, [userType, driverTrip, usersTrip]);
// console.log(trips.length)
  const totalTrips = useMemo(() => {
    if (userType === "driver") {
      return  driverTotalTrips?.data.length || 0;
    } else {
      return  usersTotalTrips?.data.length || 0;
    }
  }, [userType, driverTotalTrips, usersTotalTrips]);
  const totalPages = Math.ceil(totalTrips / itemsPerPage);
  console.log(totalTrips)
  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-500";
      case "pending":
      case "panding":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "مقبولة";
      case "pending":
      case "panding":
        return "في الانتظار";
      case "completed":
        return "مكتملة";
      case "cancelled":
        return "ملغية";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCoordinates = (coordinates: [number, number]): string => {
    return `${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}`;
  };

  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const generatePageNumbers = (): (number | string)[] => {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter(
      (item, index, arr) => arr.indexOf(item) === index
    );
  };

  if (!trips.length && totalTrips === 0) {
    return (
      <div className="container mx-auto p-6" dir="rtl">
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">لا توجد رحلات</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">رحلاتي </h1>
        <Badge variant="outline" className="text-primary border-primary">
          {totalTrips} رحلة
        </Badge>
      </div>

      <div className="grid gap-4">
        {trips.map((trip: Trip) => (
          <Card
            key={trip._id}
            className="border-primary/20 hover:border-primary/40 transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-primary">
                  رحلة #{trip._id.slice(-8)}
                </CardTitle>
                <Badge className={`${getStatusColor(trip.status)} text-white`}>
                  {getStatusText(trip.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-primary">
                        موقع البداية
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatCoordinates(trip.start_location.coordinates)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-primary">
                        موقع النهاية
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatCoordinates(trip.end_location.coordinates)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-primary">السعر</p>
                      <p className="text-lg font-semibold">{trip.price} ر.س</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-primary">المدة</p>
                      <p className="text-sm">{trip.duration_min} دقيقة</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-2 border-t">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">المسافة</p>
                  <p className="text-sm font-medium text-primary">
                    {trip.distance_km.toFixed(2)} كم
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
                  <p className="text-sm font-medium text-primary">
                    {formatDate(trip.createdAt)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">تاريخ التحديث</p>
                  <p className="text-sm font-medium text-primary">
                    {formatDate(trip.updatedAt)}
                  </p>
                </div>
              </div>

              {userType === "driver" && trip.userID && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">معرف المستخدم</p>
                  <p className="text-sm font-mono text-primary">
                    {trip.userID}
                  </p>
                </div>
              )}

              {userType === "user" && trip.driverID && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">معرف السائق</p>
                  <p className="text-sm font-mono text-primary">
                    {trip.driverID}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {driverTrip && usersTrip &&   <div className="flex flex-col items-center space-y-4 mt-8">
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-primary border-primary hover:bg-primary/10"
          >
            <ChevronRight className="w-4 h-4 ml-1" />
            التالي
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="text-primary border-primary hover:bg-primary/10 ml-2"
          >
            <ChevronLast className="w-4 h-4 ml-1" />
          </Button>

          <div className="flex items-center gap-1 mx-4">
            {generatePageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="text-muted-foreground"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page as number)}
                    className={
                      currentPage === page
                        ? "bg-primary text-white min-w-[40px]"
                        : "text-primary border-primary hover:bg-primary/10 min-w-[40px]"
                    }
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="text-primary border-primary hover:bg-primary/10 mr-2"
          >
            <ChevronFirst className="w-4 h-4 mr-1" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-primary border-primary hover:bg-primary/10"
          >
            السابق
            <ChevronLeft className="w-4 h-4 mr-1" />
          </Button>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div>
            الصفحة {currentPage} من {totalPages}
          </div>
          <div>
            عرض {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, totalTrips)} من إجمالي{" "}
            {totalTrips} رحلة
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            الانتقال إلى الصفحة:
          </span>
          <div className="flex gap-1">
            {[
              1,
              Math.ceil(totalPages / 4),
              Math.ceil(totalPages / 2),
              Math.ceil((3 * totalPages) / 4),
              totalPages,
            ]
              .filter(
                (page, index, arr) =>
                  arr.indexOf(page) === index && page <= totalPages
              )
              .map((page) => (
                <Button
                  key={page}
                  variant="ghost"
                  size="sm"
                  onClick={() => goToPage(page)}
                  disabled={currentPage === page}
                  className="text-xs text-primary hover:bg-primary/10 min-w-[32px] h-8"
                >
                  {page}
                </Button>
              ))}
          </div>
        </div>
      </div>}
           
    </div>
  );
};

export default Trips;
