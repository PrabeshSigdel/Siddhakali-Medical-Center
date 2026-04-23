// List of allowed pages
const routes = ["home", "about", "timeline", "services", "contact", "machine", "bio", "gallery"];

function clearPageTimers() {
    if (window.__homeCarouselTimer) {
        clearInterval(window.__homeCarouselTimer);
        window.__homeCarouselTimer = null;
    }

    if (window.__testimonialInterval) {
        clearInterval(window.__testimonialInterval);
        window.__testimonialInterval = null;
    }
}

function swapPageCSS(page) {
    const oldLink = document.getElementById("page-css");
    const oldHref = oldLink ? oldLink.getAttribute("href") : "";
    const nextHref = `css/${page}.css`;

    if (oldHref === nextHref) {
        return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = nextHref;
    link.id = "page-css";

    if (oldLink) {
        oldLink.remove();
    }

    document.head.appendChild(link);
}

// Load JS dynamically
function loadJS(page) {
    const oldScript = document.getElementById("page-js");
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.src = `js/${page}.js`;
    script.id = "page-js";
    script.defer = true;
    document.body.appendChild(script);
}

// Load a specific page into #app
function loadPage(page) {
    const app = document.getElementById("app");
    if (!app) return;

    clearPageTimers();
    swapPageCSS(page);

    fetch(`html/${page}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${page}`);
            }

            return response.text();
        })
        .then(html => {
            app.innerHTML = html;

            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant"
            });

            loadJS(page);
        })
        .catch(() => {
            app.innerHTML = "<h2>Page not found</h2>";
        });
}


// Router function
function router() {
    // Check if we are on home.html directly, then skip routing
    if (window.location.pathname.endsWith("home.html")) {
        return; // do nothing
    }

    let hash = location.hash.replace("#", "");
    if (!hash) hash = "home"; // default page
    if (!routes.includes(hash)) hash = "home";

    loadPage(hash);
    highlightActiveLink(hash);
}

function highlightActiveLink(page) {
    const links = document.querySelectorAll(".nav a");

    links.forEach(link => {
        const href = link.getAttribute("href").replace("#", "");

        if (href === page) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

// Trigger router as soon as the DOM is ready so content does not wait for all assets.
window.addEventListener("hashchange", router);

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", router);
} else {
    router();
}

