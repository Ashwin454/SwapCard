const express=require("express");
const { registerUser, loginUser, logoutUser, loadUser, updateProf, generateQR, invite, loadLists } = require("../controller/userController");
const { isAuthenticated } = require("../middleware/auth");

const router=express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/profile").get(isAuthenticated,loadUser);
router.route("/updateProf").put(isAuthenticated, updateProf);
router.route("/createQR/:id").post(isAuthenticated, generateQR);
router.route("/invite").put(isAuthenticated, invite);
router.route("/loadList").get(isAuthenticated, loadLists);
module.exports=router;