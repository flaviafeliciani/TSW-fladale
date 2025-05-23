//salvataggio cookie per controllo email utente
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", () => {
    const emailInput = form.querySelector('input[name="email"]');
    if (emailInput) {
      sessionStorage.setItem("user_email", emailInput.value);
    }
  });
});

document.querySelectorAll('*').forEach(element => {
  element.setAttribute('draggable', 'false');
});
