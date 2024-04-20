const { Blog } = require("../models/Blog");
const { getAdminId } = require("../utils/AuthCheck");
const { Router } = require("express");
const { CheckAllRequiredFieldsAvailaible } = require("../utils/functions");
const { SaveImageDB } = require("./Image");
const { default: mongoose } = require("mongoose");

const router = Router();

router.post("/Create-Blog", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;
		const Check = await CheckAllRequiredFieldsAvailaible(Credentials, ["title", "content"], res);
		if (Check) {
			return;
		}

		const newBlog = new Blog({
			title: Credentials.title,
			content: Credentials.content,
			categories: Credentials.categories || [],
			tags: Credentials.tags || [],
			Admin: new mongoose.Types.ObjectId(id),
		});

		if (Credentials?.image?.name) {
			const image = await SaveImageDB(Credentials.image, { Blog: newBlog._id }, res);
			if (image?.file?._id) {
				newBlog.Image = [new mongoose.Types.ObjectId(image.file._id)];
			} else {
				return res.status(500).json({ status: 500, message: image?.Error });
			}
		}

		await newBlog.save();
		res.status(200).json({ status: 200, message: "Blog Created Succesfully", id: newBlog._id });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Update-Blog/:id", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		const Credentials = req.body;
		const searchBlog = await Blog.findOne({ _id: req.params.id });
		if (!searchBlog?._id) {
			return res.status(404).json({ status: 404, message: "Blog Not Found" });
		}

		const updateBlog = {
			title: Credentials?.title ?? searchBlog.title,
			content: Credentials?.content ?? searchBlog.content,
			categories: Credentials?.categories ?? searchBlog.categories,
			tags: Credentials?.tags ?? searchBlog.tags,
		};

		if (Credentials?.image?.name) {
			const image = await SaveImageDB(Credentials.image, { Blog: searchBlog._id }, res);
			if (image?.file?._id) {
				updateBlog.Image = [new mongoose.Types.ObjectId(image.file._id)];
			} else {
				return res.status(500).json({ status: 500, message: image?.Error });
			}
		}

		await Blog.updateOne({ _id: req.params.id }, updateBlog);
		res.status(200).json({ status: 200, message: "Blog Updated Succesfully" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.post("/Delete-Blog/:id", async (req, res) => {
	try {
		const { id, message } = await getAdminId(req);
		if (!id) {
			return res.status(401).json({ status: 401, message: message });
		}

		await Blog.deleteOne({ _id: req.params.id });
		res.status(200).json({ status: 200, message: "Blog Deleted Succesfully" });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/GetAllBlogs", async (req, res) => {
	try {
		const data = await Blog.find().populate(["Image"]).sort({ publicationDate: -1 });
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

router.get("/BlogInfo/:id", async (req, res) => {
	try {
		const data = await Blog.findOne({ _id: req.params.id }).populate(["Image"]);
		if (!data) {
			return res.status(404).json({ status: 404, message: "Blog Not Found" });
		}
		res.status(200).json({ status: 200, data });
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
	}
});

module.exports = router;
