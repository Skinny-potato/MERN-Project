const express = require("express")
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductreview, getProductReviews, deleteReview, getAdminProducts } = require("../controllers/productControllers");
const { isAuthenticatedUse, authoriseRoles } = require("../middleware/auth");



const router = express.Router()

router.route("/products").get(getAllProducts);

router.route("/admin/products").get(isAuthenticatedUse, authoriseRoles("admin"), getAdminProducts)

router.route("/admin/product/new").post(isAuthenticatedUse, authoriseRoles("admin"), createProduct);

router.route("/admin/product/:id").put(isAuthenticatedUse, authoriseRoles("admin"), updateProduct).delete(isAuthenticatedUse, authoriseRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUse, createProductreview);

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUse, deleteReview);

module.exports = router



//Note :
// THe syntax which is used to define the routes up above may seem different but they are actually sensible

// its divided into two parts -- The route , the middleware function

// the middle ware functions actually pass on their command as they complete their part 
