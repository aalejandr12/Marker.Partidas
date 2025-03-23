if (!window.hscHighlightInitialized) {
  window.hscHighlightInitialized = true;

  // Función para resaltar los códigos HSC de forma eficiente
  function highlightHSC(target, hscCodes) {
    const elements = target.querySelectorAll("*:not(script):not(style)");

    elements.forEach((element) => {
      if (element.children.length === 0 && !element.classList.contains("hsc-highlighted")) {
        let text = element.textContent;
        Object.keys(hscCodes).forEach((code) => {
          const regex = new RegExp(code.replace(/[.]/g, "\\."), "g");
          text = text.replace(
            regex,
            `<span class="hsc-highlight" title="${hscCodes[code]}">${code}</span>`
          );
        });
        element.innerHTML = text;
        element.classList.add("hsc-highlighted");
      }
    });
  }

  // Recuperar el JSON desde el almacenamiento local
  chrome.storage.local.get("hscCodes", ({ hscCodes }) => {
    if (hscCodes) {
      const targetContainer = document.querySelector(".ui-datatable-scrollable-body");
      if (targetContainer) {
        // Evitar resaltar cuando se hace clic en los botones de "Editar" o "Menú"
        const preventHighlightButtons = document.querySelectorAll("button, a, .ui-button");

        preventHighlightButtons.forEach((button) => {
          button.addEventListener("click", (event) => {
            // Desactivar el resaltado al hacer clic en los botones
            event.stopPropagation(); // Evitar la propagación del clic
          });
        });

        // Resaltar en el cambio de página (al hacer clic en los botones de paginación)
        const pageButtons = document.querySelectorAll(".ui-paginator-page");
        pageButtons.forEach((button) => {
          button.addEventListener("click", () => {
            setTimeout(() => {
              const updatedTargetContainer = document.querySelector(".ui-datatable-scrollable-body");
              if (updatedTargetContainer) {
                highlightHSC(updatedTargetContainer, hscCodes);
              }
            }, 500); // Esperar un poco para que la nueva página cargue
          });
        });

        // Resaltar el contenido en la carga inicial de la página
        highlightHSC(targetContainer, hscCodes);

        // Repetir el resaltado en intervalos si es necesario (en caso de que el contenido cambie dinámicamente)
        setInterval(() => {
          const updatedTargetContainer = document.querySelector(".ui-datatable-scrollable-body");
          if (updatedTargetContainer) {
            highlightHSC(updatedTargetContainer, hscCodes);
          }
        }, 1000); // Revisar cada 1 segundo si el contenido cambia
      } else {
        console.warn("No se encontró el contenedor para resaltar.");
      }
    } else {
      console.warn("No se encontraron datos de códigos arancelarios locales.");
    }
  });
}
