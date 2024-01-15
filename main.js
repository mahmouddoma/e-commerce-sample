// @ts-nocheck
let iconCart = document.querySelector(".cart-list");
let closeCart = document.querySelector(".close");
let body = document.querySelector("body");
const modal = document.getElementById("myModal");
const knowMoreButtons = document.querySelectorAll(".know-more-btn");
const closeBtn = document.querySelector(".close");

iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

closeCart.addEventListener("click", () => {
  body.classList.remove("showCart");
});

let cartItemCount = 0;

fetch("https://fakestoreapi.com/products")
  .then((res) => res.json())
  .then((products) => {
    let output = "";

    for (let item of products) {
      output += `
          <article class="product" data-name="${item.title}" data-price="${item.price}">
            <img class="card-img-top rounded-3 w-50" loading="lazy" src="${item.image}" alt="${item.title}">
            <div class="card-body">
                <h2 class="card-title mt-4">${item.title}</h2>
                <p class="card-text text-center">${item.description}</p>
                <h2 class="card-text"><span>&#36;</span>${item.price}</h2>
               <div class="btn">
                  <button onclick="showPopup('${item.image}', '${item.description}', '${item.price}')" class="btn btn-primary addCart">Know More</button>
                  <button onclick="addToCart(event)" class="btn btn-primary addCart">Add to Cart</button>
               </div>
            </div>
          </article>
          <div class="popup" id="popup">
            <div class="popup-content ">
              <span class="close bg-light rounded-1 mb-2 text-center" onclick="closePopup()">&times;</span>
              <img id="popupImg" class="card-img-top text-light rounded-4" loading="lazy" src="" alt="">
              <h2 id="popupTitle" class="card-title mt-4 text-light"></h2>
              <p id="popupDesc" class="card-text text-center text-light"></p>
              <h2 id="popupPrice" class="card-text text-light"></h2>
            </div>
          </div>
      `;
    }
    document.querySelector(".listProductHTML .products").innerHTML = output;
  });

function addToCart(event) {
  const productArticle = event.target.closest(".product");
  const productName = productArticle.dataset.name;
  const productPrice = parseFloat(productArticle.dataset.price);

  const cartItems = document.querySelectorAll(".listCart .name");
  let isItemInCart = false;

  cartItems.forEach((item) => {
    if (item.innerText === productName) {
      isItemInCart = true;
    }
  });

  if (!isItemInCart) {
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
      <div class="totalPrice">$${productPrice.toFixed(2)}</div>
      <div class="quantity">
          <span class="minus">-</span>
          <span>0</span>
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

function showPopup(imageSrc, description, price, title) {
  var modal = document.querySelector(".popup");
  var popupImg = document.getElementById("popupImg");
  var popupTitle = document.getElementById("popupTitle");
  var popupDesc = document.getElementById("popupDesc");
  var popupPrice = document.getElementById("popupPrice");

  popupImg.src = imageSrc;
  popupDesc.textContent = description;
  popupTitle.textContent = title;
  popupPrice.innerHTML = "<span>&#36;</span>" + price;

  modal.style.display = "block";

  var closeButton = document.querySelector(".close");
  closeButton.onclick = function () {
    modal.style.display = "none";
  };
}

function filterProducts() {
  var filter = document.getElementById("filterInput").value.toUpperCase();
  var minPrice = parseFloat(document.getElementById("minPrice").value);
  var maxPrice = parseFloat(document.getElementById("maxPrice").value);

  var products = document.getElementsByClassName("product");

  for (var i = 0; i < products.length; i++) {
    var productName = products[i].getAttribute("data-name").toUpperCase();
    var productPrice = parseFloat(products[i].getAttribute("data-price"));

    var nameMatch = productName.indexOf(filter) > -1;
    var priceMatch = productPrice >= minPrice && productPrice <= maxPrice;

    if (nameMatch && priceMatch) {
      products[i].style.display = "";
    } else {
      products[i].style.display = "none";
    }
  }
}

function clearFilter() {
  document.getElementById("filterInput").value = "";
  document.getElementById("minPrice").value = "0";
  document.getElementById("maxPrice").value = "1000";

  var products = document.getElementsByClassName("product");
  for (var i = 0; i < products.length; i++) {
    products[i].style.display = "";
  }

  var slideshowContainer = document.querySelector(".slideshow-container");
  slideshowContainer.style.display = "block";
}

// wraper
var hamb = document.getElementById("hamb");
var left = document.getElementById("left-side");
hamb.addEventListener("click", function () {
  this.classList.toggle("active");
  left.classList.toggle("active");
});
