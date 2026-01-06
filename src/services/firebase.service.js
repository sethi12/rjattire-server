import { db } from "../config/firebase.js";

/* ---------------- READ ---------------- */
export const getCollection = async (collectionName) => {
  const snapshot = await db.collection(collectionName).get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/* ---------------- CREATE ---------------- */
export const addToCollection = async (collectionName, data) => {
  const ref = await db.collection(collectionName).add({
    ...data,
    createdAt: new Date(),
  });
  return ref.id;
};

/* ---------------- UPDATE ---------------- */
export const updateCollectionById = async (collectionName, id, data) => {
  await db
    .collection(collectionName)
    .doc(id)
    .update({
      ...data,
      updatedAt: new Date(),
    });
  return true;
};

/* ---------------- DELETE ---------------- */
export const deleteCollectionById = async (collectionName, id) => {
  await db.collection(collectionName).doc(id).delete();
  return true;
};
