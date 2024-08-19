import jwt from "jsonwebtoken"
//import { SECRET } from "../utils.js";
import { config } from '../config/config.js';

export const authjwt=(req, res, next)=>{
    console.log(req.cookies["codercookie"]);
    if(!req.cookies["codercookie"]){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`User not valid...!!!`})
    }
    let token = req.cookies["codercookie"];
try {
        let user = jwt.verify(token,config.SECRET)
        req.user = user;
} catch (error) {
    res.setHeader('Content-Type','application/json');
    return res.status(401).json({error:`${error}`})
    
}
    next()
}

export const auth=(req, res, next)=>{
    if(!req.session.user){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`There are no logged users`})
    }
    next()
}
