import React, { useEffect } from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Cart from "./Pages/Cart";
import Category from "./Pages/Category";
import Checkout from "./Pages/Checkout";
import ProductDetails from "./Pages/ProductDetails";
import ProductDetailWithComments from "./Pages/ProductDetailWithComments";
import Wishlist from "./Pages/Wishlist";
import OrderTracking from "./Pages/OrderTracking";
import SignIn from "./Pages/Singin";
import SignUp from "./Pages/Signup";
import Payment from "./Pages/Payment";
import AccountSetting from "./Pages/AccountSetting";
import OrderHistory from "./Pages/OrderHistory";
import Privacy from "./Pages/Privacy";
import TermsOfUse from "./Pages/TAC";
import Profile from "./Pages/Profile";
import Aos from "aos";
import ChangePasswordMain from "./Pages/ChangePassword";
import BlogList from "./Pages/BlogList";
import BlogDetail from "./Pages/BlogDetail";

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
      element: <AccountSetting />,
    },
    {///
      path: "/ChangePassword",
      element: <ChangePasswordMain />,
    },
    {///
      path: "/privacy-policy",
      element: <Privacy />,
    },
    {///
      path: "/TermsOfUse",
      element: <TermsOfUse />,
    },
    {///
      path: "/Profile",
      element: <Profile />,
    },
    {///
      path: "/OrderHistory",
      element: <OrderHistory />,
    },
    {///
      path: "/Cart",
      element: <Cart />,
    },
    {///
      path: "/Payment",
      element: <Payment />,
    },
    {
      path: "/OrderTracking/:id",
      element: <OrderTracking />,
    },
    {///
      path: "/SignIn",
      element: <SignIn />,
    },
    {///
      path: "/SignUp",
      element: <SignUp />,
    },
    {///
      path: "/Category",
      element: <Category />,
    },
    {///
      path: "/Category/:name",
      element: <Category />,
    },
    {///
      path: "/Checkout",
      element: <Checkout />,
    },
    {///
      path: "/ProductDetails/:id",
      element: <ProductDetails />, //
    },
    {///
      path: "/ProductDetailWithComments",
      element: <ProductDetailWithComments />,
    },
    {
      path: "/Wishlist",
      element: <Wishlist />,
    },
    {
      path: "/Blog",
      element: <BlogList />,
    },
    {
      path: "/Blog/:id",
      element: <BlogDetail />,
    },
  ]);
  return (
    <RouterProvider router={router} />
  );
};

export default App;
