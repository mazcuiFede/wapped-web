// Utilidades comunes
class Utils {
    static formatPrice(price) {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS"
        }).format(price);
    }

    static sortByOrder(items) {
        if (!items) return [];

        return items.sort((a, b) => {
            if (a.orden == null && b.orden == null) return 0;
            if (a.orden == null) return 1;
            if (b.orden == null) return -1;
            return a.orden - b.orden;
        });
    }

    static generateId(text) {
        return text.replace(/\s+/g, '-');
    }

    static showToast(toastId, delay = CONFIG.UI.TOAST_DELAY) {
        const toast = new bootstrap.Toast(document.getElementById(toastId), { delay });
        toast.show();
    }

    static animateInput(input) {
        input.classList.remove("fade-change");
        void input.offsetWidth;
        input.classList.add("fade-change");
        setTimeout(() => input.classList.remove("fade-change"), CONFIG.UI.FADE_DURATION);
    }

    static copyToClipboard(input) {
        input.select();
        input.setSelectionRange(0, 99999);
        document.execCommand("copy");

        const msg = document.getElementById("mensajeCopiado");
        msg.style.display = "inline";
        setTimeout(() => (msg.style.display = "none"), 1500);
    }

    static scrollToElement(elementId) {
        const target = document.getElementById(elementId);
        if (target) {
            const top = target.getBoundingClientRect().top + window.scrollY - 10;
            window.scrollTo({ top, behavior: "smooth" });
        }
    }
}
