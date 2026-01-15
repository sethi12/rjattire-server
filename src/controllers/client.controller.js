import { getCollection } from "../services/firebase.service.js";



export const getAllCollectionsClient = async (req, res) => {
  const data = await getCollection("collections");
  res.json(data);
};

export const getAllBrandsClient = async (req, res) => {
  try {
    const brands = await getCollection("Brands");

    res.status(200).json(brands);
  } catch (error) {
    console.error("Get Brands Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch brands",
    });
  }
};

export const getAllCategories = async(req,res)=>{
 try {
   const categories = await getCollection("Categories");
  res.status(200).json(categories)
 } catch (error) {
  console.error("Failed to fetch categories")
  res.status(500).json({
    success:false,
    message:"Failed to fetch categories"
  })
 }
}

export const getAllProductsClient = async (req, res) => {
  try {
    const products = await getCollection("products");

    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection("products").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

