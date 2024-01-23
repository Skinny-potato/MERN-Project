const express = require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteProfile, deleteUser } = require("../controllers/userController");
const { isAuthenticatedUse, authoriseRoles } = require("../middleware/auth");
const router = express.Router();



router.route("/register").post(registerUser);

router.route("/login").post(loginUser)

router.route("/password/forgot").post(forgotPassword)

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout)

router.route("/me").get(isAuthenticatedUse, getUserDetails);

router.route("/password/update").put(isAuthenticatedUse, updatePassword);

router.route("/me/update").put(isAuthenticatedUse, updateProfile);

router.route("/admin/users").get(isAuthenticatedUse, authoriseRoles("admin"), getAllUsers);

router.route("/admin/user/:id").get(isAuthenticatedUse, authoriseRoles("admin"), getSingleUser).put(isAuthenticatedUse, authoriseRoles("admin"), updateUserRole).delete(isAuthenticatedUse, authoriseRoles("admin"), deleteUser);

module.exports = router;