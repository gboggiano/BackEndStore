const { Router } = require("express");
const express = require("express");
const ProductManager = require("../deliveryIIMod"); // Asegúrate de que la ruta sea correcta
const { updateProduct, getProducts } = require("../deliveryIIMod");
const filename = `${__dirname}/../../assets/products.txt`;
const productmanager = new ProductManager(filename);

const router = Router();

module.exports = router;
