(function () {
  var ACCESS_KEY = "eea-admin-access";
  var ADMIN_PASSCODE = "8681";

  var loginPanel = document.querySelector("[data-admin-login]");
  var dashboardPanel = document.querySelector("[data-admin-dashboard]");
  var loginForm = document.querySelector("[data-admin-form]");
  var passcodeInput = document.querySelector("[data-admin-passcode]");
  var uploadForm = document.querySelector("[data-upload-form]");
  var fileInput = document.querySelector("[data-upload-file]");
  var titleInput = document.querySelector("[data-upload-title]");
  var captionInput = document.querySelector("[data-upload-caption]");
  var photoGrid = document.querySelector("[data-admin-photo-grid]");
  var statusBox = document.querySelector("[data-admin-status]");
  var logoutButton = document.querySelector("[data-admin-logout]");
  var resetButton = document.querySelector("[data-admin-reset]");

  if (!window.EEAMediaStore || !loginPanel || !dashboardPanel) {
    return;
  }

  function setStatus(message) {
    if (statusBox) {
      statusBox.textContent = message;
    }
  }

  function hasAccess() {
    return sessionStorage.getItem(ACCESS_KEY) === "granted";
  }

  function grantAccess() {
    sessionStorage.setItem(ACCESS_KEY, "granted");
  }

  function revokeAccess() {
    sessionStorage.removeItem(ACCESS_KEY);
  }

  function showDashboard(show) {
    loginPanel.classList.toggle("active", !show);
    dashboardPanel.classList.toggle("active", show);
  }

  function renderPhotos() {
    var images = window.EEAMediaStore.getGalleryImages();
    photoGrid.innerHTML = "";

    if (!images.length) {
      photoGrid.innerHTML = '<div class="empty-state">No hay imagenes guardadas en este navegador.</div>';
      return;
    }

    images.forEach(function (image) {
      var card = document.createElement("article");
      card.className = "admin-photo-card";

      var photo = document.createElement("img");
      photo.src = image.src;
      photo.alt = image.title || "Imagen de galeria";

      var copy = document.createElement("div");

      var title = document.createElement("strong");
      title.textContent = image.title || "Imagen sin titulo";

      var caption = document.createElement("p");
      caption.className = "muted";
      caption.textContent = image.caption || "Sin descripcion.";

      var button = document.createElement("button");
      button.type = "button";
      button.className = "button danger-button";
      button.textContent = "Eliminar";
      button.addEventListener("click", function () {
        var updated = window.EEAMediaStore
          .getGalleryImages()
          .filter(function (item) {
            return item.id !== image.id;
          });

        window.EEAMediaStore.saveGalleryImages(updated);
        renderPhotos();
        setStatus("Imagen eliminada. La pagina de galeria ya se actualizo en este navegador.");
      });

      copy.appendChild(title);
      copy.appendChild(caption);
      card.appendChild(photo);
      card.appendChild(copy);
      card.appendChild(button);
      photoGrid.appendChild(card);
    });
  }

  function initializeState() {
    showDashboard(hasAccess());
    if (hasAccess()) {
      renderPhotos();
      setStatus("Modo administrador activo. Aqui puedes subir o eliminar fotos de la galeria.");
    } else {
      setStatus("Ingresa tu codigo para abrir el panel.");
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!passcodeInput) {
        return;
      }

      if (passcodeInput.value.trim() === ADMIN_PASSCODE) {
        grantAccess();
        passcodeInput.value = "";
        showDashboard(true);
        renderPhotos();
        setStatus("Acceso correcto. Ya puedes administrar tus fotos.");
      } else {
        setStatus("Codigo incorrecto. Cambialo tambien dentro de admin-media.js para personalizarlo.");
      }
    });
  }

  if (uploadForm) {
    uploadForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var file = fileInput && fileInput.files ? fileInput.files[0] : null;
      if (!file) {
        setStatus("Selecciona una imagen primero.");
        return;
      }

      var reader = new FileReader();
      reader.onload = function (loadEvent) {
        var images = window.EEAMediaStore.getGalleryImages();

        images.unshift({
          id: "custom-" + Date.now(),
          src: loadEvent.target.result,
          title: titleInput && titleInput.value.trim() ? titleInput.value.trim() : "Nuevo momento",
          caption: captionInput && captionInput.value.trim() ? captionInput.value.trim() : "Galeria actualizada desde Admin Media."
        });

        window.EEAMediaStore.saveGalleryImages(images);
        uploadForm.reset();
        renderPhotos();
        setStatus("Imagen agregada con exito. Abre gallery.html y veras el cambio.");
      };

      reader.readAsDataURL(file);
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      revokeAccess();
      showDashboard(false);
      setStatus("Sesion cerrada.");
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      window.EEAMediaStore.resetGalleryImages();
      renderPhotos();
      setStatus("La galeria volvio a las imagenes base.");
    });
  }

  initializeState();
})();
