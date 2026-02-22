// Define the geoCountry variable
let geoCountry;

// Function to set a cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

// Function to get a cookie
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

// Function to fetch country information based on IP
async function getGeoCountry() {
  try {
    const response = await fetch("https://get.geojs.io/v1/ip/country.json");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    geoCountry = data;

    // Set cookie for 30 days
    setCookie("countryCookie", geoCountry.country, 30);

    // Update the elements based on the country
    updateElementsBasedOnCountry();
  } catch (error) {
    // Fallback if fetch fails
    updateElementsBasedOnCountry();
  }
}

// Function to update elements based on the country cookie
function updateElementsBasedOnCountry() {
  const country = getCookie("countryCookie");
  
  // Updated selector to include your new data-gbp attribute
  const elements = document.querySelectorAll("[data-ind][data-usd], [data-gbp]");

  if (elements.length > 0) {
    for (let element of elements) {
      if (country === "IN") {
        // Show India pricing
        element.textContent = element.getAttribute("data-ind");
      } else if (country === "GB") {
        // Show UK pricing - Logic added here
        element.textContent = element.getAttribute("data-gbp");
      } else {
        // Show Default/USD pricing
        element.textContent = element.getAttribute("data-usd");
      }
    }
  }
}

// Check if the cookie is present
if (!getCookie("countryCookie")) {
  getGeoCountry();
} else {
  updateElementsBasedOnCountry();
}
