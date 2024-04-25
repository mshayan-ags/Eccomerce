import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { withAuthContext } from "./Auth";

// The 9 entity contexts (Address, Bank, Brand, Category, Coupon, Discount,
// Product, Sale, User) were previously copy-pasted, near byte-for-byte
// identical, into 9 separate files. This factory is the single
// implementation they all share now - the same shape, defined once.
export function createEntityContext({ endpoint, listKey, getterKey, errorKey, transform }) {
  const Context = createContext();

  const withContext = (Component) => (props) => (
    <Context.Consumer>{(value) => <Component {...value} {...props} />}</Context.Consumer>
  );

  const Provider = ({ children, Token, CheckToken }) => {
    const [list, setList] = useState([]);
    const [error, setError] = useState(null);

    const getAll = () => {
      if (Token || localStorage.getItem("token")) {
        axios
          .get(`${process.env.REACT_APP_PUBLIC_PATH}/${endpoint}`, {
            headers: {
              Authorization: Token ? `${Token}` : `${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            if (res?.data?.status == 200) {
              const data = res?.data?.data;
              setList(transform ? transform(data) : data);
            } else {
              setError(res?.data?.message);
            }
          })
          .catch((err) => {
            setError(err?.message);
          });
      } else {
        setTimeout(() => {
          CheckToken();
          getAll();
        }, 500);
      }
    };

    useEffect(() => {
      getAll();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Context.Provider value={{ [getterKey]: getAll, [listKey]: list, [errorKey]: error }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, withContext, Provider: withAuthContext(Provider) };
}
