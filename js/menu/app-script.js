class App {
    constructor() {
        this.productManager = new ProductManager();
        this.cartManager = new CartManager(this.productManager);
        this.imageManager = new ImageManager();
        this.uiManager = new UIManager();

        this.init();
    }

    async init() {
        try {
            this.uiManager.showSpinner();

            const response = await ApiService.fetchRestaurantData();
            const restaurantData = response.data[0];
            this.productManager.setRestaurantData(restaurantData);
            this.productManager.renderProducts();
            this.productManager.renderChips();

        } catch (error) {
            this.uiManager.showError(`Error cargando productos: ${error.message}`);
        } finally {
            this.uiManager.hideSpinner();
        }
    }
}

// Funciones globales para compatibilidad con HTML
function mostrarSeleccion() {
    cartManager.showOrderSummary();
}

function enviarPedidoPorWhatsapp() {
    cartManager.sendOrderViaWhatsApp();
}

function ampliarImagen(src) {
    imageManager.expandImage(src);
}

function copiarAlias(input) {
    Utils.copyToClipboard(input);
}

// Inicialización de la aplicación
let productManager, cartManager, imageManager, uiManager;

window.onload = () => {
    const app = new App();

    // Exponer instancias globalmente para compatibilidad
    productManager = app.productManager;
    cartManager = app.cartManager;
    imageManager = app.imageManager;
    uiManager = app.uiManager;
};
