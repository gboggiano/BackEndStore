const socket = io();

socket.on("newProduct", (product) => {
  //add new product to HTML
  const container = document.getElementById("productsTemplate");
  container.innerHTML += `
    <div class="container" id="productsTemplate">
    <h3>${product.ttle}</h3>
    <p> ${product.price}</p>
    <p>${product.description}</p>
    <img src=${product.thumbnail}} alt="img" />
  </div>
    `;
});
