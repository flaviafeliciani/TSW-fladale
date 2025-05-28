const API_BASE_URL = "http://localhost:8000";
    
document.addEventListener("DOMContentLoaded", async () => {
    const accountArea = document.getElementById("account-area");
    
    // Ottiene un cookie dato il nome
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    };
  
    // Recupera l'email dell'utente dal cookie
    const userEmail = getCookie("user_email");
  
    // Se c'è un'email, mostra l'area profilo, altrimenti mostra "Accedi"
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
  
    // Gestione invio del form "Trova la tua pianta"
    const form = document.getElementById("plantForm");
    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            
            const luogo = document.getElementById("luogo").value;
            const luce = document.getElementById("luce").value;
            const ambiente = document.getElementById("ambiente").value;
            const cura = document.getElementById("cura").value;
            const grandezza = document.getElementById("grandezza").value;
            
            // Mappa tra opzioni e ID tag del database
            const tagMap = {
                "Esterno": 1, "Ufficio": 2, "Salotto": 3, "Cucina": 4, "Camera": 5, "Bagno": 6,
                "Facile": 7, "Intermedia": 8, "Difficile": 9, "Umido": 10, "Secco": 11,
                "Sole": 12, "Ombra": 13, "Penombra": 14, "Piccola": 15, "Media": 16, "Grande": 17
            };
        
            const selectedTags = [];
            const params = new URLSearchParams();
        
            if (luogo === "Interno") {
                selectedTags.push(2, 3, 4, 5, 6);
            } else if (luogo) {
                selectedTags.push(tagMap[luogo]);
            }
        
            if (luce) selectedTags.push(tagMap[luce]);
            if (ambiente) selectedTags.push(tagMap[ambiente]);
            if (cura) selectedTags.push(tagMap[cura]);
            if (grandezza) selectedTags.push(tagMap[grandezza]);
        
            if (selectedTags.length > 0) {
                params.set("tags", selectedTags.join(","));
            }
        
            try {
                // Chiamata all’API per recuperare le piante filtrate
                const response = await fetch(`${API_BASE_URL}/api/piante?${params.toString()}`);
                const piante = await response.json();
                
                // Se trova piante, reindirizza alla pagina di dettaglio
                if (piante.length > 0) {
                    const randomPianta = piante[Math.floor(Math.random() * piante.length)];
                    const piantaId = randomPianta.id;
                    window.location.href = `../dettaglio-page/dettaglio_index.html?id=${piantaId}`;
                } else {
                    showToast("Nessuna pianta trovata con questi criteri.");
                }
            } catch (error) {
                console.error("Errore nella ricerca della pianta:", error);
                showToast("Errore durante la ricerca. Riprova.");
            }
        
            // Pulisce il form
            form.reset();
        });
    
    }
});

// Mostra un toast (popup di notifica temporanea)
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
    
// Attiva l’osservazione del DOM per aggiunte future
observer.observe(document.body, { childList: true, subtree: true });