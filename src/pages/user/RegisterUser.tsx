import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff, Mail, Lock, User, Phone, UserCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { encryptRole } from "@/util/encrypt";

const registerSchema = yup.object({
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
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

const RegisterUser = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
  });

  const { mutate:registerMutate, isPending } = queries.RegisterUser();

const { mutate: loginMutate } = queries.Login();

  const navigate = useNavigate();

  const onSubmit = (data: RegisterFormData) => {
    const loadingToast = toast.loading("جاري إنشاء الحساب...", {
      description: "يرجى الانتظار...",
    });

    registerMutate(data, {
      onSuccess: (res) => {
        toast.dismiss(loadingToast);

        if (res?.status === false) {
          toast.error("خطأ في إنشاء الحساب", {
            description:
              res?.message ||
              "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.",
          });
          return;
        }

        toast.success("تم إنشاء الحساب بنجاح", {
          description: "مرحباً بك في تطبيق التاكسي.",
        });
        console.log("تم إنشاء الحساب بنجاح");

  
  loginMutate(
    { email: data.email, password: data.password },
    {
      onSuccess: (loginRes: any) => {
        toast.dismiss();

        if (loginRes?.token) {
          localStorage.setItem("token", loginRes.token);

          const loginRole = loginRes?.user?.role ?? loginRes?.role;
          if (loginRole) {
            localStorage.setItem("role", encryptRole(loginRole));
          }


          navigate("/userNavBar", { replace: true });
        } else {
          toast.error("تم إنشاء الحساب لكن فشل تسجيل الدخول التلقائي");
          navigate("/login");
        }
      },
      onError: (err: any) => {
        toast.dismiss();
        toast.error("خطأ أثناء تسجيل الدخول", {
          description: err?.message || "حدث خطأ غير متوقع.",
        });
        navigate("/login");
      },
    }
  );
      },
      onError: (error) => {
        toast.dismiss(loadingToast);
        toast.error("خطأ في إنشاء الحساب", {
          description:
            error?.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <Card className="w-full max-w-lg bg-white shadow-xl border-0">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-chart-1 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <UserCheck className="w-10 h-10 text-white" />
            </div>

            <div>
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                إنشاء حساب جديد
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                الرجاء إدخال بياناتك للتسجيل
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
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
                    placeholder="user@taxi.com"
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

              <Button
                type="submit"
                disabled={isPending || isSubmitting}
                className="w-full h-10"
              >
                {isPending || isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري إنشاء الحساب...
                  </div>
                ) : (
                  "إنشاء الحساب"
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

      {/* Left Side - Animated Users */}
      <div className="flex-1 bg-gradient-to-br from-primary to-chart-1 relative overflow-hidden hidden lg:flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Main User Icon */}
        <div className="relative z-10 animate-[bounce_3s_ease-in-out_infinite]">
          <div className="transform hover:scale-110 transition-transform duration-500">
            <UserCheck className="w-96 h-96 text-white/90 drop-shadow-2xl" />
          </div>
        </div>

        {/* Moving User Icons */}
        <div className="absolute top-1/4 left-0 animate-[moveRight_12s_linear_infinite]">
          <User className="w-16 h-16 text-white/30" />
        </div>
        <div className="absolute bottom-1/4 right-0 animate-[moveLeft_15s_linear_infinite]">
          <UserCheck className="w-12 h-12 text-white/20" />
        </div>
        <div className="absolute top-3/4 left-0 animate-[moveRight_18s_linear_infinite] delay-1000">
          <User className="w-20 h-20 text-white/25" />
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
            transform: translateX(calc(100vw + 100px));
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(-100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterUser;
