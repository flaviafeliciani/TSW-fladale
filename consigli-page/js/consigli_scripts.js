const API_BASE_URL = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", async () => {
    // Mappa ogni ambiente a un tag ID e alla rispettiva galleria (in ordine)
    const sezioni = [
        { tagId: '23', containerIndex: 0 }, // salotto
        { tagId: '26', containerIndex: 1 }, // bagno
        { tagId: '25', containerIndex: 2 }, // camera
        { tagId: '24', containerIndex: 3 }, // cucina
        { tagId: '22', containerIndex: 4 }, // ufficio
    ];

    // Per ogni ambiente carica la galleria corrispondente
    for (const { tagId, containerIndex } of sezioni) {
        await caricaGalleriaPerTagId(tagId, containerIndex);
    }

    gestisciHoverImmagini(); // Attiva effetti hover sulle immagini
    gestisciScrollGallerie();  // Attiva lo scroll tramite frecce
    aggiornaAccountArea(); // Gestisce l’area account utente
});

// Carica le piante usando direttamente l'ID del tag + tag 22
async function caricaGalleriaPerTagId(tagId, containerIndex) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/piante?tags=${tagId}`);
        const piante = await res.json();
        const container = document.querySelectorAll('.galleria-piante')[containerIndex];

        container.innerHTML = ''; // pulizia contenuto statico

        // Per ogni pianta, crea la card visuale
        piante.forEach(p => {
            const link = document.createElement('a');
            link.href = `../dettaglio-page/dettaglio_index.html?id=${p.id}`;
            link.className = 'card-link';
            link.style.textDecoration = "none";
            link.style.color = "inherit";
            
            const div = document.createElement('div');
            div.className = 'pianta';
            
            const img = document.createElement('img');
            img.src = '../immagini_comuni/piante/' + p.immagine_url;
            img.setAttribute('data-original', img.src);
            img.setAttribute('data-hover', '../immagini_comuni/piante_hover/' + (p.hover_url || ''));
            img.alt = p.nome;
            
            const nome = document.createElement('p');
            nome.textContent = p.nome;
            
            div.appendChild(img);
            div.appendChild(nome);
            link.appendChild(div);
            container.appendChild(link);
        });
    } catch (err) {
        console.error(`Errore nel caricamento della sezione tag ID ${tagId}:`, err);
    }
}
// Gestisce l’effetto hover sulle immagini delle piante (cambio immagine con dissolvenza)
function gestisciHoverImmagini() {
    document.querySelectorAll('.galleria-piante').forEach(galleria => {
        galleria.addEventListener('mouseover', e => {
            if (e.target.tagName === 'IMG' && e.target.dataset.hover) {
                e.target.style.opacity = 0; // fade out
                setTimeout(() => {
                    e.target.src = e.target.dataset.hover;
                    e.target.style.opacity = 1; // fade in
                }, 150); // leggero delay per dare tempo all'opacità
            }
        });

        galleria.addEventListener('mouseout', e => {
            if (e.target.tagName === 'IMG' && e.target.dataset.original) {
                e.target.style.opacity = 0; // fade out
                setTimeout(() => {
                    e.target.src = e.target.dataset.original;
                    e.target.style.opacity = 1; // fade in
                }, 150);
            }
        });
    });
}

// Gestisce lo scroll orizzontale delle gallerie tramite pulsanti freccia
function gestisciScrollGallerie() {
    document.querySelectorAll('.galleria-container').forEach(containerEl => {
        const container = containerEl.querySelector('.galleria-piante');
        const leftBtn = containerEl.querySelector('.freccia.sinistra');
        const rightBtn = containerEl.querySelector('.freccia.destra');
        const scrollAmount = 6 * 220;

        // Scroll a destra
        rightBtn?.addEventListener('click', () => {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        // Scroll a sinistra
        leftBtn?.addEventListener('click', () => {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        // Mostra/nasconde le frecce in base alla posizione di scroll
        container?.addEventListener('scroll', () => {
            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            leftBtn.style.display = container.scrollLeft > 20 ? 'inline-block' : 'none';
            rightBtn.style.display = container.scrollLeft < maxScrollLeft - 20 ? 'inline-block' : 'none';
        });

        // Inizializza visibilità frecce
        container?.dispatchEvent(new Event('scroll'));
    });
}

// Mostra il nome o login utente nell'area account
async function aggiornaAccountArea() {
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
}

// Disattiva il trascinamento su un elemento specifico
function disableDragging(el) {
    if (el.nodeType === 1) { // solo nodi di tipo ELEMENT
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