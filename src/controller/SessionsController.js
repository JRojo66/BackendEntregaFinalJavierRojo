import { UserManagerMONGO as UserManager } from "../dao/UserManagerMONGO.js";
import { SECRET } from "../utils.js";
import jwt from "jsonwebtoken";
import { UserDTO } from "../dto/userDTO.js";
import { config } from "../config/config.js";
import nodemailer from "nodemailer";
import { userService } from "../services/UserService.js";

const userManager = new UserManager();

export class SessionsController {
  static redirectToMain = (req, res) => {
    res.redirect("http://localhost:8080/");
  };

  static register = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json({ message: "Register OK", newUser: req.user });
  };

  static login = async (req, res) => {
    let { web } = req.body;
    let user = { ...req.user }; // passport modifies the request creating a req.user
    delete user.password;
    req.session.user = user;
    if (web) {
      res.redirect("/profile");
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ payload: "Successful Login...!!!", user });
    }
  };

  static loginJWT = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ payload: "Enter email and password" });
    }
    let user = await userManager.getBy({ email }); // Pasar a service
    if (!user)
      return res
        .status(400)
        .send(`Wrong credentials...There is no user with that mail...!!!`);
    user = new UserDTO(user);
    user = { ...user };
    let token = jwt.sign(user, SECRET, { expiresIn: "1h" });
    res.cookie("codercookie", token, { httpOnly: true });
    // Record login time
    await userManager.update({ email }, { last_connection: new Date() });
    return res.status(200).json({
      userLogged: user,
      token,
    });
  };

  static logoutJWT = async (req, res) => {
    try {
      const token = req.cookies.codercookie;
      const user = jwt.verify(token, SECRET);
      const email = user.email;
      await userManager.update({ email }, { last_connection: new Date() });                                               //Pasar a userService
      res.clearCookie("codercookie");
      res.setHeader("Content-Type", "application/json");
      return res
        .status(200)
        .json({ payload: `Bye ${user.name}, hope to see you back soon!` });
    } catch (error) {
      console.log(error);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Unexpected error - Try later or contact administrator...!!!`,
      });
    }
  };

  static passwordReset = async (req, res) => {
    let { email } = req.body;
    // Validates email not empty
    if (!email) return res.status(400).send("Enter email");
    try {
      //Validate email exists
      let user = await userManager.getBy({ email });
      if (!user) return res.status(400).send(`Mail not registered...!!!`);
      // create jwt
      let tokenpwr = jwt.sign(user, SECRET, { expiresIn: 3600 });
      res.cookie("resetPasswordcookie", tokenpwr, { httpOnly: true });
      const userjwt = jwt.verify(tokenpwr, SECRET, { algorithms: ["HS256"] });

      // Send email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: "587",
        auth: {
          user: "javier.rojo66@gmail.com",
          pass: config.GMAIL_PASS,
        },
      });
      transporter.sendMail({
        from: "rojozon javier.rojo66@gmail.com",
        to: user.email,
        subject: "Reset your password",
        html: `<a href="http://localhost:8080/passwordResetForm/?token=${tokenpwr}">Reset your password</a>`,
      });
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        payload: `An email was sent to ${user.email}. Check your spambox if not received. Follow instructions`,
      });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Unexpected error - Try later or contact administrator...!!!`,
      });
    }
  };

  static error = (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected server error - Try again later or contact admninistrator`,
      detail: `Authentication error...!!!`,
    });
  };

  static loginGitHub = (req, res) => {
    async (req, res) => {
      let { web } = req.body;
      let user = { ...req.user }; // passport modifies the request creating a req.user
      delete user.password;
      req.session.user = user;
      if (web) {
        res.redirect("/profile");
      } else {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(200)
          .json({ payload: "Successful Login...!!!", user });
      }
    };
  };

  static callBackGitHub = (req, res) => {
    req.session.user = req.user;
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: req.user });
  };

  static logout = (req, res) => {
    req.session.destroy((e) => {
      if (e) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
          error: `Unexpected server error - Try again later or contact admninistrator`,
          detalle: `${error.message}`,
        });
      }
    });
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "Successful Logout...!!!" });
  };

  static current = (req, res) => {
    let userSessions = req.session.user;
    userSessions = new UserDTO(userSessions);
    if (!userSessions) {
      userSessions = "No sessions users logged";
    }
    let token = req.cookies["codercookie"];
    try {
      let userJWT = jwt.verify(token, SECRET);
      userJWT = new UserDTO(userJWT);
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ userSessions, userJWT });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(401).json({ userJWT: `${error}`, userSessions });
    }
  };

  static premium = async (req, res) => {
    try {
      let uid = req.params.uid;
      let user = await userManager.getBy({ _id: uid });
      console.log(user);
      if (user.role === "premium") {
        await userService.updateUser({ _id: uid }, { role: "user" });
        res.setHeader("Content-Type", "application/json");
        return res
          .status(200)
          .json({ payload: `User ${user.email} is now user` });
      }
      if (user.role === "user" && user.documents[0].reference!=="" && user.documents[1].reference!=="" && user.documents[2].reference!=="") {
        console.log("user.documents[0]",user.documents[0].reference);                                                    // clg
        await userService.updateUser({ _id: uid }, { role: "premium" });
        res.setHeader("Content-Type", "application/json");
        return res
          .status(200)
          .json({ payload: `User ${user.email} is now premium` });
      } else {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Role is not premium nor user or missing or incomplete documents...!!!`})
      }
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Unexpected server error - contact your administrator`,
        detalle: `${error}`,
      });
    }
  };

  static addDocument = async (req, res) => {
    let userId;
    if(!req.fileDoc){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`Choose file and try again...!!!`})
    }
    if ((req.params.uid = "web")) {
      userId = req.user._id;
    } else {
      userId = req.params.uid;
    }
    const reference = req.fileSavedPath + "/" + req.fileSavedName;
    try {
      const user = await userManager.getBy({ _id: userId });
      let documents = user.documents;
      switch (req.fileDoc) {
        case "profile":
          break;
        case "product":
          console.log(req.fileDoc);
          break;
        case "identification":
          documents[0].reference = reference;
          break;
        case "addressProof":
          console.log(req.fileDoc);
          documents[1].reference = reference;
          break;
        case "bankStatement":
          documents[2].reference = reference;

          break;
        default:
      }
      await userManager.update({ _id: userId }, { documents });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Unexpected server error - contact your administrator`,
      });
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "File saved...!!!" });
  };
}
