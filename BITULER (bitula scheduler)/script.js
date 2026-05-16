document.addEventListener("DOMContentLoaded", () => {
  const themeSelector = document.getElementById("themeSelector");
  const daysContainer = document.getElementById("daysContainer");
  const scheduleList = document.getElementById("scheduleList");
  const startDateInput = document.getElementById("startDate");
  const dateRangeDisplay = document.getElementById("dateRangeDisplay");
  const avatarUpload = document.getElementById("avatarUpload");
  const avatarPreview = document.getElementById("avatarPreview");
  const avatarPlaceholder = document.getElementById("avatarPlaceholder");
  const downloadBtn = document.getElementById("downloadBtn");
  const channelInput = document.getElementById("channelInput");
  const channelNameDisplay = document.getElementById("channelNameDisplay");

  // Theme Setup
  document.body.className = "theme-cyberpunk";
  themeSelector.addEventListener("change", (e) => {
    document.body.className = `theme-${e.target.value}`;
  });

  // Default Hari
  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  let currentDates = [];

  // Format Tanggal (DD/MM)
  const formatDate = (date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${d}/${m}`;
  };

  // Format Tanggal Panjang (MMM DD)
  const formatLongDate = (date) => {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, "0")}`;
  };

  // Inisialisasi 7 Hari
  const initializeDays = () => {
    daysContainer.innerHTML = "";
    scheduleList.innerHTML = "";
    currentDates = [];

    // Set default start date ke hari ini
    const today = new Date();
    startDateInput.value = today.toISOString().split("T")[0];

    generateSchedule(today);
  };

  const generateSchedule = (startDate) => {
    daysContainer.innerHTML = "";
    scheduleList.innerHTML = "";
    currentDates = [];

    // Update Header Date Range
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    dateRangeDisplay.textContent = `${formatLongDate(startDate)} - ${formatLongDate(endDate)}`;

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      currentDates.push(currentDate);

      // Create Input Form
      const dayInput = document.createElement("div");
      dayInput.className = "day-item-input";
      dayInput.innerHTML = `
                <div class="day-item-header">
                    <span class="day-item-name">${dayNames[i]}</span>
                    <span class="day-item-date">${formatDate(currentDate)}</span>
                </div>
                <div class="form-group">
                    <input type="time" id="time-${i}" value="19:00">
                </div>
                <div class="form-group">
                    <input type="text" id="activity-${i}" placeholder="INSERT ACTIVITY">
                </div>
                <label class="off-day-toggle">
                    <input type="checkbox" id="off-${i}">
                    <span>REST DAY / OFF</span>
                </label>
            `;
      daysContainer.appendChild(dayInput);

      // Create Preview Row
      const dayRow = document.createElement("div");
      dayRow.className = "day-row";
      dayRow.id = `preview-row-${i}`;
      dayRow.innerHTML = `
                <div class="day-info">
                    <div class="day-name">${dayNames[i]}</div>
                    <div class="day-date">${formatDate(currentDate)}</div>
                </div>
                <div class="time-info" id="preview-time-${i}">19:00 WIB</div>
                <div class="activity-info" id="preview-activity-${i}">???</div>
            `;
      scheduleList.appendChild(dayRow);

      // Add Event Listeners for real-time update
      document.getElementById(`time-${i}`).addEventListener("input", (e) => {
        document.getElementById(`preview-time-${i}`).textContent =
          `${e.target.value} WIB`;
      });

      document
        .getElementById(`activity-${i}`)
        .addEventListener("input", (e) => {
          document.getElementById(`preview-activity-${i}`).textContent =
            e.target.value.toUpperCase();
        });

      document.getElementById(`off-${i}`).addEventListener("change", (e) => {
        const previewRow = document.getElementById(`preview-row-${i}`);
        if (e.target.checked) {
          previewRow.classList.add("is-rest");
          document.getElementById(`preview-activity-${i}`).textContent =
            "REST DAY";
        } else {
          previewRow.classList.remove("is-rest");
          const currentActivity = document.getElementById(
            `activity-${i}`,
          ).value;
          document.getElementById(`preview-activity-${i}`).textContent =
            currentActivity ? currentActivity.toUpperCase() : "???";
        }
      });
    }
  };

  // Event Listener: Change Start Date
  startDateInput.addEventListener("change", (e) => {
    if (e.target.value) {
      generateSchedule(new Date(e.target.value));
    }
  });

  // --- Image controls ---
  const avatarArea = document.querySelector(".avatar-area");
  const zoomControlGroup = document.getElementById("zoomControlGroup");
  const zoomSlider = document.getElementById("zoomSlider");
  const zoomValue = document.getElementById("zoomValue");
  const zoomInBtn = document.getElementById("zoomIn");
  const zoomOutBtn = document.getElementById("zoomOut");
  // pan
  const panXSlider = document.getElementById("panXSlider");
  const panYSlider = document.getElementById("panYSlider");
  const panLeftBtn = document.getElementById("panLeft");
  const panRightBtn = document.getElementById("panRight");
  const panUpBtn = document.getElementById("panUp");
  const panDownBtn = document.getElementById("panDown");
  // rotate
  const rotateLeftBtn = document.getElementById("rotateLeft");
  const rotateRightBtn = document.getElementById("rotateRight");
  const rotateSlider = document.getElementById("rotateSlider");

  // Canvas scale factor (must match CSS transform: scale(0.45))
  const CANVAS_SCALE = 0.45;

  let currentZoom = 100;
  let offsetX = 0; // horizontal offset from center (canvas px)
  let offsetY = 0; // vertical offset from bottom   (canvas px, positive = up)
  let rotate = 0; // vertical offset from bottom   (canvas px, positive = up)

  // Apply calculated position + size to the img element
  const applyAvatarTransform = () => {
    if (!avatarPreview.naturalWidth) return;

    const areaW = avatarArea.clientWidth || 500;
    const areaH = avatarArea.clientHeight || 500;
    const imgW = avatarPreview.naturalWidth;
    const imgH = avatarPreview.naturalHeight;

    // Fit-to-contain base scale, then multiply by zoom
    const baseScale = Math.min(areaW / imgW, areaH / imgH);
    const finalScale = baseScale * (currentZoom / 100);
    const pxW = imgW * finalScale;
    const pxH = imgH * finalScale;

    // Symmetric horizontal centering + user offset
    const centerLeft = (areaW - pxW) / 2;
    avatarPreview.style.width = pxW + "px";
    avatarPreview.style.height = pxH + "px";
    avatarPreview.style.left = centerLeft + offsetX + "px";
    avatarPreview.style.bottom = offsetY + "px";
    avatarPreview.style.right = "auto";
    avatarPreview.style.rotate = rotate + "deg";
  };

  const applyZoom = (zoom) => {
    currentZoom = Math.min(250, Math.max(50, zoom));
    zoomSlider.value = currentZoom;
    zoomValue.textContent = `${currentZoom}%`;
    applyAvatarTransform();
  };

  const applyPan = (dx, dy) => {
    offsetX = Math.max(-800, Math.min(800, offsetX + dx));
    offsetY = Math.max(-800, Math.min(800, offsetY + dy));
    panXSlider.value = offsetX;
    panYSlider.value = offsetY;
    applyAvatarTransform();
  };

  const applyRotate = (r) => {
    rotate = r;
    rotateSlider.value = rotate;
    applyAvatarTransform();
  };
  // Event Listener: Upload Avatar
  avatarUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        avatarPreview.src = event.target.result;
        avatarPreview.onload = () => {
          avatarPreview.style.display = "block";
          avatarPlaceholder.style.display = "none";
          zoomControlGroup.classList.add("visible");
          // Reset position & zoom on new image
          offsetX = 0;
          offsetY = 0;
          panXSlider.value = 0;
          panYSlider.value = 0;
          rotateSlider.value = 0;
          applyZoom(100);
        };
      };
      reader.readAsDataURL(file);
    }
  });

  // Zoom slider & buttons
  zoomSlider.addEventListener("input", () =>
    applyZoom(parseInt(zoomSlider.value)),
  );
  zoomInBtn.addEventListener("click", () => applyZoom(currentZoom + 10));
  zoomOutBtn.addEventListener("click", () => applyZoom(currentZoom - 10));
  rotateLeftBtn.addEventListener("click", () => applyRotate(rotate - 1));
  rotateRightBtn.addEventListener("click", () => applyRotate(rotate + 1));

  // Pan sliders
  panXSlider.addEventListener("input", () => {
    offsetX = parseInt(panXSlider.value);
    applyAvatarTransform();
  });
  panYSlider.addEventListener("input", () => {
    offsetY = parseInt(panYSlider.value);
    applyAvatarTransform();
  });
  rotateSlider.addEventListener("input", () => {
    rotate = parseInt(rotateSlider.value);
    applyAvatarTransform();
  });

  // Pan arrow buttons (20px step)
  panLeftBtn.addEventListener("click", () => applyPan(-20, 0));
  panRightBtn.addEventListener("click", () => applyPan(20, 0));
  panUpBtn.addEventListener("click", () => applyPan(0, 20));
  panDownBtn.addEventListener("click", () => applyPan(0, -20));

  // Drag to reposition (mouse)
  let isDragging = false,
    dragStartX = 0,
    dragStartY = 0,
    dragStartOffsetX = 0,
    dragStartOffsetY = 0;

  avatarPreview.addEventListener("mousedown", (e) => {
    if (avatarPreview.style.display === "none") return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartOffsetX = offsetX;
    dragStartOffsetY = offsetY;
    avatarPreview.classList.add("is-dragging");
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    // Divide by CANVAS_SCALE to convert screen px → canvas px
    const dx = (e.clientX - dragStartX) / CANVAS_SCALE;
    const dy = (e.clientY - dragStartY) / CANVAS_SCALE;
    offsetX = dragStartOffsetX + dx;
    offsetY = dragStartOffsetY - dy; // invert Y: drag up → image moves up
    panXSlider.value = Math.round(offsetX);
    panYSlider.value = Math.round(offsetY);
    applyAvatarTransform();
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      avatarPreview.classList.remove("is-dragging");
    }
  });

  // Event Listener: Channel Input
  channelInput.addEventListener("input", (e) => {
    channelNameDisplay.textContent =
      e.target.value.toUpperCase() || "YOUR CHANNEL";
  });

  // Event Listener: Download Schedule Image
  downloadBtn.addEventListener("click", () => {
    const canvasElement = document.getElementById("scheduleCanvas");

    // Simpan transform sementara
    const originalTransform = canvasElement.style.transform;

    // Reset transform to none so html2canvas captures full 1920x1080
    canvasElement.style.transform = "none";

    // Sedikit timeout agar browser me-render ukuran aslinya terlebih dahulu
    setTimeout(() => {
      const computedBg = getComputedStyle(canvasElement).backgroundColor;
      html2canvas(canvasElement, {
        scale: 1, // Ekstra kualitas (bisa ditingkatkan misal scale: 2 kalau ingin sangat tajam)
        backgroundColor: computedBg, // Menggunakan background warna tema aktif
        logging: false,
        useCORS: true,
      }).then((canvas) => {
        // Kembalikan ukuran aslinya di UI
        canvasElement.style.transform = originalTransform;

        // Buat link download
        const link = document.createElement("a");
        link.download = `Bituler_Schedule_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }, 100);
  });

  // Start App
  initializeDays();
});
