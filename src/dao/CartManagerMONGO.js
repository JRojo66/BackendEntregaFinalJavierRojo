// Imports
import { cartModel } from "./models/cartModel.js";


// Code
export class CartManagerMONGO {

  // CRUD - Create, Read, Update, Delete

  // Create: Carts are created with users

  // Create cart
  add = async () => {
    const cartProducts = {products: []}
    let newCart = await cartModel.create(cartProducts);
    return newCart.toJSON();
  }
  // Read from Data Base

  // get all carts
   getAll = async () => {
    return await cartModel.find().lean();
  }

    // get cart with filter
  getOneBy = async (filter) => {  
    return await cartModel.findOne(filter).lean();
  };

    // get cart with filter polulated
  getBy = async (filter) => {
    return await cartModel.findOne(filter).populate("products.product").lean();
  };
  
    // Update products in cart
  update = async (id, cart) => {
    return await cartModel.updateOne({ _id: id }, cart);
  }

  // Delete product in cart
  delete = async(cid, pid) => {
    return await cartModel.findByIdAndUpdate(cid,{$pull: { products: { product: pid } }},{ new: true });
  }

}

