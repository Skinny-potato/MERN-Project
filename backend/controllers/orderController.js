const Order = require("../Models/orderModels");
const Product = require("../Models/productModels");
const Errorhandler = require("../Utils/errorhandler");
const catchAsynErrors = require("../middleware/catchasynerrors");


//Create new order
exports.newOrder = catchAsynErrors(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    const order = await Order.create({
        shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice,
        paidAt: Date.now(),
        user: req.user._id,

    });

    res.status(201).json({
        success: true,
        order,
    })
})

//get single order
exports.getSingleOrder = catchAsynErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        return next(new Errorhandler("Order not found with this id", 404));
    }
    res.status(200).json({
        success: true,
        order,
    });
});

//get logged in user Orders
exports.myOrders = catchAsynErrors(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders,
    });
});

//get all Orders -- Admin
exports.getAllOrders = catchAsynErrors(async (req, res, next) => {

    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});

//Update Orders -- Admin
exports.updateOrder = catchAsynErrors(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new Errorhandler("Order not found with this Id", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new Errorhandler('We have already delievered this order', 400));
    }
    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }
    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.delieverdAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,

    });
});


async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}


//Delete Orders -- Admin
exports.deleteOrder = catchAsynErrors(async (req, res, next) => {

    const orders = await Order.findById(req.params.id);


    if (!orders) {
        return next(new Errorhandler("Order not found with this Id", 404));
    }

    await orders.remove()
    res.status(200).json({
        success: true,
    });
});
