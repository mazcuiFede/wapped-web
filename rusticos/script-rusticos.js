
window.onload = async () => {
    const spinner = document.getElementById("spinner");

    try {

        spinner.style.display = "block";

        const response = await fetch("https://waped-app.onrender.com/items/menu_rusticos");

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        productos = (await response.json()).data;

        cargarProductos(productos)
        cargarChips(productos)

    } catch (error) {
        contenedor.innerHTML = `<div class="alert alert-danger">Error cargando productos: ${error}</div>`;
    } finally {
        // Ocultar spinner al terminar
        spinner.style.display = "none";
    }
};

// Hace el POST al backend
async function guardarPedidoEnBackend(pedidoData) {
    try {
        const resp = await fetch("https://waped-app.onrender.com/items/pedidos_rusticos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedidoData)
        });
        debugger
        if (!resp.ok) throw new Error(`Error HTTP ${resp.status}`);
        return resp.status;
    } catch (err) {
        console.error("❌ Error guardando pedido:", err);
        return null;
    }
}
