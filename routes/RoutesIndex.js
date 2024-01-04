import adminRoutes from "./admin/index.js";
import userRoutes from "./user/index.js";

const constructorMethod = (app) => {
  app.get("/", (req, res) => {
    res.render("home", {
      title: "Welcome to Home Page",
    });
  });

  //admin routes
  app.use("/guest", guestRoutes);
  app.use("/admin", adminRoutes);

  app.use("*", (req, res) => {
    res.render("error", {
      title: "Error",
      code: 404,
      hasError: true,
      error: "page not found",
    });
  });
};

export default constructorMethod;
