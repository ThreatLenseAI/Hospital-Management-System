let patients = JSON.parse(localStorage.getItem("patients")) || [];
let doctors = JSON.parse(localStorage.getItem("doctors")) || [];
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let bills = JSON.parse(localStorage.getItem("bills")) || [];

function saveData() {
    localStorage.setItem("patients", JSON.stringify(patients));
    localStorage.setItem("doctors", JSON.stringify(doctors));
    localStorage.setItem("appointments", JSON.stringify(appointments));
    localStorage.setItem("bills", JSON.stringify(bills));
}

function showSection(id) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");
}

function addPatient() {
    let name = document.getElementById("patientName").value.trim();
    let age = Number(document.getElementById("patientAge").value);
    let mobile = document.getElementById("patientMobile").value.trim();
    let disease = document.getElementById("patientDisease").value.trim();

    if (!name || !age || age < 1 || age > 120 ||
        !/^[0-9]{10}$/.test(mobile) || !disease) {
        alert("Enter valid patient details");
        return;
    }

    patients.push({
        id: Date.now(),
        name, age, mobile, disease
    });

    saveData();
    displayData();

    document.getElementById("patientName").value = "";
    document.getElementById("patientAge").value = "";
    document.getElementById("patientMobile").value = "";
    document.getElementById("patientDisease").value = "";

    alert("Patient added successfully!");
}

function addDoctor() {
    let name = document.getElementById("doctorName").value.trim();
    let speciality = document.getElementById("doctorSpeciality").value.trim();
    let mobile = document.getElementById("doctorMobile").value.trim();

    if (!name || !speciality || !/^[0-9]{10}$/.test(mobile)) {
        alert("Enter valid doctor details");
        return;
    }

    doctors.push({
        id: Date.now(),
        name, speciality, mobile
    });

    saveData();
    displayData();

    alert("Doctor added successfully!");
}

function addAppointment() {
    let patient = document.getElementById("appointmentPatient").value.trim();
    let doctor = document.getElementById("appointmentDoctor").value.trim();
    let date = document.getElementById("appointmentDate").value;
    let time = document.getElementById("appointmentTime").value;

    if (!patient || !doctor || !date || !time) {
        alert("Fill all appointment details");
        return;
    }

    appointments.push({
        id: Date.now(),
        patient, doctor, date, time
    });

    saveData();
    displayData();

    alert("Appointment booked successfully!");
}

function addBill() {
    let patient = document.getElementById("billPatient").value.trim();
    let amount = Number(document.getElementById("billAmount").value);

    if (!patient || !Number.isFinite(amount) || amount <= 0) {
        alert("Enter valid billing details");
        return;
    }

    bills.push({
        id: Date.now(),
        patient, amount
    });

    saveData();
    displayData();

    alert("Bill generated successfully!");
}

function deleteRecord(type, id) {
    if (!confirm("Are you sure you want to delete this record?")) {
        return;
    }

    if (type === "patients") {
        patients = patients.filter(item => item.id !== id);
    }

    if (type === "doctors") {
        doctors = doctors.filter(item => item.id !== id);
    }

    if (type === "appointments") {
        appointments = appointments.filter(item => item.id !== id);
    }

    if (type === "bills") {
        bills = bills.filter(item => item.id !== id);
    }

    saveData();
    displayData();
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function displayList(elementId, data, type, formatter) {
    document.getElementById(elementId).innerHTML = data.map(item => `
        <div class="item">
            ${formatter(item)}
            <br>
            <button onclick="deleteRecord('${type}', ${item.id})">
                Delete
            </button>
        </div>
    `).join("");
}

function displayData() {
    document.getElementById("patientCount").innerText = patients.length;
    document.getElementById("doctorCount").innerText = doctors.length;
    document.getElementById("appointmentCount").innerText = appointments.length;

    let total = bills.reduce((sum, bill) => sum + bill.amount, 0);

    document.getElementById("revenue").innerText =
        "₹" + total.toLocaleString("en-IN");

    displayList("patientList", patients, "patients", p =>
        `<b>${escapeHTML(p.name)}</b><br>
        Age: ${p.age}<br>
        Mobile: ${escapeHTML(p.mobile)}<br>
        Reason: ${escapeHTML(p.disease)}`
    );

    displayList("doctorList", doctors, "doctors", d =>
        `<b>${escapeHTML(d.name)}</b><br>
        Specialization: ${escapeHTML(d.speciality)}<br>
        Mobile: ${escapeHTML(d.mobile)}`
    );

    displayList("appointmentList", appointments, "appointments", a =>
        `<b>${escapeHTML(a.patient)}</b><br>
        Doctor: ${escapeHTML(a.doctor)}<br>
        Date: ${escapeHTML(a.date)}<br>
        Time: ${escapeHTML(a.time)}`
    );

    displayList("billList", bills, "bills", b =>
        `<b>${escapeHTML(b.patient)}</b><br>
        Amount: ₹${b.amount.toLocaleString("en-IN")}`
    );
}

displayData();
