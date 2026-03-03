/* --- Variables Globales --- */
const container = document.querySelector(".containerCards");
const navSticky = document.querySelector("#navSticky");
const cartContainer = document.querySelector("#cartContainer");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");

let cData = [];
const lang = "fr";
let cart = [];

/* --- LocalStorage --- */
const saveCartStorage = () => {
  localStorage.setItem("cartTechStore", JSON.stringify(cart));
};

const readCartStorage = () => {
  const datosStorage = localStorage.getItem("cartTechStore");
  return datosStorage ? JSON.parse(datosStorage) : [];
};

// load LocalStorage
cart = readCartStorage();

// json
async function loadJson() {
  try {
    const reponse = await fetch("collection.json");
    const data = await reponse.json();

    cData = data.products || data;

    loadCards(cData);
    updateCartUI();
  } catch (error) {
    console.error("Erreur:", error);
    if (container) {
      container.innerHTML = `<p class="text-white">Erreur lors du chargement des produits</p>`;
    }
  }
}

/* --- Cards --- */
function loadCards(products) {
  if (!container) return;
  container.innerHTML = "";

  products.forEach((item) => {
    const cardCol = document.createElement("div");
    cardCol.className = "col-md-4 mb-4";

    cardCol.innerHTML = `
            <div class="card card-premium h-100 p-4"> 
                <div class="product-image-container mb-4">
                    <img class="img-fluid w-100 h-100 object-fit-cover" 
                         src="img/${item.id}.jpg" 
                         alt="${item.name[lang]}">
                </div>
                <div class="card-body-aethel d-flex flex-column flex-grow-1">
                    <p class="small text-warning ls-2 text-uppercase mb-2">${item.category}</p>
                    <h5 class="serif text-white display-6 mb-3">${item.name[lang]}</h5>
                    <h4 class="text-white fw-light mb-3">$ ${item.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })}</h4>
                    <p class="small opacity-50 mb-4 serif italic">
                        "${item.description[lang].substring(0, 80)}..."
                    </p>
                    <div class="mt-auto">
                        <button class="btn btn-aethel w-100" data-id="${item.id}">
                            ${lang === "fr" ? "DÉCOUVRIR" : "DISCOVER"}
                        </button>
                    </div>
                </div>
            </div> `;
    container.appendChild(cardCol);
  });
}

/* --- cart --- */
function addToCart(idProducto) {
  const existe = cart.find((item) => item.id === idProducto);

  if (existe) {
    existe.cantidad++;
  } else {
    const productoBase = cData.find((p) => p.id === idProducto);
    if (!productoBase) return;

    cart.push({
      id: idProducto,
      cantidad: 1,
    });
  }
  saveCartStorage();
  updateCartUI();
}

function updateCartUI() {
  if (!cartContainer) return;
  cartContainer.innerHTML = "";

  let totalPrecio = 0;
  let totalProductos = 0;

  cart.forEach((item) => {
    const producto = cData.find((p) => p.id === item.id);
    if (!producto) return;

    totalPrecio += producto.price * item.cantidad;
    totalProductos += item.cantidad;

    const div = document.createElement("div");
    div.className =
      "list-group-item py-3 border-0 border-bottom bg-transparent text-white";
    div.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <img src="img/${item.id}.jpg" style="width: 50px; height: 50px; object-fit: cover;" class="me-3 rounded">
                <div>
                    <h6 class="mb-0 small serif">${producto.name[lang]}</h6>
                    <p class="mb-0 small opacity-50">$${producto.price.toLocaleString("de-DE")}</p>
                </div>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-outline-warning btn-op" data-op="menos" data-id="${item.id}">-</button>
                <span class="small">${item.cantidad}</span>
                <button class="btn btn-sm btn-outline-warning btn-op" data-op="mas" data-id="${item.id}">+</button>
                <button class="btn btn-sm text-danger btn-op" data-op="todo" data-id="${item.id}">×</button>
            </div>
        </div>`;
    cartContainer.appendChild(div);
  });

  if (cartCount) cartCount.textContent = totalProductos;
  if (cartTotal)
    cartTotal.textContent = `$ ${totalPrecio.toLocaleString("de-DE", { minimumFractionDigits: 2 })}`;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="text-muted text-center py-4 small italic">Votre panier est vide</p>`;
  }
}

function operatorCart(id, operacion) {
  const item = cart.find((p) => p.id === id);
  if (!item) return;

  if (operacion === "mas") {
    item.cantidad++;
  } else if (operacion === "menos") {
    if (item.cantidad > 1) {
      item.cantidad--;
    } else {
      cart = cart.filter((p) => p.id !== id);
    }
  } else if (operacion === "todo") {
    cart = cart.filter((p) => p.id !== id);
  }

  saveCartStorage();
  updateCartUI();
}

/* --- cards Modal --- */
function showProductDetails(id) {
  const prod = cData.find((p) => p.id === id);
  if (!prod) return;

  const modalTitle = document.querySelector("#productosModal .modal-title");
  const modalBody = document.querySelector("#productosModal .modal-body");

  modalTitle.innerText = prod.name[lang];

  modalBody.innerHTML = `
    <div class="row align-items-center g-4 mt-1">
        <div class="col-md-6">
            <div class="border border-warning border-opacity-10 p-2">
                <img src="img/${prod.id}.jpg" class="img-fluid" alt="${prod.name[lang]}" />
            </div>
        </div>
        <div class="col-md-6 text-white">
            <span class="text-warning ls-3 small text-uppercase">${prod.category}</span>
            <h2 class="serif display-5 my-3">${prod.name[lang]}</h2>
            <h3 class="fw-light mb-4 text-white-50">$ ${prod.price.toLocaleString("de-DE")}</h3>
            <hr class="border-warning opacity-25" />
            <p class="serif opacity-75 my-4" style="font-size: 1.15rem; line-height: 1.8;">
                ${prod.description[lang]}
            </p>
            <div class="d-grid gap-3 mt-5">
                <button class="btn btn-aethel btn-add-cart" data-id="${prod.id}">AJOUTER AU PANIER</button>
                <button class="btn btn-link text-white-50 text-decoration-none small ls-2" data-bs-dismiss="modal">
                    RETOUR AU CATALOGUE
                </button>
            </div>
        </div>
    </div>`;

  const modalElement = document.getElementById("productosModal");
  const bsModal = bootstrap.Modal.getOrCreateInstance(modalElement);

  //
  const addBtn = modalBody.querySelector(".btn-add-cart");
  addBtn.onclick = () => {
    addToCart(prod.id);
    bsModal.hide();
  };

  bsModal.show();
}

/* --- Events --- */

// "Découvrir"
container.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-aethel");
  if (btn) {
    const id = btn.dataset.id;
    showProductDetails(id);
  }
});

// operations cart
if (cartContainer) {
  cartContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-op");
    if (!btn) return;
    const id = btn.dataset.id; // Sin parseInt para IDs alfanuméricos
    const operacion = btn.dataset.op;
    operatorCart(id, operacion);
  });
}

// btns Filters
const filterBtns = document.querySelectorAll("[data-filter]");
filterBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");
    filterBtns.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    if (filter === "all") {
      loadCards(cData);
    } else {
      const filtered = cData.filter((item) => item.category.includes(filter));
      loadCards(filtered);
    }
  });
});

// Btn Ascensión
const btnAscension = document.getElementById("backToTop");
if (btnAscension) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btnAscension.classList.add("show");
    } else {
      btnAscension.classList.remove("show");
    }
  });

  btnAscension.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Validation forms
const nom = document.querySelector("#nom");
if (nom) {
  nom.addEventListener("input", () => {
    if (nom.value.trim() !== "") {
      nom.classList.replace("is-invalid", "is-valid") ||
        nom.classList.add("is-valid");
    } else {
      nom.classList.replace("is-valid", "is-invalid") ||
        nom.classList.add("is-invalid");
    }
  });
}

// load initial
loadJson();
