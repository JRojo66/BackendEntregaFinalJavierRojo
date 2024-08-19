// import { CartManagerMONGO as CartManager } from "../dao/CartManagerMONGO.js";
import { cartService } from "../services/CartService.js";
//import { ProductManagerMONGO as ProductManager } from "../dao/ProductManagerMONGO.js";
import { productService } from "../services/ProductService.js";
import { isValidObjectId } from "mongoose";
import { customLogger } from "../utils.js";

// const cartManager = new CartManager();
// let productManager = new ProductManager(); // Revisar cartRouter. let productManager = new ProductManager(join(__dirname, "data", "products.json"));   Esta asi porque viene de persistencia en memoria?

export class CartController {
  static getAllCarts = async (req, res) => {
    try {
      let cart = await cartService.getAllCarts();
      if (req.query.limit) {
        // Check if 'limit' exists in the request query
        const limit = Number(req.query.limit);
        if (isNaN(limit)) {
          res.setHeader("Content-Type", "application/json");
          return res.status(400).json({ error: "The 'limit' parameter must be a number" });
        }
        cart = cart.slice(0, limit); // Apply limit  if  valid
      }
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json(cart);
    } catch (error) {
      let errorData = {
        title: "Error accesing Carts DB",
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
      customLogger.error(JSON.stringify(errorData, null, 5));
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Unexpected server error - Try again later or contact admninistrator`,
        detail: `${error.message}`,
      });
    }
  };

  static getCartById = async (req, res) => {
    let cid = req.params.cid;
    console.log(cid);
    if (!isValidObjectId(cid)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: "Pls, enter a valid id..." });
    }
    try {
      let cart = await cartService.getCartBy({ _id: cid });
      if (!cart) {
        res.setHeader("Content-Type", "application/json");
        return res.status(404).json({ message: `cart id ${cid} not found` });
      } else {
        res.json(cart);
      }
    } catch {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: "Unkwown error params" });
    }
  };

  static addProductInCart = async (req, res) => {
    let { cid, pid } = req.params;
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Not valid cid/pid` });
    }

    let cart = await cartService.getOneCartBy({ _id: cid });
    if (!cart) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Can't find Cart id ${cid}` });
    }
    let product = await productService.getProductBy({ _id: pid });
    if (!product) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Can't find product id ${pid}` });
    }

    if(product.owner===req.user.email)
      {
        return res.status(401).json({ error: `Can't buy your own products... Doesn't make sense, ask Coderhouse why...` });
      }


    let productIndex = cart.products.findIndex((p) => p.product == pid);

    if (productIndex === -1) {
      cart.products.push({ product: pid, qty: 1 });
    } else {
      cart.products[productIndex].qty++;
    }
    let result = await cartService.updateCart(cid, cart);
    if (result.modifiedCount > 0) {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json("Cart updated");
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Unexpected server error - Try later or contact administrator`,
        detalle: `Could not update...!`,
      });
    }
  };

  static updateCart = async (req, res) => {
    // cid validations as ObjectId
    let { cid } = req.params;
    if (!isValidObjectId(cid)) {
      return res
        .status(500)
        .json({ error: `cart id must be a valid MongoDB _id` });
    }
    // cart validation
    let cartExists;
    cartExists = await cartService.getCartBy({ _id: cid });
    if (!cartExists) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(404)
        .json({ error: `There is no cart with id: ${cid}` });
    }
    // Cart update
    let newProducts = req.body;
    const newCart = await cartService.updateCart(cid, newProducts);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(`Cart ${cid} updated`);
  };

  static updateQty = async (req, res) => {
    // WARNING: the endpoint is very similar to "/:cid/product/:pid" and can be confused
    let { cid, pid } = req.params;
    // cid and pid validations as ObjectId
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      return res
        .status(500)
        .json({ error: `cart and products id must be valid MongoDB _ids` });
    }
    // product validation
    let exists;
    try {
      // ** Volver acá con el productService
      exists = await productService.getProductBy({ _id: pid });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Unexpected server error - Try again later or contact admninistrator`,
        detail: `${error.message}`,
      });
    }
    if (!exists) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `There is no Product with id: ${pid}` });
    }
    //cart validation
    let cartExists;
    cartExists = await cartService.getCartBy({ _id: cid });
    if (!cartExists) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(404)
        .json({ error: `There is no cart with id: ${cid}` });
    }
    // Validate qty
    let newQty = req.body.qty;
    if (typeof newQty !== "number") {
      return res.status(500).json({ error: `qty must be a number` });
    }
    // Update qty
    try {
      let productExists = false;
      let cart = await cartService.getOneCartBy({ _id: cid });
      cart.products.forEach((element) => {
        if (element.product == pid) {
          element.qty = newQty;
          productExists = true;
        }
      });
      if (!productExists) {
        return res.status(500).json({
          error: `There is no product ${pid} does not exist in cart ${cid}`,
        });
      }

if(product.owner===req.user.email)
  {
    return res.status(401).json({ error: `Can't buy your own products... Doesn't make sense, ask Coderhouse why...` });
  }

      let newProducts = { products: cart.products };
      const newCart = await cartService.updateCart(cid, newProducts);
      return res.json(`Updated cart: ${pid} with qty: ${newQty}`);
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Unexpected server error - Try again later or contact admninistrator`,
        detail: `${error.message}`,
      });
    }
  };

  static deleteProduct = async (req, res) => {
    let { cid, pid } = req.params; // create a validation function
    // cid and pid validations as ObjetcId
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      return res
        .status(400)
        .json({ error: `cart and products id be valid Mongo ObjectIds` });
    }
    // product validation in products
    let existsInProducts;
    try {
      existsInProducts = await productService.getProductBy({ _id: pid }); // Volver con Product services
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Unexpected server error - Try again later or contact admninistrator`,
        detail: `${error.message}`,
      });
    }
    if (!existsInProducts) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(404)
        .json({ error: `There is no Product with id: ${pid}` });
    }
    // cart validation
    let cartExists;
    try {
      cartExists = await cartService.getOneCartBy({ _id: cid });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Unexpected server error - Try again later or contact admninistrator`,
        detail: `${error.message}`,
      });
    }
    if (!cartExists) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(404)
        .json({ error: `There is no cart with id: ${cid}` });
    }
    // product validation in cart
    let productIndex = cartExists.products.findIndex((p) => p.product == pid);
    if (productIndex === -1) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(404)
        .json({ error: `There is no product ${pid} in cart ${cid}` });
    }
    // Delete product in cart
    try {
      let cartUpdated = await cartService.deleteProductInCart(cid, pid);
      res.json(`${pid} deleted from cart: ${cid}`);
    } catch (error) {
      return res.json({
        error: `Unexpected server error - Try again later or contact admninistrator`,
        detail: `${error.message}`,
      });
    }
  };

  static deleteAllProductsInCart = async (req, res) => {
    let { cid } = req.params;
    // cid validation as objectId
    if (!isValidObjectId(cid)) {
      return res
        .status(400)
        .json({ error: `cart id must be valid Mongo ObjectId` });
    }
    // cart existence validation
    let cartExists;
    try {
      cartExists = await cartService.getCartBy({ _id: cid });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Unexpected server error - Try again later or contact admninistrator`,
        detail: `${error.message}`,
      });
    }
    if (!cartExists) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(404)
        .json({ error: `There is no cart with id: ${cid}` });
    }
    let newProducts = { products: [] };
    const newCart = await cartService.updateCart(cid, newProducts);
    res.setHeader("Content-Type", "application/json");
    return res.json(`Products in cart ${cid} were deleted`);
  };

  // Pasar a TicketController

  static addNewTicket = async (req, res) => {
    try {
      console.log("yyy");
      //let ticket = await TicketManager.add()
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Unexpected server error - Try again later or contact admninistrator`,
        detail: `${error.message}`,
      });
    }
  };
}
