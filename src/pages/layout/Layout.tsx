import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AppSidebar from "./AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, Sun, Moon } from "lucide-react";
import { adminMenuItems, driverMenuItems, userMenuItems } from "./NavItems";
import queries from "@/api/driver/query";
import { useQuery } from "@tanstack/react-query";

const getMenuItems = (userType: string) => {
  switch (userType) {
    case "admin":
      return adminMenuItems;
    case "driver":
      return driverMenuItems;
    case "user":
    default:
      return userMenuItems;
  }
};

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

//  const {data}=queries.GetAllDriver({
  
//  })
  // const isDriverAvailable=;
  const [isDark, setIsDark] = useState(false);
  const driverIsAvailable=localStorage.getItem("driverIsAvailable");
  // console.log(Boolean(driverIsAvailable));
  const [isOnline, setIsOnline] = useState(driverIsAvailable);
  const userType = localStorage.getItem("userType") || "user";
  const menuItems = getMenuItems(userType);

  const { mutate: toggleDriverAvailability, isPending: isToggling } =
    queries.AvailablilityDriver();

  const handleToggleDriver = () => {
    const driverId = localStorage.getItem("userId") as string;
    const newStatus = isOnline==='true'?false:true;
    // console.log(newStatus);
    localStorage.setItem("driverIsAvailable",String(newStatus));
    console.log(newStatus)
    toggleDriverAvailability(
      { id: driverId, isAvailable: newStatus },
      {
        onSuccess: () => {
          setIsOnline(newStatus?'true':'false');
          toast.success(
            newStatus
              ? "تم تحويل السائق إلى Online"
              : "تم تحويل السائق إلى Offline"
          );
        },
        onError: (error: any) => {
          toast.error("حدث خطأ في تغيير حالة السائق");
          console.error("Driver availability error:", error);
        },
      }
    );
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
      if (!savedTheme) localStorage.setItem("theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newTheme;
    });
  };

  const routeTranslations = menuItems.reduce((acc, item) => {
    acc[item.url] = { label: item.title, icon: item.icon };
    return acc;
  }, {} as Record<string, { label: string; icon: any }>);

  routeTranslations["/"] = { label: "الرئيسية", icon: Home };
  routeTranslations["/home"] = { label: "الرئيسية", icon: Home };

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    if (location.pathname === "/" || location.pathname === "/home") {
      breadcrumbs.push({
        path: "/",
        label: routeTranslations["/"].label,
        icon: routeTranslations["/"].icon,
        isLast: true,
        isHome: true,
      });
      return breadcrumbs;
    }

    breadcrumbs.push({
      path: "/",
      label: routeTranslations["/"].label,
      icon: routeTranslations["/"].icon,
      isLast: false,
      isHome: true,
    });

    let currentPath = "";
    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`;
      const route = routeTranslations[currentPath];
      breadcrumbs.push({
        path: currentPath,
        label: route ? route.label : pathname,
        icon: route?.icon || null,
        isLast: index === pathnames.length - 1,
        isHome: false,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div dir="rtl" className={isDark ? "dark" : ""}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-50 border-b border-sidebar-border/30 bg-sidebar/98 backdrop-blur-md shadow-sm px-6 py-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <Breadcrumb>
                  <BreadcrumbList className="flex items-center">
                    {breadcrumbs.map((breadcrumb) => {
                      const Icon = breadcrumb.icon;
                      return (
                        <div
                          key={breadcrumb.path}
                          className="flex items-center"
                        >
                          <BreadcrumbItem>
                            {breadcrumb.isLast ? (
                              <BreadcrumbPage className="text-sidebar-foreground flex items-center gap-2">
                                {Icon && <Icon size={16} />}
                                {breadcrumb.label}
                              </BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink
                                onClick={() => navigate(breadcrumb.path)}
                                className="text-sidebar-foreground/70 hover:text-sidebar-foreground flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                {Icon && <Icon size={16} />}
                                {breadcrumb.label}
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {!breadcrumb.isLast && (
                            <BreadcrumbSeparator className="mx-2 rotate-180" />
                          )}
                        </div>
                      );
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className="flex items-center gap-3">
                {/* زر تبديل الثيم */}
                <button
                  onClick={toggleTheme}
                  className="h-8 w-8 rounded-full bg-sidebar-accent/50 hover:bg-sidebar-accent flex items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label={isDark ? "تبديل للنهار" : "تبديل للظلام"}
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                {/* زر تبديل حالة السائق Online/Offline */}
                {userType === "driver" && (
                  <button
                    onClick={handleToggleDriver}
                    disabled={isToggling}
                    className={`h-8 px-3 rounded-full font-medium text-white transition-all duration-200 ${
                      isToggling
                        ? "bg-gray-400 cursor-not-allowed"
                        : isOnline==='true'
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {isToggling
                      ? "جارٍ التغيير..."
                      : isOnline ==='true'
                      ? "متصل"
                      : "غير متصل"}
                  </button>
                )}
              </div>
            </div>
          </header>

          <main>
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
