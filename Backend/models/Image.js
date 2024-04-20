const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
	{
		filename: {
			type: String,
			required: true
		},
		mimetype: {
			type: String,
			required: true,
			trim: true
		},
		Admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admin"
		},
		User: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		Brand: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Brand"
		},
		Product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product"
		},
		Blog: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog"
		}
	},
	{
		timestamps: {
			createdAt: "created_at", // Use `created_at` to store the created date
			updatedAt: "updated_at" // and `updated_at` to store the last updated date
		}
	}
);

const Image = mongoose.model("Image", ImageSchema);

module.exports = { Image };
