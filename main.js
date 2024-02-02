// @ts-nocheck
const API_URL = "https://fakestoreapi.com/products";
const iconCart = document.querySelector(".cart-list");
const closeCart = document.querySelector(".close");
const body = document.querySelector("body");
const modal = document.getElementById("myModal");
const knowMoreButtons = document.querySelectorAll(".know-more-btn");
const listProductContainer = document.querySelector(
  ".listProductHTML .products"
);
const listCartContainer = document.querySelector(".listCart");
const iconCartCount = document.querySelector(".icon-cart span");

iconCart.addEventListener("click", () => toggleCartVisibility());

closeCart.addEventListener("click", () => hideCart());

let cartItemCount = 0;

fetchProducts();

function toggleCartVisibility() {
  body.classList.toggle("showCart");
}

function hideCart() {
  body.classList.remove("showCart");
}

function fetchProducts() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((products) => displayProducts(products));
}

function displayProducts(products) {
  let output = "";

  for (let item of products) {
    output += createProductHTML(item);
  }

  listProductContainer.innerHTML = output;
}

function createProductHTML(item) {
  return `
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

function addToCart(event) {
  const productArticle = event.target.closest(".product");
  const productName = productArticle.dataset.name;
  const productPrice = parseFloat(productArticle.dataset.price);

  const isItemInCart = checkIfItemInCart(productName);

  if (!isItemInCart) {
    cartItemCount++;
    iconCartCount.innerText = cartItemCount;

    const cartItem = createCartItem(productArticle, productName, productPrice);
    listCartContainer.appendChild(cartItem);
  }
}

function checkIfItemInCart(productName) {
  const cartItems = document.querySelectorAll(".listCart .name");
  return Array.from(cartItems).some((item) => item.innerText === productName);
}

function createCartItem(productArticle, productName, productPrice) {
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

  minusBtn.addEventListener("click", () =>
    updateQuantity(false, quantity, cartItem, productPrice)
  );
  plusBtn.addEventListener("click", () =>
    updateQuantity(true, quantity, cartItem, productPrice)
  );

  return cartItem;
}

function updateQuantity(isIncrement, quantityElement, cartItem, productPrice) {
  let quantityValue = parseInt(quantityElement.innerText);

  if (isIncrement) {
    quantityValue++;
  } else {
    if (quantityValue > 1) {
      quantityValue--;
    } else {
      cartItem.remove();
      cartItemCount--;
      iconCartCount.innerText = cartItemCount;
      return;
    }
  }

  quantityElement.innerText = quantityValue;
  cartItem.querySelector(".totalPrice").innerText = `$${(
    productPrice * quantityValue
  ).toFixed(2)}`;
}

function checkout() {
  const cartItems = document.querySelectorAll(".listCart .products");
  let totalPrice = calculateTotalPrice(cartItems);

  const totalPriceElement = document.querySelector(".totalPriceValue");
  totalPriceElement.innerText = `$${totalPrice.toFixed(2)}`;
}

function calculateTotalPrice(cartItems) {
  let totalPrice = 0;

  cartItems.forEach((cartItem) => {
    const priceElement = cartItem.querySelector(".totalPrice");
    const price = parseFloat(priceElement.innerText.replace("$", ""));
    totalPrice += price;
  });

  return totalPrice;
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
// Image Slider
document.addEventListener("DOMContentLoaded", function () {
  const sliderContainer = document.getElementById("slider");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");

  fetchProductsForSlider();

  function fetchProductsForSlider() {
    fetch(API_URL)
      .then((response) => response.json())
      .then((products) => displaySlider(products))
      .catch((error) => console.error("Error fetching products:", error));
  }

  function displaySlider(products) {
    products.forEach((product) => {
      const slide = createSlide(product);
      sliderContainer.appendChild(slide);
    });

    let currentIndex = 0;

    function showSlide(index) {
      const newTransformValue = -index * 100 + "%";
      sliderContainer.style.transform = `translateX(${newTransformValue})`;
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % products.length;
      showSlide(currentIndex);
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + products.length) % products.length;
      showSlide(currentIndex);
    }

    setInterval(nextSlide, 3000);
    prevButton.addEventListener("click", prevSlide);
    nextButton.addEventListener("click", nextSlide);
  }

  function createSlide(product) {
    const slide = document.createElement("div");
    slide.classList.add("slide");
    const image = document.createElement("img");
    image.src = product.image;
    slide.appendChild(image);
    return slide;
  }
});
