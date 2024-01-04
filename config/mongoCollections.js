import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const users = getCollectionFn("users");
export const orders = getCollectionFn("orders");
export const products = getCollectionFn("products");
export const transactions = getCollectionFn("transactions");
export const carts = getCollectionFn("carts");
