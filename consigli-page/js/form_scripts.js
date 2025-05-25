const API_BASE_URL = "http://localhost:8000";

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

  // Gestione form piante
  const form = document.getElementById("plantForm");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const luogo = document.getElementById("luogo").value;
      const luce = document.getElementById("luce").value;
      const ambiente = document.getElementById("ambiente").value;
      const cura = document.getElementById("cura").value;
      const grandezza = document.getElementById("grandezza").value;

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
        // Esegui la richiesta all'API
        const response = await fetch(`${API_BASE_URL}/api/piante?${params.toString()}`);
        const piante = await response.json();

        if (piante.length > 0) {
          const randomPianta = piante[Math.floor(Math.random() * piante.length)];
          const piantaId = randomPianta.id;
          window.location.href = `../dettaglio-page/dettaglio_index.html?id=${piantaId}`;
        } else {
          alert("Nessuna pianta trovata con questi criteri.");
        }
      } catch (error) {
        console.error("Errore nella ricerca della pianta:", error);
        alert("Si è verificato un errore durante la ricerca.");
      }

      form.reset();
    });

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