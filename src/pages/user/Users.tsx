import React, { useState, useEffect } from "react";
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
  Briefcase,
  Shield,
  User,
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
import queries from "@/api/user/query";

interface User {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "user" | "admin" | "driver";
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  success: boolean;
  count: number;
  data: User[];
}

const UsersComponent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  const { data, isLoading, error, refetch } = queries.GetAllUsers(
    currentPage,
    pageSize
  );

  // Mock mutations - replace with actual mutations from your queries
  const { mutate: updateUserRole, isPending: isUpdatingRole } = {
    mutate: (params: any, options: any) => {
      // Mock implementation
      setTimeout(() => {
        options.onSuccess?.();
      }, 1000);
    },
    isPending: false,
  };

  const { mutate: deleteUser, isPending: isDeleting } = {
    mutate: (userId: string, options: any) => {
      // Mock implementation
      setTimeout(() => {
        options.onSuccess?.();
      }, 1000);
    },
    isPending: false,
  };

  const usersData: UsersResponse = data || {
    success: true,
    count: 0,
    data: [],
  };

  // Filter users based on search term and role filter
  const filteredUsers = usersData.data?.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers?.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers?.slice(startIndex, startIndex + pageSize);

  const handleRoleUpdate = (userId: string, newRole: string) => {
    updateUserRole(
      { userId, role: newRole },
      {
        onSuccess: () => {
          toast.success("تم تحديث دور المستخدم بنجاح");
          refetch();
        },
        onError: (error: any) => {
          toast.error("حدث خطأ في تحديث دور المستخدم");
          console.error("Role update error:", error);
        },
      }
    );
  };

  const handleDelete = (userId: string) => {
    deleteUser(userId, {
      onSuccess: () => {
        toast.success("تم حذف المستخدم");
        refetch();
      },
      onError: (error: any) => {
        toast.error("حدث خطأ في حذف المستخدم");
        console.error("Delete error:", error);
      },
    });
  };

  const getRoleBadge = (role: User["role"]) => {
    const variants = {
      user: "bg-blue-100 text-blue-800 border-blue-200",
      admin: "bg-red-100 text-red-800 border-red-200",
      driver: "bg-green-100 text-green-800 border-green-200",
    };

    const arabicText = {
      user: "مستخدم",
      admin: "مدير",
      driver: "سائق",
    };

    return (
      <Badge className={`${variants[role]} border`}>{arabicText[role]}</Badge>
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "driver":
        return <Car className="h-4 w-4" />;
      case "user":
      default:
        return <User className="h-4 w-4" />;
    }
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
    setRoleFilter("");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <Users className="h-12 w-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          لا يوجد مستخدمين
        </h3>
        <p className="text-slate-600 mb-6">
          لم يتم العثور على أي مستخدمين في النظام حالياً
        </p>
        <Button onClick={() => refetch()} variant="outline">
          <Search className="h-4 w-4 mr-2" />
          إعادة تحديث
        </Button>
      </div>
    </div>
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
                  حدث خطأ أثناء تحميل بيانات المستخدمين
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              قائمة المستخدمين
            </h1>
            <p className="text-slate-600 mt-1">
              عرض وإدارة جميع المستخدمين المسجلين في النظام
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              المجموع: {usersData.count}
            </Badge>
          </div>
        </div>

        <div>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="البحث عن المستخدمين..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {(searchTerm || roleFilter) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      مسح الفلاتر
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 w-full 
                sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] 
                md:grid-cols-[repeat(3,1fr)]">
                <div className="flex flex-col gap-1 lg:w-[70%]">
                  <Label htmlFor="role-filter">الدور</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الأدوار" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user" >مستخدم</SelectItem>
                      <SelectItem value="admin">مدير</SelectItem>
                      <SelectItem value="driver">سائق</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1 lg:w-[70%]">
                  <Label htmlFor="email-filter">البريد الإلكتروني</Label>
                  <Input
                    placeholder="البحث بالبريد الإلكتروني..."
                    className="w-[90%]"
                  />
                </div>
                <div className="flex flex-col gap-1 lg:w-[70%]">
                  <Label htmlFor="phone-filter">رقم الهاتف</Label>
                  <Input
                    placeholder="البحث برقم الهاتف..."
                    className="w-[90%]"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {isLoading ? (
                <LoadingState />
              ) : paginatedUsers?.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedUsers?.map((user, index) => (
                    <div
                      key={user._id}
                      className="h-full hover:-translate-y-1 transition-transform duration-200"
                    >
                      <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.firstName?.charAt(0) || "م"}
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {user.firstName} {user.lastName}
                                </CardTitle>
                                <CardDescription>
                                  @{user.userName}
                                </CardDescription>
                              </div>
                            </div>
                            {getRoleBadge(user.role)}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail className="h-4 w-4" />
                              <span className="truncate">{user.email}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="h-4 w-4" />
                              <span>{user.phone}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              {getRoleIcon(user.role)}
                              <span>
                                {user.role === "admin"
                                  ? "مدير"
                                  : user.role === "driver"
                                  ? "سائق"
                                  : "مستخدم"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar className="h-4 w-4" />
                              <span>انضم في {formatDate(user.createdAt)}</span>
                            </div>
                          </div>

                  
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}

              {paginatedUsers?.length > 0 && totalPages > 1 && (
                <div className="mt-8 flex justify-center">
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
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UsersComponent;
