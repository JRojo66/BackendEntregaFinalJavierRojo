export class ViewsController {
  static home = async (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("home", {});
  };

  static register = async (req, res) => {
    res.status(200).render("register");
  };

  static login = async (req, res) => {
    let error = req.query.error;
    res.status(200).render("login", { error });
  };

  static logout = async (req, res) => {
    let { error } = req.query;
    res.status(200).render("logout", { error });
  };

  static passwordReset = async (req, res) => {
    res.status(200).render("passwordReset");
  };

  static passwordResetForm = async (req, res) => {
    res.status(200).render("passwordResetForm");
  };

  static chat = async (req, res) => {
    res.status(200).render("chat");
  };

}
