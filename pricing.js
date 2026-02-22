console.log("!!! PRICING SCRIPT V2.0 IS RUNNING !!!");

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
  console.log("Cookie found:", country);

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
  console.log("Checking visibility for", visibilityElements.length, "elements");

  visibilityElements.forEach(element => {
    const targetCountry = element.getAttribute("data-country-target");
    if (country === "IN" && targetCountry === "IN") {
       console.log("India detected. Forcing section to display.");
       element.style.setProperty("display", "block", "important"); 
    } else {
       element.style.setProperty("display", "none", "important");
    }
  });
}

// Main Execution
const existingCookie = getCookie("countryCookie");
if (existingCookie) {
  console.log("Using existing cookie...");
  runAllLogic();
} else {
  console.log("No cookie. Fetching geo data...");
  fetch("https://get.geojs.io/v1/ip/country.json")
    .then(res => res.json())
    .then(data => {
      setCookie("countryCookie", data.country, 30);
      runAllLogic();
    })
    .catch(err => {
      console.error("Geo fetch failed:", err);
      runAllLogic();
    });
}
