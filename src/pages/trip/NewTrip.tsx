import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Route,
  Sparkles,
  ArrowRight,
  Car,
  Users,
  Crown,
  DollarSign,
  Check,
  X,
  ArrowLeft,
  Clock,
  Star,
  Shield,
  Zap,
  RotateCcw,
  Search,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "@/lib/axios";
import {
  pickupIcon as startIcon,
  dropoffIcon as endIcon,
  currentLocationIcon,
} from "./tripIcons";
import {
  calculateDistance,
  getRoute,
  MapEvents,
} from "@/util/newTripFunctions";
import {
  DriverCard,
  StepIndicator,
  VehicleSizeCard,
  VehicleTypeCard,
} from "../../components/ui/newTripComp";
import { useSocket } from "@/components/provider/SocketProvider";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const driverIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdn-icons-png.flaticon.com/512/10740/10740612.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [60, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Location {
  lat: number;
  lng: number;
}

interface Driver {
  location: {
    type: string;
    coordinates: [number, number];
  };
  _id: string;
  user: string;
  status: string;
  isAvailable: boolean;
  licenseNumber: string;
  vehicleType: string;
  vehicleSize: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface RouteStep {
  lat: number;
  lng: number;
}

interface AcceptedTripData {
  tripId: string;
  driverID: string;
  lat: number;
  lng: number;
}

interface DriverLocationUpdate {
  tripId: string;
  lat: number;
  lng: number;
}

export default function TripPlanner() {
  const { socket, isConnected } = useSocket();
  console.log({ isConnected });
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSetStart, setHasSetStart] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [vehicleType, setVehicleType] = useState<string>("");
  const [vehicleSize, setVehicleSize] = useState<string>("");
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [route, setRoute] = useState<RouteStep[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);
  const [tripId, setTripId] = useState<string | null>(null);
  const [waitingForDriver, setWaitingForDriver] = useState<boolean>(false);
  const [driverLocation, setDriverLocation] = useState<Location | null>(null);
  const [driverToStartRoute, setDriverToStartRoute] = useState<RouteStep[]>([]);
  const [showTripDetails, setShowTripDetails] = useState<boolean>(false);
  const [isLoadingDriverRoute, setIsLoadingDriverRoute] =
    useState<boolean>(false);
  const [showTripMap, setShowTripMap] = useState<boolean>(false);
  const mapRef = useRef<any>(null);
  const userId = localStorage.getItem("userId");
  console.log({ userId });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          setStartLocation(userPos);
        },
        (error) => {
          console.warn("خطأ في الحصول على الموقع:", error);
          const defaultLocation: Location = { lat: 24.7136, lng: 46.6753 };
          setUserLocation(defaultLocation);
          setStartLocation(defaultLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit("rider:join", { riderID: userId });

    socket.on("trip:accepted", async (data: AcceptedTripData) => {
      console.log("✅ Trip accepted:", data);
      toast.success("تم قبول الرحلة بنجاح!");

      const driverPos: Location = { lat: data.lat, lng: data.lng };
      setDriverLocation(driverPos);
      setTripId(data.tripId || "confirmed");
      setIsBooking(false);
      setWaitingForDriver(false);
      setShowTripMap(true);

      if (startLocation) {
        setIsLoadingDriverRoute(true);
        try {
          const driverRoute = await getRoute(driverPos, startLocation);
          setDriverToStartRoute(driverRoute);
        } catch (error) {
          console.error("Error getting driver route:", error);
        } finally {
          setIsLoadingDriverRoute(false);
        }
      }
    });

    socket.on(
      "driverLocationUpdateToRider",
      async (data: DriverLocationUpdate) => {
        console.log("📍 Driver location update", data);

        if (data.tripId === tripId) {
          const newDriverLocation: Location = { lat: data.lat, lng: data.lng };
          setDriverLocation(newDriverLocation);

          if (startLocation) {
            setIsLoadingDriverRoute(true);
            try {
              const updatedDriverRoute = await getRoute(
                newDriverLocation,
                startLocation
              );
              setDriverToStartRoute(updatedDriverRoute);
            } catch (error) {
              console.error("Error updating driver route:", error);
            } finally {
              setIsLoadingDriverRoute(false);
            }
          }
        }
      }
    );

    return () => {
      socket.off("trip:response");
      socket.off("trip:accepted");
      socket.off("driverLocationUpdateToRider");
    };
  }, [socket, isConnected, userId, startLocation, tripId]);

  const handleMapClick = useCallback(
    async (latlng: L.LatLng) => {
      const location: Location = { lat: latlng.lat, lng: latlng.lng };

      if (!hasSetStart) {
        setStartLocation(location);
        setHasSetStart(true);
      } else {
        setEndLocation(location);
        setIsLoadingRoute(true);

        if (startLocation) {
          const routeSteps = await getRoute(startLocation, location);
          setRoute(routeSteps);
        }
        setIsLoadingRoute(false);
      }
    },
    [hasSetStart, startLocation]
  );

  const resetLocations = (): void => {
    setStartLocation(userLocation);
    setEndLocation(null);
    setHasSetStart(false);
    setStep(1);
    setVehicleType("");
    setVehicleSize("");
    setRoute([]);
    setTripId(null);
    setWaitingForDriver(false);
    setShowTripMap(false);
    setDriverLocation(null);
    setDriverToStartRoute([]);
  };

  const resetToCurrentLocation = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newLocation);
          setStartLocation(newLocation);
          setEndLocation(null);
          setHasSetStart(false);
          setRoute([]);
        },
        (error) => {
          console.warn("خطأ في تحديد الموقع:", error);
        }
      );
    }
  };

  const handleSheetOpenChange = (open: boolean): void => {
    if (showTripMap) return;

    setIsSheetOpen(open);
    if (open) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 800);
    } else {
      resetLocations();
    }
  };

  const canProceedToStep2 = startLocation && endLocation;
  const canProceedToStep3 = vehicleType;
  const canProceedToStep4 = vehicleSize;

  const handleNextStep = () => {
    if (step <= 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleBookTrip = async () => {
    if (!startLocation || !endLocation || !vehicleType || !vehicleSize) return;

    setIsBooking(true);
    setWaitingForDriver(true);

    try {
      const distance = calculateDistance(startLocation, endLocation);
      const duration = Math.round(distance * 1.5);
      const price = Math.round(distance * 5);

      const bookingData = {
        userID: userId,
        start_location_lat: startLocation.lat,
        start_location_lng: startLocation.lng,
        end_location_lat: endLocation.lat,
        end_location_lng: endLocation.lng,
        distance_km: distance,
        duration_min: duration,
        price: price,
        vehicleType: vehicleType,
        vehicleSize: parseInt(vehicleSize),
      };

      await axios.post("trip/newTrip", bookingData);
      console.log("📤 Trip request sent:", bookingData);
      toast.success("تم إرسال طلب الرحلة بنجاح 🚕");
    } catch (error) {
      console.error("Error booking trip:", error);
      toast.error("حدث خطأ في حجز الرحلة");
      setIsBooking(false);
      setWaitingForDriver(false);
    }
  };

  const distance =
    startLocation && endLocation
      ? calculateDistance(startLocation, endLocation)
      : 0;
  const estimatedTime = Math.round(distance * 1.5);

  const vehicleTypes = ["VIP", "عادي", "اقتصادي"];

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "تحديد مسار الرحلة";
      case 2:
        return "اختيار نوع السيارة";
      case 3:
        return "تحديد حجم السيارة";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    if (waitingForDriver) {
      return "جاري البحث عن سائق مناسب، يرجى الانتظار...";
    }

    switch (step) {
      case 1:
        return !hasSetStart
          ? "انقر على الخريطة لتحديد نقطة البداية"
          : !endLocation
          ? "انقر مرة أخرى لتحديد نقطة النهاية"
          : "تم تحديد المسار بنجاح، يمكنك المتابعة للخطوة التالية";
      case 2:
        return "اختر نوع السيارة المناسب لاحتياجاتك ومزايا كل فئة";
      case 3:
        return "حدد عدد المقاعد المطلوبة حسب عدد الركاب وقم بتأكيد الحجز";
      default:
        return "";
    }
  };

  if (showTripMap && tripId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4">
        <div className="h-full max-w-6xl mx-auto space-y-4">
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-lg border border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">رحلة نشطة</h3>
                  <p className="text-sm text-muted-foreground">
                    رقم الرحلة: {tripId}
                  </p>
                </div>
              </div>
              <Button
                onClick={resetLocations}
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                إنهاء الرحلة
              </Button>
            </div>
          </div>

          <div className="relative h-[calc(100vh-150px)] w-full rounded-3xl overflow-hidden shadow-xl border border-border/40">
            {(isLoadingDriverRoute || isLoadingRoute) && (
              <div className="absolute top-5 left-5 z-50 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm flex items-center gap-3 shadow-lg">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري حساب المسار...</span>
              </div>
            )}
            <MapContainer
              center={
                startLocation
                  ? [startLocation.lat, startLocation.lng]
                  : userLocation
                  ? [userLocation.lat, userLocation.lng]
                  : [24.7136, 46.6753]
              }
              zoom={12}
              style={{ height: "100%", width: "100%" }}
              className="rounded-3xl grayscale-[20%] contrast-110"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {startLocation && (
                <Marker
                  position={[startLocation.lat, startLocation.lng]}
                  icon={startIcon}
                />
              )}

              {endLocation && (
                <Marker
                  position={[endLocation.lat, endLocation.lng]}
                  icon={endIcon}
                />
              )}

              {driverLocation && (
                <Marker
                  position={[driverLocation.lat, driverLocation.lng]}
                  icon={driverIcon}
                />
              )}

              {route.length > 0 && (
                <Polyline
                  positions={route.map((step) => [step.lat, step.lng])}
                  pathOptions={{
                    color: "#3b82f6",
                    weight: 5,
                    opacity: 0.85,
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                />
              )}

              {driverToStartRoute.length > 0 && (
                <Polyline
                  positions={driverToStartRoute.map((step) => [
                    step.lat,
                    step.lng,
                  ])}
                  pathOptions={{
                    color: "#22c55e",
                    weight: 4,
                    opacity: 0.85,
                    lineCap: "round",
                    lineJoin: "round",
                    dashArray: "10, 10",
                  }}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-lg">
        <div className="space-y-6">
          <div className="relative">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-3xl shadow-2xl shadow-primary/25 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <Route className="w-14 h-14 text-primary-foreground" />
            </div>
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            {isConnected && (
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm">
                <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              مخطط الرحلات الذكي
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-md mx-auto">
              احجز رحلتك التالية مع أفضل السائقين وأحدث السيارات في المدينة
            </p>
            <div className="flex items-center justify-center space-x-6 space-x-reverse text-sm text-muted-foreground">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Shield className="w-4 h-4 text-green-500" />
                <span>آمن ومضمون</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>سريع وموثوق</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span>{isConnected ? "متصل" : "غير متصل"}</span>
              </div>
            </div>
          </div>
        </div>

        {tripId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-800 font-semibold">
              تم قبول رحلتك! رقم الرحلة: {tripId}
            </p>
          </div>
        )}

        <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="shadow-2xl shadow-primary/20 hover:shadow-3xl hover:shadow-primary/30 transform hover:scale-105 transition-all duration-500 px-10 py-6 rounded-2xl text-lg font-semibold group bg-gradient-to-r from-primary to-primary/90"
              disabled={tripId !== null}
            >
              <Navigation className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform duration-500" />
              {tripId ? "رحلة نشطة" : "بدء رحلة جديدة"}
            </Button>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="h-[100vh] rounded-t-3xl border-0 shadow-2xl bg-background/95 backdrop-blur-3xl"
          >
            <SheetHeader className="pb-8 border-b border-border/50">
              <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-6 opacity-60"></div>
              <StepIndicator currentStep={step} totalSteps={4} />
              <SheetTitle className="text-2xl font-bold text-center">
                {waitingForDriver ? "جاري البحث عن سائق..." : getStepTitle()}
              </SheetTitle>
              <SheetDescription className="text-center text-muted-foreground text-lg">
                {getStepDescription()}
              </SheetDescription>

              {waitingForDriver && (
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="60"
                  viewBox="0 0 100 60"
                  fill="none"
                  initial={{ x: -500 }}
                  animate={{ x: -1600 }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                >
                  <rect
                    x="10"
                    y="20"
                    width="80"
                    height="20"
                    rx="4"
                    fill={"#1976d2"}
                  />
                  <path d="M30 20 L40 10 H60 L70 20 Z" fill={"#1976d2"} />
                  <rect
                    x="42"
                    y="12"
                    width="16"
                    height="8"
                    fill="white"
                    opacity="0.9"
                  />
                  <circle cx="25" cy="42" r="8" fill="#222" />
                  <circle cx="75" cy="42" r="8" fill="#222" />
                  <circle cx="25" cy="42" r="3" fill="#bbb" />
                  <circle cx="75" cy="42" r="3" fill="#bbb" />
                </motion.svg>
              )}
            </SheetHeader>

            <div className="flex justify-between items-center border-t border-border/50 pt-6 mt-6">
              <div>
                {step > 1 && !waitingForDriver && (
                  <Button
                    onClick={handlePrevStep}
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 mr-7 rounded-xl border-2 hover:border-primary/30 transition-all duration-300 flex items-center space-x-2 space-x-reverse"
                  >
                    <ArrowRight className="w-5 h-5" />
                    <span>السابق</span>
                  </Button>
                )}
              </div>

              <div>
                {step === 1 && canProceedToStep2 && !waitingForDriver && (
                  <Button
                    onClick={handleNextStep}
                    size="lg"
                    className="px-8 py-4 ml-7 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 flex items-center space-x-2"
                  >
                    <span>التالي</span>
                    <ArrowLeft className="w-6 h-5" />
                  </Button>
                )}

                {step === 2 && canProceedToStep3 && !waitingForDriver && (
                  <Button
                    onClick={handleNextStep}
                    size="lg"
                    className="px-8 py-4 ml-7 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 flex items-center space-x-2"
                  >
                    <span>التالي</span>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                )}
                {step === 3 && canProceedToStep3 && !waitingForDriver && (
                  <Button
                    onClick={handleNextStep}
                    size="lg"
                    className="px-8 py-4 ml-7 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 flex items-center space-x-2"
                  >
                    <span>التالي</span>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                )}

                {step === 4 && canProceedToStep4 && !waitingForDriver && (
                  <Button
                    onClick={handleBookTrip}
                    disabled={isBooking}
                    size="lg"
                    className="px-8 py-4 ml-7 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-60 bg-gradient-to-r from-green-500 to-green-600 flex items-center space-x-2"
                  >
                    {isBooking ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>جاري الحجز...</span>
                      </>
                    ) : (
                      <>
                        <span>تأكيد الحجز</span>
                        <Check className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex-1 flex items-center justify-center py-20">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto"></div>
                  <p className="text-muted-foreground text-lg">
                    جاري تحميل الخريطة...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-6 mt-8 overflow-y-auto pb-6">
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="relative h-[420px] w-full rounded-3xl overflow-hidden shadow-xl border border-border/40">
                      {isLoadingRoute && (
                        <div className="absolute top-5 left-5 z-50 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm flex items-center gap-3 shadow-lg">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>جاري حساب المسار...</span>
                        </div>
                      )}
                      <MapContainer
                        center={
                          userLocation
                            ? [userLocation.lat, userLocation.lng]
                            : [24.7136, 46.6753]
                        }
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                        className="rounded-3xl grayscale-[20%] contrast-110"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                          attribution="&copy; OpenStreetMap contributors"
                        />
                        <MapEvents onMapClick={handleMapClick} />
                        {startLocation && (
                          <Marker
                            position={[startLocation.lat, startLocation.lng]}
                            icon={startIcon}
                          />
                        )}
                        {endLocation && (
                          <Marker
                            position={[endLocation.lat, endLocation.lng]}
                            icon={endIcon}
                          />
                        )}
                        {route.length > 0 && (
                          <Polyline
                            positions={route.map((step) => [
                              step.lat,
                              step.lng,
                            ])}
                            pathOptions={{
                              color: "#3b82f6",
                              weight: 5,
                              opacity: 0.85,
                              lineCap: "round",
                              lineJoin: "round",
                            }}
                          />
                        )}
                      </MapContainer>
                    </div>

                    {startLocation && endLocation && (
                      <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl shadow-lg border border-border/30">
                        <div className="flex flex-col items-center gap-8">
                          <div className="flex items-center gap-8">
                            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                              <Navigation className="w-6 h-6 text-white" />
                            </div>
                            <ArrowRight className="w-8 h-8 text-primary" />
                            <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                              <MapPin className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-6 w-full">
                            <div className="bg-muted/50 p-6 rounded-2xl flex flex-col items-center shadow-sm">
                              <span className="text-3xl font-bold text-primary">
                                {distance.toFixed(1)} كم
                              </span>
                              <span className="text-sm text-muted-foreground mt-1">
                                المسافة
                              </span>
                            </div>
                            <div className="bg-muted/50 p-6 rounded-2xl flex flex-col items-center shadow-sm">
                              <span className="text-3xl font-bold text-primary">
                                {estimatedTime} د
                              </span>
                              <span className="text-sm text-muted-foreground mt-1">
                                الوقت المقدر
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {vehicleTypes.map((type) => (
                        <VehicleTypeCard
                          key={type}
                          type={type}
                          isSelected={vehicleType === type}
                          onSelect={() => setVehicleType(type)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[4, 6, 8, 12, 16].map((size) => (
                        <VehicleSizeCard
                          key={size}
                          size={String(size)}
                          isSelected={vehicleSize === String(size)}
                          onSelect={() => setVehicleSize(String(size))}
                        />
                      ))}
                    </div>

                    {vehicleSize && startLocation && endLocation && (
                      <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/20 shadow-lg">
                        <div className="text-center space-y-3">
                          <h4 className="font-bold text-lg text-primary">
                            تفاصيل الرحلة
                          </h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="bg-background/70 backdrop-blur p-3 rounded-xl">
                              <p className="font-bold text-primary">
                                {distance.toFixed(1)} كم
                              </p>
                              <p className="text-muted-foreground">المسافة</p>
                            </div>
                            <div className="bg-background/70 backdrop-blur p-3 rounded-xl">
                              <p className="font-bold text-primary">
                                {estimatedTime} د
                              </p>
                              <p className="text-muted-foreground">الوقت</p>
                            </div>
                            <div className="bg-background/70 backdrop-blur p-3 rounded-xl">
                              <p className="font-bold text-primary">
                                {Math.round(distance * 5)} ل.س
                              </p>
                              <p className="text-muted-foreground">السعر</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                            <div className="bg-background/70 backdrop-blur p-3 rounded-xl">
                              <p className="font-bold text-primary">
                                {vehicleType}
                              </p>
                              <p className="text-muted-foreground">
                                نوع السيارة
                              </p>
                            </div>
                            <div className="bg-background/70 backdrop-blur p-3 rounded-xl">
                              <p className="font-bold text-primary">
                                {vehicleSize} مقاعد
                              </p>
                              <p className="text-muted-foreground">
                                حجم السيارة
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {step === 4 && (
                  <div className="space-y-6">
                    {vehicleSize && startLocation && endLocation && (
                      <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/20 shadow-lg">
                        <div className="text-center space-y-3">
                          <h4 className="font-bold text-lg text-primary">
                            تفاصيل الرحلة
                          </h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="bg-background/70 backdrop-blur p-3 rounded-xl">
                              <p className="font-bold text-primary">
                                {distance.toFixed(1)} كم
                              </p>
                              <p className="text-muted-foreground">المسافة</p>
                            </div>
                            <div className="bg-background/70 backdrop-blur p-3 rounded-xl">
                              <p className="font-bold text-primary">
                                {estimatedTime} د
                              </p>
                              <p className="text-muted-foreground">الوقت</p>
                            </div>
                            <div className="bg-background/70 backdrop-blur p-3 rounded-xl">
                              <p className="font-bold text-primary">
                                {Math.round(distance * 5)} ل.س
                              </p>
                              <p className="text-muted-foreground">السعر</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                            <div className="bg-background/70 backdrop-blur p-3 rounded-xl">
                              <p className="font-bold text-primary">
                                {vehicleType}
                              </p>
                              <p className="text-muted-foreground">
                                نوع السيارة
                              </p>
                            </div>
                            <div className="bg-background/70 backdrop-blur p-3 rounded-xl">
                              <p className="font-bold text-primary">
                                {vehicleSize} مقاعد
                              </p>
                              <p className="text-muted-foreground">
                                حجم السيارة
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
