import { UserManagerMONGO } from "../../src/dao/UserManagerMONGO.js";
import mongoose from "mongoose";
import Assert from "assert";
import {describe, it} from "mocha";
import { isValidObjectId } from "mongoose";
import { expect } from "chai";


const assert = Assert.strict;

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

  describe("Test UserManagerMONGO - Assert",function(){
    this.timeout(10000);
    
    before(function(){
        this.dao=new UserManagerMONGO();          // instanciates 
    })
    afterEach(async function(){
        await mongoose.connection.collection("users").deleteMany({email:"test20240804@test.com"})
    })

    it("UserManagerMONGO getBy returns user",async function(){
        let result = await this.dao.getBy();
        assert.ok(Object.keys(result).includes("_id"));
    })

    it("UserManagerMONGO create creates a user in Mongo Database", async function(){
        let checknull = await mongoose.connection.collection("users").findOne({email:"test20240804@test.com"})
        assert.equal(checknull, null);
        await this.dao.create({name:"testname", lastname:"testlastname", age: 1, role:"user", cart: "66789f7c7e06af63bddf1c09", email:"test20240804@test.com", password:"123"});
        let result = await mongoose.connection.collection("users").findOne({email:"test20240804@test.com"})
        assert.ok(isValidObjectId(result._id));
    })
  })