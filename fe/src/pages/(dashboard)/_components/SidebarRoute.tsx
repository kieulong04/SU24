"use client";

import { BarChart, List, ShoppingCart, DollarSign, User, Package, Percent, Settings } from "lucide-react";
import SidebarItem from "./SidebarItem";

const routes = [
    {
        icon: BarChart,
        label: "Thống kê",
        href: "/admin",
    },
    {
        icon: List,
        label: "Quản lý sản phẩm",
        href: "/admin/products",
    },
    {
        icon: Settings,
        label: "Quản lý thuộc tính",
        href: "/admin/attributes",
    },
    {
        icon: ShoppingCart,
        label: "Quản lý đơn hàng",
        href: "/admin/orders",
    },
    {
        icon: DollarSign,
        label: "Bán hàng tại quầy",
        href: "/admin/pos",
    },
    {
        icon: Package,
        label: "Trả hàng",
        href: "/admin/returns",
    },
    {
        icon: Percent,
        label: "Giảm giá",
        href: "/admin/discounts",
    },
    {
        icon: User,
        label: "Tài khoản",
        href: "/admin/accounts",
    },

];

const SidebarRoutes = () => {
    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    );
};

export default SidebarRoutes;
