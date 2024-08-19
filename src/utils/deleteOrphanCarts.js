import mongoose from "mongoose";
import { userModel } from "../dao/models/userModel.js";
import { cartModel } from "../dao/models/cartModel.js";
import { config } from "../config/config.js";

// ** Revisar Borra todos los carritos

async function deleteOrphanCarts() {
  try {
    // Conectar a MongoDB (reemplaza con tu conexión)
    await mongoose.connect(config.MONGO_URL, {
        dbName: config.DB_NAME,
      });
      console.log("DB Online...!!!");

    // Obtener todos los IDs de usuario
    const userIds = await userModel.find({}, '_id').lean();
    const userIdsArray = userIds.map(user => user._id);

    // Obtener todos los IDs de carrito
    const cartIds = await cartModel.find({}, '_id').lean();
    const cartIdsArray = cartIds.map(cart => cart._id);

    // Encontrar carritos orfanos
    const orphanCartIds = cartIdsArray.filter(cartId => !userIdsArray.includes(cartId));

    // Eliminar carritos orfanos
    if (orphanCartIds.length > 0) {
      await cartModel.deleteMany({ _id: { $in: orphanCartIds } });
      console.log('Carritos orfanos eliminados:', orphanCartIds.length);
    } else {
      console.log('No se encontraron carritos orfanos.');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error al eliminar carritos orfanos:', error);
  }
}

deleteOrphanCarts();