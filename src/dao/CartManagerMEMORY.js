// Imports
import fs from "fs";
import { stringify } from "querystring";
import { dirname, join } from "path";
import path from "path";

export class CartManagerMEMORY {
  #cart;
  #filePathCart;
  constructor(pathCart) {
    this.#cart = [];
    this.#filePathCart = pathCart;
  }
  async init() {
    this.#cart = await this.#getCartFromFileAsync();
  }

  // File management

  // Read form file
  #getCartFromFileAsync = async () => {
    try {
      let fileContent = await fs.promises.readFile(this.#filePathCart, {
        encoding: "utf-8",
      });
      return JSON.parse(fileContent);
    } catch (error) {
      return `Error reading file: , ${error}`;
    }
  };

  // Save in file

  #saveCartInFileAsync = async () => {
    try {
      await fs.promises.writeFile(
        this.#filePathCart,
        JSON.stringify(this.#cart)
      );
      return this.#cart;
    } catch (error) {
      return `Error saving file: ${error})`;
    }
  };

  // CRUD - Create, Read, Update, Delete

// Create cart
  addCart = async () => {
    this.#cart.push({id:1, products: []})
    await this.#saveCartInFileAsync();
    return `Cart #1 created - Cart is empty`;
  }

  // Create/add product in cart
  addProductInCart = async (cid, id) => {
    const cart = this.#cart.findIndex((element) => element.id === cid);
    if (cart > -1) {
      const product = this.#cart[cart].products.findIndex(
        (element) => element.id === id
      );
      if (product > -1) {
        this.#cart[cart].products[product].qty++;
        await this.#saveCartInFileAsync();
        return `Product ${id} added to Cart # ${cid}!`;
      } else {
        let oldId = id;
        id = Math.max(...this.#cart.map((m) => m.id)) + 1; // creates id = max cart.id +1
        let newProduct = { id: oldId, qty: 1 };
        this.#cart[cart].products.push(newProduct);
        await this.#saveCartInFileAsync();
        return `Product ${oldId} added to Cart...! id: ${cid}`;
      }
    } else {
      cid = Math.max(...this.#cart.map((m) => m.id)) + 1; // creates id = max cart.id +1
      if(this.#cart.length===0){
        cid = 1;
        console.log(cid);
      } 
      this.#cart.push({ id: cid, products: [{ id: id, qty: 1 }] });
      await this.#saveCartInFileAsync();
      return `New Cart added...! Cart id:  ${cid}...!`;
      
    }
  };

  //  Read all
  getCart = () => {
    return this.#cart;
  };

  // Read by Id
  getCartById = (id) => {
    const cart = this.#cart.find((element) => element.id === id);
    if (cart) {
      return cart;
    } else {
      return `id ${id} not found...!`;
    }
  };
}
