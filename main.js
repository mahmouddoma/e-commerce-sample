// @ts-nocheck
let iconCart = document.querySelector(".cart-list");
let closeCart = document.querySelector(".close");
let body = document.querySelector("body");

iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

closeCart.addEventListener("click", () => {
  body.classList.remove("showCart");
});

let cartItemCount = 0;
let http = new XMLHttpRequest();
http.open("GET", "products.json", true);

http.send();

http.onload = function () {
  if (this.readyState == 4 && this.status == 200) {
    let products = JSON.parse(this.responseText);
    let output = "";

    for (let item of products) {
      output += `
            <article class="product" data-name="${item.name}" data-price="${item.price}">
                <img src="${item.image}" alt="Product 1">
                <h2>${item.name}</h2>
                <p>${item.description}</p>
                <p><span>&#36;</span>${item.price}</p>
                <button onclick="addToCart(event)" class="addCart">Add to Cart</button>
            </article>
            `;
    }
    document.querySelector(".listProductHTML .products").innerHTML = output;
  }
};

function addToCart(event) {
  const productArticle = event.target.closest(".product");
  const productName = productArticle.dataset.name;
  const productPrice = productArticle.dataset.price;

  cartItemCount++;
  document.querySelector(".icon-cart span").innerText = cartItemCount;

  const cartItem = document.createElement("div");
  cartItem.classList.add("products");
  cartItem.innerHTML = `
      <div class="image">
        <img src="${
          productArticle.querySelector("img").src
        }" alt="${productName}">
      </div>
      <div class="name">${productName}</div>
      <div class="totalPrice">$${productPrice}</div>
      <div class="quantity">
          <span class="minus">-</span>
          <span>1</span>
          <span class="plus">+</span>
      </div>
  `;

  const quantity = cartItem.querySelector(".quantity span:nth-child(2)");
  const minusBtn = cartItem.querySelector(".minus");
  const plusBtn = cartItem.querySelector(".plus");

  minusBtn.addEventListener("click", () => {
    let quantityValue = parseInt(quantity.innerText);
    if (quantityValue > 1) {
      quantityValue--;
      quantity.innerText = quantityValue;
      cartItem.querySelector(".totalPrice").innerText = `$${(
        productPrice * quantityValue
      ).toFixed(2)}`;
    } else {
      cartItem.remove();
      cartItemCount--;
      document.querySelector(".icon-cart span").innerText = cartItemCount;
    }
  });

  plusBtn.addEventListener("click", () => {
    let quantityValue = parseInt(quantity.innerText);
    quantityValue++;
    quantity.innerText = quantityValue;
    cartItem.querySelector(".totalPrice").innerText = `$${(
      productPrice * quantityValue
    ).toFixed(2)}`;
  });

  document.querySelector(".listCart").appendChild(cartItem);
}
function checkout() {
  const cartItems = document.querySelectorAll(".listCart .products");
  let totalPrice = 0;

  cartItems.forEach((cartItem) => {
    const priceElement = cartItem.querySelector(".totalPrice");
    const price = parseFloat(priceElement.innerText.replace("$", ""));
    totalPrice += price;
  });

  const totalPriceElement = document.querySelector(".totalPriceValue");
  totalPriceElement.innerText = `$${totalPrice.toFixed(2)}`;
}

