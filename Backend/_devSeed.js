require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Brand } = require("./models/Brand");
const { Category } = require("./models/Category");
const { Product } = require("./models/Product");
const { Admin } = require("./models/Admin");
const { User } = require("./models/User");
const { Blog } = require("./models/Blog");
const { Review } = require("./models/Review");
const { Address } = require("./models/Address");
const { Bank } = require("./models/Bank");
const { Sale } = require("./models/Sale");
const { SaleOfProduct } = require("./models/SaleOfProduct");

async function main() {
	await mongoose.connect(process.env.MONGODB_URI);

	const brandRoyal = await new Brand({ name: "royal paws", description: "Premium nutrition for every life stage.", country: "USA" }).save();
	const brandWild = await new Brand({ name: "wild trail", description: "Grain-free recipes inspired by the wild.", country: "Canada" }).save();

	const catDogFood = await new Category({ name: "dog food", description: "Everyday nutrition for dogs." }).save();
	const catCatFood = await new Category({ name: "cat food", description: "Everyday nutrition for cats." }).save();
	const catTreats = await new Category({ name: "treats", description: "Snacks and training treats." }).save();

	const products = await Product.insertMany([
		{
			Product: "royal-adult-chicken-5kg", ProductCode: "RP-1001", name: "Royal Paws Adult Chicken Recipe",
			description: "A balanced adult dog food made with real chicken as the first ingredient.",
			price: 42.99, quantity: 120, LifeStage: "adult", currentSize: "medium", currentFlavor: "chicken",
			ingredients: "Chicken, brown rice, oatmeal, chicken fat, flaxseed",
			nutritional_info: { protein: "26%", fat: "15%", fiber: "4%", moisture: "10%" },
			brand: brandRoyal._id, category: catDogFood._id,
		},
		{
			Product: "royal-puppy-salmon-3kg", ProductCode: "RP-1002", name: "Royal Paws Puppy Salmon Recipe",
			description: "Omega-rich salmon formula to support healthy puppy growth.",
			price: 38.5, quantity: 80, LifeStage: "puppy", currentSize: "small", currentFlavor: "salmon",
			ingredients: "Salmon, sweet potato, peas, salmon oil",
			nutritional_info: { protein: "28%", fat: "17%", fiber: "3%", moisture: "10%" },
			brand: brandRoyal._id, category: catDogFood._id,
		},
		{
			Product: "wild-trail-senior-turkey-4kg", ProductCode: "WT-2001", name: "Wild Trail Senior Turkey Recipe",
			description: "Grain-free senior formula with glucosamine for joint support.",
			price: 45.0, quantity: 60, LifeStage: "senior", currentSize: "large", currentFlavor: "turkey",
			ingredients: "Turkey, lentils, chickpeas, glucosamine, chondroitin",
			nutritional_info: { protein: "24%", fat: "13%", fiber: "5%", moisture: "10%" },
			brand: brandWild._id, category: catDogFood._id,
		},
		{
			Product: "wild-trail-indoor-cat-tuna-2kg", ProductCode: "WT-3001", name: "Wild Trail Indoor Cat Tuna Recipe",
			description: "Hairball control formula for indoor cats with real tuna.",
			price: 29.99, quantity: 95, LifeStage: "adult", currentSize: "small", currentFlavor: "tuna",
			ingredients: "Tuna, rice, fish oil, psyllium husk",
			nutritional_info: { protein: "32%", fat: "14%", fiber: "6%", moisture: "10%" },
			brand: brandWild._id, category: catCatFood._id,
		},
		{
			Product: "royal-kitten-chicken-1kg", ProductCode: "RP-4001", name: "Royal Paws Kitten Chicken Recipe",
			description: "Nutrient-dense formula to support kitten growth and development.",
			price: 19.99, quantity: 150, LifeStage: "kitten", currentSize: "toy", currentFlavor: "chicken",
			ingredients: "Chicken, egg, taurine, DHA",
			nutritional_info: { protein: "34%", fat: "18%", fiber: "3%", moisture: "10%" },
			brand: brandRoyal._id, category: catCatFood._id,
		},
		{
			Product: "wild-trail-training-treats-500g", ProductCode: "WT-5001", name: "Wild Trail Beef Training Treats",
			description: "Bite-sized, low-calorie treats perfect for training sessions.",
			price: 12.49, quantity: 200, LifeStage: "all", currentSize: "softchews", currentFlavor: "beef",
			ingredients: "Beef, sweet potato, natural flavoring",
			nutritional_info: { protein: "22%", fat: "8%", fiber: "2%", moisture: "20%" },
			brand: brandWild._id, category: catTreats._id,
		},
	]);

	const adminPassword = await bcrypt.hash("Admin@12345", 12);
	const admin = await new Admin({
		name: "Demo Admin", email: "admin@demo.com", phoneNumber: 1234567890,
		password: adminPassword, Role: "SuperAdmin",
	}).save();

	const userPassword = await bcrypt.hash("User@12345", 12);
	const user = await new User({
		name: "Jordan Rivera", email: "customer@demo.com", password: userPassword, points: 240,
	}).save();

	const address = await new Address({
		full_name: "Jordan Rivera", phone_number: "555-0142", address_line1: "482 Maple Street", address_line2: "Apt 3B",
		city: "Austin", state: "TX", country: "USA", postal_code: "73301", User: user._id,
	}).save();

	await Review.insertMany([
		{ user: user._id, targetType: "Product", targetId: products[0]._id, rating: 5, comment: "My dog loves this food, coat looks shinier already!" },
		{ user: user._id, targetType: "Product", targetId: products[2]._id, rating: 4, comment: "Good quality, senior dog seems to have more energy." },
	]);

	await new Blog({
		title: "5 Signs Your Dog's Diet Needs an Upgrade",
		content: "Nutrition plays a huge role in your dog's energy, coat, and long-term health. Here are five signs it might be time for a change...",
		Admin: admin._id,
	}).save();

	const bank = await new Bank({
		User: user._id, bank_name: "Visa", account_number: "4242", account_detail: "visa_4242",
		country: "USA", stripeID: "pm_demo_4242", is_verified: true,
	}).save();

	const saleOfProduct = await new SaleOfProduct({
		product: products[0]._id, quantity: 2, totalPrice: products[0].price, totalPriceAfterDiscount: products[0].price,
	}).save();

	const sale = await new Sale({
		User: user._id, Address: address._id, Bank: bank._id, Product: [saleOfProduct._id], paymentMethod: "card_demo",
		totalAmount: products[0].price * 2, totalAmountAfterDiscount: products[0].price * 2, couponvalue: 0, status: "Processing",
	}).save();
	saleOfProduct.Sale = sale._id;
	await saleOfProduct.save();

	console.log("SEED_DONE");
	console.log(JSON.stringify({
		admin: { email: "admin@demo.com", password: "Admin@12345" },
		user: { email: "customer@demo.com", password: "User@12345" },
		saleId: sale._id.toString(),
	}));
	process.exit(0);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
