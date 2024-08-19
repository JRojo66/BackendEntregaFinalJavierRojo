import { UserManagerMONGO } from "../../src/dao/UserManagerMONGO.js";
import mongoose from "mongoose";
import {describe, it, before, afterEach} from "mocha";
import { isValidObjectId } from "mongoose";
import { expect } from "chai";

const connDB = async () => {
    // Connects to mongoDb
    try {
      await mongoose.connect("mongodb+srv://backendCoderJRb:backend123@jr.rdtaukg.mongodb.net/?retryWrites=true&w=majority&appName=JR", {
        dbName: "ecommerce",
      });
      console.log("DB Online...!!!");
    } catch (error) {
      console.log(error);
    }
  };
  connDB();

  describe("Test UserManagerMONGO - Chai",function(){
    this.timeout(10000);
    
    before(function(){
        this.dao=new UserManagerMONGO();          // instanciates 
    })
    afterEach(async function(){
        await mongoose.connection.collection("users").deleteMany({email:"test20240804@test.com"})
    })

    it("UserManagerMONGO getBy returns user (CHAI)",async function(){
        let result = await this.dao.getBy();
        expect(Object.keys(result).includes("_id")).to.be.true;
        expect(Object.keys(result)).to.includes("email");
        expect(Object.keys(result._id)).to.exist;
    })

    it("UserManagerMONGO create creates a user in Mongo Database (CHAI)", async function(){
        let checknull = await mongoose.connection.collection("users").findOne({email:"test20240804@test.com"})
        //assert.equal(checknull, null);
        expect(checknull).to.be.null
        await this.dao.create({name:"testname", lastname:"testlastname", age: 1, role:"user", cart: "66789f7c7e06af63bddf1c09", email:"test20240804@test.com", password:"123"});
        let result = await mongoose.connection.collection("users").findOne({email:"test20240804@test.com"})
        expect(isValidObjectId(result._id)).to.exist
    })
  })