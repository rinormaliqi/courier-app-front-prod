"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../../contexts/SidebarContext";
import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ListIcon,
  TableIcon,
  BoxCubeIcon,
  UserIcon,
} from "../../icons/index";
import { YStack, Text, Button } from "tamagui";
import { useLanguage } from "../../contexts/LanguageContext";
import { FaMap } from "react-icons/fa";

type NavItem = {
  key: string;
  icon: React.ReactNode;
  path: string;
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const shouldShowText = isExpanded || isHovered || isMobileOpen;
  const sidebarWidth = isExpanded || isHovered || isMobileOpen ? 290 : 90;
  const iconPosition = 24;
  const { t } = useLanguage();

  const navItems: NavItem[] = useMemo(
    () => [
      {
        icon: <GridIcon className="w-5 h-5 ml-3.5" />,
        key: "sidebar.dashboard",
        path: "/dashboard",
      },
      {
        icon: <UserCircleIcon className="w-5 h-5 ml-3.5" />,
        key: "sidebar.profile",
        path: "/dashboard/profile",
      },
      {
        icon: <CalenderIcon className="w-5 h-5 ml-3.5" />,
        key: "sidebar.calendar",
        path: "/dashboard/calendar",
      },
      {
        icon: <BoxCubeIcon className="w-5 h-5 ml-3.5" />,
        key: "sidebar.orders",
        path: "/dashboard/orders",
      },
      {
        icon: <UserIcon className="w-5 h-5 ml-3.5" />,
        key: "sidebar.doctors",
        path: "/dashboard/doctors",
      },
      {
        icon: <FaMap className="w-5 h-5 ml-3.5" />,
        key: "sidebar.map",
        path: "/dashboard/map",
      },
      {
        icon: <ListIcon className="w-5 h-5 ml-3.5" />,
        key: "sidebar.forms",
        path: "/dashboard/forms",
      },
      {
        icon: <TableIcon className="w-5 h-5 ml-3.5" />,
        key: "sidebar.reports",
        path: "/dashboard/reports",
      },
      // {
      //   icon: <PageIcon className="w-5 h-5 ml-3.5" />,
      //   key: "sidebar.error",
      //   path: "/error-404",
      // },
    ],
    [],
  );

  return (
    <aside
      className={`fixed top-0 left-0 bg-white border-r border-gray-200 z-40 transition-all duration-300 ease-in-out ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
      style={{
        height: "100vh",
        width: isMobileOpen ? "100%" : `${sidebarWidth}px`,
      }}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top padding to account for header height */}
      <div className="pt-2 pb-4">
        <div className="flex justify-center py-8">
          <Link href="/dashboard">
            <Image src="/logoD.png" alt="Logo" width={32} height={32} />
          </Link>
        </div>

        <nav className="mt-4">
          <YStack gap="$1">
            {navItems.map((nav) => (
              <Link key={nav.path} href={nav.path} passHref legacyBehavior>
                <a>
                  <Button
                    chromeless
                    className="flex items-center w-full p-3 rounded-lg transition-colors relative"
                  >
                    <div
                      className="absolute flex items-center justify-center"
                      style={{
                        left: iconPosition,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "24px",
                        height: "24px",
                      }}
                    >
                      <span
                        className={
                          pathname === nav.path
                            ? "text-green-500"
                            : "text-gray-500"
                        }
                      >
                        {nav.icon}
                      </span>
                    </div>

                    <div
                      className={`transition-all duration-200 ${
                        shouldShowText ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        marginLeft: "56px",
                        textAlign: "left",
                        width: "calc(100% - 56px)",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Text
                        fontSize="$4"
                        fontWeight="500"
                        className={`${
                          pathname === nav.path
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                        color="$gray10Light"
                      >
                        {t(nav.key)}
                      </Text>
                    </div>
                  </Button>
                </a>
              </Link>
            ))}
          </YStack>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
