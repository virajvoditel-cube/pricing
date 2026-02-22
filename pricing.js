(function() {
    console.log("!!! CUBE GLOBAL LOGIC V3.0 - ACTIVE !!!");

    function getCookie(name) {
        let v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    }

    function runGlobalLogic(country) {
        console.log("Applying logic for country:", country);

        // 1. PRICING LOGIC (USD, INR, GBP)
        const priceElements = document.querySelectorAll("[data-ind][data-usd], [data-gbp]");
        priceElements.forEach(el => {
            if (country === "IN") {
                el.textContent = el.getAttribute("data-ind");
            } else if (country === "GB") {
                el.textContent = el.getAttribute("data-gbp");
            } else {
                el.textContent = el.getAttribute("data-usd");
            }
        });

        // 2. VISIBILITY LOGIC (.india-only-section)
        const indiaSection = document.querySelector('.india-only-section');
        if (indiaSection) {
            if (country === "IN") {
                console.log("India Match: Showing .india-only-section");
                indiaSection.style.setProperty("display", "block", "important");
            } else {
                console.log("Non-India: Hiding .india-only-section");
                indiaSection.style.setProperty("display", "none", "important");
            }
        }
    }

    // Execution Flow
    let cookie = getCookie("countryCookie");
    if (cookie) {
        runGlobalLogic(cookie);
    } else {
        fetch("https://get.geojs.io/v1/ip/country.json")
            .then(res => res.json())
            .then(data => {
                // Set cookie for 30 days
                document.cookie = "countryCookie=" + data.country + "; path=/; max-age=2592000";
                runGlobalLogic(data.country);
            })
            .catch(() => {
                console.log("Geo API failed, defaulting to USD");
                runGlobalLogic("USD");
            });
    }
})();
