// Configuración centralizada
const CONFIG = {
    API: {
        BASE_URL: "https://waped-strapi-cloudinary-app.onrender.com/api",
    },
    UI: {
        TOAST_DELAY: 100,
        FADE_DURATION: 300,
        SCROLL_THRESHOLD: 50
    }
};

// URLs de endpoints
const ENDPOINTS = {
    RESTAURANT: `${CONFIG.API.BASE_URL}/restaurants?filters[documentId][%24eq]=${RESTAURANT_ID}&populate[logo][fields]=url&populate[banner][fields]=url&populate[menus][fields]=nombre%2Cprecio%2Corden%2Cdescripcion&populate[menus][populate][categorias][fields]=Label&populate[menus][populate][imagen_producto][fields]=url`,
    PEDIDOS: `${CONFIG.API.BASE_URL}/pedidos-rusticos`
};

// Headers comunes
const HEADERS = {
    "Content-Type": "application/json"
};
