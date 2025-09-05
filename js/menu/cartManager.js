// Gestión del carrito de compras
class CartManager {
    constructor(productManager) {
        this.productManager = productManager;
    }

    changeQuantity(productId, delta) {
        const input = document.getElementById(`cantidad${productId}`);
        let valor = parseInt(input.value);
        valor = isNaN(valor) ? 0 : valor + delta;

        if (valor < 0) valor = 0;
        input.value = valor;

        Utils.animateInput(input);

        if (delta > 0) {
            Utils.showToast("toastProductoAgregado");
        } else if (delta < 0 && valor >= 0) {
            Utils.showToast("toastProductoQuitado");
        }
    }

    getCartItems() {
        const productosEnPedido = [];
        let total = 0;

        this.productManager.products.forEach(prod => {
            const cantidad = parseInt(document.getElementById(`cantidad${prod.id}`)?.value);
            if (cantidad > 0) {
                productosEnPedido.push(`- ${cantidad} x ${prod.nombre}`);
                total += prod.precio * cantidad;
            }
        });

        return { productosEnPedido, total };
    }

    showOrderSummary() {
        const { productosEnPedido, total } = this.getCartItems();

        if (total === 0) {
            alert("Por favor, selecciona al menos un producto.");
            return;
        }

        const modalContenido = document.getElementById("modalContenido");
        const btnWhatsapp = document.getElementById("btnWhatsapp");

        modalContenido.innerHTML = `
            <p><strong>Productos en el pedido:</strong> ${productosEnPedido.map(x => "<br />" + x.toString()).join()}</p>
            <p><strong>Total:</strong> $ ${total.toLocaleString()}</p>
        `;

        btnWhatsapp.style.display = "inline-block";

        const modal = new bootstrap.Modal(document.getElementById('pedidoModal'));
        modal.show();
    }

    async sendOrderViaWhatsApp() {
        const formData = this.extractFormData();

        if (!this.validateFormData(formData)) {
            return;
        }

        const { productosEnPedido, total } = this.getCartItems();
        const orderData = this.buildOrderData(productosEnPedido, total, formData);
        const whatsappMessage = this.buildWhatsAppMessage(orderData);

        await ApiService.saveOrder(orderData);

        const url = `https://wa.me/${CONFIG.WHATSAPP.NUMBER}?text=${whatsappMessage}`;
        window.open(url, "_blank");
    }

    extractFormData() {
        const productosHtml = document.querySelector("#modalContenido p")?.innerText || "";
        const totalHtml = document.querySelector("#modalContenido p:nth-child(2)")?.innerText || "";

        return {
            productosHtml,
            totalHtml,
            metodoPago: document.querySelector('input[name="metodoPago"]:checked')?.value || "",
            metodoEnvio: document.querySelector('input[name="metodoEnvio"]:checked')?.value || "",
            direccion: document.getElementById("direccion")?.value.trim() || "",
            instrucciones: document.getElementById("instrucciones")?.value.trim() || "",
            comentarios: document.getElementById("comentarios")?.value.trim() || "",
            nroWhatsappCliente: document.getElementById("nroWhatsappCliente")?.value.trim() || ""
        };
    }

    validateFormData(formData) {
        if (formData.metodoEnvio === "Delivery" && !formData.direccion) {
            alert("Por favor, ingresá una dirección para el delivery.");
            return false;
        }

        if (!formData.nroWhatsappCliente) {
            alert("Por favor, ingresá tu número de Whatsapp.");
            return false;
        }

        return true;
    }

    buildOrderData(productosEnPedido, total, formData) {
        const descripcionPedido = this.extractProductDescription(formData.productosHtml);
        const totalLimpio = this.calculateTotal(formData.totalHtml, formData.metodoEnvio);

        return {
            descripcion: descripcionPedido.replaceAll('- ', '').replaceAll('%0A', ' '),
            total_a_pagar: totalLimpio,
            forma_de_pago: formData.metodoPago.toLowerCase(),
            tipo_envio: formData.metodoEnvio.toLowerCase(),
            direccion: formData.direccion || null,
            instrucciones_de_envio: formData.instrucciones || null,
            comentarios: formData.comentarios || null,
            cliente: formData.nroWhatsappCliente
        };
    }

    extractProductDescription(productosHtml) {
        if (!productosHtml) return "";
        return productosHtml
            .replace("Productos en el pedido:", "")
            .trim()
            .split("\n")
            .map(linea => linea.replace(/^[-•\s]*/, "").trim())
            .filter(Boolean)
            .map(item => `- ${item}`)
            .join("%0A");
    }

    calculateTotal(totalHtml, metodoEnvio) {
        if (!totalHtml) return 0;
        let total = parseFloat(
            totalHtml.replace("Total:", "").replace("$", "").replace(",", "").trim()
        );
        if (metodoEnvio === "Delivery") {
            total += CONFIG.DELIVERY.COST;
        }
        return total;
    }

    buildWhatsAppMessage(orderData) {
        let mensaje = `Hola! Quisiera hacer el siguiente pedido:%0A`;

        if (orderData.descripcion) {
            mensaje += `%0A${orderData.descripcion}`;
        }
        if (orderData.total_a_pagar) {
            mensaje += `%0A%0A*Total a pagar: ${orderData.total_a_pagar.toLocaleString()}*`;
        }

        mensaje += `%0A%0AForma de pago: ${orderData.forma_de_pago}`;
        mensaje += `%0ATipo de envío: ${orderData.tipo_envio}`;

        if (orderData.tipo_envio === "delivery") {
            mensaje += `%0ADirección: ${orderData.direccion}`;
            if (orderData.instrucciones_de_envio) {
                mensaje += `%0AInstrucciones: ${orderData.instrucciones_de_envio}`;
            }
        }

        if (orderData.comentarios) {
            mensaje += `%0AComentario: ${orderData.comentarios}`;
        }

        return mensaje;
    }
}
