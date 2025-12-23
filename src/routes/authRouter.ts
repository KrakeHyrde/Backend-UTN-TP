import { Router } from "express"
import AuthController from "../controllers/authController"
import logger from "../config/logger"
import limiter from "../middleware/rateLimitMiddleware"

const authRouter = Router()

authRouter.post("/register", logger, limiter, AuthController.register)
authRouter.post("/login", logger, limiter, AuthController.login)

export default authRouter