document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "index.html"; // Redirect to login if not logged in
    } else {
        // Display user's name
        document.querySelector("h1").textContent = `Welcome, ${user.name}`;
    }

    // Modal handling
    const bookAppointmentLink = document.getElementById("book-appointment-link");
    const emergencyDiagnosisLink = document.getElementById("emergency-diagnosis-link");
    const viewPrescriptionsLink = document.getElementById("view-prescriptions-link");

    const bookAppointmentModal = document.getElementById("book-appointment-modal");
    const emergencyDiagnosisModal = document.getElementById("emergency-diagnosis-modal");
    const viewPrescriptionsModal = document.getElementById("view-prescriptions-modal");

    const modals = [bookAppointmentModal, emergencyDiagnosisModal, viewPrescriptionsModal];

    // Function to open a modal
    function openModal(modal) {
        modal.style.display = "flex";
    }

    // Function to close a modal
    function closeModal(modal) {
        modal.style.display = "none";
    }

    // Click events to open modals
    bookAppointmentLink.addEventListener("click", function () {
        openModal(bookAppointmentModal);
    });

    emergencyDiagnosisLink.addEventListener("click", function () {
        openModal(emergencyDiagnosisModal);
    });

    viewPrescriptionsLink.addEventListener("click", function () {
        openModal(viewPrescriptionsModal);
        loadPrescriptions(); // Load prescriptions when viewing
    });

    // Click events to close modals when clicking outside the modal content
    modals.forEach(modal => {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
});

// Appointment booking and confirmation handling
document.addEventListener("DOMContentLoaded", function () {
    const physicianSelect = document.getElementById("physician-select");
    const dateInput = document.getElementById("appointment-date");
    const timeSelect = document.getElementById("appointment-time");
    const confirmButton = document.getElementById("confirm-appointment");
    const confirmationMessage = document.getElementById("confirmation-message");
    const confirmedPhysician = document.getElementById("confirmed-physician");
    const confirmedDate = document.getElementById("confirmed-date");
    const confirmedTime = document.getElementById("confirmed-time");

    confirmButton.addEventListener("click", function () {
        const physician = physicianSelect.options[physicianSelect.selectedIndex].text;
        const date = dateInput.value;
        const time = timeSelect.options[timeSelect.selectedIndex].text;

        if (physician && date && time) {
            confirmedPhysician.textContent = physician;
            confirmedDate.textContent = new Date(date).toDateString();
            confirmedTime.textContent = time;
            confirmationMessage.style.display = "block"; // Show confirmation message

            // Save the appointment
            saveAppointment(physician, date, time);

            // Clear input fields
            physicianSelect.value = "";
            dateInput.value = "";
            timeSelect.value = "";
        } else {
            alert("Please select a physician, date, and time.");
        }
    });

    // Save appointment receipt to localStorage
    function saveAppointment(physician, date, time) {
        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        const newAppointment = {
            id: Date.now(),
            physician: physician,
            date: new Date(date).toDateString(),
            time: time
        };
        appointments.push(newAppointment);
        localStorage.setItem("appointments", JSON.stringify(appointments));
    }

    // Print the latest appointment receipt
    function printLatestAppointment() {
        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        if (appointments.length > 0) {
            const latestAppointment = appointments[appointments.length - 1]; // Get the latest appointment
            let printWindow = window.open("", "", "width=600,height=400");
            printWindow.document.write(`
                <html>
                <head><title>Print Appointment</title></head>
                <body>
                <h2>Appointment Confirmation</h2>
                <p><strong>Physician:</strong> ${latestAppointment.physician}</p>
                <p><strong>Date:</strong> ${latestAppointment.date}</p>
                <p><strong>Time:</strong> ${latestAppointment.time}</p>
                <button onclick="window.print()">Print this receipt</button>
                </body>
                </html>
            `);
            printWindow.document.close();
        } else {
            alert("No appointments to print.");
        }
    }
});

// Emergency Diagnosis handling and dynamically adding prescriptions
document.addEventListener("DOMContentLoaded", function () {
    const symptomsInput = document.getElementById("symptoms-input");
    const diagnoseButton = document.getElementById("diagnose-button");
    const diagnosisResult = document.getElementById("diagnosis-result");
    const diagnosisText = document.getElementById("diagnosis-text");
    const recommendedMedication = document.getElementById("recommended-medication");

    const prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];

    diagnoseButton.addEventListener("click", function () {
        const symptoms = symptomsInput.value.trim();
        let diagnosis, medication;

        if (symptoms) {
            if (symptoms.toLowerCase().includes("fever") && symptoms.toLowerCase().includes("cough")) {
                diagnosis = "Possible Flu";
                medication = "Paracetamol, Rest, and Hydration";
            } else if (symptoms.toLowerCase().includes("headache") && symptoms.toLowerCase().includes("dizziness")) {
                diagnosis = "Possible Migraine";
                medication = "Ibuprofen, Avoid Bright Lights";
            } else if (symptoms.toLowerCase().includes("headache") && symptoms.toLowerCase().includes("fever")) {
                diagnosis = "Possible Malaria";
                medication = "Ameten softgel, Paracetamol,and Rest";
            } else {
                diagnosis = "Unknown condition";
                medication = "Consult a physician for a proper diagnosis";
            }

            diagnosisText.textContent = diagnosis;
            recommendedMedication.textContent = medication;
            diagnosisResult.style.display = "block";

            // Add a prescription to the list
            if (diagnosis !== "Unknown condition") {
                const newPrescription = {
                    id: Date.now(), // Generate unique ID
                    date: new Date().toLocaleDateString(),
                    diagnosis: diagnosis,
                    medication: medication,
                    dosage: diagnosis === "Possible Flu" ? "Take 1 tablet every 4-6 hours" : "Take 1 tablet every 6-8 hours"
                };
                prescriptions.push(newPrescription);
                localStorage.setItem("prescriptions", JSON.stringify(prescriptions)); // Save to localStorage
            }

            // Clear input fields
            symptomsInput.value = "";
        } else {
            alert("Please enter your symptoms.");
        }
    });
});

// Load and render prescriptions
function loadPrescriptions() {
    const prescriptionsList = document.getElementById("prescriptions-list");
    prescriptionsList.innerHTML = ""; // Clear existing list
    const prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];

    if (prescriptions.length > 0) {
        prescriptions.forEach(prescription => {
            const prescriptionDiv = document.createElement("div");
            prescriptionDiv.classList.add("bg-white", "p-6", "rounded-lg", "shadow-lg", "mb-4");

            prescriptionDiv.innerHTML = `
                <h2 class="text-xl font-semibold mb-2">Prescription #${prescription.id}</h2>
                <p><strong>Diagnosis:</strong> ${prescription.diagnosis}</p>
                <p>Date Issued: <span class="text-gray-600">${prescription.date}</span></p>
                <p>Medication: <span class="text-gray-600">${prescription.medication}</span></p>
                <p>Dosage: <span class="text-gray-600">${prescription.dosage}</span></p>
                <div class="mt-4 flex space-x-4">
                    <button class="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700" onclick="printPrescription(${prescription.id})">Print</button>
                    <button class="bg-green-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-700" onclick="downloadPrescription(${prescription.id})">Download</button>
                </div>
            `;

            prescriptionsList.appendChild(prescriptionDiv);
        });
    } else {
        prescriptionsList.innerHTML = "<p>No prescriptions available.</p>";
    }
}

// Print prescription by id
function printPrescription(prescriptionId) {
    const prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
    const prescription = prescriptions.find(p => p.id === prescriptionId);

    if (prescription) {
        let printWindow = window.open("", "", "width=600,height=400");
        printWindow.document.write(`
            <html>
            <head><title>Print Prescription</title></head>
            <body>
            <h2>Prescription #${prescription.id}</h2>
            <p><strong>Diagnosis:</strong> ${prescription.diagnosis}</p>
            <p><strong>Date Issued:</strong> ${prescription.date}</p>
            <p><strong>Medication:</strong> ${prescription.medication}</p>
            <p><strong>Dosage:</strong> ${prescription.dosage}</p>
            <button onclick="window.print()">Print this prescription</button>
            </body>
            </html>
        `);
        printWindow.document.close();
    } else {
        alert("Prescription not found.");
    }
}

// Download prescription as a file
function downloadPrescription(prescriptionId) {
    const prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
    const prescription = prescriptions.find(p => p.id === prescriptionId);

    if (prescription) {
        const element = document.createElement("a");
        const file = new Blob([`
            Prescription #${prescription.id}
            Diagnosis: ${prescription.diagnosis}
            Date Issued: ${prescription.date}
            Medication: ${prescription.medication}
            Dosage: ${prescription.dosage}
        `], { type: "text/plain" });

        element.href = URL.createObjectURL(file);
        element.download = `prescription_${prescription.id}.txt`;
        document.body.appendChild(element);
        element.click();
    } else {
        alert("Prescription not found.");
    }
}