const carousel = document.getElementById("carousel");
const items = document.querySelectorAll(".carousel-item");
const bgVideo = document.getElementById("bg-video");

const prev = document.querySelector(".nav.prev");
const next = document.querySelector(".nav.next");

let isScrolling = false; // per monitorare se è in corso uno scroll
let currentIndex = 0; // Indice dell'elemento attualmente centrato

// Gestione accedi o profilo
document.addEventListener("DOMContentLoaded", () => {
    const accountArea = document.getElementById("account-area");

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    };

    const userEmail = getCookie("user_email");

    if (userEmail) {
        accountArea.innerHTML = `
        <a href="../profilo-page/profilo_index.html" title="${userEmail}">
            <img src="../immagini_comuni/profilo.png" alt="Profilo" class="icona-profilo">
        </a>`;

    } else {
        // Utente non loggato: mostra "Accedi"
        accountArea.innerHTML = `<a href="../log-in-page/accesso_index.html">Accedi</a>`;
    }
});


// Funzione per ottenere l'indice dell'elemento più vicino al centro
function getCenteredIndex() {
    let closestIndex = 0;
    let closestDistance = Infinity;

    items.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(itemCenter - window.innerWidth / 2);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    return closestIndex;
}

// Funzione per aggiornare il video in base all'elemento centrato
function updateVideoIfChanged() {
    const newIndex = getCenteredIndex();
    if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        const videoSrc = items[newIndex].dataset.video;
        if (!bgVideo.src.includes(videoSrc)) {
            bgVideo.classList.add("fade-out");
            setTimeout(() => {
                bgVideo.src = videoSrc;
                bgVideo.load();
                bgVideo.play();
                bgVideo.classList.remove("fade-out");
            }, 300);
        }
    }
}

// Aggiorna il video quando la pagina è caricata
window.addEventListener("load", updateVideoIfChanged);

// Aggiorniamo il video quando l'utente scrolla il carosello
carousel.addEventListener("scroll", updateVideoIfChanged);

// Disabilitare i bottoni durante lo scroll
function disableButtons() {
    prev.disabled = true;
    next.disabled = true;
    items.forEach(item => item.classList.add('no-hover'));
}

// Riabilitare i bottoni
function enableButtons() {
    prev.disabled = false;
    next.disabled = false;
    items.forEach(item => item.classList.remove('no-hover'));
}

// Funzione per scorrere all'indice precedente
prev.addEventListener("click", () => {
    if (isScrolling) return;

    isScrolling = true;
    disableButtons();

    currentIndex = getCenteredIndex();
    // Ciclicizzare l'indice per un carosello infinito, ma non permettere di tornare indietro dal primo elemento
    const targetIndex = (currentIndex - 1 + items.length) % items.length;
    if (targetIndex === items.length - 1) {
        // Se siamo sul primo, non torniamo indietro
        currentIndex = 0;
    } else {
        currentIndex = targetIndex;
    }

    items[currentIndex].scrollIntoView({ behavior: "smooth", block: "end" });

    setTimeout(() => {
        updateVideoIfChanged();
        isScrolling = false;
        enableButtons();
    }, 800);
});

// Funzione per scorrere all'indice successivo
next.addEventListener("click", () => {
    if (isScrolling) return;

    isScrolling = true;
    disableButtons();

    currentIndex = getCenteredIndex();
    // Ciclicizzare l'indice per un carosello infinito
    const targetIndex = (currentIndex + 1) % items.length;
    items[targetIndex].scrollIntoView({ behavior: "smooth", block: "end" });

    setTimeout(() => {
        updateVideoIfChanged();
        isScrolling = false;
        enableButtons();
    }, 800);
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


carousel.addEventListener("wheel", function(event) {

    if(isScrolling) return;

    // Ignora se l'evento è causato da uno scroll orizzontale naturale (come da trackpad)
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

    // Impedisce il comportamento verticale predefinito
    event.preventDefault();
    isScrolling = true;
    disableButtons();

    setTimeout(() => {
        // Scrolla orizzontalmente in base al deltaY
        carousel.scrollBy({
            left: event.deltaY,
            behavior: "smooth"
        });
        isScrolling = false;
        enableButtons();
    }, 100);

}, { passive: false }); // 'passive: false' è necessario per chiamare preventDefault
