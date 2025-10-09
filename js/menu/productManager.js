// Gestión de productos y categorías
class ProductManager {
    constructor() {
        this.products = [];
        this.restaurantData = null;
    }

    setRestaurantData(restaurantData) {
        this.restaurantData = restaurantData;
        this.products = Utils.sortByOrder(restaurantData.menus);
        this.updateLogo();
        this.updateBanner();
        this.updateAlias();
        this.updateDeliveryCost();
        this.updateNroWhatsappRestaurant();

        document.getElementById("stickyHeader").classList.remove("hidden"); // mostrar
    }

    updateAlias() {
        const aliasInput = document.getElementById("aliasBancario");
        if (aliasInput && this.restaurantData?.alias) {
            aliasInput.value = this.restaurantData.alias;
        }
    }

    updateDeliveryCost() {
        const costoEnvio = document.getElementById("costoEnvio");
        if (costoEnvio) {
            costoEnvio.value = this.restaurantData.costoEnvio ?? 0
        }
    }

    updateNroWhatsappRestaurant() {
        const nroWhatsappRestaurant = document.getElementById("nroWhatsappRestaurant");
        if (nroWhatsappRestaurant) {
            nroWhatsappRestaurant.value = this.restaurantData.numeroWhatsapp ?? 0
        }
    }

    updateLogo() {
        const logoElement = document.getElementById("restaurantLogo");

        if (logoElement && this.restaurantData?.logo?.url) {
            logoElement.src = this.restaurantData.logo.url;
            logoElement.alt = this.restaurantData.nombre || "Logo del Restaurante";
        }
    }

    updateBanner() {
        const banner = document.querySelector(".title-bg");
        if (banner && this.restaurantData?.banner?.url) {
            banner.style.backgroundImage = `url('${this.restaurantData?.banner?.url}')`;
        }
    }

    getCategories() {
        const categoriesWithProducts = this.products.reduce((acc, producto) => {
            producto.categorias.forEach(cat => {
                let categoria = acc.find(c => c.nombre === cat.Label);
                if (!categoria) {
                    categoria = { nombre: cat.Label, productos: [] };
                    acc.push(categoria);
                }
                categoria.productos.push(producto);
            });
            return acc;
        }, []);

        return Object.values(categoriesWithProducts);
    }

    renderProducts() {
        const contenedor = document.getElementById("contenedorProductos");
        const categorias = this.getCategories();

        categorias.forEach(categoria => {
            const categoriaDiv = this.createCategoryElement(categoria);
            contenedor.appendChild(categoriaDiv);
        });
    }

    createCategoryElement(categoria) {
        const categoriaDiv = document.createElement("div");
        categoriaDiv.className = "col-xs-12";

        const titulo = document.createElement("h1");
        titulo.className = "mb-2 fz-24 text-center mb-4";
        titulo.id = Utils.generateId(categoria.nombre);
        titulo.textContent = categoria.nombre;
        categoriaDiv.appendChild(titulo);

        const productosContainer = document.createElement("div");
        productosContainer.className = "row";

        categoria.productos.forEach(prod => {
            const prodDiv = this.createProductElement(prod);
            productosContainer.appendChild(prodDiv);
        });

        categoriaDiv.appendChild(productosContainer);
        return categoriaDiv;
    }

    createProductElement(prod) {
        const prodDiv = document.createElement("div");
        prodDiv.className = "col-xs-12 col-sm-6";

        const precioFormateado = Utils.formatPrice(prod.precio);
        const imagenUrl = prod.imagen_producto?.url || 'https://wapedapp.com/images/no-disponible.png';

        prodDiv.innerHTML = `
            <div class="h-100">
                <div class="row g-0 waped-card">
                    <div class="col-7 pr-3">
                        <h4 class="fz-20">${prod.nombre}</h4>
                        <p class="fz-14">${prod.descripcion}</p>
                        <h4 class="fz-18"><b>${precioFormateado}</b></h4>
                        <div class="input-group mt-4 mb-2 selectorcantidad">
                            <button class="btn btn-outline-secondary btn-sm" type="button" onclick="cartManager.changeQuantity(${prod.id}, -1)">−</button>
                            <input type="number" class="form-control text-center" id="cantidad${prod.id}" value="0" min="0" readonly>
                            <button class="btn btn-outline-secondary btn-sm" type="button" onclick="cartManager.changeQuantity(${prod.id}, 1)">+</button>
                        </div>
                    </div>
                    <div class="col-5">
                        <img 
                            src="${imagenUrl}"
                            class="product-img img-fluid rounded" 
                            alt="${prod.nombre}"
                            style="cursor:pointer"
                            onclick="imageManager.expandImage(this.src)"
                        >
                    </div>
                </div>
            </div>
        `;

        return prodDiv;
    }

    renderChips() {
        const chipsContainer = document.getElementById("chipsContainer");
        chipsContainer.innerHTML = "";

        const categorias = this.getCategories();

        categorias.forEach(categoria => {
            const chip = document.createElement("button");
            chip.className = "btn btn-sm";
            chip.innerText = categoria.nombre;
            chip.onclick = () => Utils.scrollToElement(Utils.generateId(categoria.nombre));
            chipsContainer.appendChild(chip);
        });
    }
}
