import React from "react";
import {
  LogOut,
  LayoutDashboard,
  CarFront,
  Users,
  User,
  MapPin,
  UserCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import {
  adminMenuItems,
  driverMenuItems,
  userMenuItems,
  empMenuItems,
} from "./NavItems";

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userType = localStorage.getItem("userType");
  console.log({ userType });
  const userName = localStorage.getItem("userName") || "مستخدم";

  const getMenuItems = () => {
    switch (userType) {
      case "admin":
        return adminMenuItems;
      case "driver":
        return driverMenuItems;
      case "user":
        return userMenuItems;
      default:
        return empMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const handleItemClick = (url: string) => {
    navigate(url);
  };

  const handleLogout = () => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    navigate("/login");
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case "admin":
        return "مدير";
      case "driver":
        return "سائق";
      case "user":
        return "مستخدم";
      default:
        return "موظف";
    }
  };

  return (
    <Sidebar side="right" collapsible="icon" className="border-l" dir="rtl">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="cursor-pointer">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/BilaWasit04.png"
                    alt="Bela Wasset"
                    className="object-contain"
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                    BW
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-right text-sm leading-tight">
                <span className="truncate font-semibold text-primary">
                  {userName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {getUserTypeLabel()}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            القائمة الرئيسية
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive =
                  location.pathname === item.url ||
                  location.pathname.startsWith(item.url + "/");

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => handleItemClick(item.url)}
                      isActive={isActive}
                      tooltip={item.title}
                      className={`cursor-pointer ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      <IconComponent
                        className={isActive ? "text-primary" : ""}
                      />
                      <span
                        className={isActive ? "text-primary font-medium" : ""}
                      >
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="تسجيل الخروج"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <LogOut />
              <span>تسجيل الخروج</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
