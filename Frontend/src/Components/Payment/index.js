import React, { useEffect, useState } from 'react';
import { useStripe, useElements, Elements, PaymentElement, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";
import { BackendLink, StripePublishableKey } from '../../link';
import { withAuthContext } from '../../context/Auth';
import { withCartContext } from '../../context/Cart';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import DogFood from "../../assests/ErrorPayment.avif"

const PaymentForm = ({ createPayment }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setLoading] = useState(false);

  async function CompletePayment() {
    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (result?.paymentMethod) {
      createPayment({ paymentMethod: result?.paymentMethod, setLoading: setLoading })
    } else {
      setLoading(false)
      swal({
        text: "There was some Error",
        button: {
          text: "Ok",
          closeModal: true
        },
        icon: "error",
        time: 3000
      });
    }

  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    CompletePayment();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div id="card-element">
          <CardElement />
        </div>
      </div>
      <button
        type="submit" disabled={!stripe || isLoading} className="bg-[#1e8a30ff] py-[16px] w-full text-[#fff] mt-[15px] rounded-[25px] text-[16px] font-[600] leading-[19.2px]">

        {isLoading ? 'Processing...' : 'Place Order'}
      </button>

      <button >
      </button>
    </form>
  );
};

function Payment({ secret, createPayment }) {
  const stripePromise = loadStripe(StripePublishableKey);

  return (
    <Elements stripe={stripePromise} options={{ clientSecret: secret?.client_secret }}>
      <PaymentForm secret={secret} createPayment={createPayment} />
    </Elements>
  )
}

function PaymentComponent({ Token, CheckToken, getTotalAfterCoupon, Address, PlaceOrder, Order }) {
  const [client, setclient] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    if (!Address || Address == "") {
      navigate("/Checkout")
    }
  }, [Order, Address])

  const fetchClientSecret = async () => {
    try {
      const response = await axios.post(`${BackendLink}/create-payment-intent`, {
        amount: getTotalAfterCoupon() * 100, currency: 'usd'
      }, {
        headers: {
          Authorization: Token
            ? `${Token}`
            : `${localStorage.getItem("token")}`,
        },
      });
      return response?.data;
    } catch (error) {
      console.log('Error creating payment intent:', error);
    }
  };
  const createPayment = async ({ paymentMethod, setLoading }) => {
    try {
      GetSecret()
      return await axios.post(`${BackendLink}/confirm-payment-intent`, {
        intent: client?.id,
        paymentMethod: paymentMethod
      }, {
        headers: {
          Authorization: Token
            ? `${Token}`
            : `${localStorage.getItem("token")}`,
        },
      }).then(async (res) => {
        if (res) {
          swal({
            text: res?.data?.message || "Payment SuccesFull Wait For Order Proccesing",
            button: {
              text: "Ok",
              closeModal: true
            },
            icon: res ? "success" : "error",
            time: 3000
          });
          if (res?.status == 200) {
            await PlaceOrder(navigate, res?.data?.bankId, paymentMethod?.id)
            setLoading(false)
          } else {
            setLoading(false)
          }
        }
      }).catch((err) => {
        console.log(err)
        setLoading(false)
        GetSecret();
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
    } catch (error) {
      setLoading(false)
      console.log('Error creating payment intent:', error);
    }
  };

  async function GetSecret() {
    const s = await fetchClientSecret();
    await setclient(s);
  }

  useEffect(() => {
    CheckToken()
    GetSecret();
  }, []);

  useEffect(() => {
    if (!client || (client == ""))
      GetSecret();
  }, [client]);

  return (
    <>
      {client ?
        <>
          <Payment secret={client} createPayment={createPayment} />
        </>
        : <div className="h-[80vh] w-full flex flex-col justify-center align-center items-center">
          <img src={DogFood} className="w-[80%] md:w-[40%] h-[50vh] my-[2%]" />
          <h1 className="text-[20px] text-center md:text-[30px] text-primary">Hang Tight! We're Sorting Out Your Payment Puzzle 🧩</h1>
          <p className="text-[10px] md:text-[12px] text-[#000000] text-center">
            "While we’re working behind the scenes to fix this little payment hiccup, why not take a few moments to perfect your cart? This is the ideal time to double-check everything you’ve added, make sure you didn’t miss out on that must-have item, or even treat yourself to something extra you’ve been eyeing. Go ahead and explore your options, rearrange your picks, or simply bask in the joy of curating your perfect order. We promise to get things back on track in no time, so you can complete your checkout hassle-free! 🛒✨"
          </p>
          <button className="bg-[#1e8a30ff] py-[6px] md:py-[16px] w-[40%] md:w-[20%] text-[#fff] mt-[15px] rounded-[25px] text-[12px] md:text-[16px] font-[600]" onClick={() => {
            navigate("/Cart")
          }}>{"Shop More"}</button>
        </div>
      }
    </>
  );
}

export default withAuthContext(withCartContext(PaymentComponent));
