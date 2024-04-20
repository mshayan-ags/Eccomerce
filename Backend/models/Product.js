const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
	{
		Product: {
			type: String,
			required: true,
			trim: true,
			unique: true
		},
		ProductCode: {
			type: String,
			required: true,
			trim: true
		},
		name: {
			type: String,
			required: true,
			trim: true
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0
		},
		quantity: {
			type: Number,
			required: true,
			min: 0
		},
		currentColor: {
			type: String,
			// enum: [
			// 	"black",
			// 	"brown",
			// 	"multi-color",
			// 	"orange",
			// 	"blue",
			// 	"pink",
			// 	"off white",
			// 	"green",
			// 	"purple",
			// 	"yellow"
			// ],
			default: "-"
		},
		LifeStage: {
			type: String,
			// enum: [ 	
			// 	"all",
			// 	"adult",
			// 	"senior",
			// 	"puppy",
			// 	"kitten",
			// 	"juvenile",
			// 	"average",
			// 	"all life stages",
			// 	"low",
			// 	"training"
			// ],
			default: "all"
		},
		currentSize: {
			type: String,
			// enum: [ 	
			// 	"large",
			// 	"medium",
			// 	"small",
			// 	"giant",
			// 	"toy",
			// 	"x-large",
			// 	"any",
			// 	"x-small",
			// 	"softchews",
			// 	"xx-large"
			// ],
			default: "-"
		},
		currentFlavor: {
			type: String,
			// enum: [ 	
			// 	"beef",
			// 	"lamb",
			// 	"venison",
			// 	"chicken",
			// 	"duck",
			// 	"salmon",
			// 	"turkey",
			// 	"pork",
			// 	"fish",
			// 	"rabbit",
			// 	"tuna",
			// 	"giblets"
			// ],
			default: "-"
		},
		isArchive: {
			type: Boolean,
			default: false,
			index: true,
		},
		ingredients: {
			type: String,
		},
		nutritional_info: {
			protein: {
				type: String
			},
			fat: {
				type: String
			},
			fiber: {
				type: String
			},
			moisture: {
				type: String
			}
		},
		brand: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Brand",
			index: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
			index: true,
		},
		Discount: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Discount"
		},
		review: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Review"
		},
		whishlist: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Whishlist"
		},
		color: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Product"
		},
		size: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Product"
		},
		flavor: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Product"
		},
		images: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Image"
		}
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at"
		}
	}
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };
