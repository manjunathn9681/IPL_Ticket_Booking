let prices = [
    [1000, 2500, 5000],
    [1200, 2800, 5500],
    [900, 2200, 4500],
    [1200, 3000, 6000]
];

let teams = [
    "RCB vs CSK",
    "MI vs KKR",
    "SRH vs RR",
    "CSK vs MI"
];

function selectMatch(number) {
    document.getElementById("match").value = number;
    calculate();
    document.getElementById("booking").scrollIntoView();
}

function filterMatches() {
    let team = document.getElementById("teamFilter").value;
    let rows = document.querySelectorAll("#schedule tr");
    let cards = document.querySelectorAll(".match-card");

    for (let i = 1; i < rows.length; i++) {
        rows[i].style.display =
            team === "All" || rows[i].cells[1].innerText.includes(team) ? "" : "none";
    }

    cards.forEach(function(card) {
        card.style.display = team === "All" || card.innerText.includes(team) ? "" : "none";
    });
}

function createScheduleCards() {
    let rows = document.querySelectorAll("#schedule tr");
    let cardsContainer = document.getElementById("scheduleCards");

    for (let i = 1; i < rows.length; i++) {
        let cells = rows[i].cells;
        let card = document.createElement("article");
        card.className = "match-card";
        card.innerHTML =
            "<h3>Match " + cells[0].innerText + ": " + cells[1].innerText + "</h3>" +
            "<p><strong>Date &amp; Time:</strong> " + cells[2].innerText + "</p>" +
            "<p><strong>Venue:</strong> " + cells[3].innerText + "</p>" +
            "<p><strong>General:</strong> ₹" + cells[4].innerText + "</p>" +
            "<p><strong>Premium:</strong> ₹" + cells[5].innerText + "</p>" +
            "<p><strong>VIP:</strong> ₹" + cells[6].innerText + "</p>";

        let button = document.createElement("button");
        button.type = "button";
        button.innerText = "Book";
        button.onclick = function() {
            selectMatch(cells[0].innerText);
        };
        card.appendChild(button);
        cardsContainer.appendChild(card);
    }
}

function calculate() {
    let match = document.getElementById("match").value;
    let stand = document.getElementById("stand").value;
    let quantity = Number(document.getElementById("quantity").value) || 0;
    let categories = ["General", "Premium", "VIP"];
    let price = match && stand ? prices[match - 1][categories.indexOf(stand)] : 0;

    document.getElementById("sMatch").innerText = match ? teams[match - 1] : "Not Selected";
    document.getElementById("sStand").innerText = stand || "Not Selected";
    document.getElementById("sPrice").innerText = price;
    document.getElementById("sQuantity").innerText = quantity;
    document.getElementById("sTotal").innerText = price * quantity;
}

function displayBookings() {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let table = document.getElementById("bookingList");

    table.innerHTML = "";

    if (bookings.length === 0) {
        table.innerHTML = "<tr><td colspan='6'>No bookings available yet.</td></tr>";
    }

    bookings.forEach(function(booking) {
        let row = table.insertRow();

        [booking.id, booking.name, booking.match, booking.stand, booking.quantity, "₹" + booking.total]
            .forEach(function(value) {
                row.insertCell().innerText = value;
            });
    });
}

document.getElementById("hamburger").onclick = function() {
    let navMenu = document.getElementById("navMenu");
    navMenu.classList.toggle("active");
    this.setAttribute("aria-expanded", navMenu.classList.contains("active"));
};

document.getElementById("teamFilter").onchange = filterMatches;

document.getElementById("viewToggle").onclick = function() {
    let matchesSection = document.getElementById("matches");
    matchesSection.classList.toggle("card-view");
    this.innerText = matchesSection.classList.contains("card-view")
        ? "Show table view"
        : "Show card view";
};

document.getElementById("match").onchange = calculate;
document.getElementById("stand").onchange = calculate;
document.getElementById("quantity").oninput = calculate;

document.getElementById("bookingForm").onsubmit = function(event) {
    event.preventDefault();

    let match = document.getElementById("match").value;
    let stand = document.getElementById("stand").value;
    let quantity = Number(document.getElementById("quantity").value);
    let name = document.getElementById("name").value;
    let categories = ["General", "Premium", "VIP"];
    let price = prices[match - 1][categories.indexOf(stand)];
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    bookings.push({
        id: "IPL" + Date.now(),
        name: name,
        match: teams[match - 1],
        stand: stand,
        quantity: quantity,
        total: price * quantity
    });

    localStorage.setItem("bookings", JSON.stringify(bookings));
    alert("Ticket Booked Successfully!");
    displayBookings();
    this.reset();
    calculate();
};

createScheduleCards();
displayBookings();
calculate();
