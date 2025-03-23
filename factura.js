document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submit');
    const htmlInput = document.getElementById('htmlInput');

    submitButton.addEventListener('click', function() {
        const userHtml = htmlInput.value;
        const newTab = window.open();
        if (newTab) {
            newTab.document.write(userHtml);
            newTab.document.close();
        } else {
            console.error('No se pudo abrir una nueva pestaña.');
        }
    });
});
