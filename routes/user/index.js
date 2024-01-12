import { Router } from "express";
const router = Router();
router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  console.log(req.session.user);
  try {
    res.render("../views/user/userHomePage", {
      title: "Welcome to Guest Page",
      userId: req.session.user.id,
      name: req.session.user.firstName,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy(() => {
    res.render("../views/logout", {
      title: "Logout Page",
      isLoginPage: false,
      message: "You have been successfully logged out.",
      homeLink: "/",
    });
  });
  res.clearCookie("AuthState");
});

export default router;
