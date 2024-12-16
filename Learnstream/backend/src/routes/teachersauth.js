import {Router} from "express"
import {loginUser, logoutUser, registerUser} from "../controllers/userteacherController.js"
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router =Router();

router.route('/signup').post(
    // injecting middle ware
    upload.fields([
        {
            name:"avatar", // front end field should also be avatar
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount: 1
        }
    ]),
    registerUser)
router.route('/login').post(loginUser)
// secured route
router.route('/logout').post(verifyJWT,logoutUser)

export default router