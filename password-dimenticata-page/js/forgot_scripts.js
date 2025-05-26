document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("forgot-password-form");

    //inserimento email
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[name="email"]').value;

        try {
            const res = await fetch("http://localhost:8000/api/password-dimenticata", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            if (!res.ok) {
                const text = await res.text(); // legge l'errore anche se non è JSON
                console.error("Errore:", text);
                showToast("Errore dal server");
                return;
            }

            const data = await res.json();
            showToast(data.message || "Controlla la tua email, anche la spam!");
            setTimeout(() => {
                window.location.href = "../log-in-page/accesso_index.html";
            }, 3000);
        } catch (err) {
            console.error(err);
            showToast("Errore durante l'invio dell'email");
        }
    });
});

//notifiche popup
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
