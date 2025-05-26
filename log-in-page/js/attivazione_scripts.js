const token = new URLSearchParams(window.location.search).get("token");
const countdownEl = document.getElementById("countdown");

//controllo attivazione
if (!token) {
    document.querySelector("h1").innerText = "Token mancante!";
    countdownEl.parentElement.innerText = "";
} else {
    fetch(`http://localhost:8000/api/attiva-account?token=${token}`)
        .then(res => res.json())
        .then(data => {
            if (!data.message) {
                document.querySelector("h1").innerText = "Errore attivazione account.";
                countdownEl.parentElement.innerText = "";
                return;
            }

            // Countdown e redirect
            let seconds = 5;
            const interval = setInterval(() => {
                seconds--;
                countdownEl.innerText = seconds;
                if (seconds === 0) {
                    clearInterval(interval);
                    window.location.href = "accesso_index.html";
                }
            }, 1000);
        })
        .catch(() => {
            document.querySelector("h1").innerText = "Errore durante l'attivazione.";
            countdownEl.parentElement.innerText = "";
        });
}