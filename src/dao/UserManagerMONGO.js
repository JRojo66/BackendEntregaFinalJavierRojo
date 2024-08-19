import { userModel } from "./models/userModel.js";

export class UserManagerMONGO {
  create = async (user) => {
    return await userModel.create(user);
  };

  getBy = async (filter = {}) => {
    return await userModel.findOne(filter).lean();
  };

  update = async(search, update)=>{
    return await userModel.findOneAndUpdate(search, update)
  }

  
}
