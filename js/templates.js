// Templates HTML reutilizables
const TEMPLATES = {
    productCard: (prod) => `
        <div class="h-100">
            <div class="row g-0 waped-card">
                <div class="col-7 pr-3">
                    <h4 class="fz-20">${prod.nombre}</h4>
                    <p class="fz-14">${prod.descripcion}</p>
                    <h4 class="fz-18"><b>${Utils.formatPrice(prod.precio)}</b></h4>
                    <div class="input-group mt-4 mb-2 selectorcantidad">
                        <button class="btn btn-outline-secondary btn-sm" type="button" onclick="cartManager.changeQuantity(${prod.id}, -1)">−</button>
                        <input type="number" class="form-control text-center" id="cantidad${prod.id}" value="0" min="0" readonly>
                        <button class="btn btn-outline-secondary btn-sm" type="button" onclick="cartManager.changeQuantity(${prod.id}, 1)">+</button>
                    </div>
                </div>
                <div class="col-5">
                    <img 
                        src="${prod.imagen_producto?.url || 'https://wapedapp.com/images/no-disponible.png'}"
                        class="product-img img-fluid rounded" 
                        alt="${prod.nombre}"
                        style="cursor:pointer"
                        onclick="imageManager.expandImage(this.src)"
                    >
                </div>
            </div>
        </div>
    `,

    orderSummary: (productosEnPedido, total) => `
        <p><strong>Productos en el pedido:</strong> ${productosEnPedido.map(x => "<br />" + x.toString()).join()}</p>
        <p><strong>Total:</strong> $ ${total.toLocaleString()}</p>
    `,

    errorMessage: (message) => `
        <div class="alert alert-danger">${message}</div>
    `,

    loadingSpinner: () => `
        <div class="text-center my-5">
            <div class="spinner-border spinner" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `
};

// Mensajes de la aplicación
const MESSAGES = {
    errors: {
        loadingProducts: "Error cargando productos",
        noProductsSelected: "Por favor, selecciona al menos un producto.",
        noAddress: "Por favor, ingresá una dirección para el delivery.",
        noWhatsApp: "Por favor, ingresá tu número de Whatsapp."
    },
    success: {
        productAdded: "Producto agregado al carrito 🛒",
        productRemoved: "Producto quitado del carrito 🧺",
        aliasCopied: "✅ Alias copiado!"
    },
    whatsapp: {
        greeting: "Hola! Quisiera hacer el siguiente pedido:",
        totalLabel: "Total a pagar:",
        paymentMethod: "Forma de pago:",
        deliveryType: "Tipo de envío:",
        address: "Dirección:",
        instructions: "Instrucciones:",
        comment: "Comentario:"
    }
};
