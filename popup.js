document.addEventListener("DOMContentLoaded", () => {
  const selectFileButton = document.getElementById("selectFile");
  const updateButton = document.getElementById("updateData");
  const statusText = document.getElementById("status");

  // Obtener URL del archivo JSON desde el almacenamiento
  chrome.storage.sync.get("jsonUrl", ({ jsonUrl }) => {
    if (jsonUrl) {
      statusText.textContent = `URL actual: ${jsonUrl}`;
    } else {
      statusText.textContent = "No se ha configurado ninguna URL.";
    }
  });

  // Configurar URL del archivo JSON
  selectFileButton.addEventListener("click", () => {
    const url = prompt("Ingresa la URL del archivo JSON:");
    if (url) {
      chrome.storage.sync.set({ jsonUrl: url }, () => {
        statusText.textContent = `URL guardada: ${url}`;
      });
    } else {
      statusText.textContent = "No se ingresó una URL.";
    }
  });

  // Actualizar datos JSON desde la URL configurada
  updateButton.addEventListener("click", () => {
    chrome.storage.sync.get("jsonUrl", ({ jsonUrl }) => {
      if (jsonUrl) {
        fetch(jsonUrl)
          .then((response) => response.json())
          .then((hscCodes) => {
            chrome.storage.local.set({ hscCodes }, () => {
              statusText.textContent = "Datos actualizados localmente.";
            });
          })
          .catch((error) => {
            console.error("Error al actualizar los datos:", error);
            statusText.textContent = "Error al actualizar los datos.";
          });
      } else {
        statusText.textContent = "No se ha configurado la URL para la actualización.";
      }
    });
  });
});
