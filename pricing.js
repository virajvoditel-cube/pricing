// Define global variables
let geoCountry;

// --- Helper: Set a Cookie ---
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

// --- Helper: Get a Cookie ---
function getCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// --- Main Logic: Update Prices and Section Visibility ---
function runAllLogic() {
  const country = getCookie("countryCookie");
  
  // 1. ORIGINAL PRICING LOGIC (USD, INR, GBP)
  const priceElements = document.querySelectorAll("[data-ind][data-usd], [data-gbp]");
  if (priceElements.length > 0) {
    for (let element of priceElements) {
      if (country === "IN") {
        element.textContent = element.getAttribute("data-ind");
      } else if (country === "GB") {
        element.textContent = element.getAttribute("data-gbp");
      } else {
        element.textContent = element.getAttribute("data-usd");
      }
    }
  }

  // 2. NEW VISIBILITY LOGIC (India-only Section)
  const visibilityElements = document.querySelectorAll("[data-country-target]");
  visibilityElements.forEach(element => {
    const targetCountry = element.getAttribute("data-country-target");
    // If user is in India, show the section; otherwise, keep it hidden
    if (country === "IN" && targetCountry === "IN") {
      element.style.display = "block"; 
    } else {
      element.style.display = "none";
    }
  });
}

// --- Fetch Location based on IP ---
async function getGeoCountry() {
  try {
    const response = await fetch("https://get.geojs.io/v1/ip/country.json");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    geoCountry = data;

    // Set cookie for 30 days
    setCookie("countryCookie", geoCountry.country, 30);

    // Update the site
    runAllLogic();
  } catch (error) {
    // If fetch fails, still run logic to show default USD prices
    runAllLogic();
  }
}

// --- Initialize ---
if (!getCookie("countryCookie")) {
  getGeoCountry();
} else {
  runAllLogic();
}
