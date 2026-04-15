(function () {
  var STORAGE_KEY = "eea-gallery-images";

  var defaultGallery = [
    {
      src: "foto1.jpg.jpeg",
      title: "Practica guiada",
      caption: "Conversaciones reales para fortalecer fluidez y confianza."
    },
    {
      src: "foto2.jpg.jpeg",
      title: "Clase participativa",
      caption: "Aprendizaje activo con acompanamiento cercano."
    },
    {
      src: "foto3.jpg.jpeg",
      title: "Expresion oral",
      caption: "Espacios seguros para hablar ingles desde el primer dia."
    },
    {
      src: "foto4.jpg.jpeg",
      title: "Trabajo en equipo",
      caption: "Actividades colaborativas que vuelven el idioma mas natural."
    },
    {
      src: "foto10.jpg.png",
      title: "Motivacion que se nota",
      caption: "Cada sesion busca resultados visibles y experiencias memorables."
    },
    {
      src: "foto11.jpg.png",
      title: "Aprendizaje con proposito",
      caption: "El ingles como herramienta para avanzar academica y laboralmente."
    },
    {
      src: "foto12.jpg.png",
      title: "Acompanamiento constante",
      caption: "Retroalimentacion clara y practica adaptada al estudiante."
    },
    {
      src: "foto13.jpg.jpg",
      title: "Interaccion autentica",
      caption: "Momentos que conectan el aula con situaciones reales."
    },
    {
      src: "foto14.jpg.jpg",
      title: "Confianza en accion",
      caption: "Estudiantes dando pasos firmes hacia nuevas oportunidades."
    },
    {
      src: "foto15.jpg.jpg",
      title: "Comunidad que crece",
      caption: "Una academia enfocada en impacto humano y crecimiento real."
    }
  ];

  function cloneDefaultGallery() {
    return defaultGallery.map(function (item) {
      return {
        id: "default-" + Math.random().toString(36).slice(2, 9),
        src: item.src,
        title: item.title,
        caption: item.caption
      };
    });
  }

  function getGalleryImages() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return cloneDefaultGallery();
      }

      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) {
        return cloneDefaultGallery();
      }

      return parsed;
    } catch (error) {
      return cloneDefaultGallery();
    }
  }

  function saveGalleryImages(images) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  }

  function resetGalleryImages() {
    var images = cloneDefaultGallery();
    saveGalleryImages(images);
    return images;
  }

  function setupNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setupYear() {
    document.querySelectorAll("[data-year]").forEach(function (node) {
      node.textContent = new Date().getFullYear();
    });
  }

  function setupGalleryPage() {
    var grid = document.querySelector("[data-gallery-grid]");
    if (!grid) {
      return;
    }

    var status = document.querySelector("[data-gallery-status]");
    var modal = document.querySelector("[data-gallery-modal]");
    var modalImage = document.querySelector("[data-gallery-image]");
    var modalTitle = document.querySelector("[data-gallery-title]");
    var modalCaption = document.querySelector("[data-gallery-caption]");
    var closeButton = document.querySelector("[data-gallery-close]");
    var prevButton = document.querySelector("[data-gallery-prev]");
    var nextButton = document.querySelector("[data-gallery-next]");
    var images = getGalleryImages();
    var currentIndex = 0;

    function renderGallery() {
      grid.innerHTML = "";

      if (!images.length) {
        grid.innerHTML = '<div class="empty-state">Todavia no hay imagenes disponibles.</div>';
        if (status) {
          status.textContent = "La galeria esta vacia por ahora.";
        }
        return;
      }

      images.forEach(function (image, index) {
        var card = document.createElement("article");
        card.className = "gallery-card";

        var button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", "Abrir imagen");

        var photo = document.createElement("img");
        photo.src = image.src;
        photo.alt = image.title || "Galeria Expressive English Academy";

        var copy = document.createElement("div");
        copy.className = "gallery-copy";

        var title = document.createElement("strong");
        title.textContent = image.title || "Momento Expressive English Academy";

        var caption = document.createElement("span");
        caption.textContent = image.caption || "Experiencias reales de nuestros estudiantes.";

        copy.appendChild(title);
        copy.appendChild(caption);
        button.appendChild(photo);
        button.appendChild(copy);
        card.appendChild(button);
        grid.appendChild(card);

        button.addEventListener("click", function () {
          openModal(index);
        });
      });

      if (status) {
        status.textContent = "Galeria actualizada. Si cambias fotos desde Admin Media, aqui se reflejan en este navegador.";
      }
    }

    function openModal(index) {
      currentIndex = index;
      var image = images[currentIndex];

      if (!image || !modal || !modalImage) {
        return;
      }

      modalImage.src = image.src;
      modalImage.alt = image.title || "Imagen de galeria";
      if (modalTitle) {
        modalTitle.textContent = image.title || "Expressive English Academy";
      }
      if (modalCaption) {
        modalCaption.textContent = image.caption || "Experiencias reales de aprendizaje.";
      }

      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      if (!modal) {
        return;
      }
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    function step(direction) {
      if (!images.length) {
        return;
      }
      currentIndex = (currentIndex + direction + images.length) % images.length;
      openModal(currentIndex);
    }

    if (closeButton) {
      closeButton.addEventListener("click", closeModal);
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        step(-1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        step(1);
      });
    }

    if (modal) {
      modal.addEventListener("click", function (event) {
        if (event.target === modal) {
          closeModal();
        }
      });
    }

    document.addEventListener("keydown", function (event) {
      if (!modal || !modal.classList.contains("active")) {
        return;
      }

      if (event.key === "Escape") {
        closeModal();
      }

      if (event.key === "ArrowLeft") {
        step(-1);
      }

      if (event.key === "ArrowRight") {
        step(1);
      }
    });

    renderGallery();
  }

  setupNavigation();
  setupYear();
  setupGalleryPage();

  window.EEAMediaStore = {
    getGalleryImages: getGalleryImages,
    saveGalleryImages: saveGalleryImages,
    resetGalleryImages: resetGalleryImages
  };
})();
