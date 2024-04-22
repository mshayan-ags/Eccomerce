import React, { lazy } from "react";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";

// Each view is its own chunk, only fetched when an admin actually navigates
// there - the sidebar/router shell (loaded up front) stays a small, fast
// initial bundle instead of everything shipping together.
const MainDashboard = lazy(() => import("views/admin/default"));
const Address = lazy(() => import("views/admin/Address/List"));
const Bank = lazy(() => import("views/admin/Bank/List"));
const User = lazy(() => import("views/admin/User/List"));
const Sale = lazy(() => import("views/admin/Sale/List"));
const EditSale = lazy(() => import("views/admin/Sale/OrderTracking"));
const Brand = lazy(() => import("views/admin/Brand/List"));
const AddBrand = lazy(() => import("views/admin/Brand/index"));
const Category = lazy(() => import("views/admin/Category/List"));
const AddCategory = lazy(() => import("views/admin/Category"));

const Discount = lazy(() => import("views/admin/Discount/List"));
const AddDiscount = lazy(() => import("views/admin/Discount/index"));

const Coupon = lazy(() => import("views/admin/Coupon/List"));
const AddCoupon = lazy(() => import("views/admin/Coupon"));

const Product = lazy(() => import("views/admin/Product/List"));
const AddProduct = lazy(() => import("views/admin/Product"));
const SignIn = lazy(() => import("views/auth/SignIn"));
const Select = lazy(() => import("views/admin/Product/Select"));

const Blog = lazy(() => import("views/admin/Blog/List"));
const AddBlog = lazy(() => import("views/admin/Blog"));
const Review = lazy(() => import("views/admin/Review/List"));
const Settings = lazy(() => import("views/admin/Settings"));

const routes = [
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    component: <SignIn />,
    isHidden: true,
  },
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Brand",
    layout: "/admin",
    path: "Brand",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Brand />,
  },
  {
    name: "AddBrand",
    layout: "/admin",
    isHidden: true,
    path: "AddBrand/:id",
    icon: <MdPerson className="h-6 w-6" />,
    component: <AddBrand />,
  },
  {
    name: "Discount",
    layout: "/admin",
    path: "Discount",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Discount />,
  },
  {
    name: "AddDiscount",
    layout: "/admin",
    isHidden: true,
    path: "AddDiscount/:id",
    icon: <MdPerson className="h-6 w-6" />,
    component: <AddDiscount />,
  },
  {
    name: "Category",
    layout: "/admin",
    path: "Category",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Category />,
  },
  {
    name: "AddCategory",
    layout: "/admin",
    isHidden: true,
    path: "AddCategory/:id",
    icon: <MdPerson className="h-6 w-6" />,
    component: <AddCategory />,
  },
  {
    name: "Coupon",
    layout: "/admin",
    path: "Coupon",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Coupon />,
  },
  {
    name: "AddCoupon",
    layout: "/admin",
    isHidden: true,
    path: "AddCoupon/:id",
    icon: <MdPerson className="h-6 w-6" />,
    component: <AddCoupon />,
  },
  {
    name: "Product",
    layout: "/admin",
    path: "Product",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Product />,
  },
  {
    name: "AddProduct",
    layout: "/admin",
    isHidden: true,
    path: "AddProduct/:id",
    icon: <MdPerson className="h-6 w-6" />,
    component: <AddProduct />,
  },
  {
    name: "SelectProduct",
    layout: "/admin",
    isHidden: true,
    path: "SelectProduct/:ProductCode/:Type/:id",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Select />,
  },
  {
    name: "Address",
    layout: "/admin",
    path: "Address",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Address />,
  },
  {
    name: "User",
    layout: "/admin",
    path: "User",
    icon: <MdPerson className="h-6 w-6" />,
    component: <User />,
  },
  {
    name: "Sale",
    layout: "/admin",
    path: "Sale",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Sale />,
  },
  {
    name: "EditSale",
    layout: "/admin",
    isHidden: true,
    path: "EditSale/:id",
    icon: <MdPerson className="h-6 w-6" />,
    component: <EditSale />,
  },
  {
    name: "Bank",
    layout: "/admin",
    path: "Bank",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Bank />,
  },
  {
    name: "Blog",
    layout: "/admin",
    path: "Blog",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Blog />,
  },
  {
    name: "AddBlog",
    layout: "/admin",
    isHidden: true,
    path: "AddBlog/:id",
    icon: <MdPerson className="h-6 w-6" />,
    component: <AddBlog />,
  },
  {
    name: "Reviews",
    layout: "/admin",
    path: "Review",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Review />,
  },
  {
    name: "Settings",
    layout: "/admin",
    isHidden: true,
    path: "Settings",
    icon: <MdLock className="h-6 w-6" />,
    component: <Settings />,
  },
];
export default routes;
