console.log("!!! PRICING SCRIPT V1.7 IS LIVE !!!");

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

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

function runAllLogic() {
  const country = getCookie("countryCookie");
  console.log("Location detected as:", country);

  // 1. Pricing Logic
  const priceElements = document.querySelectorAll("[data-ind][data-usd], [data-gbp]");
  priceElements.forEach(element => {
    if (country === "IN") {
      element.textContent = element.getAttribute("data-ind");
    } else if (country === "GB") {
      element.textContent = element.getAttribute("data-gbp");
    } else {
      element.textContent = element.getAttribute("data-usd");
    }
  });

  // 2. Visibility Logic
  const visibilityElements = document.querySelectorAll("[data-country-target]");
  console.log("Targeting visibility for:", visibilityElements.length, "elements");

  visibilityElements.forEach(element => {
    const targetCountry = element.getAttribute("data-country-target");
    if (country === "IN" && targetCountry === "IN") {
       console.log("Success: Setting India section to visible.");
       element.style.setProperty("display", "block", "important"); 
    } else {
       element.style.setProperty("display", "none", "important");
    }
  });
}

async function getGeoCountry() {
  try {
    const response = await fetch("https://get.geojs.io/v1/ip/country.json");
    const data = await response.json();
    setCookie("countryCookie", data.country, 30);
    runAllLogic();
  } catch (error) {
    runAllLogic();
  }
}

// Immediate execution attempt
if (!getCookie("countryCookie")) {
  getGeoCountry();
} else {
  runAllLogic();
}
