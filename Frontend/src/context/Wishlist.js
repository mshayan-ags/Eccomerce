import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { BackendLink } from "../link";
import { withAuthContext } from "./Auth";

export const WishlistContext = createContext();

export const withWishlistContext = (Component) => (props) =>
(
	<WishlistContext.Consumer>
		{(value) => <Component {...value} {...props} />}
	</WishlistContext.Consumer>
);

const WishlistProvider = ({ children, Token }) => {
	const [Wishlist, setWishlist] = useState([]);
	const [WishlistError, setWishlistError] = useState(null);

	const authHeader = () => ({
		headers: { Authorization: Token || localStorage.getItem("token") },
	});

	const GetWishlist = () => {
		if (!Token && !localStorage.getItem("token")) return;
		axios
			.get(`${BackendLink}/GetWishlist`, authHeader())
			.then((res) => {
				if (res?.data?.status == 200) {
					setWishlist(res?.data?.data || []);
				} else {
					setWishlistError(res?.data?.message);
				}
			})
			.catch((err) => setWishlistError(err?.message));
	};

	const isInWishlist = (productId) => Wishlist?.some((p) => p?._id === productId);

	const AddToWishlist = (productId) => {
		if (!Token && !localStorage.getItem("token")) return;
		axios
			.post(`${BackendLink}/Add-Wishlist-Product`, { productId }, authHeader())
			.then((res) => {
				if (res?.data?.status == 200) GetWishlist();
			})
			.catch((err) => setWishlistError(err?.message));
	};

	const RemoveFromWishlist = (productId) => {
		axios
			.post(`${BackendLink}/Remove-Wishlist-Product`, { productId }, authHeader())
			.then((res) => {
				if (res?.data?.status == 200) GetWishlist();
			})
			.catch((err) => setWishlistError(err?.message));
	};

	const ToggleWishlist = (productId) => {
		if (isInWishlist(productId)) {
			RemoveFromWishlist(productId);
		} else {
			AddToWishlist(productId);
		}
	};

	useEffect(() => {
		GetWishlist();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Token]);

	return (
		<WishlistContext.Provider
			value={{ Wishlist, WishlistError, GetWishlist, isInWishlist, AddToWishlist, RemoveFromWishlist, ToggleWishlist }}
		>
			{children}
		</WishlistContext.Provider>
	);
};

export default withAuthContext(WishlistProvider);
