const container = document.querySelector(".containerCards");
const navSticky = document.querySelector("#navSticky");
let cData = [];
const lang = "fr";

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-aethel")) {
    const id = e.target.dataset.id;
    showProductDetails(id);
  }
});

async function loadJson() {
  try {
    const reponse = await fetch("collection.json");

    const data = await reponse.json();
    cData = data.products || data;
    loadCards(cData);
  } catch (error) {
    console.error("Erreur:", error);
    container.innerHTML = `<p class="text-white">Erreur lors du chargement des produits</p>`;
  }
}

function loadCards(products) {
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

function showProductDetails(id) {
  const prod = cData.find((p) => p.id === id);
  if (!prod) return;

  const modalTitle = document.querySelector("#productosModal .modal-title");
  const modalBody = document.querySelector("#productosModal .modal-body");

  modalTitle.classList.add("serif", "ls-2");
  modalTitle.innerText = prod.name[lang];

  modalBody.innerHTML = `
    <div class="row align-items-center g-5">
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
                <button class="btn btn-aethel">AJOUTER AU PANIER</button>
                <button class="btn btn-link text-white-50 text-decoration-none small ls-2" data-bs-dismiss="modal">
                    RETOUR AU CATALOGUE
                </button>
            </div>
        </div>
    </div>`;

  const modalElement = document.getElementById("productosModal");
  const bsModal = bootstrap.Modal.getOrCreateInstance(modalElement);
  bsModal.show();
}

const btns = document.querySelectorAll("[data-filter]");
btns.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");
    btns.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    if (filter === "all") {
      loadCards(cData);
    } else {
      const filtered = cData.filter((item) => item.category.includes(filter));
      loadCards(filtered);
    }
  });
});

loadJson();

const btnAscension = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  // Si el usuario baja más de 300px, añade la clase 'show'
  if (window.scrollY > 300) {
    btnAscension.classList.add("show");
  } else {
    btnAscension.classList.remove("show");
  }
});

// Al hacer clic, vuelve arriba suavemente
btnAscension.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

/* validation form */
const nom = document.querySelector("#nom");
const prenom = document.querySelector("#prenom");

nom.addEventListener("input", () => {
  if (nom.value !== "") {
    nom.classList.remove("is-invalide");
    nom.classList.add("is-valide");
  } else {
    nom.classList.add("is-invalide");
    nom.classList.remove("is-valide");
  }
});
