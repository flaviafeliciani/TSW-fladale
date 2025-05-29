const API_BASE_URL = "http://localhost:8000";
let calendar;
let updateArrowVisibility;

//prende informazioni utente
document.addEventListener("DOMContentLoaded", () => {
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    };

    const userEmail = getCookie("user_email");

    const accountArea = document.getElementById("account-area");
    if (userEmail) {
        accountArea.innerHTML = `
            <a href="../profilo-page/profilo_index.html" title="${userEmail}">
                <img src="../immagini_comuni/profilo.png" alt="Profilo" class="icona-profilo">
            </a>`;
    } else {
        accountArea.innerHTML = `<a href="../log-in-page/accesso_index.html">Accedi</a>`;
    }

    //cambia nome nel titolo
    const nomeContainer = document.getElementById("titolo-giardino");
    if (!userEmail) {
        if (nomeContainer)
            nomeContainer.textContent = "Ciao amico del verde! Fai l'accesso per vedere le tue piante ";
    } else {
        fetch(`${API_BASE_URL}/api/utente?email=${userEmail}`)
            .then(res => res.json())
            .then(data => {
                if (nomeContainer)
                    nomeContainer.textContent = `Ciao ${data.nome}! Benvenuto nel tuo giardino`;
            })
            .catch(() => {
                if (nomeContainer)
                    nomeContainer.textContent = "Ciao amico del verde! Fai l'accesso per vedere le tue piante ";
            });
    }

    //creazione eventi promemoria di annaffiamento
    fetch(`${API_BASE_URL}/api/eventi-annaffiamento?email=${userEmail}`)
        .then(res => res.json())
        .then(eventi => {
            const containerEventi = document.getElementById("eventi-google");
            if (!containerEventi || eventi.length === 0) return;

            const eventiPerPianta = {};
            eventi.forEach(e => {
                if (!eventiPerPianta[e.id_pianta]) eventiPerPianta[e.id_pianta] = [];
                eventiPerPianta[e.id_pianta].push(e);
            });

            Object.values(eventiPerPianta).forEach(listaEventi => {
                listaEventi.sort((a, b) => new Date(a.start) - new Date(b.start));
                const evento = listaEventi[0];

                const startDate = new Date(evento.start);
                const endDate = new Date(startDate);
                endDate.setMinutes(startDate.getMinutes() + 30);

                const formatDate = (d) =>
                    d.toISOString().replace(/[-:]|\.\d{3}/g, '').slice(0, 15) + 'Z';

                const link = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evento.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent("Promemoria automatico da Fladale")}&location=${encodeURIComponent("Il tuo giardino")}`;

                const btn = document.createElement("button");
                btn.textContent = `➕ ${evento.title}`;
                btn.onclick = () => window.open(link, "_blank");
                containerEventi.appendChild(btn);
            });
        })
        .catch(err => {
            console.error("Errore nel caricare eventi Google:", err);
        });

    //crea card delle piante preferite
    fetch(`${API_BASE_URL}/api/preferiti?email=${userEmail}`)
        .then(res => res.json())
        .then(piantePreferite => {
            const container = document.getElementById("contenitore-piante");
            const btnLeft = document.querySelector(".freccia.sinistra");
            const btnRight = document.querySelector(".freccia.destra");
            const scrollContainer = document.getElementById("contenitore-piante");

            if (container && piantePreferite.length > 0) {
                container.classList.add('scroll-piante');

                piantePreferite.forEach(pianta => {
                    const div = document.createElement("div");
                    div.className = "pianta";

                    const img = document.createElement("img");
                    img.src = "../immagini_comuni/piante/" + pianta.immagine_url;
                    img.alt = pianta.nome;
                    img.classList.add("foto-pianta");
                    img.style.cursor = "pointer";
                    img.addEventListener("click", () => {
                        window.location.href = `../dettaglio-page/dettaglio_index.html?id=${pianta.id}`;
                    });

                    const titolo = document.createElement("h3");
                    titolo.textContent = pianta.nome;

                    const barraCont = document.createElement("div");
                    barraCont.className = "acqua-bar-container";

                    const barra = document.createElement("div");
                    barra.className = "acqua-bar";
                    barra.style.width = `${pianta.percentuale_annaffiamento}%`;
                    barraCont.appendChild(barra);

                    const par = document.createElement("p");
                    par.innerHTML = `Acqua residua: <span class="percentuale">${pianta.percentuale_annaffiamento}</span>%`;

                    const btnRimuovi = document.createElement("button");
                    btnRimuovi.className = "btn-rimuovi";
                    btnRimuovi.dataset.nome = pianta.nome;
                    btnRimuovi.textContent = "Rimuovi dai preferiti";

                    const btnData = document.createElement("button");
                    btnData.className = "btn-data-annaffiamento";
                    btnData.dataset.id = pianta.id;
                    btnData.textContent = "Ultimo annaffiamento";

                    div.appendChild(img);
                    div.appendChild(titolo);
                    div.appendChild(barraCont);
                    div.appendChild(par);
                    div.appendChild(btnRimuovi);
                    div.appendChild(btnData);
                    container.appendChild(div);
                });

                //controllo frecce per scroll
                updateArrowVisibility = () => {
                    const scrollLeft = scrollContainer.scrollLeft;
                    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
                    btnLeft.classList.toggle("hidden", scrollLeft <= 5);
                    btnRight.classList.toggle("hidden", scrollLeft >= maxScroll - 5);
                };

                if (piantePreferite.length < 3) {
                    btnLeft.classList.add("hidden");
                    btnRight.classList.add("hidden");
                } else {
                    const card = scrollContainer.querySelector(".pianta");
                    if (!card) return;

                    const cardRect = card.getBoundingClientRect();
                    const cardWidth = cardRect.width;
                    const gap = parseInt(getComputedStyle(scrollContainer).gap) || 0;
                    const scrollStep = cardWidth * 3 + gap * 2;

                    btnLeft.addEventListener("click", () => {
                        scrollContainer.scrollBy({ left: -scrollStep, behavior: "smooth" });
                    });

                    btnRight.addEventListener("click", () => {
                        scrollContainer.scrollBy({ left: scrollStep, behavior: "smooth" });
                    });

                    scrollContainer.addEventListener("scroll", updateArrowVisibility);
                    window.addEventListener("resize", updateArrowVisibility);
                    requestAnimationFrame(updateArrowVisibility);
                }

                //rimozione delle piante dai preferiti
                container.addEventListener('click', (e) => {
                    if (e.target.classList.contains('btn-rimuovi')) {
                        const card = e.target.closest('.pianta');
                        const nome = e.target.dataset.nome;
                        
                        const id = card.querySelector('.btn-data-annaffiamento').dataset.id;
                        card.remove();
                        showToast("Pianta rimossa dai preferiti!");
                        fetch(`${API_BASE_URL}/api/preferiti/delete`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: userEmail, id_pianta: id })
                        })
                        .then(() => {
                            const cards = scrollContainer.querySelectorAll('.pianta');
                            if (cards.length < 3) {
                                btnLeft.classList.add("hidden");
                                btnRight.classList.add("hidden");
                            }
                            updateArrowVisibility();

                            setTimeout(() => {
                                if (calendar) calendar.refetchEvents();

                                
                                aggiornaEventiGoogle();
                            }, 300);
                        });

                    }
                });

            } else if (container) {
                container.innerHTML = "<p>Nessuna pianta preferita trovata.</p>";
                const btnLeft = document.querySelector(".freccia.sinistra");
                const btnRight = document.querySelector(".freccia.destra");
                btnLeft?.classList.add("hidden");
                btnRight?.classList.add("hidden");
            }
        });

    //calendario
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'it',
            height: 'auto',
            headerToolbar: {
                start: 'prev,next today',
                center: 'title',
                end: window.innerWidth > 768 ? 'listWeek,dayGridMonth' : ''
            },
            views: {
                listWeek: { buttonText: 'Settimana' },
                dayGridMonth: { buttonText: 'Mese', displayEventTime: false, eventDisplay: 'block' }
            },
            eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
            listDayFormat: { weekday: 'long', day: 'numeric', month: 'short' },
            events: function(info, successCallback, failureCallback) {
                fetch(`${API_BASE_URL}/api/eventi-annaffiamento?email=${userEmail}`)
                    .then(res => res.json())
                    .then(events => successCallback(events))
                    .catch(err => {
                        console.error("Errore eventi:", err);
                        failureCallback(err);
                });
            }
        });
        calendar.render();

        //gestione visione mobile del titolo del calendario
        const fixCalendarToolbarLayout = () => {
            
            if (window.innerWidth > 768) return;

            if (calendar && calendar.view.type !== 'listWeek') {
                calendar.changeView('listWeek');
            }
            const toolbar = document.querySelector(".fc-header-toolbar");
            if (!toolbar) return;

            const title = toolbar.querySelector(".fc-toolbar-title");
            const chunks = toolbar.querySelectorAll(".fc-toolbar-chunk");

            if (toolbar.querySelector(".fc-toolbar-chunks")) return;

            const wrapper = document.createElement("div");
            wrapper.classList.add("fc-toolbar-chunks");

            chunks.forEach(chunk => {
                if (chunk.querySelector(".fc-prev-button") || chunk.querySelector(".fc-next-button")) {
                    chunk.classList.add("fc-chunk-navigazione");
                    if (chunk.querySelector(".fc-today-button")) {
                        chunk.classList.add("con-today");
                    } else {
                        chunk.classList.add("senza-today");
                    }
                }
                wrapper.appendChild(chunk);
            });

            //(mantiene classi e struttura)
            while (toolbar.firstChild) toolbar.removeChild(toolbar.firstChild);

            toolbar.appendChild(title);
            toolbar.appendChild(wrapper);
        };

        fixCalendarToolbarLayout();

    }

    //popup ultimo annaffiamento
    let selectedId = null;

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-data-annaffiamento")) {
            selectedId = e.target.dataset.id;
            const oggi = new Date().toISOString().split("T")[0];
            document.getElementById("data-input").value = oggi;
            document.getElementById("popup-calendario").style.display = "block";
        }

        if (e.target.id === "conferma-data") {
            const data = document.getElementById("data-input").value || new Date().toISOString().split("T")[0];

            fetch(`${API_BASE_URL}/api/preferiti/data-annaffiamento`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, id_pianta: selectedId, data })
            })
                .then(res => res.json())
                .then(data => {
                    showToast("Data salvata!");

                    document.getElementById("popup-calendario").style.display = "none";
                    document.getElementById("data-input").value = "";

                    const piantaCard = document.querySelector(`.btn-data-annaffiamento[data-id="${selectedId}"]`)?.closest('.pianta');
                    if (piantaCard && data.percentuale !== undefined) {
                        piantaCard.querySelector('.acqua-bar').style.width = `${data.percentuale}%`;
                        piantaCard.querySelector('.percentuale').textContent = data.percentuale;
                    }

                    calendar.refetchEvents();
                });
        }

        if (e.target.id === "annulla-data") {
            document.getElementById("popup-calendario").style.display = "none";
            document.getElementById("data-input").value = "";
        }
    });

    //aggiornamento eventi sezione per aggiungerli al google calendar
    function aggiornaEventiGoogle() {
    fetch(`${API_BASE_URL}/api/eventi-annaffiamento?email=${getCookie("user_email")}`)
        .then(res => res.json())
        .then(eventi => {
            const containerEventi = document.getElementById("eventi-google");
            if (!containerEventi) return;
            containerEventi.innerHTML = "";

            const eventiPerPianta = {};
            eventi.forEach(e => {
                if (!eventiPerPianta[e.id_pianta]) eventiPerPianta[e.id_pianta] = [];
                eventiPerPianta[e.id_pianta].push(e);
            });

            Object.values(eventiPerPianta).forEach(listaEventi => {
                listaEventi.sort((a, b) => new Date(a.start) - new Date(b.start));
                const evento = listaEventi[0];

                const startDate = new Date(evento.start);
                const endDate = new Date(startDate);
                endDate.setMinutes(startDate.getMinutes() + 30);

                const formatDate = (d) =>
                    d.toISOString().replace(/[-:]|\\.\\d{3}/g, '').slice(0, 15) + 'Z';

                const link = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evento.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent("Promemoria automatico da Fladale")}&location=${encodeURIComponent("Il tuo giardino")}`;

                const btn = document.createElement("button");
                btn.textContent = `➕ ${evento.title}`;
                btn.onclick = () => window.open(link, "_blank");
                containerEventi.appendChild(btn);
            });
        });
    }

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

});

// disattiva il trascinamento su un elemento specifico
function disableDragging(el) {
    if (el.nodeType === 1) { // solo nodi di tipo ELEMENT
        el.setAttribute('draggable', 'false');
        el.querySelectorAll('*').forEach(child => {
            child.setAttribute('draggable', 'false');
        });
    }
}

//applica agli elementi già presenti
document.querySelectorAll('*').forEach(el => disableDragging(el));

//osserva il DOM per nuovi elementi aggiunti
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            disableDragging(node);
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });