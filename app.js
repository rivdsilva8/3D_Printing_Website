import express from "express";
const app = express();
import session from "express-session";
// import configRoutes from "./routes/RoutesIndex.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + "/public");

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "AuthState",
    secret: "secret session",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 },
    //cookie: { secure: false },
  })
);

app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    helpers: {
      eq: (v1, v2) => v1 === v2,
      isSelected: function (code, phonePrefix) {
        return code === phonePrefix ? 'selected ="selected"' : "";
      },
    },
  })
);
app.set("view engine", "handlebars");

app.use("/", (req, res, next) => {
  if (req.originalUrl === "/favicon.ico") {
    return next();
  }

  if (req.originalUrl.startsWith("/public")) {
    return next();
  }

  console.log(
    `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${
      req.session.user ? "Authenticated User" : "Non-Authenticated User"
    })`
  );

  next();
});

configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
