import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ProductContext } from "../context/Product";
import { BackendLink } from "../link";

// Reads a product from the already-loaded product list when possible instead
// of firing a fresh request per card - previously every cart/checkout line
// item made its own `GET /ProductInfo/:id` call even though the product list
// was already loaded on the same page (an N+1 request pattern).
export function useProductInfo(id) {
	const { AllProduct } = useContext(ProductContext) || {};
	const [ProductInfo, setProductInfo] = useState({});
	const [ProductError, setProductError] = useState(null);

	useEffect(() => {
		if (!id) return;

		const cached = AllProduct?.find((product) => product?._id === id);
		if (cached) {
			setProductInfo(cached);
			return;
		}

		axios
			.get(`${BackendLink}/ProductInfo/${id}`)
			.then((res) => {
				if (res?.data?.status == 200) {
					setProductInfo(res?.data?.data);
				} else {
					setProductError(res?.data?.message);
				}
			})
			.catch((err) => {
				setProductError(err?.message);
			});
	}, [id, AllProduct]);

	return { ProductInfo, ProductError };
}
