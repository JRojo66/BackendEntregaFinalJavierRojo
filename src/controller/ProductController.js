// import { ProductManagerMONGO as ProductManager } from "../dao/ProductManagerMONGO.js";
import { productService } from "../services/ProductService.js";
import { isValidObjectId } from "mongoose";
import { validationProducts } from "../utils/validation.js";
import { productsModel } from "../dao/models/productsModel.js";           // Quitar
///import { io } from "../app.js";                                       // Revisar - porque no lo esta exportando?

// Instanciates                                                         // Para la persistencia en FS?
// let productManager = new ProductManager(
//    join(__dirname, "data", "products.json")
// );

// Loads Products
// async function loadProducts() {                                        // Para la persistencia en FS?
//   await productManager.init();
// }
// loadProducts();

// let productManager = new ProductManager();

export class ProductController {
  static getProducts = async (req, res) => {
    // Variables definition
    let pquery;
    let limit = 10;
    let page = 1;
    let query = {};
    let sort = {};
    let prevLink = "";
    let nextLink = "";

    // limit validation
    if (req.query.limit) {
      limit = Number(req.query.limit);
      if (isNaN(limit)) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "The 'limit' parameter must be a number" });
      }
    }

    // page validation
    if (req.query.page) {
      page = Number(req.query.page);
      if (isNaN(page)) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "The 'page' parameter must be a number" });
      }
    }

    // query validation
    if (req.query.query) {
      let queryObject = {};
      try {
        queryObject = JSON.parse(req.query.query);
      } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({
          error: "Query param is not a JSON - please modify and try again",
        });
      }

      if (typeof queryObject === "object") {
        // Validate query - Que mande alguna de la propiedades existentes
        query = queryObject;
      } else {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "The 'query' parameter must be a JSON" });
      }
    }

    // sort validations
    if (req.query.sort) {
      // Validate sort - Que mande propiedades existentes
      let sortObject = {};
      try {
        sortObject = JSON.parse(req.query.sort);
      } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({
          error: "Sort param is not a JSON - please modify and try again",
        });
      }

      if (typeof sortObject === "object") {
        sort = sortObject;
      } else {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "The 'sort' parameter must be a JSON" });
      }
    }

    // Query
    pquery = await productService.getProductsPaginated(query, limit, page, sort);

    // Links to prevPage y nextPage
    if (!pquery.hasPrevPage) {
      prevLink = null;
    } else {
      prevLink = `http://localhost:8080/api/products?page=${
        page - 1
      }&limit=${limit}&query=${encodeURIComponent(
        JSON.stringify(query)
      )}&sort=${encodeURIComponent(JSON.stringify(sort))}`;
    }

    if (!pquery.hasNextPage) {
      nextLink = null;
    } else {
      nextLink = `http://localhost:8080/api/products?page=${
        page + 1
      }&limit=${limit}&query=${encodeURIComponent(
        JSON.stringify(query)
      )}&sort=${encodeURIComponent(JSON.stringify(sort))}`;
    }

    // Return
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      status: 200,
      payload: pquery.docs,
      totalPages: pquery.totalPages,
      prevPage: pquery.prevPage,
      nextPage: pquery.nextPage,
      hasPrevPage: pquery.hasPrevPage,
      hasNextPage: pquery.hasNextPage,
      prevLink,
      nextLink,
    });
  };

  static getProductById = async (req, res) => {
    let id = req.params.id;
    id = Number(id);
    if (isNaN(id)) {
      return res.json({ error: "Pls, enter a numeric id..." });
    }
    try {
      let product = await productService.getProductBy({ id: id });          
      if (!product) {
        return res.json({ message: `id ${id} not found` });
      } else {
        res.json({ product, user: req.user }); // returns user for DesafioComplementario2
      }
    } catch {
      return res.json({ error: "Unkwown error params" });
    }
  };

  static createProduct = async (req, res) => {
    let {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      owner,
      thumbnails,
    } = req.body;

    const errors = validationProducts(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      // do not validate owner. if owner is not specified, owner is "admin"
      thumbnails
    );
    if (errors.length > 0) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({error: errors }); // Return an array of validation errors
    }

    // Validate product exists
    let exists;
    try {
      exists = await productService.getProductBy({ code });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Unexpected server error - Try again later or contact admninistrator`,
        //detail: `${error.message}`,
      });
    }
    if (exists) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `Product with code ${code} already exists` });
    }    
    // if owner is not specified, owner is "admin"
    if(!owner){
      owner="admin"
    }

    try {
      let productAdded = await productService.addProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        owner,
        thumbnails,
      });
      let newProduct = await productService.getAllProducts();
        req.serverSocket.emit("newProduct", title);
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({payload: productAdded});
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res
        .status(500)
        .json({
          error: `Unexpected server error - Try again later or contact admninistrator`,
        });
    }
  };

  static updateProduct = async (req, res) => {
    let { pid } = req.params;
    if (!isValidObjectId(pid)) {
      return res.status(400).json({
        error: `Enter a valid id`,
      });
    }

    let updatedProduct = req.body;

    if (updatedProduct._id) {
      delete updatedProduct._id;
    }

    if (updatedProduct.code) {
      let exist;
      try {
        exist = await productService.getProductBy({ code: updatedProduct.code });
        if (exist) {
          return res.status(400).json({
            error: `A product with the code ${updatedProduct.code} already exists`,
          });
        }
      } catch (error) {
        return res.status(500).json({
          error: `${error.message}`,
        });
      }
    }

    try {
      let product = await productService.getProductBy({_id: pid})
      if(req.user.email !== product.owner && req.user.name !== "admin"){
        return res.json({ payload: `Only the product owner can delete this product...!!!` });
      }
      const products = await productService.updateProducts(pid, updatedProduct);
      return res.json(products);
    } catch (error) {
      res
        .status(300)
        .json({
          error: `Unexpected server error - Try again later or contact admninistrator`,
        });
    }
  };

  static deleteProduct = async (req, res) => {
    let { pid } = req.params;
    if (!isValidObjectId(pid)) {
      return res.status(400).json({
        error: `Enter a valid id`,
      });
    }
    try {
      let product = await productService.getProductBy({_id: pid})
      if(req.user.email !== product.owner && req.user.name !== "admin"){
        return res.json({ payload: `Only the product owner can delete this product...!!!` });
      }
      if (product){               
        await productService.deleteProduct(pid);
        req.serverSocket.emit("deletedProduct", await productService.getAllProducts());
        return res.json({ payload: `Product ${pid} deleted` });
      }
      else {
        return res.status(404).json({ error: `${pid} inexistent` });
      }
    } catch (error) {
      return res.status(300).json({ error: `Error deleting product ${pid}`});        //  ,error: ${error}
    }
  };
}
