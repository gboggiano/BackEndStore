const ProductManager = require("./deliveryIIMod");
const express = require("express");
const path = require("path");
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

const app = express();
const filename = `${__dirname}/../assets/products.txt`;
const productmanager = new ProductManager(filename);

//-------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//--------------
// app.get("/products", async (_, res) => {
//   //......
//   try {
//     const prod = await productmanager.getProducts();
//     res.json(prod);
//     return;
//   } catch (err) {
//     res.json({ error: `cannot get products` });
//     throw err;
//   }
// });

//--------------

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//--------------------------------------------------------------- //
// app.get("/products", async (req, res) => {
//   //......
//   try {
//     const { limit } = req.query;
//     if (limit) {
//       const prod = await productmanager.getProducts();
//       const prodLimit = prod.slice(0, limit);
//       res.json(prodLimit);
//     } else {
//       const prod = await productmanager.getProducts();
//       res.json(prod);
//     }
//   } catch (err) {
//     res.json({ error: `cannot get products` });
//     throw err;
//   }
// });

// //--------------
// app.get("/products/:uid", async (req, res) => {
//   //......

//   try {
//     const produ = await productmanager.getProductsByID(req.params.uid);

//     if (!produ) {
//       console.log(`User with ID:` + req.params.uid + ` do not exist`);
//     }

//     res.json(produ);
//     return;
//   } catch (error) {
//     console.log(`Error getting products id ` + req.params.uid);
//   }
// });

// //--------------

// //---------------
// app.get("/test", (_, res) => {
//   res.end("Test page OK");
//   console.log("no problem found");
// });

// //----------------
app.listen(8080, () => {
  console.log("Server app.js up & running");
});
//---------------------------------------------------------------
