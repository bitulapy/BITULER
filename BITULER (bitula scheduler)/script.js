document.addEventListener('DOMContentLoaded', () => {
    const themeSelector = document.getElementById('themeSelector');
    const daysContainer = document.getElementById('daysContainer');
    const scheduleList = document.getElementById('scheduleList');
    const startDateInput = document.getElementById('startDate');
    const dateRangeDisplay = document.getElementById('dateRangeDisplay');
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarPlaceholder = document.getElementById('avatarPlaceholder');
    const downloadBtn = document.getElementById('downloadBtn');
    const channelInput = document.getElementById('channelInput');
    const channelNameDisplay = document.getElementById('channelNameDisplay');

    // Theme Setup
    document.body.className = 'theme-cyberpunk';
    themeSelector.addEventListener('change', (e) => {
        document.body.className = `theme-${e.target.value}`;
    });

    // Default Hari
    const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    let currentDates = [];

    // Format Tanggal (DD/MM)
    const formatDate = (date) => {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${d}/${m}`;
    };

    // Format Tanggal Panjang (MMM DD)
    const formatLongDate = (date) => {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}`;
    };

    // Inisialisasi 7 Hari
    const initializeDays = () => {
        daysContainer.innerHTML = '';
        scheduleList.innerHTML = '';
        currentDates = [];

        // Set default start date ke hari ini
        const today = new Date();
        startDateInput.value = today.toISOString().split('T')[0];

        generateSchedule(today);
    };

    const generateSchedule = (startDate) => {
        daysContainer.innerHTML = '';
        scheduleList.innerHTML = '';
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
            const dayInput = document.createElement('div');
            dayInput.className = 'day-item-input';
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
            const dayRow = document.createElement('div');
            dayRow.className = 'day-row';
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
            document.getElementById(`time-${i}`).addEventListener('input', (e) => {
                document.getElementById(`preview-time-${i}`).textContent = `${e.target.value} WIB`;
            });

            document.getElementById(`activity-${i}`).addEventListener('input', (e) => {
                document.getElementById(`preview-activity-${i}`).textContent = e.target.value.toUpperCase();
            });

            document.getElementById(`off-${i}`).addEventListener('change', (e) => {
                const previewRow = document.getElementById(`preview-row-${i}`);
                if (e.target.checked) {
                    previewRow.classList.add('is-rest');
                    document.getElementById(`preview-activity-${i}`).textContent = 'REST DAY';
                } else {
                    previewRow.classList.remove('is-rest');
                    const currentActivity = document.getElementById(`activity-${i}`).value;
                    document.getElementById(`preview-activity-${i}`).textContent = currentActivity ? currentActivity.toUpperCase() : '???';
                }
            });
        }
    };

    // Event Listener: Change Start Date
    startDateInput.addEventListener('change', (e) => {
        if (e.target.value) {
            generateSchedule(new Date(e.target.value));
        }
    });

    // Event Listener: Upload Avatar
    avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                avatarPreview.src = event.target.result;
                avatarPreview.style.display = 'block';
                avatarPlaceholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Event Listener: Channel Input
    channelInput.addEventListener('input', (e) => {
        channelNameDisplay.textContent = e.target.value.toUpperCase() || 'YOUR CHANNEL';
    });

    // Event Listener: Download Schedule Image
    downloadBtn.addEventListener('click', () => {
        const canvasElement = document.getElementById('scheduleCanvas');

        // Simpan transform sementara
        const originalTransform = canvasElement.style.transform;

        // Reset transform to none so html2canvas captures full 1920x1080
        canvasElement.style.transform = 'none';

        // Sedikit timeout agar browser me-render ukuran aslinya terlebih dahulu
        setTimeout(() => {
            const computedBg = getComputedStyle(canvasElement).backgroundColor;
            html2canvas(canvasElement, {
                scale: 1, // Ekstra kualitas (bisa ditingkatkan misal scale: 2 kalau ingin sangat tajam)
                backgroundColor: computedBg, // Menggunakan background warna tema aktif
                logging: false,
                useCORS: true
            }).then((canvas) => {
                // Kembalikan ukuran aslinya di UI
                canvasElement.style.transform = originalTransform;

                // Buat link download
                const link = document.createElement('a');
                link.download = `Bituler_Schedule_${new Date().getTime()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }, 100);
    });

    // Start App
    initializeDays();
});
