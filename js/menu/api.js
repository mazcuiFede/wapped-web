// Módulo para manejo de API
class ApiService {
    static async fetchRestaurantData() {
        try {
            const response = await fetch(ENDPOINTS.RESTAURANT, {
                method: "GET",
                headers: HEADERS
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching restaurant data:", error);
            throw error;
        }
    }

    static async saveOrder(orderData) {
        try {
            const response = await fetch(ENDPOINTS.PEDIDOS, {
                method: "POST",
                headers: HEADERS,
                body: JSON.stringify({
                    data: {
                        ...orderData,
                        restaurant: RESTAURANT_ID
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }

            return response.status;
        } catch (error) {
            console.error("❌ Error guardando pedido:", error);
            return null;
        }
    }
}
