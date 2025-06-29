const vehicleData = {
  /*
  2024: {
    Toyota: ["Camry", "Corolla", "RAV4"],
    Ford: ["F-150", "Mustang", "Explorer"],
  },
  2023: {
    Honda: ["Accord", "Civic", "CR-V"],
    Ford: ["Escape", "Fusion"],
    BMW: ["X3", "X5"],
  },
  2022: {
    Chevrolet: ["Silverado", "Malibu"],
    Toyota: ["Highlander", "Tacoma"],
  },
  */

  2011: {
    RAM: {
      1500: ["Front Bumper", "Rear Bumper"],
    },
  },
  2012: {
    RAM: {
      1500: ["Front Bumper", "Rear Bumper"],
      2500: ["Tailgate"],
    },
  },
  2013: {
    RAM: {
      1500: ["Front Bumper", "Rear Bumper"],
      2500: ["Tailgate"],
    },
    Toyota: {
      Camry: ["Front Bumper"],
      Corolla: ["Passenger Side Fender"],
    },
  },
  2014: {
    RAM: {
      1500: ["Front Bumper", "Rear Bumper"],
      2500: ["Tailgate"],
    },
    Toyota: {
      Camry: ["Front Bumper"],
      Corolla: ["Passenger Side Fender"],
    },
  },
  2015: {
    RAM: {
      1500: ["Front Bumper", "Rear Bumper"],
      2500: ["Tailgate"],
    },
    Toyota: {
      Camry: ["Front Bumper"],
      Corolla: ["Passenger Side Fender"],
    },
  },
  2016: {
    RAM: {
      2500: ["Tailgate"],
    },
    Toyota: {
      Camry: ["Front Bumper"],
      Corolla: ["Passenger Side Fender"],
    },
  },
  2017: {
    Toyota: {
      Corolla: ["Front Bumper", "Passenger Side Fender"],
    },
  },
};

const Storage = {
  getVehicles() {
    return JSON.parse(localStorage.getItem("savedVehicles") || "[]");
  },
  saveVehicle({ year, make, model }) {
    const vehicles = this.getVehicles();
    const slug = `${year}-${make}-${model}`.toLowerCase().replace(/\s+/g, "-");

    const exists = vehicles.some(
      (v) => v.year === year && v.make === make && v.model === model
    );

    if (!exists) {
      vehicles.push({ year, make, model, slug });
      localStorage.setItem("savedVehicles", JSON.stringify(vehicles));
    }
  },
};

// Theme Management
class ThemeManager {
  constructor() {
    this.theme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    this.init();
  }

  init() {
    this.applyTheme();
    this.bindEvents();
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.theme);
    localStorage.setItem("theme", this.theme);
  }

  toggle() {
    this.theme = this.theme === "light" ? "dark" : "light";
    this.applyTheme();
  }

  bindEvents() {
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggle());
    }
  }
}

// Modal Management
class ModalManager {
  constructor() {
    this.modal = document.getElementById("modalOverlay");
    this.openBtn = document.getElementById("openModal");
    this.closeBtn = document.getElementById("closeModal");
    this.form = document.getElementById("vehicleForm");
    this.init();
  }

  init() {
    this.bindEvents();
    this.populateYears();
  }

  bindEvents() {
    // Open modal
    if (this.openBtn) {
      this.openBtn.addEventListener("click", () => this.open());
    }

    // Close modal
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    // Close on backdrop click
    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
    }

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });

    // Form submission
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  populateYears() {
    const yearSelect = document.getElementById("yearSelect");
    const makeSelect = document.getElementById("makeSelect");
    const modelSelect = document.getElementById("modelSelect");
    const productTypeSelect = document.getElementById("productTypeSelect");
    const submitBtn = document.querySelector(".form-submit");

    // Reset all
    yearSelect.innerHTML = `<option value="">Select Year</option>`;
    makeSelect.innerHTML = `<option value="">Select Make</option>`;
    modelSelect.innerHTML = `<option value="">Select Model</option>`;
    productTypeSelect.innerHTML = `<option value="">Select Product Type</option>`;
    makeSelect.disabled = true;
    modelSelect.disabled = true;
    productTypeSelect.disabled = true;
    submitBtn.disabled = true;

    Object.keys(vehicleData)
      .sort((a, b) => b - a)
      .forEach((year) => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });

    yearSelect.addEventListener("change", () => {
      const selectedYear = yearSelect.value;

      makeSelect.innerHTML = `<option value="">Select Make</option>`;
      modelSelect.innerHTML = `<option value="">Select Model</option>`;
      productTypeSelect.innerHTML = `<option value="">Select Product Type</option>`;
      makeSelect.disabled = true;
      modelSelect.disabled = true;
      productTypeSelect.disabled = true;
      submitBtn.disabled = true;

      if (selectedYear) {
        this.populateMakes(selectedYear);
        makeSelect.disabled = false;
      }
    });
  }

  populateMakes(selectedYear) {
    const makeSelect = document.getElementById("makeSelect");
    const modelSelect = document.getElementById("modelSelect");
    const productTypeSelect = document.getElementById("productTypeSelect");
    const submitBtn = document.querySelector(".form-submit");

    const makes = Object.keys(vehicleData[selectedYear] || {});
    makeSelect.innerHTML = `<option value="">Select Make</option>`;
    modelSelect.innerHTML = `<option value="">Select Model</option>`;
    productTypeSelect.innerHTML = `<option value="">Select Product Type</option>`;
    modelSelect.disabled = true;
    productTypeSelect.disabled = true;
    submitBtn.disabled = true;

    makes.forEach((make) => {
      const option = document.createElement("option");
      option.value = make;
      option.textContent = make;
      makeSelect.appendChild(option);
    });

    makeSelect.addEventListener("change", () => {
      const selectedMake = makeSelect.value;

      modelSelect.innerHTML = `<option value="">Select Model</option>`;
      productTypeSelect.innerHTML = `<option value="">Select Product Type</option>`;
      modelSelect.disabled = true;
      productTypeSelect.disabled = true;
      submitBtn.disabled = true;

      if (selectedMake) {
        this.populateModels(selectedYear, selectedMake);
        modelSelect.disabled = false;
      }
    });
  }

  populateModels(selectedYear, selectedMake) {
    const modelSelect = document.getElementById("modelSelect");
    const productTypeSelect = document.getElementById("productTypeSelect");
    const submitBtn = document.querySelector(".form-submit");

    const models = Object.keys(vehicleData[selectedYear][selectedMake] || {});
    modelSelect.innerHTML = `<option value="">Select Model</option>`;
    productTypeSelect.innerHTML = `<option value="">Select Product Type</option>`;
    productTypeSelect.disabled = true;
    submitBtn.disabled = true;

    models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      modelSelect.appendChild(option);
    });

    modelSelect.addEventListener("change", () => {
      const selectedModel = modelSelect.value;

      productTypeSelect.innerHTML = `<option value="">Select Product Type</option>`;
      productTypeSelect.disabled = true;
      submitBtn.disabled = true;

      if (selectedModel) {
        this.populateProductTypes(selectedYear, selectedMake, selectedModel);
        productTypeSelect.disabled = false;
        submitBtn.disabled = false;
      }
    });
  }

  populateProductTypes(selectedYear, selectedMake, selectedModel) {
    const productTypeSelect = document.getElementById("productTypeSelect");
    const productTypes =
      vehicleData[selectedYear][selectedMake][selectedModel] || [];

    productTypeSelect.innerHTML = `<option value="">Select Product Type</option>`;

    productTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      productTypeSelect.appendChild(option);
    });
  }

  open() {
    if (this.modal) {
      this.modal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Focus first form element
      const firstInput = this.modal.querySelector("select, input");
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  isOpen() {
    return this.modal && this.modal.classList.contains("active");
  }

  handleSubmit(e) {
    e.preventDefault();

    const year = document.getElementById("yearSelect")?.value.trim();
    const make = document.getElementById("makeSelect")?.value.trim();
    const model = document.getElementById("modelSelect")?.value.trim();
    const productType = document
      .getElementById("productTypeSelect")
      ?.value.trim();

    if (!year || !make || !model) {
      alert("Please complete Year, Make, and Model.");
      return;
    }

    Storage.saveVehicle({ year, make, model });

    // Build the base slug
    const slug = `${year}-${make}-${model}`.toLowerCase().replace(/\s+/g, "-");
    let url = `https://partifyusa.com/collections/${slug}`;

    // If product type is selected, add it as a query param
    if (productType) {
      const encodedType = encodeURIComponent(productType).replace(/%20/g, "+");
      url += `?filter.p.product_type=${encodedType}`;
    }

    console.log("Redirecting to:", url);
    window.open(url, "_blank");

    this.close();
  }
}

// Video Management
class VideoManager {
  constructor() {
    this.placeholder = document.getElementById("videoPlaceholder");
    this.playButton = document.getElementById("playButton");
    this.videoFrame = document.getElementById("videoFrame");
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    if (this.playButton) {
      this.playButton.addEventListener("click", () => this.playVideo());
    }
  }

  playVideo() {
    if (this.placeholder && this.videoFrame) {
      // Hide placeholder and show video
      this.placeholder.style.display = "none";
      this.videoFrame.style.display = "block";

      // Set video source with autoplay
      this.videoFrame.src =
        "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0";
    }
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.observeElements();
  }

  observeElements() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll(".video-content > *");
    animatedElements.forEach((el) => {
      if (!el.style.animationName) {
        // Don't interfere with existing animations
        el.style.opacity = "0";
        el.style.transform = "translateY(2rem)";
        el.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        observer.observe(el);
      }
    });
  }
}

// Newsletter Management
class NewsletterManager {
  constructor() {
    this.form = document.querySelector(".newsletter-form");
    this.input = document.querySelector(".newsletter-input");
    this.button = document.querySelector(".newsletter-btn");
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    if (this.button) {
      this.button.addEventListener("click", (e) => this.handleSubmit(e));
    }

    if (this.input) {
      this.input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.handleSubmit(e);
        }
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.input || !this.input.value.trim()) {
      this.showMessage("Please enter your email address.", "error");
      return;
    }

    if (!this.isValidEmail(this.input.value)) {
      this.showMessage("Please enter a valid email address.", "error");
      return;
    }

    // Simulate API call
    this.button.textContent = "Subscribing...";
    this.button.disabled = true;

    setTimeout(() => {
      this.showMessage("Thank you for subscribing!", "success");
      this.input.value = "";
      this.button.textContent = "Subscribe";
      this.button.disabled = false;
    }, 1000);
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showMessage(message, type) {
    // Create or update message element
    let messageEl = document.querySelector(".newsletter-message");
    if (!messageEl) {
      messageEl = document.createElement("div");
      messageEl.className = "newsletter-message";
      this.form.appendChild(messageEl);
    }

    messageEl.textContent = message;
    messageEl.className = `newsletter-message ${type}`;
    messageEl.style.cssText = `
            margin-top: 1rem;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            text-align: center;
            ${
              type === "success"
                ? "background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2);"
                : "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);"
            }
        `;

    // Remove message after 3 seconds
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, 3000);
  }
}

// Smooth Scrolling for Anchor Links
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }
}

// Performance Optimization
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.preloadCriticalResources();
  }

  lazyLoadImages() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }

  preloadCriticalResources() {
    // Preload critical fonts
    const fontLink = document.createElement("link");
    fontLink.rel = "preload";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
    fontLink.as = "style";
    document.head.appendChild(fontLink);
  }
}

// Initialize Application
class App {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.initializeComponents()
      );
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    // Initialize all components
    this.themeManager = new ThemeManager();
    this.modalManager = new ModalManager();
    this.videoManager = new VideoManager();
    this.scrollAnimations = new ScrollAnimations();
    this.newsletterManager = new NewsletterManager();
    this.smoothScroll = new SmoothScroll();
    this.performanceOptimizer = new PerformanceOptimizer();

    // Add loading complete class
    document.body.classList.add("loaded");

    console.log("AutoParts website initialized successfully!");
  }
}

// Start the application
new App();
