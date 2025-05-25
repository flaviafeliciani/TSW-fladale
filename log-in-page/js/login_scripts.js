document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");

    //controllo input
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // blocca invio classico

        // Controllo per accesso
        const email = form.querySelector('input[name="email"]').value;
        const password = form.querySelector('input[name="password"]').value;

        try {
            const response = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                // Accesso, cookie e redirect
                document.cookie = `user_email=${email}; path=/`;
                showToast("Accesso riuscito!");
                setTimeout(() => {
                    window.location.href = "../home-page/hp_index.html";
                }, 1500);
            } else {
                const data = await response.json();
                showToast(data.error || "Credenziali non valide");
            }
        } catch (err) {
            console.error(err);
            showToast("Errore di connessione");
        }
    });

    // Disabilita trascinamento elementi
    document.querySelectorAll('*').forEach(el => el.setAttribute('draggable', 'false'));
});

// Toast per notifiche
let toastTimeout;

function showToast(messaggio, durata = 3000) {
    const toast = document.getElementById("toast-popup");
    if (!toast) return;

    if (toastTimeout) clearTimeout(toastTimeout);

    toast.textContent = messaggio;
    toast.classList.remove("hidden");
    toast.classList.add("show");

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
        toastTimeout = setTimeout(() => {
            toast.classList.add("hidden");
        }, 500);
    }, durata);
}
