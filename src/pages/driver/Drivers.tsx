import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import queries from "@/api/driver/query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageCircle,
  MessageCircleReply,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  Image,
  FileText,
  Filter,
  MoreVertical,
  Upload,
  Trash2,
  Check,
  X,
  UserCheck,
  UserX,
  Loader2,
  MapPin,
  Car,
  Calendar,
  Mail,
  Phone,
  Users,
  Truck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface User {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Driver {
  _id: string;
  user: User;
  status: "Pending" | "Approved" | "Rejected";
  isAvailable: boolean;
  licenseNumber: string;
  vehicleType: "Standard" | "Vip" | "Premium";
  vehicleSize: 4 | 6 | 12 | 24;
  location: {
    type: string;
    coordinates: [number, number];
  };
  createdAt: string;
  updatedAt: string;
}

interface DriversResponse {
  success: boolean;
  count: number;
  data: Driver[];
}

const Drivers: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>("");
  const [vehicleSizeFilter, setVehicleSizeFilter] = useState<string>("");
  const [licenseFilter, setLicenseFilter] = useState<string>("");

  const { data, isLoading, error, refetch } = queries.GetAllDriver(
    currentPage,
    pageSize
  );

  const { mutate: approveDriver, isPending: isApproving } =
    queries.ApproveDriver();
  const { mutate: deleteDriver, isPending: isDeleting } =
    queries.DeletedDriver();

  const driversData: DriversResponse = data || {
    success: true,
    count: 0,
    data: [],
  };
  const filteredDrivers = driversData.data?.filter((driver) => {
    const matchesSearch =
      !searchTerm ||
      driver.user?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      driver.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLicense =
      !licenseFilter ||
      driver.licenseNumber?.toLowerCase().includes(licenseFilter.toLowerCase());
    const matchesStatus = !statusFilter || driver.status === statusFilter;

    const matchesVehicleType =
      !vehicleTypeFilter || driver.vehicleType === vehicleTypeFilter;
    const matchesVehicleSize =
      !vehicleSizeFilter || driver.vehicleSize.toString() === vehicleSizeFilter;

    return (
      matchesSearch &&
      matchesLicense &&
      matchesStatus &&
      matchesVehicleType &&
      matchesVehicleSize
    );
  });

  const totalPages = Math.ceil(filteredDrivers?.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedDrivers = filteredDrivers?.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleApprove = (driverId: string) => {
    approveDriver(driverId, {
      onSuccess: () => {
        toast.success("تم قبول السائق بنجاح");
        refetch();
      },
      onError: (error: any) => {
        toast.error("حدث خطأ في قبول السائق");
        console.error("Approve error:", error);
      },
    });
  };

  const handleReject = (driverId: string) => {
    deleteDriver(driverId, {
      onSuccess: () => {
        toast.success("تم رفض السائق");
        refetch();
      },
      onError: (error: any) => {
        toast.error("حدث خطأ في رفض السائق");
        console.error("Reject error:", error);
      },
    });
  };

  const handleDelete = (driverId: string) => {
    deleteDriver(driverId, {
      onSuccess: () => {
        toast.success("تم حذف السائق");
        refetch();
      },
      onError: (error: any) => {
        toast.error("حدث خطأ في حذف السائق");
        console.error("Delete error:", error);
      },
    });
  };

  const getStatusBadge = (status: Driver["status"]) => {
    const variants = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Approved: "bg-green-100 text-green-800 border-green-200",
      Rejected: "bg-red-100 text-red-800 border-red-200",
    };

    const arabicText = {
      Pending: "في الانتظار",
      Approved: "مقبول",
      Rejected: "مرفوض",
    };

    return (
      <Badge className={`${variants[status]} border`}>
        {arabicText[status]}
      </Badge>
    );
  };

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case "Standard":
        return <Car className="h-4 w-4" />;
      case "Vip":
        return <Truck className="h-4 w-4" />;
      case "Premium":
        return <Car className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  const getVehicleTypeArabic = (
    type: "Standard" | "Vip" | "Premium" | string
  ) => {
    const types = {
      Standard: "عادي",
      Vip: "مميز",
      Premium: "فاخر",
    };
    return types[type as keyof typeof types] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setVehicleTypeFilter("");
    setVehicleSizeFilter("");
    setCurrentPage(1);
    setLicenseFilter("");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    vehicleTypeFilter,
    vehicleSizeFilter,
    licenseFilter,
  ]);

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16"
    >
      <div className="max-w-md mx-auto">
        <div className="bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <Users className="h-12 w-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          لا يوجد سائقين
        </h3>
        <p className="text-slate-600 mb-6">
          لم يتم العثور على أي سائقين في النظام حالياً
        </p>
        <Button onClick={() => refetch()} variant="outline">
          <Search className="h-4 w-4 mr-2" />
          إعادة تحديث
        </Button>
      </div>
    </motion.div>
  );

  const LoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-200 rounded w-24"></div>
              <div className="h-6 bg-slate-200 rounded w-16"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  خطأ في تحميل البيانات
                </h3>
                <p className="text-slate-500 mb-4">
                  حدث خطأ أثناء تحميل بيانات السائقين
                </p>
                <Button onClick={() => refetch()}>إعادة المحاولة</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              قائمة السائقين
            </h1>
            <p className="text-slate-600 mt-1">
              عرض وإدارة جميع السائقين المسجلين في النظام
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              المجموع: {driversData?.count}
            </Badge>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between my-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="البحث عن السائقين..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {(searchTerm ||
                    statusFilter ||
                    vehicleTypeFilter ||
                    vehicleSizeFilter) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      مسح الفلاتر
                    </Button>
                  )}
                </div>
              </div>
              <div
                className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  "
              >
                {/* الحالة */}
                <div className="flex flex-col gap-3 w-full">
                  <Label htmlFor="status-filter">الحالة</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="جميع الحالات" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="Pending">في الانتظار</SelectItem>
                      <SelectItem value="Approved">مقبول</SelectItem>
                      <SelectItem value="Rejected">مرفوض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* نوع المركبة */}
                <div className="flex flex-col gap-3 w-full">
                  <Label htmlFor="vehicle-type-filter">نوع المركبة</Label>
                  <Select
                    value={vehicleTypeFilter}
                    onValueChange={setVehicleTypeFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="جميع الأنواع" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="Standard">عادي</SelectItem>
                      <SelectItem value="Vip">مميز</SelectItem>
                      <SelectItem value="Premium">فاخر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* حجم المركبة */}
                <div className="flex flex-col gap-3 w-full">
                  <Label htmlFor="vehicle-size-filter">حجم المركبة</Label>
                  
                  <Select
                    value={vehicleSizeFilter}
                    onValueChange={setVehicleSizeFilter} 
                    >
             
                    <SelectTrigger className="w-full" >
                      <SelectValue placeholder="جميع الأحجام" />
                    </SelectTrigger>
                      
                    <SelectContent 
                    className="w-full"
                    >
                      <SelectItem value="4">4 مقاعد</SelectItem>
                      <SelectItem value="6">6 مقاعد</SelectItem>
                      <SelectItem value="12">12 مقعد</SelectItem>
                      <SelectItem value="24">24 مقعد</SelectItem>
                    </SelectContent>
                  </Select>
                    
                </div>

                {/* البحث برقم الرخصة */}
                <div className="flex flex-col gap-3 lg:w-[70%]">
                  <Label htmlFor="license-filter">رقم الرخصة</Label>
                  <Input
                    placeholder="البحث برقم الرخصة..."
                    value={licenseFilter}
                    onChange={(e) => setLicenseFilter(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {isLoading ? (
                <LoadingState />
              ) : filteredDrivers?.length === 0 ? (
                <EmptyState />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {filteredDrivers?.map((driver, index) => (
                      <motion.div
                        key={driver._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="h-full"
                      >
                        <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                  {driver.user?.firstName?.charAt(0) || "س"}
                                </div>
                                <div>
                                  <CardTitle className="text-lg">
                                    {driver.user?.firstName}{" "}
                                    {driver.user?.lastName}
                                  </CardTitle>
                                  <CardDescription>
                                    @{driver.user?.userName}
                                  </CardDescription>
                                </div>
                              </div>
                              {getStatusBadge(driver.status)}
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Mail className="h-4 w-4" />
                                <span>{driver.user?.email}</span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <FileText className="h-4 w-4" />
                                <span>رخصة: {driver.licenseNumber}</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  {getVehicleTypeIcon(driver.vehicleType)}
                                  <span>
                                    {getVehicleTypeArabic(driver.vehicleType)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <Users className="h-4 w-4" />
                                  <span>{driver.vehicleSize} مقعد</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  انضم في {formatDate(driver.createdAt)}
                                </span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100">
                              <div className="flex items-center justify-between gap-2">
                                {driver.status === "Pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleApprove(driver._id)}
                                      disabled={isApproving}
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                      {isApproving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Check className="h-4 w-4 mr-1" />
                                      )}
                                      قبول
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleReject(driver._id)}
                                      disabled={isDeleting}
                                      className="flex-1"
                                    >
                                      {isDeleting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <X className="h-4 w-4 mr-1" />
                                      )}
                                      رفض
                                    </Button>
                                  </>
                                )}

                                {driver.status === "Approved" && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full"
                                      >
                                        <MoreVertical className="h-4 w-4 mr-2" />
                                        خيارات
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => handleDelete(driver._id)}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        حذف السائق
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}

                                {driver.status === "Rejected" && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(driver._id)}
                                    disabled={isDeleting}
                                    className="flex-1"
                                  >
                                    {isDeleting ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4 mr-1" />
                                    )}
                                    حذف
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {driversData.data?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-8 flex justify-center"
                >
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            handlePageChange(Math.max(1, currentPage - 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            handlePageChange(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Drivers;
