// Gestión de la interfaz de usuario
class UIManager {
    constructor() {
        this.initEventListeners();
        this.initScrollHandler();
    }

    initEventListeners() {
        // Manejo de campos de delivery
        this.initDeliveryFields();

        // Manejo de método de pago
        this.initPaymentMethodHandler();

        // Copiar alias bancario
        this.initAliasCopyHandler();
    }

    initDeliveryFields() {
        const deliveryFields = document.getElementById("deliveryFields");
        const metodoEnvioRadios = document.querySelectorAll('input[name="metodoEnvio"]');

        const toggleDeliveryFields = () => {
            const selected = document.querySelector('input[name="metodoEnvio"]:checked').value;
            if (selected === "Delivery") {
                deliveryFields.classList.add("show");
            } else {
                deliveryFields.classList.remove("show");
            }
        };

        metodoEnvioRadios.forEach(radio => {
            radio.addEventListener("change", toggleDeliveryFields);
        });

        toggleDeliveryFields();
    }

    initPaymentMethodHandler() {
        document.querySelectorAll('input[name="metodoPago"]').forEach(radio => {
            radio.addEventListener("change", () => {
                const campoAlias = document.getElementById("campoAliasBancario");
                const transferenciaSeleccionada = document.getElementById("transferencia").checked;

                if (transferenciaSeleccionada) {
                    campoAlias.classList.add("mostrar");
                } else {
                    campoAlias.classList.remove("mostrar");
                }
            });
        });
    }

    initAliasCopyHandler() {
        const aliasInput = document.getElementById("aliasBancario");
        if (aliasInput) {
            aliasInput.onclick = () => Utils.copyToClipboard(aliasInput);
        }
    }

    initScrollHandler() {
        let lastScrollY = window.scrollY;
        const stickyHeader = document.getElementById("stickyHeader");

        window.addEventListener("scroll", () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > CONFIG.UI.SCROLL_THRESHOLD) {
                stickyHeader.classList.add("oculto");
            } else {
                stickyHeader.classList.remove("oculto");
            }

            lastScrollY = currentScrollY;
        });
    }

    showSpinner() {
        const spinner = document.getElementById("spinner");
        spinner.style.display = "block";
    }

    hideSpinner() {
        const spinner = document.getElementById("spinner");
        spinner.style.display = "none";
    }

    showError(message) {
        const contenedor = document.getElementById("contenedorProductos");
        contenedor.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }
}
