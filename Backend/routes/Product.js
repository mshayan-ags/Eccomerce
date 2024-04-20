const { Product } = require("../models/Product");
const { Image } = require("../models/Image");
const { getAdminId } = require("../utils/AuthCheck");
const { Router } = require("express");
const { default: mongoose } = require("mongoose");
const { CheckAllRequiredFieldsAvailaible } = require("../utils/functions");
const { SaveImageDB } = require("./Image");
const { Brand } = require("../models/Brand");
const { Category } = require("../models/Category");

const router = Router();

async function saveImagesArr({ ImgArr, id, res }) {
	const results = await Promise.all(ImgArr.map((image) => SaveImageDB(image, { Product: new mongoose.Types.ObjectId(id) }, res)));
	const failed = results.find((result) => !result?.file?._id);
	if (failed) {
		res.status(500).json({ status: 500, message: failed?.Error || "Failed to upload one or more images" });
		return false;
	}
	return true;
}

router.post("/Create-Product", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;

		const Check = await CheckAllRequiredFieldsAvailaible(
			Credentials,
			[
				"name", "description", "price", "quantity", "currentColor", "currentSize",
				"currentFlavor", "ingredients", "brand", "category", "images", "ProductCode"
			],
			res
		);
		if (Check) {
			return;
		}

		const productCode = `${Credentials?.ProductCode}-${Credentials?.currentColor}-${Credentials?.currentSize}-${Credentials?.currentFlavor}`;
		const searchProduct = await Product.findOne({ Product: productCode });
		if (searchProduct) {
			return res.status(409).json({ status: 409, message: "This Product Already Exist" });
		}

		const searchBrand = await Brand.findOne({ _id: Credentials?.brand });
		const searchCategory = await Category.findOne({ _id: Credentials?.category });
		if (!searchBrand?._id || !searchCategory?._id) {
			return res.status(400).json({ status: 400, message: "Please Check Your Data" });
		}

		const newProduct = new Product({
			Product: productCode,
			ProductCode: Credentials?.ProductCode,
			name: Credentials?.name,
			description: Credentials?.description,
			price: Credentials?.price,
			quantity: Credentials?.quantity,
			currentColor: Credentials?.currentColor,
			currentSize: Credentials?.currentSize,
			currentFlavor: Credentials?.currentFlavor,
			ingredients: Credentials?.ingredients,
			brand: new mongoose.Types.ObjectId(Credentials?.brand),
			category: new mongoose.Types.ObjectId(Credentials?.category),
			nutritional_info: {
				protein: Credentials?.protein,
				fat: Credentials?.fat,
				fiber: Credentials?.fiber,
				moisture: Credentials?.moisture
			}
		});

		const ImgArr = [...(Credentials?.images || [])];
		if (ImgArr.length > 0) {
			const uploaded = await saveImagesArr({ ImgArr, id: newProduct?._id, res });
			if (!uploaded) return;

			const uniqueImages = await Image.find({ Product: newProduct?._id }).select("_id");
			newProduct.images = uniqueImages;
		}

		await newProduct.save();

		const searchBrandProducts = await Product.find({ brand: Credentials?.brand }).select("_id");
		await Brand.updateOne({ _id: Credentials?.brand }, { Product: searchBrandProducts });

		const searchCategoryProducts = await Product.find({ category: Credentials?.category }).select("_id");
		await Category.updateOne({ _id: Credentials?.category }, { Product: searchCategoryProducts });

		res.status(200).json({ status: 200, message: "Product Created in Succesfully", id: newProduct?._id });
	} catch (error) {
		if (error?.code == 11000) {
			res.status(409).json({
				status: 409,
				message: `Please Change your ${Object.keys(error?.keyValue)[0]} as it's not unique`
			});
		} else {
			res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
		}
	}
});

router.post("/Update-Product/:id", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;

		const searchProduct = await Product.findOne({ _id: req?.params?.id });
		if (!searchProduct?._id) {
			return res.status(404).json({ status: 404, message: "Product Not Found" });
		}

		const updateProduct = {
			name: Credentials?.name ?? searchProduct?.name,
			ProductCode: Credentials?.ProductCode ?? searchProduct?.ProductCode,
			description: Credentials?.description ?? searchProduct?.description,
			price: Credentials?.price ?? searchProduct?.price,
			quantity: Credentials?.quantity ?? searchProduct?.quantity,
			currentColor: Credentials?.currentColor ?? searchProduct?.currentColor,
			currentSize: Credentials?.currentSize ?? searchProduct?.currentSize,
			currentFlavor: Credentials?.currentFlavor ?? searchProduct?.currentFlavor,
			ingredients: Credentials?.ingredients ?? searchProduct?.ingredients,
			nutritional_info: {
				protein: Credentials?.protein ?? searchProduct?.nutritional_info?.protein,
				fat: Credentials?.fat ?? searchProduct?.nutritional_info?.fat,
				fiber: Credentials?.fiber ?? searchProduct?.nutritional_info?.fiber,
				moisture: Credentials?.moisture ?? searchProduct?.nutritional_info?.moisture
			}
		};

		updateProduct.Product = `${updateProduct?.ProductCode}-${updateProduct?.currentColor}-${updateProduct?.currentSize}-${updateProduct?.currentFlavor}`;
		const clashing = await Product.findOne({
			Product: updateProduct.Product,
			_id: { $ne: searchProduct?._id }
		});
		if (clashing) {
			return res.status(409).json({ status: 409, message: "This Product Already Exist" });
		}

		if (Credentials?.images?.length > 0) {
			const uploaded = await saveImagesArr({ ImgArr: [...Credentials.images], id: searchProduct?._id, res });
			if (!uploaded) return;
		}

		const uniqueImages = await Image.find({ Product: searchProduct?._id }).select("_id");
		await Product.updateOne({ _id: req?.params?.id }, { ...updateProduct, images: uniqueImages });

		res.status(200).json({ status: 200, message: "Product Updated Succesfully" });
	} catch (error) {
		if (error?.code == 11000) {
			res.status(409).json({
				status: 409,
				message: `Please Change your ${Object.keys(error?.keyValue)[0]} as it's not unique`
			});
		} else {
			res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
		}
	}
});

router.post("/Delete-Product/:id", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const searchProduct = await Product.findOne({ _id: req?.params?.id });
		if (!searchProduct?._id) {
			return res.status(404).json({ status: 404, message: "Product Not Found" });
		}

		await Product.updateOne({ _id: req?.params?.id }, { isArchive: true });
		res.status(200).json({ status: 200, message: "Product Deleted in Succesfully" });
	} catch (error) {
		if (error?.code == 11000) {
			res.status(409).json({
				status: 409,
				message: `Please Change your ${Object.keys(error?.keyValue)[0]} as it's not unique`
			});
		} else {
			res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
		}
	}
});

router.post("/Add-Product-Accesories/:ProductCode", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const searchProduct = await Product.find({ ProductCode: req?.params?.ProductCode });
		if (searchProduct?.length <= 0) {
			return res.status(404).json({ status: 404, message: "Please Check Your Data" });
		}

		const Credentials = req.body;
		const color = [...searchProduct?.[0]?.color];
		const flavor = [...searchProduct?.[0]?.flavor];
		const size = [...searchProduct?.[0]?.size];
		if (Credentials?.ColorProductId) color.push(new mongoose.Types.ObjectId(Credentials?.ColorProductId));
		if (Credentials?.SizeProductId) size.push(new mongoose.Types.ObjectId(Credentials?.SizeProductId));
		if (Credentials?.FlavorProductId) flavor.push(new mongoose.Types.ObjectId(Credentials?.FlavorProductId));

		await Product.updateMany(
			{ ProductCode: req?.params?.ProductCode },
			{
				color: Array.from(new Set(color.map((item) => item.toString()))),
				size: Array.from(new Set(size.map((item) => item.toString()))),
				flavor: Array.from(new Set(flavor.map((item) => item.toString())))
			}
		);

		res.status(200).json({ status: 200, message: "Product Accesories Added in Succesfully" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Remove-Product-Accesories/:ProductCode", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const searchProduct = await Product.find({ ProductCode: req?.params?.ProductCode });
		if (searchProduct?.length <= 0) {
			return res.status(404).json({ status: 404, message: "Please Check Your Data" });
		}

		const Credentials = req.body;
		let color = [...searchProduct?.[0]?.color];
		let flavor = [...searchProduct?.[0]?.flavor];
		let size = [...searchProduct?.[0]?.size];

		if (Credentials?.ColorProductId) color = color.filter((item) => item.toString() != Credentials?.ColorProductId);
		if (Credentials?.SizeProductId) size = size.filter((item) => item.toString() != Credentials?.SizeProductId);
		if (Credentials?.FlavorProductId) flavor = flavor.filter((item) => item.toString() != Credentials?.FlavorProductId);

		await Product.updateMany(
			{ ProductCode: req?.params?.ProductCode },
			{
				color: Array.from(new Set(color.map((item) => item.toString()))),
				size: Array.from(new Set(size.map((item) => item.toString()))),
				flavor: Array.from(new Set(flavor.map((item) => item.toString())))
			}
		);

		res.status(200).json({ status: 200, message: "Product Accesories Removed in Succesfully" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/ProductInfo/:id", async (req, res) => {
	try {
		const Check = await CheckAllRequiredFieldsAvailaible(req.params, ["id"], res);
		if (Check) {
			return;
		}

		const data = await Product.findOne({ _id: req.params.id }).populate([
			"images", "Discount", "category", "brand",
			{ path: "color", populate: ["images"] },
			{ path: "size", populate: ["images"] },
			{ path: "flavor", populate: ["images"] }
		]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllProducts", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const data = await Product.find().populate(["images", "Discount"]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllProductsUser", async (req, res) => {
	try {
		const data = await Product.find({ isArchive: false }).populate(["images", "Discount"]);
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

module.exports = router;
