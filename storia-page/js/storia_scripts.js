const API_BASE_URL = "http://localhost:8000";

// controllo login per gestione accedi o profilo
document.addEventListener("DOMContentLoaded", async () => {
    const accountArea = document.getElementById("account-area");

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    };

    const userEmail = getCookie("user_email");

    if (userEmail) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/utente?email=${userEmail}`);
            if (!res.ok) throw new Error("Utente non trovato");
            const data = await res.json();

            // Mostra icona con tooltip nome+cognome
            accountArea.innerHTML = `
                <a href="../profilo-page/profilo_index.html" title="${data.nome} ${data.cognome}">
                    <img src="../immagini_comuni/profilo.png" alt="Profilo" class="icona-profilo">
                </a>`;
        } catch (err) {
            console.error("Errore nel recupero utente:", err);
            accountArea.innerHTML = `<a href="../log-in-page/accesso_index.html">Accedi</a>`;
        }
    } else {
        accountArea.innerHTML = `<a href="../log-in-page/accesso_index.html">Accedi</a>`;
    }
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