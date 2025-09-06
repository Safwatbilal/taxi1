import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff, Mail, Lock, Car } from "lucide-react";
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

const loginSchema = yup.object({
  email: yup
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .required("البريد الإلكتروني مطلوب"),
  password: yup
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .required("كلمة المرور مطلوبة"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = queries.Login();

  const navigate = useNavigate();
  const onSubmit = (data: any) => {
    const loadingToast = toast.loading("جاري تسجيل الدخول...", {
      description: "يرجى الانتظار...",
    });

    mutate(data, {
      onSuccess: (res) => {
  console.log(res?.user.role);
        toast.dismiss(loadingToast);

        if (res?.status === false) {
          toast.error("خطأ في تسجيل الدخول", {
            description:
              res?.message ||
              "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.",
          });
          return;
        }
        if (res?.token) {
          console.log({ res });
          localStorage.setItem("token", res.token);
          localStorage.setItem("userId", res.user._id);
          localStorage.setItem("userType", res.user.user.role);
          if(res.user.user.role==='driver'){
            localStorage.setItem("driverIsAvailable", res.user.isAvailable);
          }
          navigate("/home");
        }
          if (res?.role) {
    const encRole = encryptRole(res.role);
    localStorage.setItem("role", encRole);
  }
        toast.success("تم تسجيل الدخول بنجاح", {
          description: "مرحباً بك في تطبيق التاكسي.",
        });
        console.log("تم تسجيل الدخول بنجاح");
      },
      onError: (error) => {
        toast.dismiss(loadingToast);
        toast.error("خطأ في تسجيل الدخول", {
          description:
            error?.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <Card className="w-full max-w-md bg-white shadow-xl border-0">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-chart-1 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Car className="w-10 h-10 text-white" />
            </div>

            <div>
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                تسجيل الدخول
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                أدخل بياناتك للدخول إلى حسابك
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  البريد الإلكتروني
                </Label>
                <div className="relative group">
                  <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@taxi.com"
                    className={`pr-12 h-12 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                      errors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                        : ""
                    }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  كلمة المرور
                </Label>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className={`pr-12 pl-12 h-12 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                      errors.password
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                        : ""
                    }`}
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 text-gray-500 hover:text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {!showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isPending || isSubmitting}
                className="w-full h-12 "
                size="lg"
              >
                {isPending || isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2rounded-full "></div>
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                ليس لديك حساب؟{" "}
                <Button
                  type="button"
                  variant="link"
                  className="px-1 text-primary hover:text-chart-1 font-medium"
                  onClick={() => navigate("/joinUs")}
                >
                  إنشاء حساب جديد
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Left Side - Animated Car */}
      <div className="flex-1 bg-gradient-to-br from-primary to-chart-1 relative overflow-hidden hidden lg:flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Main Car */}
        <div className="relative z-10 animate-[bounce_3s_ease-in-out_infinite]">
          <div className="transform hover:scale-110 transition-transform duration-500">
            <Car className="w-96 h-96 text-white/90 drop-shadow-2xl" />
          </div>
        </div>

        {/* Moving Cars */}
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

export default LoginPage;
