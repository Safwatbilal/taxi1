import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  UserCheck,
  Car,
  CreditCard,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "sonner";
import queries from "@/api/auth/query";

const applyDriverSchema = yup.object({
  userName: yup.string().required("اسم المستخدم مطلوب"),
  firstName: yup.string().required("الاسم الأول مطلوب"),
  lastName: yup.string().required("الاسم الأخير مطلوب"),
  phone: yup.string().required("رقم الهاتف مطلوب"),
  email: yup
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .required("البريد الإلكتروني مطلوب"),
  password: yup
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .required("كلمة المرور مطلوبة"),
  licenseNumber: yup.string().required("رقم الرخصة مطلوب"),
  vehicleType: yup.string().required("نوع المركبة مطلوب"),
  vehicleSize: yup
    .number()
    .required("حجم المركبة مطلوب")
    .min(1, "يجب أن يكون أكبر من 0"),
});

type ApplyDriverFormData = yup.InferType<typeof applyDriverSchema>;

const ApplyDriver = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplyDriverFormData>({
    resolver: yupResolver(applyDriverSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = queries.AppleyDriver();
  const navigate = useNavigate();

  const onSubmit = (data: ApplyDriverFormData) => {
    const loadingToast = toast.loading("جاري تقديم الطلب...", {
      description: "يرجى الانتظار...",
    });

    mutate(data, {
      onSuccess: (res) => {
        toast.dismiss(loadingToast);

        if (res?.status === false) {
          toast.error("خطأ في تقديم الطلب", {
            description:
              res?.message ||
              "حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مرة أخرى.",
          });
          return;
        }

        toast.success("تم تقديم الطلب بنجاح", {
          description: "سيتم مراجعة طلبك قريباً.",
        });
        console.log("تم تقديم الطلب بنجاح");
      },
      onError: (error) => {
        toast.dismiss(loadingToast);
        console.log({ error });
        toast.error("خطأ في تقديم الطلب", {
          description:
            error?.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      <div className="flex-1 flex items-center justify-center p-2 bg-gray-50">
        <Card className="w-full max-w-3xl bg-white shadow-xl border-0">
          <CardHeader className="text-center space-y-2 pb-2">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-chart-1 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Car className="w-8 h-8 text-white" />
            </div>

            <div>
              <CardTitle className="text-2xl font-bold text-gray-800 mb-1">
                تقديم طلب سائق
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                املأ البيانات للانضمام كسائق
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="userName" className="text-gray-700 text-sm">
                    اسم المستخدم
                  </Label>
                  <div className="relative group">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="userName"
                      type="text"
                      placeholder="اسم المستخدم"
                      className={`pr-10 h-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                        errors.userName ? "border-red-400" : ""
                      }`}
                      {...register("userName")}
                    />
                  </div>
                  {errors.userName && (
                    <p className="text-xs text-red-500">
                      {errors.userName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-gray-700 text-sm">
                    رقم الهاتف
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="رقم الهاتف"
                      className={`pr-10 h-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                        errors.phone ? "border-red-400" : ""
                      }`}
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="text-gray-700 text-sm">
                    الاسم الأول
                  </Label>
                  <div className="relative group">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="الاسم الأول"
                      className={`pr-10 h-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                        errors.firstName ? "border-red-400" : ""
                      }`}
                      {...register("firstName")}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="lastName" className="text-gray-700 text-sm">
                    الاسم الأخير
                  </Label>
                  <div className="relative group">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="الاسم الأخير"
                      className={`pr-10 h-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                        errors.lastName ? "border-red-400" : ""
                      }`}
                      {...register("lastName")}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-xs text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-gray-700 text-sm">
                  البريد الإلكتروني
                </Label>
                <div className="relative group">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="driver@taxi.com"
                    className={`pr-10 h-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                      errors.email ? "border-red-400" : ""
                    }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-gray-700 text-sm">
                  كلمة المرور
                </Label>
                <div className="relative group">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className={`pr-10 pl-10 h-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                      errors.password ? "border-red-400" : ""
                    }`}
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {!showPassword ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="licenseNumber"
                  className="text-gray-700 text-sm"
                >
                  رقم الرخصة
                </Label>
                <div className="relative group">
                  <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="licenseNumber"
                    type="text"
                    placeholder="رقم رخصة القيادة"
                    className={`pr-10 h-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                      errors.licenseNumber ? "border-red-400" : ""
                    }`}
                    {...register("licenseNumber")}
                  />
                </div>
                {errors.licenseNumber && (
                  <p className="text-xs text-red-500">
                    {errors.licenseNumber.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-gray-700 text-sm">نوع المركبة</Label>
                  <Select
                    onValueChange={(value) => setValue("vehicleType", value)}
                  >
                    <SelectTrigger
                      className={`h-10 bg-gray-50 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                        errors.vehicleType ? "border-red-400" : ""
                      }`}
                    >
                      <SelectValue placeholder="اختر نوع المركبة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vip">VIP</SelectItem>
                      <SelectItem value="regular">عادي</SelectItem>
                      <SelectItem value="economic">اقتصادي</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.vehicleType && (
                    <p className="text-xs text-red-500">
                      {errors.vehicleType.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="vehicleSize"
                    className="text-gray-700 text-sm"
                  >
                     حجم المركبة بالمقاعد
                  </Label>
                  <div className="relative group">
                    {/* <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /> */}

                    {/* <Input
                      id="vehicleSize"
                      type=""
                      placeholder="عدد المقاعد"
                      className={`pr-10 h-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                        errors.vehicleSize ? "border-red-400" : ""
                      }`}
                      {...register("vehicleSize", { valueAsNumber: true })}
                    /> */}
                    <Select
                    onValueChange={(value) => setValue("vehicleSize", Number(value))}
                  >
                    <SelectTrigger
                      className={`h-10 bg-gray-50 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                        errors.vehicleSize ? "border-red-400" : ""
                      }`}
                    >
                      <SelectValue placeholder="اختر حجم المركبة"  />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                  {errors.vehicleSize && (
                    <p className="text-xs text-red-500">
                      {errors.vehicleSize.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending || isSubmitting}
                className="w-full h-10"
              >
                {isPending || isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري تقديم الطلب...
                  </div>
                ) : (
                  "تقديم الطلب"
                )}
              </Button>
            </form>

            <div className="text-center pt-3 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                لديك حساب بالفعل؟{" "}
                <Button
                  type="button"
                  variant="link"
                  className="px-1 text-primary hover:text-chart-1 font-medium"
                  onClick={() => navigate("/login")}
                >
                  تسجيل الدخول
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 bg-gradient-to-br from-primary to-chart-1 relative overflow-hidden hidden lg:flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 animate-[bounce_3s_ease-in-out_infinite]">
          <div className="transform hover:scale-110 transition-transform duration-500">
            <Car className="w-96 h-96 text-white/90 drop-shadow-2xl" />
          </div>
        </div>

        <div className="absolute top-1/4 left-0 animate-[moveRight_12s_linear_infinite]">
          <Car className="w-16 h-16 text-white/30" />
        </div>
        <div className="absolute bottom-1/4 right-0 animate-[moveLeft_15s_linear_infinite]">
          <Car className="w-12 h-12 text-white/20 transform rotate-180" />
        </div>
        <div className="absolute top-3/4 left-0 animate-[moveRight_18s_linear_infinite] delay-1000">
          <Car className="w-20 h-20 text-white/25" />
        </div>
      </div>

      <style>{`
        @keyframes moveRight {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 100px));
            opacity: 0;
          }
        }

        @keyframes moveLeft {
          0% {
            transform: translateX(calc(100vw + 100px)) rotate(180deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(-100px) rotate(180deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ApplyDriver;
