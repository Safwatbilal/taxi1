import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "@/components/provider/SocketProvider";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Navigation,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Car,
  Shield,
  MapPin,
  Route,
  Power,
  PowerOff,
  Play,
  Square,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  pickupIcon as startIcon,
  dropoffIcon as endIcon,
  currentLocationIcon,
} from "../trip/tripIcons";
import { calculateDistance, getRoute } from "@/util/newTripFunctions";
import { motion } from "framer-motion";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface TripRequest {
  userID: string;
  start_location: {
    coordinates: [number, number];
    type: string;
  };
  end_location: {
    coordinates: [number, number];
    type: string;
  };
  distance_km: number;
  duration_min: number;
  price: number;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Location {
  lat: number;
  lng: number;
}

interface RouteStep {
  lat: number;
  lng: number;
}

const HomePage = () => {
  const userType = localStorage.getItem("userType") || "";
  const userId = localStorage.getItem("userId") || "";
  const { socket, isConnected } = useSocket();

  const [currentTripRequest, setCurrentTripRequest] =
    useState<TripRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptedTrip, setAcceptedTrip] = useState<TripRequest | null>(null);
  const [tripStarted, setTripStarted] = useState(false);
  console.log({ acceptedTrip });
  const [driverLocation, setDriverLocation] = useState<Location | null>(null);
  const [routeToPickup, setRouteToPickup] = useState<RouteStep[]>([]);
  const [tripRoute, setTripRoute] = useState<RouteStep[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isMapSheetOpen, setIsMapSheetOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);

  const locationUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const driverPos: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setDriverLocation(driverPos);
          console.log("Driver location:", driverPos);
        },
        (error) => {
          console.warn("خطأ في الحصول على الموقع:", error);
          const defaultLocation: Location = { lat: 24.7136, lng: 46.6753 };
          setDriverLocation(defaultLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    }
  }, []);

  const startLocationTracking = () => {
    if (!acceptedTrip || !socket || !isConnected) return;

    console.log(" Starting location tracking for trip:", acceptedTrip._id);

    if (locationUpdateIntervalRef.current) {
      clearInterval(locationUpdateIntervalRef.current);
    }

    locationUpdateIntervalRef.current = setInterval(() => {
      if (navigator.geolocation && acceptedTrip && socket && isConnected) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentLocation: Location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            setDriverLocation(currentLocation);

            const locationUpdate = {
              tripId: acceptedTrip._id,
              lng: currentLocation.lng,
              lat: currentLocation.lat,
            };

            console.log("📍 Sending location update:", locationUpdate);
            socket.emit("driverLocationUpdate", locationUpdate);
          },
          (error) => {
            console.warn("خطأ في تحديث الموقع:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      }
    }, 5000);
  };

  const stopLocationTracking = () => {
    if (locationUpdateIntervalRef.current) {
      clearInterval(locationUpdateIntervalRef.current);
      locationUpdateIntervalRef.current = null;
      console.log("🛑 Stopped location tracking");
    }
  };

  useEffect(() => {
    if (acceptedTrip && socket && isConnected) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }

    return () => {
      stopLocationTracking();
    };
  }, [acceptedTrip, socket, isConnected]);

  useEffect(() => {
    if (userType !== "driver") return;
    if (!socket || !isConnected) return;

    socket.emit("driver:join", { driverID: userId });

    socket.on("trip:request", (data: TripRequest) => {
      console.log("📥 Received trip request:", data);
      setCurrentTripRequest(data);
      toast.info("طلب رحلة جديد!");
    });

    socket.on("trip:accepted", (data) => {
      console.log("✅ Trip accepted successfully:", data);
      toast.success("تم تأكيد قبول الرحلة!");
      setAcceptedTrip(currentTripRequest);
      setCurrentTripRequest(null);
      setIsProcessing(false);

      if (currentTripRequest && driverLocation) {
        loadRoutes(currentTripRequest);
      }
    });

    socket.on("trip:completed", () => {
      console.log("🏁 Trip completed");
      toast.success("تمت الرحلة بنجاح!");
      setAcceptedTrip(null);
      setTripStarted(false);
      stopLocationTracking();
    });

    socket.on("trip:cancelled", () => {
      console.log("❌ Trip cancelled");
      toast.info("تم إلغاء الرحلة");
      setAcceptedTrip(null);
      setTripStarted(false);
      stopLocationTracking();
    });

    return () => {
      socket.off("trip:request");
      socket.off("trip:accepted");
      socket.off("trip:completed");
      socket.off("trip:cancelled");
    };
  }, [
    socket,
    isConnected,
    userType,
    userId,
    currentTripRequest,
    driverLocation,
  ]);

  const loadRoutes = async (trip: TripRequest) => {
    if (!driverLocation) return;

    setIsLoadingRoute(true);

    const pickupLocation: Location = {
      lat: trip.start_location.coordinates[0],
      lng: trip.start_location.coordinates[1],
    };

    const dropoffLocation: Location = {
      lat: trip.end_location.coordinates[0],
      lng: trip.end_location.coordinates[1],
    };

    console.log("Loading routes:");
    console.log("Driver location:", driverLocation);
    console.log("Pickup location:", pickupLocation);
    console.log("Dropoff location:", dropoffLocation);

    try {
      const [routeToPickupSteps, tripRouteSteps] = await Promise.all([
        getRoute(driverLocation, pickupLocation),
        getRoute(pickupLocation, dropoffLocation),
      ]);

      setRouteToPickup(routeToPickupSteps);
      setTripRoute(tripRouteSteps);
    } catch (error) {
      console.error("Error loading routes:", error);
    }

    setIsLoadingRoute(false);
  };

  const handleResponse = (accepted: boolean) => {
    if (!currentTripRequest || isProcessing) return;
    setIsProcessing(true);

    const responseData = {
      driverID: userId,
      trip: currentTripRequest,
      accepted,
      lat: driverLocation ? driverLocation.lat : null,
      lng: driverLocation ? driverLocation.lng : null,
    };

    console.log("📤 Sending trip:response:", responseData);

    socket?.emit("trip:response", responseData);

    if (accepted) {
      toast.success("تم إرسال قبول الرحلة!");
      setAcceptedTrip(currentTripRequest);
      setCurrentTripRequest(null);
      setIsProcessing(false);

      if (currentTripRequest && driverLocation) {
        loadRoutes(currentTripRequest);
        setIsMapSheetOpen(true);
      }
    } else {
      toast.info("تم رفض الرحلة");
      setCurrentTripRequest(null);
      setIsProcessing(false);
    }
  };

  const handleStartTrip = () => {
    if (!acceptedTrip || !socket) return;

    socket.emit("trip:start", { tripId: acceptedTrip._id });
    setTripStarted(true);
    toast.success("تم بدء الرحلة!");
  };

  const handleEndTrip = () => {
    if (!acceptedTrip || !socket) return;

    socket.emit("trip:end", { tripId: acceptedTrip._id });
    setTripStarted(false);
    setAcceptedTrip(null);
    stopLocationTracking();
    toast.success("تم إنهاء الرحلة!");
  };

  const toggleAvailability = () => {
    if (!driverLocation || !socket || !isConnected || isTogglingAvailability) {
      if (!driverLocation) {
        toast.error("لا يمكن تحديد موقعك الحالي");
      } else if (!isConnected) {
        toast.error("غير متصل بالخادم");
      }
      return;
    }

    setIsTogglingAvailability(true);
    const newAvailabilityStatus = !isAvailable;

    const availabilityData = {
      driverId: userId,
      lng: driverLocation.lng,
      lat: driverLocation.lat,
    };

    console.log("📤 Sending driverAvailable:", availabilityData);

    socket.emit("driverAvailable", availabilityData);

    setIsAvailable(newAvailabilityStatus);
    setIsTogglingAvailability(false);

    if (newAvailabilityStatus) {
      toast.success("تم تفعيل حالة الإتاحة - جاهز لاستقبال الطلبات!");
    } else {
      toast.info("تم إيقاف حالة الإتاحة");
    }
  };

  if (userType !== "driver") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <CardTitle className="text-red-500 mb-4">غير مصرح</CardTitle>
          <p>هذه الصفحة مخصصة للسائقين فقط</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">لوحة السائق</h1>
          <div className="flex items-center justify-center space-x-2 space-x-reverse">
            <motion.div
              animate={{ marginBottom: isConnected ? 0 : 40 }}
            ></motion.div>
            <motion.span
              animate={{ opacity: isConnected ? 1 : [1, 0, 1] }}
              transition={{
                duration: 1,
                repeat: isConnected ? 0 : Infinity,
                ease: "easeInOut",
              }}
              className="text-sm text-gray-600"
            >
              {isConnected ? "" : "جاري الاتصال بالخادم..."}
            </motion.span>
          </div>
        </div>

        <div className="mb-6">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      isAvailable ? "bg-green-500 animate-pulse" : "bg-gray-400"
                    }`}
                  ></div>
                  <div>
                    <h3 className="font-semibold text-lg">حالة الإتاحة</h3>
                    <p className="text-sm text-gray-600">
                      {isAvailable ? "متاح لاستقبال الطلبات" : "غير متاح"}
                    </p>
                    {acceptedTrip && (
                      <p className="text-xs text-blue-600 font-medium">
                        📍 يتم تتبع الموقع كل 5 ثوان
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={toggleAvailability}
                  disabled={
                    isTogglingAvailability || !driverLocation || !isConnected
                  }
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    isAvailable
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isTogglingAvailability ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التحديث...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isAvailable ? (
                        <>
                          <PowerOff className="w-5 h-5" />
                          إيقاف الإتاحة
                        </>
                      ) : (
                        <>
                          <Power className="w-5 h-5" />
                          تفعيل الإتاحة
                        </>
                      )}
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {acceptedTrip ? (
          <div className="space-y-6">
            <Card className="shadow-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-green-700">
                  {tripStarted ? "رحلة جارية" : "رحلة مؤكدة"}
                </CardTitle>
                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <MapPin className="w-4 h-4 animate-pulse" />
                  <span>يتم إرسال الموقع تلقائياً</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                    <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {acceptedTrip.price}
                    </p>
                    <p className="text-sm text-gray-600">ليرة سورية</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                    <Navigation className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {acceptedTrip.distance_km.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">كم</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                    <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">
                      {acceptedTrip.duration_min}
                    </p>
                    <p className="text-sm text-gray-600">دقيقة</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">معرف الرحلة:</span>{" "}
                    {acceptedTrip._id}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">المستخدم:</span>{" "}
                    {acceptedTrip.userID}
                  </p>
                </div>

                <Sheet open={isMapSheetOpen} onOpenChange={setIsMapSheetOpen}>
                  <SheetTrigger asChild>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-bold rounded-xl shadow-lg">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-6 h-6" />
                        عرض المسار إلى نقطة الاستلام
                      </div>
                    </Button>
                  </SheetTrigger>

                  <SheetContent
                    side="bottom"
                    className="h-[90vh] rounded-t-3xl border-0 shadow-2xl bg-background/95 backdrop-blur-3xl"
                  >
                    <SheetHeader className="pb-6 border-b border-border/50">
                      <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-4 opacity-60"></div>
                      <SheetTitle className="text-2xl font-bold text-center text-green-700">
                        المسار إلى نقطة الاستلام
                      </SheetTitle>
                      <SheetDescription className="text-center text-muted-foreground text-lg">
                        اتبع المسار الموضح للوصول إلى موقع الراكب
                      </SheetDescription>

                      <div className="flex gap-4">
                        {!tripStarted ? (
                          <Button
                            onClick={handleStartTrip}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-4 text-lg font-bold rounded-xl shadow-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Play className="w-6 h-6" />
                              بدء الرحلة
                            </div>
                          </Button>
                        ) : (
                          <Button
                            onClick={handleEndTrip}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 text-lg font-bold rounded-xl shadow-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Square className="w-6 h-6" />
                              إنهاء الرحلة
                            </div>
                          </Button>
                        )}
                      </div>
                    </SheetHeader>

                    <div className="flex-1 flex flex-col space-y-6 mt-6 overflow-y-auto pb-6">
                      <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-xl border border-border/40">
                        {isLoadingRoute && (
                          <div className="absolute top-5 left-5 z-50 bg-green-500 text-white px-5 py-2.5 rounded-full text-sm flex items-center gap-3 shadow-lg">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>جاري حساب المسار...</span>
                          </div>
                        )}
                        <MapContainer
                          center={
                            driverLocation
                              ? [driverLocation.lat, driverLocation.lng]
                              : [24.7136, 46.6753]
                          }
                          zoom={13}
                          style={{ height: "100%", width: "100%" }}
                          className="rounded-3xl"
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                          />
                          {driverLocation && (
                            <Marker
                              position={[
                                driverLocation.lat,
                                driverLocation.lng,
                              ]}
                              icon={currentLocationIcon}
                            />
                          )}
                          <Marker
                            position={[
                              acceptedTrip.start_location.coordinates[0],
                              acceptedTrip.start_location.coordinates[1],
                            ]}
                            icon={startIcon}
                          />
                          <Marker
                            position={[
                              acceptedTrip.end_location.coordinates[0],
                              acceptedTrip.end_location.coordinates[1],
                            ]}
                            icon={endIcon}
                          />
                          {routeToPickup.length > 0 && (
                            <Polyline
                              positions={routeToPickup.map((step) => [
                                step.lat,
                                step.lng,
                              ])}
                              pathOptions={{
                                color: "#3b82f6",
                                weight: 5,
                                opacity: 0.8,
                                lineCap: "round",
                                lineJoin: "round",
                                dashArray: "10, 10",
                              }}
                            />
                          )}
                          {tripRoute.length > 0 && (
                            <Polyline
                              positions={tripRoute.map((step) => [
                                step.lat,
                                step.lng,
                              ])}
                              pathOptions={{
                                color: "#fbbf24",
                                weight: 5,
                                opacity: 0.85,
                                lineCap: "round",
                                lineJoin: "round",
                              }}
                            />
                          )}
                        </MapContainer>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardContent>
            </Card>
          </div>
        ) : currentTripRequest ? (
          <Card className="shadow-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-blue-700">
                طلب رحلة جديد!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                  <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {currentTripRequest.price}
                  </p>
                  <p className="text-sm text-gray-600">ليرة سورية</p>
                </div>
                <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                  <Navigation className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {currentTripRequest.distance_km.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">كم</p>
                </div>
                <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                  <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">
                    {currentTripRequest.duration_min}
                  </p>
                  <p className="text-sm text-gray-600">دقيقة</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-bold">المعرف:</span>{" "}
                  {currentTripRequest._id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">المستخدم:</span>{" "}
                  {currentTripRequest.userID}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">الحالة:</span>{" "}
                  {currentTripRequest.status}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">وقت الإنشاء:</span>{" "}
                  {new Date(currentTripRequest.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">آخر تحديث:</span>{" "}
                  {new Date(currentTripRequest.updatedAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">نقطة البداية:</span>{" "}
                  {currentTripRequest.start_location.coordinates[0].toFixed(6)},
                  {currentTripRequest.start_location.coordinates[1].toFixed(6)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">نقطة النهاية:</span>{" "}
                  {currentTripRequest.end_location.coordinates[0].toFixed(6)},
                  {currentTripRequest.end_location.coordinates[1].toFixed(6)}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => handleResponse(true)}
                  disabled={isProcessing}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-bold rounded-xl shadow-lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري القبول...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-6 h-6" />
                      قبول الرحلة
                    </div>
                  )}
                </Button>
                <Button
                  onClick={() => handleResponse(false)}
                  disabled={isProcessing}
                  variant="outline"
                  className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-50 py-6 text-lg font-bold rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <XCircle className="w-6 h-6" />
                    رفض الرحلة
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center p-12 bg-gray-50">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              في انتظار طلبات الرحلات
            </h3>
            <p className="text-gray-500">ستظهر الطلبات الجديدة هنا تلقائياً</p>
            <div className="mt-6">
              <Badge
                variant="outline"
                className={`px-4 py-2 ${
                  isAvailable
                    ? "border-green-500 text-green-600"
                    : "border-gray-400 text-gray-500"
                }`}
              >
                {isAvailable ? "متاح للعمل" : "غير متاح"}
              </Badge>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HomePage;
