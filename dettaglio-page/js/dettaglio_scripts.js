const API_BASE_URL = "http://localhost:8000";

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

let isFavorite = false;

document.addEventListener("DOMContentLoaded", async () => {
    const accountArea = document.getElementById("account-area");
    const userEmail = getCookie("user_email");

    // Imposta accesso / profilo
    if (userEmail) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/utente?email=${userEmail}`);
            if (!res.ok) throw new Error("Utente non trovato");
            const data = await res.json();

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

    // Carica pianta
    await loadPlant();

    // Gestione click sul cuore preferiti
    const addFavoriteBtn = document.getElementById("add-favorite-btn");
    const cuoreIcon = addFavoriteBtn.querySelector(".icona-pref");

    addFavoriteBtn.addEventListener("click", async () => {
        const userEmail = getCookie("user_email");
        if (!userEmail) {
            showToastNearElement(cuoreIcon, "Devi effettuare il login per aggiungere ai preferiti.");
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (!id) return;

        try {
            const endpoint = isFavorite ? "delete" : "add";
            const res = await fetch(`${API_BASE_URL}/api/preferiti/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, id_pianta: id })
            });

            if (res.ok) {
                isFavorite = !isFavorite;
                cuoreIcon.src = isFavorite
                    ? "../immagini_comuni/piantaselezione.png"
                    : "../immagini_comuni/pianta.png";
            } else {
                const err = await res.json();
                showToastNearElement(cuoreIcon, "Errore: " + err.error);
            }
        } catch (err) {
            console.error("Errore nell'aggiunta/rimozione ai preferiti", err);
        }
    });
});

async function loadPlant() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
        document.getElementById("titolo-pianta").textContent = "ID non fornito";
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/piante/${id}`);
        if (!res.ok) throw new Error("Errore caricamento");

        const pianta = await res.json();

        const nomePianta = pianta.nome;
        document.title = nomePianta;
        document.getElementById("titolo-pagina").textContent = "fladale | " + nomePianta;
        document.getElementById("titolo-pianta").textContent = nomePianta;
        document.getElementById("sottotitolo-pianta").textContent = pianta.descrizione;
        document.getElementById("immagine-pianta").src = "../immagini_comuni/piante/" + pianta.immagine_url;
        document.getElementById("immagine-pianta").alt = nomePianta;
        document.getElementById("hover-pianta").src = "../immagini_comuni/piante_hover/" + pianta.hover_url;
        document.getElementById("hover-pianta").alt = nomePianta;

        if (descrizioniPiante[nomePianta]) {
            document.getElementById("descrizione-pianta").textContent =
                descrizioniPiante[nomePianta].descrizione;
            document.getElementById("map-origine").src =
                "img/" + descrizioniPiante[nomePianta].mapOrigine + ".png";
            document.getElementById("map-origine").alt =
                "Mappa Origine" + nomePianta;
            document.getElementById("map-nome").textContent =
                descrizioniPiante[nomePianta].mapOrigine;
        } else {
            document.getElementById("descrizione-pianta").textContent = "Descrizione non disponibile.";
        }

        const lista = document.getElementById("lista-dettagli");
        lista.innerHTML = "";

        const dettagli = [
            {
                icona: "img/icona-acqua.png",
                titolo: "Bisogno d'acqua",
                testo: `Annaffiare ogni ${pianta.richiesta_acqua_giorni} giorni.`
            },
            {
                icona: "img/icona-sole.png",
                titolo: "Esigenze di luce",
                testo: pianta.luce ? `Predilige ambienti con ${pianta.luce.toLowerCase()}.` : null
            },
            {
                icona: "img/icona-termometro.png",
                titolo: "Tipo di ambiente",
                testo: pianta.ambiente ? `Ama ambienti ${pianta.ambiente.toLowerCase()}.` : null
            },
            {
                icona: "img/icona-spazio.png",
                titolo: "Grandezza tipica",
                testo: pianta.grandezza ? `Pianta di dimensioni ${pianta.grandezza.toLowerCase()}.` : null
            },
            {
                icona: "img/icona-cura.png",
                titolo: "Livello di manutenzione",
                testo: pianta.cura ? `Livello di cura: ${pianta.cura.toLowerCase()}.` : null
            }
        ];

        dettagli.forEach(d => {
            if (d.testo) {
                const li = document.createElement("li");
                li.innerHTML = `
                    <img src="${d.icona}" alt="${d.titolo}" class="icon-img">
                    <div>
                        <strong>${d.titolo}</strong>
                        ${d.testo}
                    </div>`;
                lista.appendChild(li);
            }
        });

        // Verifica se è già preferita
        const userEmail = getCookie("user_email");
        if (userEmail) {
            try {
                const prefRes = await fetch(`${API_BASE_URL}/api/preferiti?email=${userEmail}`);
                const preferite = await prefRes.json();
                const currentId = parseInt(id);

                if (Array.isArray(preferite)) {
                    const trovata = preferite.find(p => p.id === currentId);
                    if (trovata) {
                        isFavorite = true;
                        document.querySelector(".icona-pref").src = "../immagini_comuni/piantaselezione.png";
                    }
                }
            } catch (err) {
                console.error("Errore nel recupero preferiti:", err);
            }
        }

    } catch (err) {
        document.getElementById("titolo-pianta").textContent = "Errore caricamento pianta";
    }
}

// Disattiva il trascinamento su un elemento specifico
function disableDragging(el) {
    if (el.nodeType === 1) {
        el.setAttribute('draggable', 'false');
        el.querySelectorAll('*').forEach(child => {
            child.setAttribute('draggable', 'false');
        });
    }
}

// Gestione pop-up accanto all'elemento
let toastTimeout;

function showToastNearElement(targetElement, messaggio, durata = 3000) {
    const toast = document.getElementById("toast-popup");
    if (!toast || !targetElement) return;

    if (toastTimeout) clearTimeout(toastTimeout);

    // Inserisci messaggio
    toast.textContent = messaggio;

    // Calcola posizione dell’elemento target
    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    // Dimensione del toast e della viewport
    const toastWidth = toast.offsetWidth || 250; // fallback
    const viewportWidth = window.innerWidth;

    // Posizione desiderata (accanto al target)
    let left = rect.left + scrollLeft - 50;
    let top = rect.bottom + scrollTop - 100;

    // Assicura che non sfori a destra
    if (left + toastWidth > scrollLeft + viewportWidth - 10) {
        left = scrollLeft + viewportWidth - toastWidth - 10;
    }

    // Assicura che non sfori a sinistra
    left = Math.max(left, 10);

    // Applica posizione
    toast.style.top = `${top}px`;
    toast.style.left = `${left}px`;
    // Mostra il toast
    toast.classList.remove("hidden");
    requestAnimationFrame(() => toast.classList.add("show"));

    // Nascondi dopo durata
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
        toastTimeout = setTimeout(() => {
            toast.classList.add("hidden");
        }, 500);
    }, durata);
}

//Controllo cambiamenti
document.querySelectorAll('*').forEach(el => disableDragging(el));

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            disableDragging(node);
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });
