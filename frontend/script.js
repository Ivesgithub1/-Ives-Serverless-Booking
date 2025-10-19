document.addEventListener("DOMContentLoaded", () => {
  // === CONFIGURATION ========================================================
  const API_BASE_URL = "https://htqghe2vn0.execute-api.us-east-1.amazonaws.com/Prod";

  // --- Get references to all HTML elements ---
  const heroSection = document.getElementById("hero");
  const bookingFormSection = document.getElementById("bookingForm");
  const seatSection = document.getElementById("seatSelection");

  const getStartedBtn = document.getElementById("getStartedBtn");
  const ticketForm = document.getElementById("ticketForm");
  const seatContainer = document.getElementById("seatContainer");
  const confirmSeatsBtn = document.getElementById("confirmSeatsBtn");
  const backToBookingBtn = document.getElementById("backToBookingBtn");
  const selectedCounter = document.getElementById("selectedCounter");

  let selectedSeats = [];

  // --- FLOW 1: Hero -> Booking form ---
  getStartedBtn.addEventListener("click", (e) => {
    e.preventDefault();
    heroSection.classList.add("hidden");
    bookingFormSection.classList.remove("hidden");
  });

  // --- FLOW 2: Booking form -> Seat selection ---
  ticketForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const tickets = parseInt(document.getElementById("tickets").value);
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    if (origin === destination) {
      alert("Origin and destination cannot be the same.");
      return;
    }

    window.bookingData = {
      tickets,
      origin,
      destination,
      bookingId: `BKG-${Date.now()}`
    };

    bookingFormSection.classList.add("hidden");
    seatSection.classList.remove("hidden");
    generateSeats();
  });

  // --- FLOW 3: Go back ---
  backToBookingBtn.addEventListener("click", () => {
    seatSection.classList.add("hidden");
    bookingFormSection.classList.remove("hidden");
  });

  // --- Helper: update counter ---
  function updateSelectedCounter() {
    selectedCounter.innerText = `Selected: ${selectedSeats.length}`;
  }

  // --- Seat layout (your full original array, unchanged) ---
  function generateSeats() {
    seatContainer.innerHTML = "";
    selectedSeats = [];
    updateSelectedCounter();

    const layout = [
      { id: "driver", text: "Driver", row: 1, col: 1, type: "driver" },
      { id: 2, row: 1, col: 5, type: "seat" }, { id: 3, row: 1, col: 6, type: "seat" },
      { id: 4, row: 2, col: 1, type: "seat" }, { id: 5, row: 2, col: 2, type: "seat" }, { id: 6, row: 2, col: 3, type: "seat" },
      { id: 7, row: 2, col: 5, type: "seat" }, { id: 8, row: 2, col: 6, type: "seat" },
      { id: 9, row: 3, col: 1, type: "seat" }, { id: 10, row: 3, col: 2, type: "seat" }, { id: 11, row: 3, col: 3, type: "seat" },
      { id: 12, row: 3, col: 5, type: "seat" }, { id: 13, row: 3, col: 6, type: "seat" },
      { id: 14, row: 4, col: 1, type: "seat" }, { id: 15, row: 4, col: 2, type: "seat" }, { id: 16, row: 4, col: 3, type: "seat" },
      { id: "exit1", text: "EXIT", row: 4, col: 5, type: "exit" },
      { id: 17, row: 5, col: 1, type: "seat" }, { id: 18, row: 5, col: 2, type: "seat" }, { id: 19, row: 5, col: 3, type: "seat" },
      { id: "aisleC", text: "C", row: 5, col: 4, type: "aisle" },
      { id: 20, row: 5, col: 5, type: "seat" }, { id: 21, row: 5, col: 6, type: "seat" },
      { id: 22, row: 6, col: 1, type: "seat" }, { id: 23, row: 6, col: 2, type: "seat" }, { id: 24, row: 6, col: 3, type: "seat" },
      { id: "aisleO1", text: "O", row: 6, col: 4, type: "aisle" },
      { id: 25, row: 6, col: 5, type: "seat" }, { id: 26, row: 6, col: 6, type: "seat" },
      { id: 27, row: 7, col: 1, type: "seat" }, { id: 28, row: 7, col: 2, type: "seat" }, { id: 29, row: 7, col: 3, type: "seat" },
      { id: "aisleR1", text: "R", row: 7, col: 4, type: "aisle" },
      { id: 30, row: 7, col: 5, type: "seat" }, { id: 31, row: 7, col: 6, type: "seat" },
      { id: 32, row: 8, col: 1, type: "seat" }, { id: 33, row: 8, col: 2, type: "seat" }, { id: 34, row: 8, col: 3, type: "seat" },
      { id: "aisleR2", text: "R", row: 8, col: 4, type: "aisle" },
      { id: 35, row: 8, col: 5, type: "seat" }, { id: 36, row: 8, col: 6, type: "seat" },
      { id: 37, row: 9, col: 1, type: "seat" }, { id: 38, row: 9, col: 2, type: "seat" }, { id: 39, row: 9, col: 3, type: "seat" },
      { id: "aisleI", text: "I", row: 9, col: 4, type: "aisle" },
      { id: 40, row: 9, col: 5, type: "seat" }, { id: 41, row: 9, col: 6, type: "seat" },
      { id: 42, row: 10, col: 1, type: "seat" }, { id: 43, row: 10, col: 2, type: "seat" }, { id: 44, row: 10, col: 3, type: "seat" },
      { id: "aisleD", text: "D", row: 10, col: 4, type: "aisle" },
      { id: 45, row: 10, col: 5, type: "seat" }, { id: 46, row: 10, col: 6, type: "seat" },
      { id: 47, row: 11, col: 1, type: "seat" }, { id: 48, row: 11, col: 2, type: "seat" }, { id: 49, row: 11, col: 3, type: "seat" },
      { id: "aisleO2", text: "O", row: 11, col: 4, type: "aisle" },
      { id: 50, row: 11, col: 5, type: "seat" }, { id: 51, row: 11, col: 6, type: "seat" },
      { id: 52, row: 12, col: 1, type: "seat" }, { id: 53, row: 12, col: 2, type: "seat" }, { id: 54, row: 12, col: 3, type: "seat" },
      { id: "exit2", text: "EXIT", row: 12, col: 5, type: "exit" },
      { id: 55, row: 13, col: 1, type: "seat" }, { id: 56, row: 13, col: 2, type: "seat" }, { id: 57, row: 13, col: 3, type: "seat" },
      { id: 58, row: 13, col: 5, type: "seat" }, { id: 59, row: 13, col: 6, type: "seat" },
      { id: 60, row: 14, col: 1, type: "seat" }, { id: 61, row: 14, col: 2, type: "seat" }, { id: 62, row: 14, col: 3, type: "seat" },
      { id: 63, row: 14, col: 5, type: "seat" }, { id: 64, row: 14, col: 6, type: "seat" },
      { id: 65, row: 15, col: 1, type: "seat" }, { id: 66, row: 15, col: 2, type: "seat" }, { id: 67, row: 15, col: 3, type: "seat" },
      { id: 68, row: 15, col: 4, type: "seat" }, { id: 69, row: 15, col: 5, type: "seat" }, { id: 70, row: 15, col: 6, type: "seat" }
    ];

    layout.forEach((item) => {
      const el = document.createElement("div");
      el.style.gridRow = item.row;
      el.style.gridColumn = item.col;
      el.innerText = item.text || item.id;

      if (item.type === "seat") {
        el.classList.add("seat");
        el.dataset.seatId = item.id;
        el.addEventListener("click", () => {
          if (el.classList.contains("taken")) return;
          const seatId = parseInt(el.dataset.seatId);
          if (el.classList.contains("selected")) {
            el.classList.remove("selected");
            selectedSeats = selectedSeats.filter((s) => s !== seatId);
          } else {
            if (selectedSeats.length < window.bookingData.tickets) {
              el.classList.add("selected");
              selectedSeats.push(seatId);
            } else {
              alert(`You can only select ${window.bookingData.tickets} seat(s).`);
            }
          }
          updateSelectedCounter();
        });
      } else {
        el.classList.add("seat-element", item.type);
      }
      seatContainer.appendChild(el);
    });
  }

  // --- Confirm Seat Selection -> call backend ---
  confirmSeatsBtn.addEventListener("click", async () => {
    if (selectedSeats.length !== parseInt(window.bookingData.tickets)) {
      alert(`Please select exactly ${window.bookingData.tickets} seat(s).`);
      return;
    }

    window.bookingData.seats = selectedSeats;
    console.log("✅ Final Booking Data:", window.bookingData);

    const phone = document.getElementById("phone").value.trim();

    try {
      const res = await fetch(`${API_BASE_URL}/bookings/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: window.bookingData.bookingId,
          selectedSeats: window.bookingData.seats,
          phone
        })
      });

      const text = await res.text();
      console.log("Backend response:", res.status, text);

      let data = {};
      try { data = JSON.parse(text); } catch {}
      if (!res.ok) {
        alert(`Server error ${res.status}: check backend logs`);
        return;
      }

      alert(`Payment started. Reference: ${data.paymentRef || "undefined"}`);
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error contacting backend.");
    }
  });
});