const API_BASE_URL = "http://localhost:8000";
let emailUtente;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profilo-form");

    // Cookie per inserimento dati dell'utente
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    };

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    async function resolveAccess() {
        emailUtente = getCookie("user_email");

        if (!emailUtente && token) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/token-login?token=${token}`);
                const data = await res.json();

                if (res.ok && data.email) {
                    emailUtente = data.email;
                    document.cookie = `user_email=${emailUtente}; path=/`;
                    window.history.replaceState(null, "", "profilo_index.html");
                } else {
                    showToast("Token non valido o scaduto");
                    setTimeout(() => {
                        window.location.href = "../log-in-page/accesso_index.html";
                    }, 2000);
                    return;
                }
            } catch (err) {
                console.error("Errore token login:", err);
                showToast("Errore di accesso");
                return;
            }
        }

        if (!emailUtente) {
            showToast("Non sei loggato.");
            setTimeout(() => {
                window.location.href = "../log-in-page/accesso_index.html";
            }, 1500);
            return;
        }

        document.getElementById("email-utente").textContent = emailUtente;

        // Caricamento dati utente
        fetch(`${API_BASE_URL}/api/utente?email=${emailUtente}`)
            .then(res => res.json())
            .then(data => {
                document.getElementById("email-utente").textContent = data.email;
                const inputs = form.querySelectorAll("input");
                const valori = [data.nome, data.cognome, data.telefono, data.citta, data.indirizzo, ""];
                inputs.forEach((input, i) => input.value = valori[i]);
            });
    }

    resolveAccess();

    // Abilita modifica
    document.querySelectorAll(".modifica-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const input = btn.previousElementSibling;
            input.disabled = false;
            input.focus();
        });
    });

    // Logout
    document.querySelector(".logout").addEventListener("click", () => {
        document.cookie = "user_email=; path=/; max-age=0";
        window.location.href = "../home-page/hp_index.html";
    });

    // Validazioni live per telefono e password
    const telefonoInput = form.elements["telefono"];
    const passwordInput = form.elements["password"];

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
        const phoneNumber = input.value.replace(/\D/g, '');
        if (input.value.trim() === "") {
            removeError(input);
            return true;
        }
        if (/^\d+$/.test(input.value)) {
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

    // Controllo formato numero di telefono e password
    telefonoInput.addEventListener("input", () => validatePhoneNumber(telefonoInput));

    passwordInput.addEventListener("input", () => {
        if (!passwordPattern.test(passwordInput.value)) {
            showError(passwordInput, "Password debole: usa maiuscole, numeri e !@#?");
        } else {
            removeError(passwordInput);
        }
    });

    // Salvataggio
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = form.elements["nome"].value;
        const cognome = form.elements["cognome"].value;
        const telefono = form.elements["telefono"].value;
        const citta = form.elements["citta"].value;
        const indirizzo = form.elements["indirizzo"].value;
        const password = form.elements["password"].value;

        const body = {
            email: emailUtente,
            nome,
            cognome,
            telefono,
            citta,
            indirizzo
        };
        if (password) {
            body.password = password;
        }

        //Cambio dati se modificati
        fetch(`${API_BASE_URL}/api/utente/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(data => {
                showToast(data.message || "Salvato!");
                form.querySelectorAll("input").forEach(input => input.disabled = true);
            })
            .catch(() => {
                showToast("Errore nel salvataggio");
            });
    });
});

// Disattiva il trascinamento su un elemento specifico
function disableDragging(el) {
    if (el.nodeType === 1) {
        el.setAttribute('draggable', 'false');
        el.querySelectorAll('*').forEach(child => {
            child.setAttribute('draggable', 'false');
        });
    }
}

// Applica agli elementi già presenti
document.querySelectorAll('*').forEach(el => disableDragging(el));

// Osserva il DOM per nuovi elementi aggiunti
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            disableDragging(node);
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });

function showToast(messaggio, durata = 3000) {
    const toast = document.getElementById("toast-popup");
    if (!toast) return;

    toast.textContent = messaggio;
    toast.classList.remove("hidden");
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.classList.add("hidden");
        }, 500);
    }, durata);
}