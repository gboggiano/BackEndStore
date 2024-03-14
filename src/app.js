const ProductManager = require("./deliveryIIMod");
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
const realTimeProducts = require("./routes/realTimeProducts");

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

//---Routes---//
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
//-- routes for handlebars uses -------//
app.use("/", viewsRouter);
app.use("/home", homeRouter);
app.use("/realTimeProducts", realTimeProducts);

//----------------websocket
const httpServer = app.listen(8080, () => {
  console.log("Server app.js up & running");
});

//-----------------server websocket

const wsServer = new Server(httpServer);
app.set("ws", wsServer);

//Cuando el cliente se conecta
wsServer.on("connection", (clientsocket) => {
  console.log(`Cliente conectado, ID: ${clientsocket.id}`);
});
