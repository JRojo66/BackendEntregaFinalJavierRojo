// Imports
import { productsModel } from "./models/productsModel.js";

// Code
export class ProductManagerMONGO {

  // CRUD - Create, Read, Update, Delete

  // Create
  add = async ({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    owner,
    thumbnails = []
  }) => {
    let productAdded = {
      title,
      description,
      code,
      price,
      status,
      stock,
      owner,
      category,
      thumbnails,
    };
    return await productsModel.create(productAdded);
  };

    // Read
    getAll = async () => {
      return await productsModel.find().lean();
    };
  
    getPaginated = async (query, limit, page, sort) => {
      return await productsModel.paginate(query, {
        limit,
        page,
        sort,
        lean: true,
      });
    };
  
    getBy = async (filter) => {
      return await productsModel.findOne(filter).lean();
    };

  // Update
  update = async (id, productData) => {
    return await productsModel.findByIdAndUpdate(id, productData, {
      runValidators: true,
      returnDocument: "after",
    });
  }

  // Delete
  async delete(productId) {
    return await productsModel.deleteOne({ _id: productId });
  }
}
