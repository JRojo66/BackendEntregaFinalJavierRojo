import { UserManagerMONGO as UserManager } from "../dao/UserManagerMONGO.js";

class UserService{
    constructor(dao){
        this.dao = dao;
    }
    getUsersBy = async (filter = {}) => {
        return this.dao.getBy(filter);
    }

    createUser = async (user) => {
        return this.dao.create(user);
    }

    updateUser = async (search, update) => {
        return this.dao.update(search, update)
    }
}
export const userService = new UserService(new UserManager);
