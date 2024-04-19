const productsModel = require("../../models/products.model");

class ProductManagerdb {
  constructor() {}

  async prepare() {
    // No hacer nada.
    // Podríamos chequear que la conexión existe y está funcionando
    if (productsModel.db.readyState !== 1) {
      throw new Error("must connect to mongodb!");
    }
  }

  async getAll(filters = null) {
    const { code, title } = { code: null, title: null, ...filters };

    const queryConditions = [];

    if (code) {
      queryConditions.push({ code });
    }

    if (title) {
      queryConditions.push({
        title: {
          $regex: `^${title}`,
          $options: "i",
        },
      });
    }

    const products = queryConditions.length
      ? await productsModel.find({ $and: queryConditions }).lean()
      : await productsModel.find().lean();

    return products;
    // .map((d) => d.toObject({ virtuals: true }));
  }

  async deleteById(id) {
    await productsModel.deleteOne({ _id: id });
  }

  async addProduct(prod) {
    const { title, description, price, thumbnail, code, stock } = prod;

    // Verificar si el producto ya existe en la base de datos
    const existingProduct = await productsModel.findOne({ code });
    if (existingProduct) {
      console.log("El código ya existe");
      return;
    }

    // Validar los campos requeridos
    if (!title || !description || !price || !code) {
      throw new Error("Datos de usuario inválidos");
    }

    // Crear el nuevo producto
    await productsModel.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });
  }

  async getByCode(code) {
    try {
      const product = await productsModel.findOne({ code }).lean();
      return product;
    } catch (error) {
      console.error("Error al buscar el producto por código:", error.message);
      throw error;
    }
  }
}

module.exports = ProductManagerdb;
