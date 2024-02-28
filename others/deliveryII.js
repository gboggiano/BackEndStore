const fs = require("fs");

class ProductManager {
  constructor(path) {
    // guardar ruta del archivo
    this.path = path;
    // array vacio
    this.products = [];
  }

  #getAndIncrease() {
    if (this.products.length === 0) {
      return 1;
    }
    // si no, obtener el mayor id y sumarle 1
    const maxID = Math.max(...this.products.map((p) => p.id));
    return maxID + 1;
  }

  //---- metodo agregar producto

  async addProduct(product) {
    // validacion de campos obligatorios
    const { title, description, price, thumbnail, code, stock } = product;
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      stock === undefined
    ) {
      console.error("All fields must be mandatory, please complete");
      return;
    }

    // validacion codigo no se repita

    const existingProduct = this.products.find((p) => p.code === code);

    if (existingProduct) {
      console.log("The code already exist");
      return;
    }

    // asignar el id al producto

    product.id = this.#getAndIncrease();

    // agregar el producto al final del archivo

    await fs.promises.appendFile(
      this.path,
      JSON.stringify(product) + "\n",
      "utf-8"
    );

    // devuelve producto apregado
    return product;
  }

  //---- metodo obtener todos los productos

  async getProducts() {
    // leer archivo
    let data = await fs.promises.readFile(this.path, "utf-8");
    //---- convertirlo a un arreglo de objetos y devolverlo
    return data.split("\n").map((line) => {
      JSON.parse(line);
    });
  }

  // ---- product by id

  async getProductsByID(id) {
    // obtener el array
    let products = await this.getProducts();
    // buscar el prod con el id
    let product = products.find((p) => p.id == id);
    // si no existe devuelve no encontrado o null
    return product || null;
  }

  // --- actualizar un producto

  async updateProduct(id, update) {
    // obtener el arreglo de productos
    let products = await this.getProducts();
    // buscar el índice del producto con el id
    let index = products.findIndex((p) => p.id == id);
    // si el producto existe
    if (index != -1) {
      // obtener el producto original
      let product = products[index];
      // actualizar sus propiedades con el objeto update
      Object.assign(product, update);
      // reemplazar el producto en el arreglo
      products[index] = product;
      // convertir el arreglo a una cadena
      let data = products.map((p) => JSON.stringify(p) + "\n").join("");
      // reescribir el archivo de productos
      await fs.promises.writeFile(this.path, data, "utf-8");
      // devolver el producto actualizado
      return product;
    } else {
      // si el producto no existe, devolver null
      return null;
    }
  }

  //---- metodo eliminar un producto

  async deleteProduct(id) {
    // obtener el arreglo de productos
    let products = await this.getProducts();
    // filtrar el arreglo para eliminar el producto con el id especificado
    let filtered = products.filter((p) => p.id != id);
    // convertir el arreglo a una cadena
    let data = filtered.map((p) => JSON.stringify(p) + "\n").join("");
    // reescribir el archivo de productos
    await fs.promises.writeFile(this.path, data, "utf-8");
    // devolver true si se eliminó el producto o false si no se encontró
    return filtered.length < products.length;
  }
}

// instancia de la clase ProductManager
let pm = new ProductManager("products.txt");

// Crear un objeto con los datos del producto
let product = {
  title: "Laptop",
  description: "Una laptop de última generación",
  price: 1000,
  thumbnail: "laptop.jpg",
  code: "LAP-001",
  stock: 10,
};

// Agregar el producto al archivo
pm.addProduct(product)
  .then((result) => {
    // Mostrar el resultado
    console.log(result);
  })
  .catch((error) => {
    // Mostrar el error
    console.error(error);
  });
