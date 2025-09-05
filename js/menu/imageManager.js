// Gestión de imágenes
class ImageManager {
    expandImage(src) {
        const imagenAmpliada = document.getElementById("imagenAmpliada");
        imagenAmpliada.src = src;

        const modal = new bootstrap.Modal(document.getElementById("imagenModal"));
        modal.show();
    }
}
