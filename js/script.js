document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       Helper Functions
    ========================== */
    const $ = (id) => document.getElementById(id);

    /* =========================
       CONTACT FORM
    ========================== */
    const contactForm = $("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const fields = ["firstName", "lastName", "email", "subject", "message"];
            const isValid = fields.every(id => $(id).value.trim() !== "");

            if (!isValid) {
                alert("Please fill in all fields.");
                return;
            }

            alert("Message sent successfully!");
            contactForm.reset();
        });
    }

    /* =========================
       MOBILE MENU TOGGLE
    ========================== */
    const toggleBtn = $("toggleBtn");
    const navMenu = $("navMenu");

    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            toggleBtn.classList.toggle("fa-bars");
            toggleBtn.classList.toggle("fa-xmark");
        });
    }

    /* =========================
       INLINE EDITABLE TEXT
    ========================== */
    document.querySelectorAll(".editable").forEach(el => {

        el.addEventListener("click", function () {
            this.contentEditable = "true";
            this.classList.add("editing");
            this.focus();
        });

        el.addEventListener("blur", function () {
            this.contentEditable = "false";
            this.classList.remove("editing");
            console.log("Saved content:", this.innerText);
        });

        el.addEventListener("keypress", function (e) {
            if (
                e.key === "Enter" &&
                this.parentElement.classList.contains("header-text")
            ) {
                e.preventDefault();
                this.blur();
            }
        });
    });

    /* =========================
       FOOD GALLERY DATA
    ========================== */
    const foodItems = [
        {
            title: "Fresh Citrus",
            desc: "Organic oranges freshly squeezed for the perfect morning start.",
            imgUrl: "https://images.unsplash.com/photo-1547514701-42782101795e"
        },
        {
            title: "Power Bowl",
            desc: "Salmon, avocado, and greens. A balanced meal for energy.",
            imgUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
        },
        {
            title: "Artisan Sourdough",
            desc: "Slow-fermented, crusty bread baked to perfection.",
            imgUrl: "https://images.unsplash.com/photo-1585476644321-b976214b2e18"
        },
        {
            title: "Garden Greens",
            desc: "Snap peas and green beans, crisp and ready to cook.",
            imgUrl: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5"
        }
    ];

    /* =========================
       GALLERY RENDER
    ========================== */
    const galleryContainer = $("gallery");

    if (galleryContainer) {
        foodItems.forEach(({ title, desc, imgUrl }) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${imgUrl}" alt="${title}">
                <div class="card-details">
                    <h3>${title}</h3>
                    <p>${desc}</p>
                </div>
            `;
            galleryContainer.appendChild(card);
        });
    }

});




// Initialize map
const map = L.map('map').setView([20.5937, 78.9629], 5);

// Load OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Nutritionist data (example)
const nutritionists = [
  {
    name: "Health & Glory - Delhi",
    lat: 28.6139,
    lng: 77.2090,
    city: "Delhi"
  },
  {
    name: "Health & Glory - Mumbai",
    lat: 19.0760,
    lng: 72.8777,
    city: "Mumbai"
  },
  {
    name: "Health & Glory - Bangalore",
    lat: 12.9716,
    lng: 77.5946,
    city: "Bangalore"
  }
];

let userMarker;
let nutritionistMarkers = [];

// Get user location
navigator.geolocation.getCurrentPosition(position => {
  const userLat = position.coords.latitude;
  const userLng = position.coords.longitude;

  map.setView([userLat, userLng], 12);

  userMarker = L.marker([userLat, userLng])
    .addTo(map)
    .bindPopup("You are here 📍")
    .openPopup();

  showNearby(userLat, userLng, 10);
});

// Calculate distance (Haversine Formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Show nearby nutritionists
function showNearby(userLat, userLng, maxDistance) {
  nutritionistMarkers.forEach(marker => map.removeLayer(marker));
  nutritionistMarkers = [];

  nutritionists.forEach(nutritionist => {
    const distance = getDistance(
      userLat,
      userLng,
      nutritionist.lat,
      nutritionist.lng
    );

    if (distance <= maxDistance) {
      const marker = L.marker([nutritionist.lat, nutritionist.lng])
        .addTo(map)
        .bindPopup(
          `<strong>${nutritionist.name}</strong><br>
           City: ${nutritionist.city}<br>
           Distance: ${distance.toFixed(2)} km`
        );

      nutritionistMarkers.push(marker);
    }
  });
}

// Distance filter
document.getElementById("distanceFilter").addEventListener("change", function () {
  navigator.geolocation.getCurrentPosition(position => {
    showNearby(
      position.coords.latitude,
      position.coords.longitude,
      this.value
    );
  });
});


