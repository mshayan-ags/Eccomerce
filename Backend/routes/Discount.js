const { Discount } = require('../models/Discount')
const { getAdminId } = require('../utils/AuthCheck')
const { Router } = require('express')
const { default: mongoose } = require('mongoose')
const { CheckAllRequiredFieldsAvailaible } = require('../utils/functions')
const { Product } = require('../models/Product')
const { Brand } = require('../models/Brand')
const { Category } = require('../models/Category')
const { Admin } = require('../models/Admin')

const router = Router()

router.post('/Create-Discount', async (req, res) => {
	try {
		const { id, message } = await getAdminId(req)
		if (!id) {
			return res.status(401).json({ status: 401, message: message })
		}

		const Credentials = req.body

		const Check = await CheckAllRequiredFieldsAvailaible(
			Credentials,
			['type', 'DiscountType', 'value', 'startDate', 'endDate', 'isActive'],
			res,
		)
		if (Check) {
			return
		}

		const newDiscount = new Discount({
			type: Credentials?.type || null,
			DiscountType: Credentials?.DiscountType,
			value: Credentials?.value,
			startDate: Credentials?.startDate,
			endDate: Credentials?.endDate,
			isActive: Credentials?.isActive,
			Admin: new mongoose.Types.ObjectId(id),
			targetType: Credentials?.targetType ? new mongoose.Types.ObjectId(Credentials?.targetType) : null
		})

		// If Discount On Brand Or Category
		if (Credentials?.type === 'Brand' || Credentials?.type === 'Category') {
			const Document = Credentials?.type === 'Brand' ? Brand : Category
			if (Credentials?.targetType) {
				const target = await Document.findOne({ _id: Credentials?.targetType })
				if (target?._id) {
					await Document.updateOne({ _id: target?._id }, { Discount: newDiscount?._id })
				}
			}
		}

		// Setting Discount On Products
		const ProductArr =
			Credentials?.type === 'Product'
				? await Product.find({ _id: { $in: Credentials?.Products } }).select('_id')
				: Credentials?.type === 'Brand'
					? await Product.find({ brand: Credentials?.targetType }).select('_id')
					: Credentials?.type === 'Category'
						? await Product.find({ category: Credentials?.targetType }).select('_id')
						: []

		newDiscount.Product = ProductArr
		const saveDiscount = await newDiscount.save()

		const searchAdminDiscountes = await Discount.find({ Admin: id }).select('_id')
		await Admin.updateOne({ _id: id }, { Discount: searchAdminDiscountes })

		await Promise.all(
			ProductArr.map((product) =>
				Product.updateOne({ _id: product._id }, { Discount: newDiscount?._id })
			)
		)

		res.status(200).json({
			status: 200,
			message: 'Discount Created in Succesfully',
			id: saveDiscount?._id
		})
	} catch (error) {
		if (error?.code == 11000) {
			res.status(409).json({
				status: 409,
				message: `Please Change your ${Object.keys(error?.keyValue)[0]} as it's not unique`,
			})
		} else {
			res.status(500).json({ status: 500, message: error?.message || 'Something went wrong' })
		}
	}
})

router.post('/Update-Discount/:id', async (req, res) => {
	try {
		const { id, message } = await getAdminId(req)
		if (!id) {
			return res.status(401).json({ status: 401, message: message })
		}

		const Credentials = req.body

		const searchDiscount = await Discount.findOne({ _id: req?.params?.id })
		if (!searchDiscount?._id) {
			return res.status(404).json({ status: 404, message: 'Discount Not Found' })
		}

		const updateDiscount = {
			DiscountType: Credentials?.DiscountType ?? searchDiscount?.DiscountType,
			value: Credentials?.value ?? searchDiscount?.value,
			startDate: Credentials?.startDate ?? searchDiscount?.startDate,
			endDate: Credentials?.endDate ?? searchDiscount?.endDate,
			isActive: Credentials?.isActive ?? searchDiscount?.isActive,
		}

		await Discount.updateOne({ _id: req?.params?.id }, updateDiscount)
		res.status(200).json({ status: 200, message: 'Discount Updated in Succesfully' })
	} catch (error) {
		if (error?.code == 11000) {
			res.status(409).json({
				status: 409,
				message: `Please Change your ${Object.keys(error?.keyValue)[0]} as it's not unique`,
			})
		} else {
			res.status(500).json({ status: 500, message: error?.message || 'Something went wrong' })
		}
	}
})

router.get('/DiscountInfo/:id', async (req, res) => {
	try {
		const { id, message } = await getAdminId(req)
		if (!id) {
			return res.status(401).json({ status: 401, message: message })
		}

		const data = await Discount.findOne({ _id: req.params.id })
		res.status(200).json({ status: 200, data })
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || 'Something went wrong' })
	}
})

router.get('/GetAllDiscounts', async (req, res) => {
	try {
		const { id, message } = await getAdminId(req)
		if (!id) {
			return res.status(401).json({ status: 401, message: message })
		}

		const data = await Discount.find()
		res.status(200).json({ status: 200, data })
	} catch (error) {
		res.status(500).json({ status: 500, message: error?.message || 'Something went wrong' })
	}
})

module.exports = router
