// import adminRoutes from "./admin/index.js";
import userRoutes from "./user/index.js";
import alienRoutes from "./alien.js";

const constructorMethod = (app) => {
  app.get("/", (req, res) => {
    res.render("home", {
      title: "Welcome to Home Page",
    });
  });

  app.use("/", alienRoutes);
  app.use("/user", userRoutes);
  // app.use("/admin", adminRoutes);

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
