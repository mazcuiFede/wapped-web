// Configuración centralizada
const CONFIG = {
    API: {
        BASE_URL: "https://waped-strapi-cloudinary-app.onrender.com/api",
        TOKEN: "33fac42f93a470cb835607df23f272a04ace72d6b150147acb077c39ecd7c941e0eb944ecad810e41c1c35af0e7d27dcc91bda8ea26a41cd3a03841e0b4ede3907940440ac0e8f8670e523c77477c514fd7b22a79447c1f732510f9da4ff3023bed4c5be3a1a445ba34e837861af8079e514b15cbffaca874c7299dae4fe6bcb"
    },
    WHATSAPP: {
        NUMBER: "5491122544073",
        ALIAS_BANCARIO: "rusticoslanus"
    },
    DELIVERY: {
        COST: 800
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
    "Authorization": `Bearer ${CONFIG.API.TOKEN}`,
    "Content-Type": "application/json"
};
