import {
  CarFront,
  LayoutDashboard,
  MapPin,
  RollerCoaster,
  TrendingUp,
  User,
  UserCircle,
  Users,
} from "lucide-react";

export const adminMenuItems = [
  {
    icon: LayoutDashboard,
    title: "الصفحة الرئيسية",
    url: "/home",
    breadcrumb: "الرئيسية",
  },
  {
    icon: CarFront,
    title: "السائقون",
    url: "/drivers",
    breadcrumb: "السائقون",
  },
  { icon: User, title: "الموظفون", url: "/employees", breadcrumb: "الموظفون" },
  { icon: Users, title: "المستخدمون", url: "/users", breadcrumb: "المستخدمون" },
  {
    icon: RollerCoaster,
    title: "ادارة الوظائف",
    url: "/role",
    breadcrumb: "ادارة الوظائف",
  },
];
export const empMenuItems = [
  {
    icon: LayoutDashboard,
    title: "الصفحة الرئيسية",
    url: "/home",
    breadcrumb: "الرئيسية",
  },
  {
    icon: CarFront,
    title: "السائقون",
    url: "/drivers",
    breadcrumb: "السائقون",
  },
  { icon: User, title: "الموظفون", url: "/employees", breadcrumb: "الموظفون" },
  { icon: Users, title: "المستخدمون", url: "/users", breadcrumb: "المستخدمون" },
  {
    icon: UserCircle,
    title: "البروفايل",
    url: "/profile",
    breadcrumb: "البروفايل",
  },
];

export const userMenuItems = [
  {
    icon: MapPin,
    title: "طلب رحلة",
    url: "/request-trip",
    breadcrumb: "طلب رحلة",
  },
  {
    icon: UserCircle,
    title: "البروفايل",
    url: "/profile",
    breadcrumb: "البروفايل",
  },
  {
    icon: TrendingUp,
    title: "سجل الرحلات",
    url: "/trips",
    breadcrumb: "سجل الرحلات",
  },
];

export const driverMenuItems = [
  {
    icon: MapPin,
    title: "الرحلة الحالية",
    url: "/current-trip",
    breadcrumb: "الرحلة الحالية",
  },
  {
    icon: UserCircle,
    title: "البروفايل",
    url: "/profile",
    breadcrumb: "البروفايل",
  },
  {
    icon: TrendingUp,
    title: "سجل الرحلات",
    url: "/trips",
    breadcrumb: "سجل الرحلات",
  },
];
