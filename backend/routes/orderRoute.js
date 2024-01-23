const express = require("express");
const { newOrder, getSingleOrder, myOrders, deleteOrder, updateOrder, getAllOrders } = require("../controllers/orderController");
const router = express.Router();
const { isAuthenticatedUse, authoriseRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUse, newOrder);

router.route("/order/:id").get(isAuthenticatedUse, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUse, myOrders);

router.route("/admin/orders").get(isAuthenticatedUse, authoriseRoles("admin"), getAllOrders);

router.route("/admin/order/:id").put(isAuthenticatedUse, authoriseRoles("admin"), updateOrder).delete(isAuthenticatedUse, authoriseRoles("admin"), deleteOrder);

module.exports = router;
