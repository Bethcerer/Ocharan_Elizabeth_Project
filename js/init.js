const container = document.querySelector(".containerCards");
const cartContainer = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");

const lang = "fr";

/* LocalStorage */

const saveCartStorage = () => {
    localStorage.setItem("cartTechStore", JSON.stringify(cart));
};

const readCartStorage = () => {
    const datosStorage = localStorage.getItem("cartTechStore");
    return datosStorage ? JSON.parse(datosStorage) : [];
};

/* cart data */

let cData = [];
let cart = readCartStorage();

/* JSON load */

async function loadJson() {

    try {

        const response = await fetch("collection.json");
        const data = await response.json();

        cData = data.products || data;

        loadCards(cData);
        updateCartUI();

    } catch (error) {

        console.error("Erreur:", error);

        if (container) {
            container.innerHTML =
                `<p class="text-white">Erreur lors du chargement des produits</p>`;
        }
    }
}

/* CARDS */

function loadCards(products) {

    if (!container) return;

    container.innerHTML = "";

    products.forEach((item) => {

        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";

        col.innerHTML = `
        <div class="card card-premium h-100 p-4"> 
            <div class="product-image-container mb-4">
                <img class="img-fluid w-100 h-100 object-fit-cover"
                     src="img/${item.id}.jpg"
                     alt="${item.name[lang]}">
            </div>

            <div class="card-body-aethel d-flex flex-column flex-grow-1">

                <h4 class="serif text-white mb-2">${item.name[lang]}</h4>

                <h5 class="text-info small opacity-50 mb-3">
                    ${item.category}
                </h5>

                <h4 class="text-white fw-light mb-4">
                    $ ${item.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                </h4>

                <p class="text-secondary small opacity-70 mb-4 flex-grow-1 italic">
                    "${item.phrase}"
                </p>
                
                <div class="d-grid gap-3 mt-5">
                    <button class="btn btn-aethel w-100" data-id="${item.id}">
                        DÉCOUVRIR
                    </button>
                    <button class="btn btn-link text-white-50 text-decoration-none small btn-direct-add ls-2 data-id="${item.id}">
                    AJOUTER À LA SÉLECTION
                    </button>
                </div>

            </div>
        </div>`;

        col.querySelector(".btn-direct-add").onclick = (e) => {
            addToCart(item.id);
        }

        /* efecto luz */

        const card = col.querySelector(".card-premium");

        card.addEventListener("mousemove", e => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });

        container.appendChild(col);
    });
}

/* ADD CART */

function addToCart(idProducto) {

    const existe = cart.find(item => item.id === idProducto);

    if (existe) {

        existe.cantidad++;

    } else {

        cart.push({
            id: idProducto,
            cantidad: 1
        });
    }

    saveCartStorage();
    updateCartUI();
}

/* CART UI */

function updateCartUI() {

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    let totalPrecio = 0;
    let totalProductos = 0;

    cart.forEach(item => {

        const producto = cData.find(p => p.id === item.id);

        if (!producto) return;

        totalPrecio += producto.price * item.cantidad;
        totalProductos += item.cantidad;

        const div = document.createElement("div");

        div.className =
            "list-group-item py-3 border-0 bg-transparent text-white";

        div.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">

            <div class="d-flex align-items-center">

                <img src="img/${item.id}.jpg"
                     style="width:50px;height:50px;object-fit:cover;"
                     class="me-3 border border-secondary border-opacity-25">

                <div>
                    <h6 class="mb-0 small serif">${producto.name[lang]}</h6>
                    <p class="mb-0 small opacity-50">
                        $${producto.price.toLocaleString("de-DE")}
                    </p>
                </div>

            </div>

            <div class="d-flex align-items-center gap-2">

                <button class="btn btn-sm btn-outline-warning btn-op"
                        data-op="menos" data-id="${item.id}">-</button>

                <span class="small">${item.cantidad}</span>

                <button class="btn btn-sm btn-outline-warning btn-op"
                        data-op="mas" data-id="${item.id}">+</button>

                <button class="btn btn-sm btn-close-aethel btn-op"
                        data-op="todo" data-id="${item.id}">
                        <i class="fa-solid fa-trash-can"></i>
                </button>

            </div>

        </div>`;

        cartContainer.appendChild(div);
    });

    if (cartCount) cartCount.textContent = totalProductos;

    if (cartTotal)
        cartTotal.textContent =
            `$ ${totalPrecio.toLocaleString("de-DE", { minimumFractionDigits: 2 })}`;

    if (cart.length === 0) {

        cartContainer.innerHTML =
            `<p class="text-muted text-center py-4 small italic">
            Votre sélection est vide.
            </p>`;
    }
}

/* CART OPERATIONS */

function operatorCart(id, operacion) {

    const item = cart.find(p => p.id === id);

    if (!item) return;

    switch (operacion) {

        case "mas":
            item.cantidad++;
            break;

        case "menos":

            if (item.cantidad > 1) {
                item.cantidad--;
            } else {
                cart = cart.filter(p => p.id !== id);
            }

            break;

        case "todo":
            cart = cart.filter(p => p.id !== id);
            break;
    }

    saveCartStorage();
    updateCartUI();
}

/* MODAL DETAILS */

function showProductDetails(id) {

    const prod = cData.find(p => p.id === id);

    if (!prod) return;

    const modalTitle =
        document.querySelector("#productosModal .modal-title");

    const modalBody =
        document.querySelector("#productosModal .modal-body");

    modalTitle.innerText = prod.id;

    modalBody.innerHTML = `
    <div class="row align-items-center g-4 mt-1">

        <div class="col-md-6">
            <div class="modal-product-image-container">
                <img id="modalProductImage" src="img/${prod.id}.jpg" alt="${prod.name[lang]}">
            </div>
        </div>

        <div class="col-md-6 text-white">

            <span class="text-info small text-uppercase">
                ${prod.category}
            </span>

            <h2 class="serif display-5 my-3">
                ${prod.name[lang]}
            </h2>

            <h4 class="fw-light mb-4">
                $ ${prod.price.toLocaleString("de-DE")}
            </h4>

            <p class="serif opacity-75 my-4">
                ${prod.description[lang]}
            </p>
            <div class="d-grid gap-3 mt-5">

            <button class="btn btn-aethel btn-add-cart" data-id="${prod.id}"> AJOUTER À LA SÉLECTION
            </button>
            <button class="btn btn-link text-white-50 text-decoration-none small ls-2" data-bs-dismiss="modal">
                    RETOUR
                </button>
            </div>
        </div>

    </div>`;

    const modalElement = document.getElementById("productosModal");
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalElement);

    modalBody
        .querySelector(".btn-add-cart")
        .onclick = () => {

            addToCart(prod.id);
            bsModal.hide();
        };

    bsModal.show();
}

/* EVENTS */

if (container) {
    container.addEventListener("click", (e) => {

        const btn = e.target.closest(".btn-aethel");

        if (btn) {
            const id = btn.dataset.id;
            showProductDetails(id);
        }

    });
}

/* CART BUTTONS */

if (cartContainer) {
    cartContainer.addEventListener("click", (e) => {

        const btn = e.target.closest(".btn-op");

        if (!btn) return;

        operatorCart(btn.dataset.id, btn.dataset.op);
    });
}

/* CONTACT DRAWER */

const contactDrawer = document.getElementById("contactDrawer");
const triggerContact = document.getElementById("triggerContact");
const closeContact = document.getElementById("closeContact");
const overlay = document.getElementById("drawerOverlay");

if (triggerContact) {
    triggerContact.addEventListener("click", () => {
        contactDrawer.classList.add("open");
        if (overlay) overlay.classList.add("open");
    });
}

if (closeContact) {
    closeContact.addEventListener("click", () => {
        contactDrawer.classList.remove("open");
        if (overlay) overlay.classList.remove("open");
    });
}

if (overlay) {
    overlay.addEventListener("click", () => {
        contactDrawer.classList.remove("open");
        overlay.classList.remove("open");
    });
}


/* btns Filters */
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

/* INIT */

loadJson();

/* Btn  asencion*/
const btn = document.getElementById("btnUp");

window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 400);
});


btn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

btn.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        btn.click();
    }
});