import adminRoutes from "./admin/index.js";
import usersRoutes from "./users.js";
import guestRoutes from "./guest/index.js";
import staffRoutes from "./staff/index.js";

const constructorMethod = (app) => {
  app.get("/", (req, res) => {
    res.render("home", {
      title: "Welcome to Home Page",
    });
  });


  //admin routes
  // TODO: middleware to check if user is actually an admin
  app.use("/", usersRoutes);
  app.use("/guest", guestRoutes);
  app.use("/admin", adminRoutes);
  app.use("/staff", staffRoutes);

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
