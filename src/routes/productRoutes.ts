import { Router } from "express"
import ProductController from "../controllers/productController"
import multer from "multer"
import logger from "../config/logger";
import authMiddleware from "../middleware/authMiddleware";

const upload = multer({ storage: multer.memoryStorage() });
const productRouter = Router() 

productRouter.get("/", logger, ProductController.getAllProducts)
productRouter.get("/:id", logger, ProductController.getProduct)
//productRouter.get("/category/:category_id", logger, ProductController.getProductsByCategory)
productRouter.post("/", logger, upload.single("image"), authMiddleware, ProductController.addProduct)
productRouter.patch("/:id", logger, authMiddleware, ProductController.updateProduct)
productRouter.delete("/:id", logger, authMiddleware, ProductController.deleteProduct)

export default productRouter