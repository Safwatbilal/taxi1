import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  Search,
  Filter,
  Edit,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import queries from "@/api/role/query";

interface Role {
  _id: string;
  title: string;
  description: string;
  roles: string[];
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface RolesResponse {
  success: boolean;
  count: number;
  data: Role[];
}

interface FormData {
  title: string;
  description: string;
  roles: string;
}

const roleSchema = yup.object({
  title: yup
    .string()
    .required("العنوان مطلوب")
    .min(2, "يجب أن يكون العنوان على الأقل حرفين"),
  description: yup
    .string()
    .required("الوصف مطلوب")
    .min(10, "يجب أن يكون الوصف على الأقل 10 أحرف"),
  roles: yup.string().required("الأدوار مطلوبة"),
});

const Roles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data: rolesResponse, isLoading, error } = queries.GetAllRole();
  const { mutate: deleteRole, isPending: isDeleting } = queries.DeleteRole();
  const { mutate: addRole, isPending: isAdding } = queries.AddRole();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(roleSchema),
    defaultValues: {
      title: "",
      description: "",
      roles: "",
    },
  });

  const roles: Role[] = (rolesResponse as RolesResponse)?.data || [];

  const filteredRoles: Role[] = roles.filter(
    (role: Role) =>
      role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.roles.some((r: string) =>
        r.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const totalPages: number = Math.ceil(filteredRoles.length / pageSize);
  const startIndex: number = (currentPage - 1) * pageSize;
  const paginatedRoles: Role[] = filteredRoles.slice(
    startIndex,
    startIndex + pageSize
  );

  const onSubmit = (data: FormData): void => {
    const rolesArray: string[] = data.roles
      .split(",")
      .map((role: string) => role.trim())
      .filter((role: string) => role);

    addRole(
      {
        title: data.title,
        description: data.description,
        roles: rolesArray,
      },
      {
        onSuccess: () => {
          setIsAddDialogOpen(false);
          reset();
          setSuccessMessage("تم إضافة الدور بنجاح");
          setTimeout(() => setSuccessMessage(""), 5000);
        },
        onError: (error: any) => {
          setErrorMessage(`خطأ في إضافة الدور: ${error.message}`);
          setTimeout(() => setErrorMessage(""), 5000);
        },
      }
    );
  };

  const handleDelete = (roleId: string): void => {
    deleteRole(roleId, {
      onSuccess: () => {
        setDeleteRoleId(null);
        setSuccessMessage("تم حذف الدور بنجاح");
        setTimeout(() => setSuccessMessage(""), 5000);
      },
      onError: (error: any) => {
        setErrorMessage(`خطأ في حذف الدور: ${error.message}`);
        setTimeout(() => setErrorMessage(""), 5000);
        setDeleteRoleId(null);
      },
    });
  };

  const TableSkeleton: React.FC = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i: number) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            خطأ في تحميل الأدوار: {(error as Error).message}
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-primary">
              إدارة الأدوار
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  إضافة دور
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-right">
                    إضافة دور جديد
                  </DialogTitle>
                  <DialogDescription className="text-right">
                    قم بإنشاء دور جديد مع صلاحيات محددة.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">العنوان</Label>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="title"
                          placeholder="أدخل عنوان الدور"
                          className={errors.title ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">الوصف</Label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="description"
                          placeholder="أدخل وصف الدور"
                          className={errors.description ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roles">الأدوار (مفصولة بفواصل)</Label>
                    <Controller
                      name="roles"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="roles"
                          placeholder="مثال: قراءة، كتابة، حذف"
                          className={errors.roles ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.roles && (
                      <p className="text-sm text-red-500">
                        {errors.roles.message}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isAdding}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isAdding ? "جاري الإضافة..." : "إضافة الدور"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6 gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الأدوار..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="pr-8"
              />
            </div>
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold text-right">
                        العنوان
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        الوصف
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        الأدوار
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        تاريخ الإنشاء
                      </TableHead>
                      <TableHead className="text-left font-semibold">
                        الإجراءات
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRoles.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center text-muted-foreground"
                        >
                          {searchTerm
                            ? "لم يتم العثور على أدوار تطابق بحثك."
                            : "لا توجد أدوار متاحة."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedRoles.map((role: Role) => (
                        <TableRow key={role._id} className="hover:bg-muted/50">
                          <TableCell className="font-medium text-primary">
                            {role.title}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {role.description}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {role.roles.map((r: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs bg-primary/10 text-primary"
                                >
                                  {r}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(role.createdAt).toLocaleDateString("ar")}
                          </TableCell>
                          <TableCell className="text-left">
                            <div className="flex justify-end space-x-2 gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                    onClick={() => setDeleteRoleId(role._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-right">
                                      حذف الدور
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-right">
                                      هل أنت متأكد من حذف الدور "{role.title}"؟
                                      لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(role._id)}
                                      disabled={isDeleting}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      {isDeleting ? "جاري الحذف..." : "حذف"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    عرض {startIndex + 1} إلى{" "}
                    {Math.min(startIndex + pageSize, filteredRoles.length)} من{" "}
                    {filteredRoles.length} نتيجة
                  </div>
                  <div className="flex space-x-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev: number) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      السابق
                    </Button>
                    <div className="flex space-x-1 gap-1">
                      {[...Array(totalPages)].map((_, index: number) => (
                        <Button
                          key={index}
                          variant={
                            currentPage === index + 1 ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(index + 1)}
                          className={
                            currentPage === index + 1 ? "bg-primary" : ""
                          }
                        >
                          {index + 1}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev: number) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                      disabled={currentPage === totalPages}
                    >
                      التالي
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Roles;
