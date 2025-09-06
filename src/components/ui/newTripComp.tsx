import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
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
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import vipImg from '../../assets/vipCar.png'
import regularCar from '../../assets/regularCar.png'
import economyCar from '../../assets/economyCar.png'
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});



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

export const ResetLocationButton: React.FC<{
  onReset: () => void;
  disabled?: boolean;
}> = ({ onReset, disabled }) => (
  <Button
    onClick={onReset}
    variant="outline"
    size="sm"
    disabled={disabled}
    className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm border-2 hover:bg-white hover:border-primary/50 shadow-lg rounded-xl px-3 py-2"
  >
    <RotateCcw className="w-4 h-4 ml-2" />
    إعادة تعيين
  </Button>
);

export const VehicleTypeCard: React.FC<{
  type: string;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ type, isSelected, onSelect }) => {
  const getVehicleInfo = (type: string) => {
    switch (type.toLowerCase()) {
      case "vip":
        return {
          name: "VIP",
          description: "سيارات فاخرة مع خدمة مميزة",
          image:
            vipImg,
          icon: Crown,
          gradient: "from-yellow-500 to-yellow-600",
          features: ["مقاعد جلدية", "تكييف مثالي", "سائق مدرب"],
          badge: "فاخر",
          badgeColor: "bg-yellow-500",
        };
      case "عادي":
      case "regular":
        return {
          name: "عادي",
          description: "سيارات مريحة بأسعار معقولة",
          image:
            regularCar,
          icon: Car,
          gradient: "from-blue-500 to-blue-600",
          features: ["مقاعد مريحة", "تكييف جيد", "نظافة عالية"],
          badge: "مريح",
          badgeColor: "bg-blue-500",
        };
      case "اقتصادي":
      case "economic":
        return {
          name: "اقتصادي",
          description: "خيار مناسب وبأسعار تنافسية",
          image:
            economyCar,
          icon: DollarSign,
          gradient: "from-green-500 to-green-600",
          features: ["أسعار مناسبة", "وقود اقتصادي", "خدمة جيدة"],
          badge: "موفر",
          badgeColor: "bg-green-500",
        };
      default:
        return {
          name: "عادي",
          description: "سيارات مريحة",
          image:
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&crop=center",
          icon: Car,
          gradient: "from-gray-500 to-gray-600",
          features: [],
          badge: "عادي",
          badgeColor: "bg-gray-500",
        };
    }
  };

  const info = getVehicleInfo(type);
  const Icon = info.icon;

  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg overflow-hidden rounded-2xl 
        ${isSelected ? "ring-2 ring-primary bg-primary/5 border-primary shadow-md" : "hover:border-primary/30 border-border"}
      `}
      onClick={onSelect}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={info.image}
          alt={info.name}
          className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-t-2xl"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
        <Badge
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 ${info.badgeColor} text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg shadow-md text-xs sm:text-sm`}
        >
          {info.badge}
        </Badge>
        {isSelected && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 w-6 sm:w-7 h-6 sm:h-7 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-3 sm:p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          {/* Icon */}
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center shadow-md`}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>

          {/* Text */}
          <div>
            <h3 className="font-bold text-base sm:text-lg md:text-xl">
              {info.name}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
              {info.description}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-3 sm:mt-4 space-y-1">
          {info.features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground"
            >
              <Check className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
import seats4 from '../../assets/4seats.png'
import seats6 from '../../assets/6seats.png'
import seats8 from '../../assets/8seats.png'
import seats16 from '../../assets/16seats.png'
export const VehicleSizeCard: React.FC<{
  size: string;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ size, isSelected, onSelect }) => {
  const getSizeInfo = (size: string) => {
    const sizeNum = parseInt(size);
    if (sizeNum <= 4) {
      return {
        name: `${size} مقاعد`,
        description: "مثالي للأفراد والعائلات الصغيرة",
        icon: Users,
        img:seats4,
        capacity: "1-4 أشخاص",
        color: "from-blue-500 to-blue-600",
      }
    } else if (sizeNum <= 8) {
      return {
        name: `${size} مقاعد`,
        description: "مناسب للعائلات الكبيرة",
        icon: Users,
        img:seats6,
        capacity: "4-8 أشخاص",
        color: "from-green-500 to-green-600",
      };
    } else if (sizeNum <= 12 ) {
      return {
        name: `${size} مقاعد`,
        description: "مناسب للعائلات الكبيرة",
        icon: Users,
        img:seats8,
        capacity: "8-12 أشخاص",
        color: "from-green-500 to-green-600",
      };
    }
    else {
      return {
        name: `${size} مقاعد`,
        description: "للرحلات الجماعية",
        icon: Users,
        img:seats16,
        capacity: `8-${size} شخص`,
        color: "from-purple-500 to-purple-600",
      };
    }
  };

  const info = getSizeInfo(size);
  const Icon = info.icon;
  const img=info.img;
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden ${
        isSelected
          ? "ring-2 ring-primary bg-primary/5 border-primary shadow-md"
          : "hover:border-primary/30 hover:shadow-md"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-5 text-center space-y-4">
        <div
          className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br ${info.color}`}
        >
          <img src={img}></img>
        </div>
        <div>
          <h3 className="font-bold text-lg">{info.name}</h3>
          <p className="text-sm text-muted-foreground">{info.description}</p>
        </div>
        <Badge
          variant="outline"
          className="mt-1 px-3 py-1 rounded-full text-sm font-medium"
        >
          {info.capacity}
        </Badge>
        {isSelected && (
          <div className="w-7 h-7 mx-auto bg-primary rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const DriverCard: React.FC<{
  driver: Driver;
  onSelect: () => void;
  isSelected: boolean;
}> = ({ driver, onSelect, isSelected }) => {
  const getVehicleGradient = (type: string) => {
    switch (type.toLowerCase()) {
      case "vip":
        return "from-yellow-500 to-yellow-600";
      case "عادي":
      case "regular":
        return "from-blue-500 to-blue-600";
      case "اقتصادي":
      case "economic":
        return "from-green-500 to-green-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
        isSelected
          ? "ring-2 ring-primary bg-primary/5 border-primary shadow-md"
          : "hover:border-primary/30"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${getVehicleGradient(
                driver.vehicleType
              )} rounded-xl flex items-center justify-center shadow-lg`}
            >
              <Car className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 space-x-reverse mb-1">
                <h3 className="text-lg font-bold">{driver.vehicleType}</h3>
                <Badge variant="secondary" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {driver.vehicleSize}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                رخصة: {driver.licenseNumber}
              </p>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">
                  متاح الآن
                </span>
                <div className="flex items-center space-x-1 space-x-reverse text-xs text-muted-foreground">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>4.9</span>
                </div>
              </div>
            </div>
          </div>
          {isSelected && (
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Check className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => {
  const stepNames = ["المسار", "نوع السيارة", "حجم السيارة", "اختيار السائق"];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step <= currentStep
                    ? "bg-primary text-primary-foreground shadow-lg scale-110"
                    : step === currentStep + 1
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step}
              </div>
              <span
                className={`text-xs mt-2 text-center font-medium ${
                  step <= currentStep ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {stepNames[step - 1]}
              </span>
            </div>
            {step < totalSteps && (
              <div className="flex-1 h-px mx-4 relative">
                <div className="absolute inset-0 bg-muted"></div>
                <div
                  className={`absolute inset-0 bg-primary transition-all duration-500 ${
                    step < currentStep ? "scale-x-100" : "scale-x-0"
                  } origin-left`}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

