import { addToCollection, getCollection,updateCollectionById,deleteCollectionById } from "../services/firebase.service.js";
import { storage, db } from "../config/firebase.js";
import { v4 as uuid } from "uuid";



export const addToproductcollection = async (req,res)=>{
  const id = await addToCollection("collections",req.body);
  res.json({success:true,id})
}
export const getAllCollectionsAdmin = async (req, res) => {
  const data = await getCollection("collections");
  res.json(data);
};

/* UPDATE COLLECTION */
export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Collection ID is required",
      });
    }

    await updateCollectionById("collections", id, {
      ...payload,
      updatedAt: Date.now(),
    });

    res.json({
      success: true,
      message: "Collection updated successfully",
    });
  } catch (error) {
    console.error("Update Collection Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update collection",
    });
  }
};

/* DELETE COLLECTION */
export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Collection ID is required",
      });
    }

    await deleteCollectionById("collections", id);

    res.json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    console.error("Delete Collection Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete collection",
    });
  }
};

export const addtoBrands = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name) {
      return res.status(400).json({ success: false, message: "Brand name required" });
    }

    let imageUrl = null;

    /* ---------- UPLOAD IMAGE ---------- */
    if (file) {
      const bucket = storage.bucket();
      const fileName = `brands/${uuid()}-${file.originalname}`;
      const blob = bucket.file(fileName);

      await blob.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
        public: true,
      });

      imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    /* ---------- SAVE TO FIRESTORE ---------- */
    const id = await addToCollection("Brands", {
      name,
      image: imageUrl,
    });

    res.json({
      success: true,
      id,
      image: imageUrl,
    });
  } catch (error) {
    console.error("Add Brand Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add brand",
    });
  }
};

export const getAllBrands = async (req, res) => {
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


/* ---------------- UPDATE BRAND ---------------- */
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const file = req.file;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Brand ID is required",
      });
    }

    const brandRef = db.collection("Brands").doc(id);
    const brandSnap = await brandRef.get();

    if (!brandSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    const brandData = brandSnap.data();
    let imageUrl = brandData.image;

    /* ---------- IF NEW IMAGE UPLOADED ---------- */
    if (file) {
      const bucket = storage.bucket();

      // 🔥 Delete old image from storage
      if (brandData.image) {
        const oldPath = brandData.image.split(`${bucket.name}/`)[1];
        if (oldPath) {
          await bucket.file(oldPath).delete().catch(() => {});
        }
      }

      // Upload new image
      const fileName = `brands/${uuid()}-${file.originalname}`;
      const blob = bucket.file(fileName);

      await blob.save(file.buffer, {
        metadata: { contentType: file.mimetype },
        public: true,
      });

      imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    /* ---------- UPDATE FIRESTORE ---------- */
    await brandRef.update({
      ...(name && { name }),
      image: imageUrl,
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Brand updated successfully",
      image: imageUrl,
    });
  } catch (error) {
    console.error("Update Brand Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update brand",
    });
  }
};

/* ---------------- DELETE BRAND ---------------- */
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Brand ID is required",
      });
    }

    const brandRef = db.collection("Brands").doc(id);
    const brandSnap = await brandRef.get();

    if (!brandSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    const brandData = brandSnap.data();
    const bucket = storage.bucket();

    /* ---------- DELETE IMAGE FROM STORAGE ---------- */
    if (brandData.image) {
      const filePath = brandData.image.split(`${bucket.name}/`)[1];
      if (filePath) {
        await bucket.file(filePath).delete().catch(() => {});
      }
    }

    /* ---------- DELETE FIRESTORE DOC ---------- */
    await brandRef.delete();

    res.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Delete Brand Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete brand",
    });
  }
};


// Products
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      collection,
      color,
      price,
      stock,
      stitchedType,
      cod,
      category,
      description,
      fabricDetails,
      fabricMeters,
    } = req.body;

    // if (!name || !brand || !price) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Required fields missing",
    //   });
    // }

    const bucket = storage.bucket();

    /* ---------- UPLOAD MAIN IMAGE ---------- */
    let mainImageUrl = null;

    if (req.files?.mainImage?.[0]) {
      const file = req.files.mainImage[0];
      const fileName = `products/main/${uuid()}-${file.originalname}`;

      await bucket.file(fileName).save(file.buffer, {
        metadata: { contentType: file.mimetype },
        public: true,
      });

      mainImageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    /* ---------- UPLOAD MULTIPLE IMAGES ---------- */
    let imageUrls = [];

    if (req.files?.images?.length) {
      for (const file of req.files.images) {
        const fileName = `products/gallery/${uuid()}-${file.originalname}`;

        await bucket.file(fileName).save(file.buffer, {
          metadata: { contentType: file.mimetype },
          public: true,
        });

        imageUrls.push(
          `https://storage.googleapis.com/${bucket.name}/${fileName}`
        );
      }
    }

    /* ---------- SAVE PRODUCT ---------- */
const docRef = await db.collection("products").add({
  name,
  brand,
  collection,
  color,
  price: Number(price),
  stock: Number(stock),
  stitchedType:stitchedType||'',
  category,
  cod: String(cod).toLowerCase() === "yes", // ✅ FIXED
  description,
  fabricDetails: JSON.parse(fabricDetails || "[]"),
  fabricMeters: JSON.parse(fabricMeters || "[]"),
  mainImage: mainImageUrl,
  images: imageUrls,
  createdAt: new Date(),
});


    res.json({
      success: true,
      id: docRef.id,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
    });
  }
};

/* ---------------- GET ALL PRODUCTS (ADMIN) ---------------- */
export const getAllProductsAdmin = async (req, res) => {
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

//add to Category 
export const addtoCategory = async (req, res) => {
  try {
    const { name, brand,collection } = req.body;
    const file = req.file;

    if (!name || !brand) {
      return res.status(400).json({
        success: false,
        message: "Category name and brand are required",
      });
    }

    let imageUrl = null;

    /* ---------- UPLOAD IMAGE ---------- */
    if (file) {
      const bucket = storage.bucket();
      const fileName = `categories/${uuid()}-${file.originalname}`;
      const blob = bucket.file(fileName);

      await blob.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
        public: true,
      });

      imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    /* ---------- SAVE TO FIRESTORE ---------- */
    const id = await addToCollection("Categories", {
      name,
      brand,          // 🔗 brand reference (id)
      image: imageUrl,
      createdAt: new Date(),
      collection: collection
    });

    res.json({
      success: true,
      id,
      image: imageUrl,
    });
  } catch (error) {
    console.error("Add Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add category",
    });
  }
};


export const getAllCategories = async (req, res) => {
  try {
    const categories = await getCollection("Categories");

    res.status(200).json(categories);
  } catch (error) {
    console.error("Get Brands Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch brands",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // category document ID
    const { name, brand ,collection} = req.body;
    const file = req.file;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (brand) updateData.brand = brand;
    if(collection) updateData.collection = collection;
    /* ---------- IMAGE UPDATE (OPTIONAL) ---------- */
    if (file) {
      const bucket = storage.bucket();
      const fileName = `categories/${uuid()}-${file.originalname}`;
      const blob = bucket.file(fileName);

      await blob.save(file.buffer, {
        metadata: { contentType: file.mimetype },
        public: true,
      });

      updateData.image = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    await db.collection("Categories").doc(id).update(updateData);

    res.json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    await db.collection("Categories").doc(id).delete();

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};
