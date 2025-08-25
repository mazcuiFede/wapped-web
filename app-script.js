let productos = []
let lastScrollTop = 0;

function cargarProductos(productos) {

    const contenedor = document.getElementById("contenedorProductos");

    const categoriasConProductosArray = getCategorias(productos)

    for (let categoria of categoriasConProductosArray) {
        const categoriaDiv = document.createElement("div");
        categoriaDiv.className = "col-xs-12";

        const titulo = document.createElement("h1");
        titulo.className = "mb-2 fz-24 text-center mb-4";
        titulo.id = categoria.nombre.replace(/\s+/g, '-'); // ID sin espacios
        titulo.textContent = categoria.nombre;
        categoriaDiv.appendChild(titulo);

        // Contenedor para los productos de esta categoría
        const productosContainer = document.createElement("div");
        productosContainer.className = "row";

        categoria.productos.forEach((prod, index) => {
            const prodDiv = document.createElement("div");
            const precioFormateado = new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS"
            }).format(prod.precio);

            prodDiv.className = "col-xs-12 col-sm-6";

            prodDiv.innerHTML = `
                            <div class="h-100">
                            <div class="row g-0 waped-card">
                                <div class="col-7 pr-3">
                                <h4 class="fz-20">${prod.nombre}</h4>
                                <p class="fz-14">${prod.descripcion}</p>
                                <h4 class="fz-18"><b>${precioFormateado}</b></h4>
                                <div class="input-group mt-4 mb-2 selectorcantidad">
                                    <button class="btn btn-outline-secondary btn-sm" type="button" onclick="cambiarCantidad(${prod.id}, -1)">−</button>
                                    <input type="number" class="form-control text-center" id="cantidad${prod.id}" value="0" min="0" readonly>
                                    <button class="btn btn-outline-secondary btn-sm" type="button" onclick="cambiarCantidad(${prod.id}, 1)">+</button>
                                </div>
                                </div>
                                <div class="col-5">
                                <img 
                                    src="${prod.imagen_producto?.url || 'https://wapedapp.com/images/no-disponible.png'}"
                                    class="product-img img-fluid rounded" 
                                    alt="${prod.nombre}"
                                    style="cursor:pointer"
                                    onclick="ampliarImagen(this.src)"
                                >
                                </div>
                            </div>
                            </div>
                        `;


            productosContainer.appendChild(prodDiv);
        });

        // Agregar todos los productos debajo del título
        categoriaDiv.appendChild(productosContainer);

        // Agregar la categoría al contenedor principal
        contenedor.appendChild(categoriaDiv);
    }

}

function cargarChips(productos) {
    productos = productos.sort((a, b) => {
        if (a.orden == null && b.orden == null) return 0;
        if (a.orden == null) return 1;  // a va después
        if (b.orden == null) return -1; // b va después
        return a.orden - b.orden;
    });

    const chipsContainer = document.getElementById("chipsContainer");
    chipsContainer.innerHTML = "";
    // Obtener las categorias únicos del array
    const categorias = getCategorias(productos)

    categorias.forEach((categoria) => {
        const chip = document.createElement("button");
        chip.className = "btn btn-sm";
        debugger
        chip.innerText = categoria.nombre;

        chip.onclick = () => {
            const target = document.getElementById(categoria.nombre.replace(/\s+/g, '-')); // mismo id que en cargarProductos
            if (target) {
                const top = target.getBoundingClientRect().top + window.scrollY - 10;
                window.scrollTo({ top, behavior: "smooth" });
            }
        };

        chipsContainer.appendChild(chip);
    });
}



function cambiarCantidad(index, delta) {
    const input = document.getElementById(`cantidad${index}`);
    let valor = parseInt(input.value);
    valor = isNaN(valor) ? 0 : valor + delta;

    if (valor < 0) valor = 0;
    input.value = valor;

    // Animación fade
    input.classList.remove("fade-change");
    void input.offsetWidth;
    input.classList.add("fade-change");

    setTimeout(() => input.classList.remove("fade-change"), 300);

    if (delta > 0) {
        const toast = new bootstrap.Toast(document.getElementById("toastProductoAgregado"), { delay: 100 });
        toast.show();
    } else if (delta < 0 && valor >= 0) {
        const toast = new bootstrap.Toast(document.getElementById("toastProductoQuitado"), { delay: 100 });
        toast.show();
    }
}


function mostrarSeleccion() {
    let productosEnPedido = [];
    let total = 0;
    productos.forEach((prod, index) => {
        const cantidad = parseInt(document.getElementById(`cantidad${prod.id}`)?.value);
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

async function enviarPedidoPorWhatsapp(nroWhatsapp) {
    // === 1) Obtener datos del formulario ===
    const productosHtml = document.querySelector("#modalContenido p")?.innerText || "";
    const totalHtml = document.querySelector("#modalContenido p:nth-child(2)")?.innerText || "";

    const metodoPago = document.querySelector('input[name="metodoPago"]:checked')?.value || "";
    const metodoEnvio = document.querySelector('input[name="metodoEnvio"]:checked')?.value || "";
    const direccion = document.getElementById("direccion")?.value.trim() || "";
    const instrucciones = document.getElementById("instrucciones")?.value.trim() || "";
    const comentarios = document.getElementById("comentarios")?.value.trim() || "";
    const nroWhatsappCliente = document.getElementById("nroWhatsappCliente")?.value.trim() || "";

    // === 2) Validaciones ===
    if (metodoEnvio === "Delivery" && !direccion) {
        alert("Por favor, ingresá una dirección para el delivery.");
        return;
    }

    if (nroWhatsappCliente === "") {
        alert("Por favor, ingresá tu número de Whatsapp.");
        return;
    }

    // === 3) Procesar productos ===
    const descripcionPedido = extraerDescripcionProductos(productosHtml);
    const totalLimpio = calcularTotal(totalHtml, metodoEnvio);

    // === 4) Construir mensaje de WhatsApp ===
    const mensajeWhatsApp = construirMensajeWhatsApp({
        productos: descripcionPedido,
        total: totalLimpio,
        pago: metodoPago,
        envio: metodoEnvio,
        direccion,
        instrucciones,
        comentarios
    });

    // === 5) Construir JSON para backend ===
    const pedidoData = {
        descripcion: descripcionPedido.replaceAll('- ', '').replaceAll('%0A', ' '),
        total_a_pagar: totalLimpio,
        forma_de_pago: metodoPago.toLowerCase(),
        tipo_envio: metodoEnvio.toLowerCase(),
        direccion: direccion || null,
        instrucciones_de_envio: instrucciones || null,
        comentarios: comentarios || null,
        cliente: nroWhatsappCliente
    };

    // === 6) Guardar pedido en backend antes de abrir WhatsApp ===
    await guardarPedidoEnBackend(pedidoData);

    // === 7) Abrir WhatsApp si todo salió bien ===";
    const url = `https://wa.me/${nroWhatsapp}?text=${mensajeWhatsApp}`;
    window.open(url, "_blank");
}

// === FUNCIONES AUXILIARES ===

// Extrae los productos y devuelve el string para el mensaje
function extraerDescripcionProductos(productosHtml) {
    if (!productosHtml) return "";
    return productosHtml
        .replace("Productos en el pedido:", "")
        .trim()
        .split("\n")
        .map(linea => linea.replace(/^[-•\s]*/, "").trim())
        .filter(Boolean)
        .map(item => `- ${item}`)
        .join("%0A"); // para WhatsApp
}

// Calcula el total y agrega envío si corresponde
function calcularTotal(totalHtml, metodoEnvio) {
    if (!totalHtml) return 0;
    let total = parseFloat(
        totalHtml.replace("Total:", "").replace("$", "").replace(",", "").trim()
    );
    if (metodoEnvio === "Delivery") {
        total += 800; // costo extra de envío
    }
    return total;
}

// Construye el mensaje final de WhatsApp
function construirMensajeWhatsApp({ productos, total, pago, envio, direccion, instrucciones, comentarios }) {
    let mensaje = `Hola! Quisiera hacer el siguiente pedido:%0A`;

    if (productos) mensaje += `%0A${productos}`;
    if (total) mensaje += `%0A%0A*Total a pagar: ${total.toLocaleString()}*`;

    mensaje += `%0A%0AForma de pago: ${pago}`;
    mensaje += `%0ATipo de envío: ${envio}`;

    if (envio === "Delivery") {
        mensaje += `%0ADirección: ${direccion}`;
        if (instrucciones) mensaje += `%0AInstrucciones: ${instrucciones}`;
    }

    if (comentarios) {
        mensaje += `%0AComentario: ${comentarios}`;
    }

    return mensaje;
}



function ampliarImagen(src) {
    const imagenAmpliada = document.getElementById("imagenAmpliada");
    imagenAmpliada.src = src;

    const modal = new bootstrap.Modal(document.getElementById("imagenModal"));
    modal.show();
}



document.addEventListener("DOMContentLoaded", function () {
    const deliveryFields = document.getElementById("deliveryFields");
    const metodoEnvioRadios = document.querySelectorAll('input[name="metodoEnvio"]');

    function toggleDeliveryFields() {
        const selected = document.querySelector('input[name="metodoEnvio"]:checked').value;
        if (selected === "Delivery") {
            deliveryFields.classList.add("show"); // animación slide down
        } else {
            deliveryFields.classList.remove("show"); // animación slide up
        }
    }

    // Escuchar cambios
    metodoEnvioRadios.forEach(radio => {
        radio.addEventListener("change", toggleDeliveryFields);
    });

    // Inicializar
    toggleDeliveryFields();
});

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

function copiarAlias(input) {
    input.select();
    input.setSelectionRange(0, 99999); // Para móviles
    document.execCommand("copy");

    const msg = document.getElementById("mensajeCopiado");
    msg.style.display = "inline";
    setTimeout(() => (msg.style.display = "none"), 1500);
}


function getCategorias(productos) {
    productos = productos.sort((a, b) => {
        if (a.orden == null && b.orden == null) return 0;
        if (a.orden == null) return 1;  // a va después
        if (b.orden == null) return -1; // b va después
        return a.orden - b.orden;
    });

    const categoriasConProductos = productos.reduce((acc, producto) => {
        producto.categorias.forEach(cat => {
            // buscar si ya existe la categoría
            let categoria = acc.find(c => c.nombre === cat.Label);
            if (!categoria) {
                categoria = { nombre: cat.Label, productos: [] };
                acc.push(categoria); // 👈 se agrega en el orden de aparición
            }
            categoria.productos.push(producto);
        });
        return acc;
    }, []);


    return Object.values(categoriasConProductos);
}

let lastScrollY = window.scrollY;
const stickyHeader = document.getElementById("stickyHeader");

window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // 👉 Scrolling hacia abajo → ocultar header
        stickyHeader.classList.add("oculto");
    } else {
        // 👉 Scrolling hacia arriba → mostrar header
        stickyHeader.classList.remove("oculto");
    }

    lastScrollY = currentScrollY;
});
