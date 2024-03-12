const ProductManager = require("./deliveryIIMod");
const express = require("express");
const path = require("path");
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const handlebars = require("express-handlebars");
const app = express();
const filename = `${__dirname}/../assets/products.txt`;
const productmanager = new ProductManager(filename);
const viewsRouter = require("./routes/views.router");

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
//-- routes for handlebars uses
app.use("/", viewsRouter);

//----------------
app.listen(8080, () => {
  console.log("Server app.js up & running");
});
//---------------------------------------------------------------
