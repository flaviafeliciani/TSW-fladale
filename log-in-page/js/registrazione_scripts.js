document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const email = document.querySelector('input[placeholder="E-mail"]');
  const password = document.querySelector('input[placeholder="Password"]');
  const confirmPassword = document.querySelector('input[placeholder="Conferma password"]');
  const phoneInput = document.querySelector('input[placeholder="Numero di telefono"]');

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#?])[A-Za-z\d!@#?]{8,}$/;

    function showError(input, message) {
        removeError(input);
        const error = document.createElement("div");
        error.className = "input-error";
        error.innerText = message;
        input.parentElement.appendChild(error);
        input.classList.add("error-border");
    }

    function removeError(input) {
        const error = input.parentElement.querySelector(".input-error");
        if (error) error.remove();
        input.classList.remove("error-border");
    }

    function validatePhoneNumber(input) {
        // Rimuove eventuali spazi o caratteri non numerici
        const phoneNumber = input.value.replace(/\D/g, '');

        // Se l'input è vuoto, rimuovi eventuali errori e ritorna true
        if (input.value.trim() === "") {
            removeError(input);
            return true;
        }

        // Controlla se l'input contiene solo numeri
        if (/^\d+$/.test(input.value)) {
            // Controlla se il numero di telefono ha una lunghezza ragionevole (ad esempio, tra 7 e 15 cifre)
            if (phoneNumber.length >= 7 && phoneNumber.length <= 15) {
                removeError(input);
                return true;
            } else {
                showError(input, "Numero di telefono non valido");
                return false;
            }
        } else {
            showError(input, "Inserisci solo numeri");
            return false;
        }
    }

    //controllo input password
    password.addEventListener("input", () => {
        if (!passwordPattern.test(password.value)) {
            showError(password, "Password non corretta");
        } else {
            removeError(password);
        }

        // Controlla subito se anche conferma è ok
        if (confirmPassword.value && password.value !== confirmPassword.value) {
            showError(confirmPassword, "Le password non coincidono");
        } else {
            removeError(confirmPassword);
        }
    });

    confirmPassword.addEventListener("input", () => {
        if (confirmPassword.value !== password.value) {
            showError(confirmPassword, "Le password non coincidono");
        } else {
            removeError(confirmPassword);
        }
    });

     phoneInput.addEventListener("input", () => {
        validatePhoneNumber(phoneInput);
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // blocca il submit normale

        let valid = true;

        if (!emailPattern.test(email.value)) {
            showError(email, "Email non valida (es. nome@dominio.com)");
            valid = false;
        }

        if (!passwordPattern.test(password.value)) {
            showError(password, "La password non rispetta i requisiti.");
            valid = false;
        }

        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, "Le password non coincidono");
            valid = false;
        }

        if (!validatePhoneNumber(phoneInput)) {
            valid = false;
        }

        if (!valid) return;

        // Prepara i dati da inviare
        const formData = new FormData(form);
        const dati = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("http://localhost:8000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dati)
            });

            if (res.ok) {
                // Mostra messaggio e reindirizza
                showToast("Registrazione riuscita! Controlla l'email per attivare l'account.");
                setTimeout(() => {
                    window.location.href = "../log-in-page/accesso_index.html";
                }, 1500);
            } else {
                const err = await res.json();
                showToast("Errore nella registrazione: " + (err.message || "Riprova."));
            }
        } catch (error) {
            showToast("Errore di rete durante la registrazione");
        }
    });
});

// Disabilita drag per tutti gli elementi della pagina
document.querySelectorAll('*').forEach(element => {
  element.setAttribute('draggable', 'false');
});

// Gestione pop-up
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