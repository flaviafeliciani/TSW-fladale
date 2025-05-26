const plantContainer = document.getElementById('plantContainer');
const noResults = document.getElementById('noResults');
const toggleViewBtn = document.getElementById('toggleViewBtn');
const filterBtn = document.getElementById('filterBtn');
const filterPopup = document.getElementById('filterPopup');
const filterForm = document.getElementById('filterForm');
const applyFiltersBtn = document.getElementById('applyFilters');
const clearFiltersBtn = document.getElementById('clearFilters');

let currentView = 3;
let currentFilters = [];
const urlParams = new URLSearchParams(window.location.search);
const tagsFromURL = urlParams.get("tags");
if (tagsFromURL) {
    currentFilters = tagsFromURL.split(",");
}
const API_BASE_URL = "http://localhost:8000";

// Funzione globale per leggere i cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

// Carica i tag nel popup come checkbox
async function fetchTags() {
    const res = await fetch(`${API_BASE_URL}/api/tags`);
    const tags = await res.json();
    filterForm.innerHTML = '';

    // Raggruppa tag per categoria
    const grouped = {};
    tags.forEach(tag => {
        if (!grouped[tag.categoria]) grouped[tag.categoria] = [];
        grouped[tag.categoria].push(tag);
    });

    // Crea le sezioni per ogni categoria
    for (const categoria in grouped) {
        if (categoria != "Hidden"){
            const groupContainer = document.createElement('div');
            groupContainer.classList.add('tag-group');

            const title = document.createElement('h4');
            title.textContent = categoria + ':';
            groupContainer.appendChild(title);

            grouped[categoria].forEach(tag => {
                const label = document.createElement('label');
                label.innerHTML = `<input type="checkbox" value="${tag.id}"> ${tag.nome}`;
                groupContainer.appendChild(label);
            });

            filterForm.appendChild(groupContainer);
        }
    }
}


// Carica le piante dal backend (con eventuali filtri)
async function fetchPlants() {
    const url = currentFilters.length > 0
    ? `${API_BASE_URL}/api/piante?tags=${currentFilters.join(',')}`
    : `${API_BASE_URL}/api/piante`;

    try {
        const email = getCookie("user_email");
        let preferitiIds = [];

        // Se loggato, ottiene gli ID delle piante nei preferiti
        if (email) {
            const resPreferiti = await fetch(`${API_BASE_URL}/api/preferiti?email=${email}`, { cache: "no-store" });
            const preferiti = await resPreferiti.json();
            preferitiIds = preferiti.map(p => p.id);
        }

        const res = await fetch(url);
        const piante = await res.json();

        plantContainer.innerHTML = '';

        // Controllo no results
        if (!piante || piante.length === 0) {
            noResults.classList.remove('hidden');
            return;
        }

        noResults.classList.add('hidden');

        // Carica le piante
        piante.forEach(p => {
            const link = document.createElement('a');
            link.href = `../dettaglio-page/dettaglio_index.html?id=${p.id}`;
            link.className = 'card-link card';

            const isPreferita = preferitiIds.includes(p.id);
            const iconaSrc = isPreferita
                ? "../immagini_comuni/piantaselezione.png"
                : "../immagini_comuni/pianta.png";

            link.innerHTML = `
                <div class="image-wrapper">
                    <img src="../immagini_comuni/piante/${p.immagine_url}" alt="${p.nome}" class="plant-image main-img">
                    <img src="../immagini_comuni/piante_hover/${p.hover_url}" alt="${p.nome}" class="plant-image hover-img">
                    <div class="favorite-icon-wrapper">
                        <img src="${iconaSrc}" alt="Preferiti" class="favorite-icon" data-id="${p.id}">
                    </div>
                </div><br>
                <h3>${p.nome}</h3>
            `;

            plantContainer.appendChild(link);

            // Gestione icona
            const icon = link.querySelector(".favorite-icon");
            icon.addEventListener("click", async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const id_pianta = icon.getAttribute("data-id");

                if (!email) {
                    showToastNearElement(icon, "Devi accedere per gestire i preferiti.");
                    return;
                }

                const isPreferita = icon.src.includes("piantaselezione");

                try {
                    if (isPreferita) {
                        // RIMOZIONE
                        const res = await fetch(`${API_BASE_URL}/api/preferiti/delete`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: email, id_pianta: id_pianta })
                        });

                        if (res.ok) {
                            showToastNearElement(icon, "Pianta rimossa dal tuo giardino");
                            icon.src = "../immagini_comuni/pianta.png";
                            icon.title = "Rimossa dai preferiti";
                        } else {
                            showToast("Errore durante la rimozione dai preferiti");
                        }
                    } else {
                        // AGGIUNTA
                        const res = await fetch(`${API_BASE_URL}/api/preferiti/add`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: email, id_pianta: id_pianta })
                        });

                        if (res.ok) {
                            showToastNearElement(icon, "Pianta aggiunta al tuo giardino");
                            icon.src = "../immagini_comuni/piantaselezione.png";
                            icon.title = "Aggiunta ai preferiti!";
                        } else {
                            showToast("Errore durante l'aggiunta ai preferiti");
                        }
                    }
                } catch (err) {
                    console.error("Errore nella richiesta:", err);
                    showToast("Errore di rete");
                }
            });

        });
        const ancora = document.querySelector(".favorite-icon");
        if (ancora) {
            showToastNearElement(ancora, "Aggiungi una pianta al tuo giardino per vederne lo stato!");
        }

    } catch (error) {
        console.error('Errore nel caricamento delle piante:', error);
    }
}

// Gestione pop-up
let toastTimeout;

function showToast(messaggio, durata = 3000) {
    const toast = document.getElementById("toast-popup");
    if (!toast) return;

    if (toastTimeout) clearTimeout(toastTimeout);

    toast.textContent = messaggio;
    toast.style.bottom = "10%";
    toast.style.alignSelf = "center";
    toast.classList.remove("hidden");
    toast.classList.add("show");

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
        toastTimeout = setTimeout(() => {
            toast.classList.add("hidden");
        }, 500);
    }, durata);
}
// Pop-up accanto all'elemento
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

// Vista: alterna 3/6 elementi
toggleViewBtn.addEventListener('click', () => {
    currentView = currentView === 3 ? 6 : 3;
    document.body.classList.remove('view-3', 'view-6');
    document.body.classList.add(`view-${currentView}`);
    toggleViewBtn.textContent = `Vista ${currentView}`;
    fetchPlants();
});

// Mostra/nasconde popup filtri
filterBtn.addEventListener('click', () => {
    filterPopup.classList.toggle('hidden');
});

// Applica filtri selezionati
applyFiltersBtn.addEventListener('click', () => {
    const selected = [...document.querySelectorAll('#filterForm input:checked')].map(el => el.value);
    currentFilters = selected;
    filterPopup.classList.add('hidden');
    fetchPlants();
});

// Rimuove tutti i filtri
clearFiltersBtn.addEventListener('click', () => {
    document.querySelectorAll('#filterForm input:checked').forEach(el => el.checked = false);
    currentFilters = [];
    filterPopup.classList.add('hidden');
    fetchPlants();
});

// Aggiorna la page quando sotto un certo limite
function aggiornaVistaResponsiva() {
    const larghezza = window.innerWidth;

    if (larghezza <= 1000) {
        currentView = 3;
        document.body.classList.remove('view-3', 'view-6');
        document.body.classList.add('view-3');
        toggleViewBtn.style.display = "none";
    } else {
        currentView = 6;
        document.body.classList.remove('view-3', 'view-6');
        document.body.classList.add('view-6');
        toggleViewBtn.style.display = "inline-block";
    }

    toggleViewBtn.textContent = `Vista ${currentView}`;
    fetchPlants();
}

// Iniziale
aggiornaVistaResponsiva();

// Anche su resize
window.addEventListener("resize", aggiornaVistaResponsiva);

// Inizializzazione
document.addEventListener('DOMContentLoaded', async () => {
    fetchTags();
    fetchPlants();
    document.body.classList.add('view-6');
    toggleViewBtn.textContent = `Vista 6`;

    //controllo log-in o profilo
    const accountArea = document.getElementById("account-area");
    const userEmail = getCookie("user_email");

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
});

// Disattiva il trascinamento su un elemento specifico
function disableDragging(el) {
    if (el.nodeType === 1) { // solo nodi di tipo ELEMENT
        el.setAttribute('draggable', 'false');
        el.querySelectorAll('*').forEach(child => {
            child.setAttribute('draggable', 'false');
        });
    }
}

// Applica la regola agli elementi già presenti
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
