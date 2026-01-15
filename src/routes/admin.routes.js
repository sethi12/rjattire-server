import express from "express";
import { addProduct, addToproductcollection,
     getAllProductsAdmin,getAllCollectionsAdmin, 
     updateCollection, deleteCollection,
      addtoBrands,getAllBrands,updateBrand,deleteBrand, 
      addtoCategory,
      getAllCategories,
      updateCategory,
      deleteCategory} from "../controllers/admin.controller.js";
import { upload } from "../middleware/upload.js";
const router = express.Router();

//Product
router.post(
  "/products",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  addProduct
);

router.get("/products", getAllProductsAdmin);


// Collections
router.post("/collections",addToproductcollection);
router.get("/collections", getAllCollectionsAdmin);
router.put("/collections/:id", updateCollection);
router.delete("/collections/:id", deleteCollection);


//Brands
router.post("/brands", upload.single("image"), addtoBrands);
router.get("/brands", getAllBrands);
router.put("/brands/:id", upload.single("image"), updateBrand);
router.delete("/brands/:id", deleteBrand);

//Categories 
// routes/admin.routes.js
router.post(
  "/categories",
  upload.single("image"),
  addtoCategory
);
router.get("/categories",getAllCategories);
router.put(
  "/categories/:id",
  upload.single("image"),
  updateCategory
);

router.delete(
  "/categories/:id",
  deleteCategory
);

export default router;
