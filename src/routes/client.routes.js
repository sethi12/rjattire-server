import express from "express";
import { getAllBrandsClient, getAllCategories, getAllCollectionsClient, getAllProductsClient, getProductById } from "../controllers/client.controller.js";

const router = express.Router();
router.get("/collections",getAllCollectionsClient);
router.get("/brands",getAllBrandsClient);
router.get("/products", getAllProductsClient);
router.get("/products/:id", getProductById);
router.get("/categories",getAllCategories);

export default router;
