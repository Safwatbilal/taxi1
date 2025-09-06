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
// import { currentLocationIcon, endIcon, startIcon } from "./tripIcons";
import { pickupIcon as startIcon, dropoffIcon as endIcon, currentLocationIcon } from '../pages/trip/tripIcons';


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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



export const LocationTracker: React.FC<{ userLocation: Location | null }> = ({
  userLocation,
}) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation && map) {
      map.setView([userLocation.lat, userLocation.lng], 15);
    }
  }, [userLocation, map]);

  return userLocation ? (
    <Marker
      position={[userLocation.lat, userLocation.lng]}
      icon={currentLocationIcon}
    />
  ) : null;
};

export const MapEvents: React.FC<{ onMapClick: (latlng: L.LatLng) => void }> = ({
  onMapClick,
}) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

export const calculateDistance = (start: Location, end: Location): number => {
  const R = 6371;
  const dLat = ((end.lat - start.lat) * Math.PI) / 180;
  const dLng = ((end.lng - start.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((start.lat * Math.PI) / 180) *
      Math.cos((end.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getRoute = async (
  start: Location,
  end: Location
): Promise<RouteStep[]> => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&overview=full`
    );
    const data = await response.json();

    if (data.routes && data.routes[0]) {
      return data.routes[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => ({
          lat,
          lng,
        })
      );
    }
    return [];
  } catch (error) {
    console.error("Error getting route:", error);
    return [];
  }
};

// مكون لإعادة تعيين الموقع

