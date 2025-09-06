import queries from "@/api/user/query";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Hash,
  Shield,
  Clock,
  Car,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
} from "lucide-react";

const Profile = () => {
  const userType = localStorage.getItem("userType") || "";
  const Id = localStorage.getItem("userId") || "";
  console.log({ userType });

  const { data, isLoading, error } =
    userType === "driver" ? queries.GetDriver(Id) : queries.GetUsers(Id);

  console.log({ data });

  if (isLoading) {
    return (
      <div className="p-6" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-32 mb-6" />
          <Card className="mb-6">
            <CardHeader className="text-center">
              <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div
        className="p-6 flex items-center justify-center min-h-screen"
        dir="rtl"
      >
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">
              خطأ في تحميل البيانات
            </h3>
            <p className="text-gray-600">لا يمكن تحميل بيانات المستخدم</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const rawData = data.data;

  // Handle different data structures for driver vs user
  const user = userType === "driver" ? rawData.user : rawData;
  const driverInfo = userType === "driver" ? rawData : null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "aproved":
      case "approved":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "aproved":
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0" />;
    }
  };

  const getVehicleTypeInArabic = (type: string) => {
    switch (type?.toLowerCase()) {
      case "vip":
        return "في آي بي";
      case "standard":
        return "عادي";
      case "economy":
        return "اقتصادي";
      default:
        return type;
    }
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 border-0 p-3">
          <CardHeader className="text-center">
            <Avatar className="h-20 w-20 mx-auto mb-4">
              <AvatarFallback className="text-xl bg-primary text-white">
                {user?.firstName?.charAt(0) || user?.userName?.charAt(0) || "م"}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">
              {user?.firstName} {user?.lastName}
            </CardTitle>
            <p className="text-primary">@{user?.userName}</p>
            {userType === "driver" && (
              <div className="flex items-center justify-center gap-2 mt-2">
                {getStatusIcon(driverInfo?.status)}
                <span
                  className={`text-sm font-medium ${getStatusColor(
                    driverInfo?.status
                  )}`}
                >
                  {driverInfo?.status === "Aproved"
                    ? "معتمد"
                    : driverInfo?.status === "pending"
                    ? "في الانتظار"
                    : driverInfo?.status === "rejected"
                    ? "مرفوض"
                    : driverInfo?.status}
                </span>
              </div>
            )}
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <Hash className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500">معرف المستخدم</p>
              <p className="font-medium truncate">{user?._id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <User className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500">اسم المستخدم</p>
              <p className="font-medium">{user?.userName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <User className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500">الاسم الأول</p>
              <p className="font-medium">{user?.firstName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <User className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500">الاسم الأخير</p>
              <p className="font-medium">{user?.lastName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <Phone className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500">رقم الهاتف</p>
              <p className="font-medium">{user?.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <Mail className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500">البريد الإلكتروني</p>
              <p className="font-medium truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <Shield className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500">الدور</p>
              <p className="font-medium">
                {userType === "driver"
                  ? "سائق"
                  : user?.role === "user"
                  ? "مستخدم"
                  : user?.role === "admin"
                  ? "مدير"
                  : user?.role}
              </p>
            </div>
          </div>

          {/* Driver-specific fields */}
          {userType === "driver" && driverInfo && (
            <>
              <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                <CreditCard className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">رقم الرخصة</p>
                  <p className="font-medium">{driverInfo.licenseNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                <Car className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">نوع المركبة</p>
                  <p className="font-medium">
                    {getVehicleTypeInArabic(driverInfo.vehicleType)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                <Car className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">حجم المركبة</p>
                  <p className="font-medium">{driverInfo.vehicleSize}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">الحالة</p>
                  <p className="font-medium">
                    {driverInfo.isAvailable ? "متاح" : "غير متاح"}
                  </p>
                </div>
              </div>

              {driverInfo.location?.coordinates && (
                <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">الموقع</p>
                    <p className="font-medium text-xs">
                      {driverInfo.location.coordinates[0].toFixed(6)},{" "}
                      {driverInfo.location.coordinates[1].toFixed(6)}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500">تاريخ الإنشاء</p>
              <p className="font-medium">
                {new Date(
                  userType === "driver" ? driverInfo.createdAt : user?.createdAt
                ).toLocaleDateString("ar-EG")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <Clock className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500">آخر تحديث</p>
              <p className="font-medium">
                {new Date(
                  userType === "driver" ? driverInfo.updatedAt : user?.updatedAt
                ).toLocaleDateString("ar-EG")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
