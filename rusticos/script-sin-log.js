let productos = []
let lastScrollTop = 0;


function cargarProductos(productos) {
    const contenedor = document.getElementById("contenedorProductos");

    productos.forEach((prod, index) => {
        const card = document.createElement("div");


        if (prod.tipo === "titulo") {
            card.className = "col-xs-12";
            card.innerHTML = `
                <div class="col">
                    <h1 class="mb-2 fz-20 mt-4" id="${prod.nombre}">${prod.nombre}</h1>
                </div>
            `;
        }
        else {
            card.className = "col-xs-12 col-sm-6";
            card.innerHTML = `
              <div class="h-100">
                <div class="row g-0 pb-4">
                  <div class="col-7 pr-3">
                        <h4 class="fz-16">${prod.nombre}</b></h4>
                        <p class="fz-14">${prod.descripcion}</p>
                        <h4 class="fz-16"><b>$ ${prod.precio.toLocaleString()}</b></h4>
                        <div class="input-group mt-4 mb-2 selectorcantidad">
                            <button class="btn btn-outline-secondary btn-sm" type="button" onclick="cambiarCantidad(${index}, -1)">−</button>
                            <input type="number" class="form-control text-center" id="cantidad${index}" value="0" min="0" readonly>
                            <button class="btn btn-outline-secondary btn-sm" type="button" onclick="cambiarCantidad(${index}, 1)">+</button>
                        </div>
                  </div>
                  <div class="col-5">
                    <img src="${prod.imagen}" class="product-img" alt="${prod.nombre}" onerror="this.onerror=null; this.src='./imagenes/no-disponible.png';">
                  </div>
                </div>
              </div>
            `;
        }
        contenedor.appendChild(card);
    });
}

function cargarChips(productos) {
    const chipsContainer = document.getElementById("chipsContainer");
    const stickyHeader = document.getElementById("stickyHeader");
    chipsContainer.innerHTML = "";

    productos.forEach((prod) => {
        if (prod.tipo === "titulo") {
            const chip = document.createElement("button");
            chip.className = "btn btn-outline-primary btn-sm rounded-pill";
            chip.innerText = prod.nombre;

            chip.onclick = () => {
                const target = document.getElementById(prod.nombre);
                if (target) {
                    const offset = stickyHeader.offsetHeight || 0;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset - 10;
                    window.scrollTo({ top, behavior: "smooth" });
                }
            };

            chipsContainer.appendChild(chip);
        }
    });
}




function cambiarCantidad(index, delta) {
    const input = document.getElementById(`cantidad${index}`);
    let valor = parseInt(input.value);
    valor = isNaN(valor) ? 0 : valor + delta;
    if (valor < 0) valor = 0;
    input.value = valor;

    // Animación fade
    input.classList.remove("fade-change"); // reiniciamos si ya estaba
    void input.offsetWidth; // forzamos reflow para que vuelva a aplicarse
    input.classList.add("fade-change");

    // Limpieza opcional por si querés quitar la clase luego
    setTimeout(() => {
        input.classList.remove("fade-change");
    }, 300);
}

function mostrarSeleccion() {
    let productosEnPedido = [];
    let total = 0;

    productos.forEach((prod, index) => {
        const cantidad = parseInt(document.getElementById(`cantidad${index}`)?.value);
        if (cantidad > 0) {
            productosEnPedido.push(`- ${cantidad} x ${prod.nombre}`);
            total += prod.precio * cantidad;
        }
    });


    if (total === 0) {
        alert("Por favor, selecciona al menos un producto.");
        return;
    }

    const modalContenido = document.getElementById("modalContenido");
    const btnWhatsapp = document.getElementById("btnWhatsapp");

    let resumenHTML = `<ul>`;

    resumenHTML += `</ul><p><strong>Total: $${total.toLocaleString()}</strong></p>`;



    modalContenido.innerHTML = `
                    <p>
                    <strong>Productos en el pedido:</strong> ${productosEnPedido.map(x => "<br />" + x.toString()).join()}
                    </p>
                    <p>
                    <strong>Total:</strong> $ ${total.toLocaleString()}
                    </p>
                `;

    btnWhatsapp.style.display = "inline-block";


    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('pedidoModal'));
    modal.show();
}

function enviarPedidoPorWhatsapp() {
    const modalContenido = document.getElementById("modalContenido");
    const productosHtml = modalContenido.querySelector("p")?.innerText || "";
    const totalHtml = modalContenido.querySelectorAll("p")[1]?.innerText || "";

    const metodoPago = document.querySelector('input[name="metodoPago"]:checked')?.value || '';
    const metodoEnvio = document.querySelector('input[name="metodoEnvio"]:checked')?.value || '';
    const direccion = document.getElementById("direccion")?.value.trim() || '';
    const instrucciones = document.getElementById("instrucciones")?.value.trim() || '';
    const comentarios = document.getElementById("comentarios")?.value.trim() || '';

    if (metodoEnvio === "Delivery" && direccion === "") {
        alert("Por favor, ingresá una dirección para el delivery.");
        return;
    }

    let mensaje = `Hola! Quisiera hacer el siguiente pedido:%0A`;

    // Productos
    if (productosHtml) {
        const productosSolo = productosHtml
            .replace("Productos en el pedido:", "")
            .trim()
            .split('\n')
            .map(linea => linea.replace(/^[-•\s]*/, "").trim())
            .filter(Boolean)
            .map(item => `- ${item}`)
            .join("%0A");

        mensaje += `%0A${productosSolo}`;
    }

    // Total
    if (totalHtml) {
        let totalLimpio = +totalHtml.replace("Total:", "").replace("$", "").replace(",", "").trim();
        if (metodoEnvio === "Delivery") {
            totalLimpio += 800; // Costo de envío
        }
        mensaje += `%0A%0A*Total a pagar: $${totalLimpio.toLocaleString()}*`;
    }

    // Métodos
    mensaje += `%0A%0A*Forma de pago: ${metodoPago}*`;
    mensaje += `%0ATipo de envío: ${metodoEnvio}`;

    // Delivery info
    if (metodoEnvio === "Delivery") {
        mensaje += `%0A*Dirección: ${direccion}*`;
        if (instrucciones) mensaje += `%0AInstrucciones: ${instrucciones}`;
    }

    // Comentario
    if (comentarios) {
        mensaje += `%0AComentario: ${comentarios}`;
    }

    const numero = "5491122544073";
    //const numero = "5491131286452";
    const url = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(url, "_blank");

}



window.onload = async () => {
    const spinner = document.getElementById("spinner");

    try {

        spinner.style.display = "block";
        const response = await fetch("./datos-menu.json");

        productos = await response.json();

        cargarProductos(productos)
        cargarChips(productos)

    } catch (error) {
        contenedor.innerHTML = `<div class="alert alert-danger">Error cargando productos: ${error}</div>`;
    } finally {
        // Ocultar spinner al terminar
        spinner.style.display = "none";
    }
};

