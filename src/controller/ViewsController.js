import { ProductManagerMONGO as ProductManager } from "../dao/ProductManagerMONGO.js";
import { CartManagerMONGO as CartManager } from "../dao/CartManagerMONGO.js";
import jwt from "jsonwebtoken";
import { SECRET } from "../utils.js";
import { config } from '../config/config.js';



let productManager = new ProductManager();                                            // Pasar a capa Service
let cartManager = new CartManager();                                                  // Pasar a capa Service

export class ViewsController {
  static home = async (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("home", {});
  };

  static createProduct = async (req, res) => {
    // Probar y agregar al menu
    res.status(200).render("createProduct");
  };

  static products = async (req, res) => {
    try {
      let query = {};
      let page = 1; // page by default
      let limit = 2; // limit by default
      let sort = { price: -1 }; // sort by default
      if (req.query.page) {
        page = req.query.page;
      }
      let token = req.cookies["codercookie"];
      let user = jwt.verify(token, SECRET);  // For sessions - let user = req.session.user; 
      let products = await productManager.getPaginated(
        query,
        limit,
        page,
        sort
      );
      let cartId = user.cart;
      res.setHeader("Content-Type", "text/html");
      res.status(200).render("products", { products, user, cartId });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Error fetching products");
    }
  };

  static realTimeProducts = async (req, res) => {
    let rtproducts;
    try {
      rtproducts = await productManager.getAll();
      res.setHeader("Content-Type", "text/html");
      res.status(200).render("realtime", { rtproducts });
    } catch (error) {
      console.log(error);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      });
    }
  };

  static getCartById = async (req, res) => {
    let { cid } = req.params;
    let token = req.cookies["codercookie"];
    let user = jwt.verify(token, SECRET); // For sessions req.session.user;
    let cart = await cartManager.getBy({ _id: cid });
    res.setHeader("Content-Type", "text/html");
    return res.status(200).render("cart", { cart, user });
  };

  static register = async (req, res) => {
    res.status(200).render("register");
  };


  static login = async (req, res) => {
    let { error } = req.query;
    res.status(200).render("login", { error });
  }


  static loginJWT = async (req, res) => {
    let { error } = req.query;
    res.status(200).render("loginJWT", { error });
  }

  static logoutJWT = async (req, res) => {
    let { error } = req.query;
    res.status(200).render("logoutJWT", { error });
  } 


  static loginGitHub = async (req, res) => {
    let { error } = req.query;
    res.status(200).render("loginGitHub", { error });
  }

  static profile = async (req, res) => {
    res.status(200).render("profile", { user: req.session.user });
  }


  static logout = async (req, res) => {
    req.session.destroy((e) => {
      if (e) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
          error: `Unexpected server error - Try again later or contact admninistrator`,
          detalle: `${error.message}`,
        });
      }
    });
    res.status(200).render("logout");
  }

  static passwordReset = async (req, res) => {
    res.status(200).render("passwordReset");
  }

  static passwordResetForm = async (req, res) => {
    res.status(200).render("passwordResetForm");
  }

  static attachFiles = async (req, res) => {
    res.status(200).render("attachFiles");
  }

  static attachFilesProfile = async (req, res) => {
    res.status(200).render("attachFilesProfile");
  }

  static attachFilesProduct = async (req, res) => {
    res.status(200).render("attachFilesProduct");
  }

  static attachFilesIdentification = async (req, res) => {
    res.status(200).render("attachFilesIdentification");
  }

  static attachFilesAddressProof = async (req, res) => {
    res.status(200).render("attachFilesAddressProof");
  }

  static attachFilesBankStatement = async (req, res) => {
    res.status(200).render("attachFilesBankStatement");
  }

  static chat = async(req,res) => {
    res.status(200).render("chat")
  }

}
