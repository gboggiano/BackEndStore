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
const prodDBRouter = require("./routes/prodDB.router");
const viewsCartsRouter = require("./routes/viewCarts.router");

//------handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//---publics and static
app.use(express.static(`${__dirname}/../public/`));
//-------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//--------------

//--------Routes JSON ---//
// app.use("/api/products", productsRouter);
// app.use("/api/carts", cartsRouter);
//-----  MongoDB-Mongoose -------//
// app.use("/api/products", productsDBRouter);
app.use("/api/products", prodDBRouter);
app.use("/api/carts", cartsDBRouter);
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
  await mongoose.connect(
    "mongodb+srv://alejandro0887:alejandro0887@coderecommerce.wk8owgr.mongodb.net/?retryWrites=true&w=majority&appName=CoderEcommerce",
    {
      dbName: "TestEcommerce",
    }
  );

  const productManager = new DbProductManager();
  await productManager.prepare();
  app.set("productManager", productManager);

  //----------------------------//

  //---------websocket ------------/
  const httpServer = app.listen(8080, () => {
    console.log("Server app.js up & running");
  });

  //-----server websocket---------/

  const wsServer = new Server(httpServer);
  app.set("ws", wsServer);

  //Cuando el cliente se conecta
  wsServer.on("connection", (clientsocket) => {
    console.log(`Cliente conectado, ID: ${clientsocket.id}`);
  });
};

main();
