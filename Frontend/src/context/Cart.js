import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { BackendLink } from "../link";
import { withAuthContext } from "./Auth";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

export const CartContext = createContext();

export const withCartContext = (Component) => (props) =>
(
  <CartContext.Consumer>
    {(value) => <Component {...value} {...props} />}
  </CartContext.Consumer>
);

function uniqueByProductID(arr) {
  const uniqueMap = {};

  // Using reduce to iterate over the array and build a map of unique ProductID values
  const uniqueArr = arr.reduce((acc, obj) => {
    // Check if ProductID already exists in the map
    if (!uniqueMap[obj.ProductID]) {
      // If not, add it to the map and push the object to the accumulator array
      uniqueMap[obj.ProductID] = true;
      acc.push(obj);
    }
    return acc;
  }, []);

  return uniqueArr;
}

const CartProvider = ({ children, Token, CheckToken }) => {
  const [Cart, setCart] = useState([]);
  const [Address, setAddress] = useState("");
  const [Order, setOrder] = useState("");
  const [Notes, setNotes] = useState("");
  const [Coupon, setCoupon] = useState("");
  const [ScheduleOrder, setScheduleOrder] = useState(null);
  const [AllCoupon, setAllCoupon] = useState([]);
  const [CouponError, setCouponError] = useState("")
  const [UsedCoupon, setUsedCoupon] = useState([]);

  function CheckCart() {
    const storedCart = JSON.parse(localStorage.getItem("Cart"));
    if (Array.isArray(storedCart) && storedCart.length > 0) {
      setCart(storedCart);
    } else {
      localStorage.setItem("Cart", JSON.stringify([]));
      setCart([]);
    }
  }


  function AddToCart({ id, quantity, price, discountedPrice, DiscountID }) {
    CheckCart()
    const Arr = [...Cart];
    const Obj = { "ProductID": id, "quantity": quantity || 1, "price": price, discountedPrice: discountedPrice > 0 ? discountedPrice : 0, DiscountID: DiscountID || null }
    Arr.push(Obj)
    const uniqueArray = uniqueByProductID(Arr);
    setCart(uniqueArray)
    localStorage.setItem("Cart", JSON.stringify(uniqueArray));
  }


  function UpdateItemCart(id, quantity) {
    CheckCart()
    const updatedCart = Cart.map(item => {
      if (item.ProductID === id) {
        return { ...item, quantity: quantity || 1 };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("Cart", JSON.stringify(updatedCart));
    console.log(updatedCart, Cart, "Cart")
  }

  function RemoveItemCart(id) {
    CheckCart()
    const updatedCart = Cart.filter(item => item.ProductID !== id);
    setCart(updatedCart);
    localStorage.setItem("Cart", JSON.stringify(updatedCart));
  }


  function isItemCart(id) {
    const Arr = [...Cart];
    return Arr.some((a) => a?.ProductID === id);
  }

  function getItemCart(id) {
    const Arr = [...Cart];
    const Obj = Arr.filter((a) => {
      if (a?.ProductID === id) {
        return a
      }
    });
    if (Obj?.length > 0 && Obj[0]?.ProductID == id)
      return Obj[0];
  }

  function getSubTotal() {
    let Total = 0;
    Cart?.forEach((a) => {
      Total += (a?.price * a?.quantity)
    })
    return Total?.toFixed(2)
  }

  function getTotal() {
    let Total = 0;
    Cart?.forEach((a) => {
      let price = a?.DiscountID ? a?.discountedPrice : a?.price;
      Total += (price * a?.quantity)
    })
    return Number(Total?.toFixed(2)) || 0
  }

  function getDiscount() {
    return Number(getSubTotal() - getTotal())?.toFixed(2) ||  0
  }


  function getCouponDiscount() {
    if (UsedCoupon?._id) {
      const value = UsedCoupon?.discountType == "Percentage" ? (getTotal() / 100 * UsedCoupon?.discountValue) : UsedCoupon?.discountValue
      return Number(value?.toFixed(2)) || 0
    }
  }

  function getTotalAfterCoupon() {
    return Number(getTotal() - (Number(getCouponDiscount()) || 0) ) || 0
  }


  // An empty cart can't have a coupon applied to it - clear one if it's left
  // over as a side effect of the cart emptying, not as a side effect of
  // computing the total (getTotal is called directly during render in
  // several pages, so it must stay a pure calculation).
  useEffect(() => {
    if (Cart?.length > 0 && getTotal() <= 0) {
      setCoupon("");
      localStorage.removeItem("Coupon");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Cart]);


  const PlaceOrder = async (navigate, bank, paymentMethod) => {
    try {
      if (Token) {
        const Obj = {
          "Product": Cart,
          "Bank": bank,
          "Address": Address,
          "paymentMethod": paymentMethod,
          Notes: Notes,
          Total: getTotal(),
        }

        if (new Date(ScheduleOrder) > new Date()) {
          Obj.scheduleDate = ScheduleOrder;
          Obj.status = "Scheduled"
        }
        await axios.post(`${BackendLink}/Create-Sale`, Obj, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        }).then((res) => {
          if (res?.data?.status == 200) {
            setOrder(res?.data?.id);
            localStorage.removeItem("Cart");
            localStorage.removeItem("Coupon");
            setCart([])
            setAddress("")
            setCoupon("")
            setScheduleOrder(null)
            swal({
              text: "Order Placed Thanks For Ordering",
              button: {
                text: "Ok",
                closeModal: true
              },
              icon: res?.data?.status == 200 ? "success" : "error",
              time: 3000
            });
            navigate(`/OrderTracking/${res?.data?.id}`);
          }
        }).catch((err) => {
          swal({
            text: err?.response?.data?.message
              ? err?.response?.data?.message
              : "There was some Error",
            button: {
              text: "Ok",
              closeModal: true
            },
            icon: "error",
            time: 3000
          });
        });
      }
    } catch (error) {
      console.log('Error creating payment intent:', error);
    }
  };


  const ReedeemCoupon = async (code) => {
    try {
      if (Token) {
        await axios.post(`${BackendLink}/Reedem-Coupon`, {
          "Coupon": code,
          "total": getTotal(),
        }, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        }).then((res) => {
          if (res?.data?.status == 200) {
            setCoupon(res?.data?.data?._id);
            localStorage.setItem("Coupon", res?.data?.data?._id);

            swal({
              text: res?.data?.message,
              button: {
                text: "Ok",
                closeModal: true
              },
              icon: res?.data?.status == 200 ? "success" : "error",
              time: 3000
            });
          }
        }).catch((err) => {
          swal({
            text: err?.response?.data?.message
              ? err?.response?.data?.message
              : "There was some Error",
            button: {
              text: "Ok",
              closeModal: true
            },
            icon: "error",
            time: 3000
          });
        });
      } else {
        swal({
          text: "Please Login To Reedeem Coupons and Discounts",
          button: {
            text: "Ok",
            closeModal: true
          },
          icon: "warning",
          time: 3000
        });
      }
    } catch (error) {
      console.log('Error creating payment intent:', error);
    }
  };


  const GetAllCouponsUser = () => {
    axios
      .get(`${BackendLink}/GetAllCouponsUser`, {
        headers: {
          Authorization: Token
            ? `${Token}`
            : `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res?.data?.status == 200) {
          setAllCoupon(res?.data?.data?.reverse());
        } else {
          setCouponError(res?.data?.message);
        }
      })
      .catch((err) => {
        setCouponError(err?.message);
      });
  };

  const GetUsedCouponsUser = (couponIdOverride) => {
    const couponId = couponIdOverride ?? Coupon;
    if (Token && couponId) {
      axios
        .get(`${BackendLink}/CouponInfo/${couponId}`, {
          headers: {
            Authorization: Token
              ? `${Token}`
              : `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res?.data?.status == 200) {
            setUsedCoupon(res?.data?.data);
          } else {
            setCouponError(res?.data?.message);
          }
        })
        .catch((err) => {
          setCouponError(err?.message);
        });
    }
  };

  useEffect(() => {
    CheckCart();
    CheckToken()
    GetAllCouponsUser()

    // Read the stored coupon id directly instead of via `Coupon` state -
    // `setCoupon` below wouldn't be visible to this same effect until the
    // next render, so calling GetUsedCouponsUser() with no argument here
    // would always fetch with an empty id on first load.
    const storedCoupon = localStorage.getItem("Coupon");
    if (storedCoupon) {
      setCoupon(storedCoupon);
      GetUsedCouponsUser(storedCoupon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <CartContext.Provider
      value={{
        Cart,
        setCart,
        CheckCart,
        AddToCart,
        UpdateItemCart,
        RemoveItemCart,
        isItemCart,
        getItemCart,
        getTotal,
        PlaceOrder,
        Address,
        setAddress,
        Notes,
        setNotes,
        getSubTotal,
        getDiscount,
        Order, setOrder,
        Coupon, setCoupon,
        ReedeemCoupon,
        AllCoupon, CouponError, GetAllCouponsUser,
        getCouponDiscount,
        GetUsedCouponsUser,
        UsedCoupon,
        getTotalAfterCoupon,
        ScheduleOrder,
        setScheduleOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default withAuthContext(CartProvider);
