class ProductManager {
  #lastId = 1;
  constructor() {
    this.products = [];
  }

  #getAndincreaseId() {
    const id = this.#lastId;
    this.#lastId += 1;
    return id;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      stock === undefined
    ) {
      console.error(" All fields must be mandatory, please complete");
      return;
    }

    // -------Validation code

    const existingProduct = this.products.find(
      (products) => products.code === code
    );
    if (existingProduct) {
      console.error("The code exist already");
      return;
    }
    // -------- Validation code

    const newProducts = {
      id: this.#getAndincreaseId(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProducts);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    //-------------- validation
    const product = this.products.find((pId) => pId.id === id);
    if (!product) {
      console.log(" No product with that ID has been found");
      return null;
    }
    return product;
  }
}

const manager = new ProductManager();
manager.addProduct(
  "Zapatillas",
  "Zapatillas deportivas",
  59.99,
  "https://example.com/zapatillas.jpg",
  "ABC123",
  10
);
manager.addProduct(
  "Camiseta",
  "Camiseta de algodón",
  19.99,
  "https://example.com/camiseta.jpg",
  "XYZ456",
  20
);

const allProducts = manager.getProducts();
console.log(allProducts);
