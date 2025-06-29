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
  deleteVehicle(index) {
    const vehicles = this.getVehicles();
    vehicles.splice(index, 1);
    localStorage.setItem("savedVehicles", JSON.stringify(vehicles));
  },
  constructVehicleURL({ year, make, model }, productType = null) {
    const slug = `${year}-${make}-${model}`.toLowerCase().replace(/\s+/g, "-");
    let url = `https://partifyusa.com/collections/${slug}`;

    if (productType) {
      const encodedType = encodeURIComponent(productType).replace(/%20/g, "+");
      url += `?filter.p.product_type=${encodedType}`;
    }

    return url;
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
    this.currentView = "garage"; // 'garage' or 'form'
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupFormElements();
    this.setupFormElements();
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

  setupFormElements() {
    this.populateYears();
  }

  showGarageView() {
    this.currentView = "garage";
    const modalContent = document.querySelector(".modal");
    const savedVehicles = Storage.getVehicles();

    modalContent.innerHTML = `
      <!-- Header -->
      <div class="modal-header">
        <button class="modal-close" id="closeModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        
        <h2 class="modal-title">My Garage</h2>
      </div>

      <!-- Content -->
      <div class="modal-content">
        ${
          savedVehicles.length > 0
            ? this.renderVehicleList(savedVehicles)
            : this.renderEmptyGarage()
        }
      </div>
    `;

    // Re-bind close button event
    const newCloseBtn = document.getElementById("closeModal");
    if (newCloseBtn) {
      newCloseBtn.addEventListener("click", () => this.close());
    }

    // Bind vehicle and action events
    this.bindGarageEvents();
  }

  renderVehicleList(vehicles) {
    return `
      <div class="vehicle-list">
        ${vehicles
          .map(
            (vehicle, index) => `
          <div class="vehicle-item clickable" data-index="${index}">
            <div class="vehicle-info">
              <div class="vehicle-details">
                <h3 class="vehicle-title">${vehicle.year} ${vehicle.make} ${vehicle.model}</h3>
                <p class="vehicle-subtitle">Click to browse parts</p>
              </div>
              <div class="vehicle-actions">
                <button class="btn-vehicle-delete" data-index="${index}" onclick="event.stopPropagation()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
        
        <button class="btn-add-vehicle" id="addNewVehicle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add New Vehicle
        </button>
      </div>
    `;
  }
  /*
  renderEmptyGarage() {
    return `
      <div class="empty-garage">
        <div class="empty-garage-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
            <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
            <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"/>
          </svg>
        </div>
        <h3 class="empty-garage-title">No vehicles in your garage</h3>
        <p class="empty-garage-subtitle">Add your first vehicle to get started finding compatible parts</p>
        <button class="btn-add-vehicle" id="addNewVehicle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Your First Vehicle
        </button>
      </div>
    `;
  }
*/

  renderEmptyGarage() {
    return `
    <div class="vehicle-list">
      <div class="empty-garage">
        <div class="empty-garage-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
            <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
            <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"/>
          </svg>
        </div>
        <h3 class="empty-garage-title">No vehicles in your garage</h3>
        <p class="empty-garage-subtitle">Add your first vehicle to get started finding compatible parts</p>
      </div>
      <button class="btn-add-vehicle" id="addNewVehicle">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Your First Vehicle
      </button>
    </div>
  `;
  }

  showFormView() {
    this.currentView = "form";
    const modalContent = document.querySelector(".modal");
    const savedVehicles = Storage.getVehicles();

    modalContent.innerHTML = `
      <!-- Header -->
      <div class="modal-header">
        <button class="modal-close" id="closeModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        
        ${
          savedVehicles.length > 0
            ? `
        <button class="modal-back" id="backToGarage">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12,19 5,12 12,5"/>
          </svg>
        </button>
        `
            : ""
        }
        
        <h2 class="modal-title">Add Vehicle</h2>
      </div>

      <!-- Form -->
      <div class="modal-content">
        <form class="modal-form" id="vehicleForm">
          <div class="form-grid">
            <!-- Year -->
            <div class="form-group">
              <label class="form-label">
                <svg class="form-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Year
              </label>
              <select class="form-select" id="yearSelect" required>
                <option value="">Select Year</option>
              </select>
            </div>

            <!-- Make -->
            <div class="form-group">
              <label class="form-label">
                <svg class="form-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                  <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                  <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"/>
                </svg>
                Make
              </label>
              <select class="form-select" id="makeSelect" required disabled>
              </select>
            </div>

            <!-- Model -->
            <div class="form-group">
              <label class="form-label">
                <svg class="form-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Model
              </label>
              <select class="form-select" id="modelSelect" required disabled>
              </select>
            </div>

            <!-- Product Type -->
            <div class="form-group">
              <label class="form-label">
                <svg class="form-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
                Product Type
              </label>
              <select class="form-select" id="productTypeSelect" disabled>
              </select>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="form-submit" disabled>
            Add Vehicle & Find Parts
          </button>
        </form>
      </div>
    `;

    // Re-bind events
    const newCloseBtn = document.getElementById("closeModal");
    const backBtn = document.getElementById("backToGarage");
    const newForm = document.getElementById("vehicleForm");

    if (newCloseBtn) {
      newCloseBtn.addEventListener("click", () => this.close());
    }

    if (backBtn) {
      backBtn.addEventListener("click", () => this.showGarageView());
    }

    if (newForm) {
      newForm.addEventListener("submit", (e) => this.handleSubmit(e));
    }

    // Setup form functionality
    this.setupFormElements();
  }

  bindGarageEvents() {
    // Add new vehicle button
    const addBtn = document.getElementById("addNewVehicle");
    if (addBtn) {
      addBtn.addEventListener("click", () => this.showFormView());
    }

    // Make entire vehicle items clickable
    document.querySelectorAll(".vehicle-item.clickable").forEach((item) => {
      item.addEventListener("click", (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this.selectVehicle(index);
      });
    });

    // Vehicle delete buttons
    document.querySelectorAll(".btn-vehicle-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent triggering the vehicle selection
        const index = parseInt(e.currentTarget.dataset.index);
        this.deleteVehicle(index);
      });
    });
  }

  selectVehicle(index) {
    const vehicles = Storage.getVehicles();
    const vehicle = vehicles[index];

    if (vehicle) {
      const url = Storage.constructVehicleURL(vehicle);
      console.log("Redirecting to:", url);
      window.open(url, "_blank");
      this.close();
    }
  }

  deleteVehicle(index) {
    if (
      confirm("Are you sure you want to remove this vehicle from your garage?")
    ) {
      Storage.deleteVehicle(index);
      this.showGarageView(); // Refresh the view
    }
  }

  populateYears() {
    const yearSelect = document.getElementById("yearSelect");
    const makeSelect = document.getElementById("makeSelect");
    const modelSelect = document.getElementById("modelSelect");
    const productTypeSelect = document.getElementById("productTypeSelect");
    const submitBtn = document.querySelector(".form-submit");

    if (!yearSelect) return;

    if (!yearSelect) return;

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
      submitBtn.disabled = false; // Enable submit when model is selected
      submitBtn.disabled = false; // Enable submit when model is selected

      if (selectedModel) {
        this.populateProductTypes(selectedYear, selectedMake, selectedModel);
        productTypeSelect.disabled = false;
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

      // Show garage view by default
      this.showGarageView();
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

    // Save vehicle to localStorage
    Storage.saveVehicle({ year, make, model });

    // Build URL and navigate
    const url = Storage.constructVehicleURL({ year, make, model }, productType);
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

new App();
