const ProductManager = require("./dao/fileManagers/deliveryIIMod");
const express = require("express");
const path = require("path");
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const app = express();
const filename = `${__dirname}/../assets/products.txt`;
const productmanager = new ProductManager(filename);
const viewsRouter = require("./routes/views.router");
const homeRouter = require("./routes/home.router");
const realTimeProducts = require("./routes/realTimeProducts.router");
// const productsDBRouter = require("./routes/productsDB.router");
// const cartsDBRouter = require("./routes/cartsDB.router");
const cartsDBRouter = require("./routes/cartsDB.router");
const mongoose = require("mongoose");
const DbProductManager = require("./dao/dbManagers/productManager");
const DbUserManager = require("./dao/dbManagers/userManager");
const prodDBRouter = require("./routes/prodDB.router");
const viewsCartsRouter = require("./routes/viewCarts.router");
const userDBRouter = require("./routes/users.router");
const { dbName, mongoUrl } = require("./dbConfig");
const sessionMiddleware = require("./session/mongoStorage");
const sessionDBRouter = require("./routes/session.router");
const loginRouter = require("./routes/login.router");
// --- Passport
const passport = require("passport");
const cookieParser = require("cookie-parser");
// --- passport Local
// const initializeStrategy = require("./config/passport.config");
// --- passport GitHub
// const initializeStrategy = require("./config/passport-github.config");
// --- passport con JWT ---///
const initializeStrategy = require("./config/passport-jw.config");
//---------------
//------handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//---publics and static
app.use(express.static(`${__dirname}/../public/`));
//-------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//-------------- ------------//

//--------Routes JSON ------//
// app.use("/api/products", productsRouter);
// app.use("/api/carts", cartsRouter);

// ---------Mongo session middleware---------//
app.use(sessionMiddleware);
//----------cookie session ------//
app.use(cookieParser());
// ------------- Passport -------------------//
initializeStrategy();
app.use(passport.initialize());
app.use(passport.session());
//---------------

//-----  MongoDB-Mongoose -------//
// app.use("/api/products", productsDBRouter);
app.use("/api/products", prodDBRouter);
app.use("/api/carts", cartsDBRouter);
app.use("/api/users", userDBRouter);
app.use("/api/session", sessionDBRouter);
//-----  Login - JW -------//
app.use("/api/login", loginRouter);

//--------------------------------------------//
//------- Routes for handlebars: ----//
//------- With Mongo  - Atlas -------//
app.use("/", viewsRouter);
app.use("/carts", viewsCartsRouter);

//--------With FS-----------//
app.use("/home", homeRouter);
app.use("/realTimeProducts", realTimeProducts);

// ----- MongoDB Config------ //
const main = async () => {
  await mongoose.connect(mongoUrl, { dbName });

  const productManager = new DbProductManager();
  await productManager.prepare();
  app.set("productManager", productManager);
  //----------------------------//

  const userManager = new DbUserManager();
  await userManager.prepare();
  app.set("userManager", userManager);

  //----------------------------//

  //---------websocket ------------/
  const httpServer = app.listen(8080, () => {
    console.log("Server app.js up & running");
  });

  // //-----server websocket---------/

  const wsServer = new Server(httpServer);
  app.set("ws", wsServer);

  // //Cuando el cliente se conecta
  // wsServer.on("connection", (clientsocket) => {
  //   console.log(`Cliente conectado, ID: ${clientsocket.id}`);
  // });
};

main();
