const ProductManager = require("./deliveryIIMod");
const express = require("express");
const path = require("path");

const app = express();

const filename = `${__dirname}/../assets/products.txt`;
const productmanager = new ProductManager(filename);

//--------------
app.get("/products", async (_, res) => {
  //......
  try {
    const prod = await productmanager.getProducts();
    res.json(prod);
    return;
  } catch (err) {
    res.json({ error: `cannot get products` });
    throw err;
  }
});

//--------------
app.get("/products/:uid", async (req, res) => {
  //......

  try {
    const produ = await productmanager.getProductsByID(req.params.uid);

    if (!produ) {
      console.log(`User with ID:` + req.params.uid + ` do not exist`);
    }

    res.json(produ);
    return;
  } catch (error) {
    console.log(`Error getting products id ` + req.params.uid);
  }
});

//--------------

//---------------
app.get("/test", (_, res) => {
  res.end("Test page OK");
  console.log("no problem found");
});

//----------------
app.listen(8080, () => {
  console.log("Server app.js up & running");
});
