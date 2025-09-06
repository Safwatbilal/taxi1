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
    SidebarProvider,
  } from "@/components/ui/sidebar"
import { Collapsible } from "../ui/collapsible"
import { CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { ChevronDown, ChevronUp, User2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import Link from "next/link"
import { useEffect, useState } from 'react';
type User = {
  id: string;
  name: string;
  photoUrl: string;
};


export function AppSidebar() {
   const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      fetch('/api/users')
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) setUser(data[1]); // get the first user
        });
    }, []);
  
    return (

        <Sidebar variant="floating" side="right" className='' >
 <button className=" text-white cursor-pointer" >
<Link className="flex flex-row justify-center p-2" href={'/UserProfile'}><p className="ml-3">{user?.name}</p>
<div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-white">
  <img src={user?.photoUrl} alt="" className="rounded-2xl "/>
</div>
</Link>
</button>
          <SidebarHeader />
          <SidebarContent />
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton  className="text-white">
                      <User2 /> انضم الينا
                      <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    side="top"
                    className="w-[--radix-popper-anchor-width]  text-white"
                  >
                    <DropdownMenuItem>
                      <Link href={'/loginAsCus'} >
                        التسجيل كزبون 
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                    <Link href={'/loginAsDr'} >
                        التسجيل كسائق 
                      </Link>
                    </DropdownMenuItem>
                   <DropdownMenuItem>
                    <Link href={'/HomePage'} >
                        الصفحة الرئيسية 
                      </Link>
                    </DropdownMenuItem>
                                        <DropdownMenuItem>
                    <Link href={'/'} >
                        الخريطة 
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

    )
  }
  