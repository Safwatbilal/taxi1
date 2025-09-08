import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Users, Briefcase, ArrowLeft, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const userTypes = [
  {
    id: "employee",
    title: "وظائف مكتبية",
    description: "انضم إلى فريقنا الإداري وكن جزءًا من النجاح اليومي.",
    icon: Briefcase,
    features: [
      "رواتب مجزية",
      "فرص تطور وظيفي",
      "بيئة عمل احترافية",
      "دوام مرن",
    ],
    buttonText: "انضم كموظف",
    stats: "+50 وظيفة متاحة",
    link: "appleyemployee",
  },
  {
    id: "driver",
    title: "سائق معنا",
    description: "حقق دخلاً ثابتًا مع مرونة في أوقات العمل.",
    icon: Car,
    features: ["دوام حر", "دفعات أسبوعية", "دعم دائم", "مزايا إضافية"],
    buttonText: "انضم كسائق",
    stats: "+1000 سائق نشط",
    link: "appleyDriver",
  },
  {
    id: "user",
    title: "ابدأ رحلتك",
    description: "استمتع بخدمة موثوقة وآمنة في أي وقت.",
    icon: Users,
    features: ["دعم 24/7", "تنقل آمن", "حجز سهل", "خيارات دفع متنوعة"],
    buttonText: "احجز الآن",
    stats: "+10 آلاف راكب سعيد",
    link: "registerUser",
  },
];

const JoinUs = () => {
  const navigate = useNavigate();

  const handleNavigation = (link: string) => {
    navigate(`/${link}`);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            اكتشف فرصًا جديدة، سواء كنت تبحث عن وظيفة، ترغب في القيادة، أو تبحث
            عن وسيلة تنقلك بأمان.
          </p>
          <div className="mt-8 flex justify-center items-center space-x-8 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>خدمة موثوقة</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>دعم على مدار الساعة</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {userTypes.map((type, index) => {
            const Icon = type.icon;

            return (
              <Card
                key={type.id}
                className={`relative overflow-hidden border-0 shadow-xl `}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-primary to-chart-1 transition-all duration-500`}
                />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full animate-pulse" />
                <div
                  className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full animate-bounce"
                  style={{ animationDuration: "3s" }}
                />
                <CardHeader className="relative z-10 text-white pb-2">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm `}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      {type.stats}
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-bold mb-2">
                    {type.title}
                  </CardTitle>
                  <CardDescription className="text-white/90 text-sm leading-relaxed">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 text-white pb-6">
                  <div className="space-y-3">
                    {type.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 transform transition-all duration-300"
                      >
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="relative z-10 pt-0">
                  <Button
                    onClick={() => handleNavigation(type.link)}
                    className={`w-full`}
                  >
                    <ArrowLeft className={`w-4 h-4 ml-2 `} />
                    <span>{type.buttonText}</span>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
