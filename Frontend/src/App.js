import React, { Suspense, lazy, useEffect } from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Aos from "aos";

// Home stays eager since it's what most visits land on first - every other
// page is its own chunk, only fetched once someone actually navigates there.
const Cart = lazy(() => import("./Pages/Cart"));
const Category = lazy(() => import("./Pages/Category"));
const Checkout = lazy(() => import("./Pages/Checkout"));
const ProductDetails = lazy(() => import("./Pages/ProductDetails"));
const ProductDetailWithComments = lazy(() => import("./Pages/ProductDetailWithComments"));
const Wishlist = lazy(() => import("./Pages/Wishlist"));
const OrderTracking = lazy(() => import("./Pages/OrderTracking"));
const SignIn = lazy(() => import("./Pages/Singin"));
const SignUp = lazy(() => import("./Pages/Signup"));
const Payment = lazy(() => import("./Pages/Payment"));
const AccountSetting = lazy(() => import("./Pages/AccountSetting"));
const OrderHistory = lazy(() => import("./Pages/OrderHistory"));
const Privacy = lazy(() => import("./Pages/Privacy"));
const TermsOfUse = lazy(() => import("./Pages/TAC"));
const Profile = lazy(() => import("./Pages/Profile"));
const ChangePasswordMain = lazy(() => import("./Pages/ChangePassword"));
const BlogList = lazy(() => import("./Pages/BlogList"));
const BlogDetail = lazy(() => import("./Pages/BlogDetail"));

// A route's chunk is still loading over the network - shown on every lazy
// route transition, not just first load, so it stays minimal.
function PageLoader() {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#1e8a30ff] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function withSuspense(element) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

const App = () => {
  useEffect(() => {
    Aos.init(
      {
        once: true,
      }
    );
  }, [])
  const router = createBrowserRouter([
    {///
      path: "*",
      element: <Home />,
    },
    {///
      path: "/",
      element: <Home />,
    },
    {///
      path: "/AccountSetting",
      element: withSuspense(<AccountSetting />),
    },
    {///
      path: "/ChangePassword",
      element: withSuspense(<ChangePasswordMain />),
    },
    {///
      path: "/privacy-policy",
      element: withSuspense(<Privacy />),
    },
    {///
      path: "/TermsOfUse",
      element: withSuspense(<TermsOfUse />),
    },
    {///
      path: "/Profile",
      element: withSuspense(<Profile />),
    },
    {///
      path: "/OrderHistory",
      element: withSuspense(<OrderHistory />),
    },
    {///
      path: "/Cart",
      element: withSuspense(<Cart />),
    },
    {///
      path: "/Payment",
      element: withSuspense(<Payment />),
    },
    {
      path: "/OrderTracking/:id",
      element: withSuspense(<OrderTracking />),
    },
    {///
      path: "/SignIn",
      element: withSuspense(<SignIn />),
    },
    {///
      path: "/SignUp",
      element: withSuspense(<SignUp />),
    },
    {///
      path: "/Category",
      element: withSuspense(<Category />),
    },
    {///
      path: "/Category/:name",
      element: withSuspense(<Category />),
    },
    {///
      path: "/Checkout",
      element: withSuspense(<Checkout />),
    },
    {///
      path: "/ProductDetails/:id",
      element: withSuspense(<ProductDetails />), //
    },
    {///
      path: "/ProductDetailWithComments",
      element: withSuspense(<ProductDetailWithComments />),
    },
    {
      path: "/Wishlist",
      element: withSuspense(<Wishlist />),
    },
    {
      path: "/Blog",
      element: withSuspense(<BlogList />),
    },
    {
      path: "/Blog/:id",
      element: withSuspense(<BlogDetail />),
    },
  ]);
  return (
    <RouterProvider router={router} />
  );
};

export default App;
