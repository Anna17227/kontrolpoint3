const deleteForms = document.querySelectorAll('.inline-form');

deleteForms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    const confirmed = confirm('Удалить пользователя?');

    if (!confirmed) {
      event.preventDefault();
    }
  });
});
