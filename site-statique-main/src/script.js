const apkConfig = {
    href: "downloads/GenZen-android.apk",
    compatibility: "Android 9 et versions superieures",
    channel: "APK Android de demonstration",
    safety: "Installation manuelle depuis la source GenZen",
};

for (const link of document.querySelectorAll("[data-apk-link]")) {
    link.href = apkConfig.href;
}

for (const compatibility of document.querySelectorAll("[data-apk-compatibility]")) {
    compatibility.textContent = apkConfig.compatibility;
}

for (const channel of document.querySelectorAll("[data-apk-channel]")) {
    channel.textContent = apkConfig.channel;
}

for (const safety of document.querySelectorAll("[data-apk-safety]")) {
    safety.textContent = apkConfig.safety;
}

for (const year of document.querySelectorAll("[data-current-year]")) {
    year.textContent = String(new Date().getFullYear());
}

const root = document.documentElement;
const siteHeader = document.querySelector("[data-site-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navPanel = document.querySelector("[data-nav-panel]");
const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const mobileNavQuery = window.matchMedia("(max-width: 760px)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const sectionLinks = navLinks.filter((link) => {
    const href = link.getAttribute("href") || "";
    return href.startsWith("#") && href.length > 1;
});

const sections = sectionLinks
    .map((link) => {
        const selector = link.getAttribute("href");
        return selector ? document.querySelector(selector) : null;
    })
    .filter(Boolean);

function getHeaderOffset() {
    const raw = getComputedStyle(root).getPropertyValue("--header-offset");
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : 0;
}

function updateHeaderOffset() {
    if (!siteHeader) {
        return;
    }

    const top = Number.parseFloat(getComputedStyle(siteHeader).top) || 0;
    const offset = Math.ceil(siteHeader.offsetHeight + top + 12);
    root.style.setProperty("--header-offset", `${offset}px`);
}

function setMenuOpen(isOpen) {
    if (!navToggle || !navPanel) {
        return;
    }

    const open = Boolean(isOpen) && mobileNavQuery.matches;
    navToggle.setAttribute("aria-expanded", String(open));
    navPanel.dataset.open = String(open);
}

function scrollToSection(hash, options = {}) {
    if (!hash || !hash.startsWith("#")) {
        return false;
    }

    const target = document.querySelector(hash);
    if (!target) {
        return false;
    }

    const behavior = reducedMotionQuery.matches || options.instant ? "auto" : "smooth";
    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

    window.scrollTo({
        top: Math.max(top, 0),
        behavior,
    });

    return true;
}

function syncActiveLink() {
    if (!sectionLinks.length || !sections.length) {
        return;
    }

    const scrollPosition = window.scrollY + getHeaderOffset() + 40;
    let activeId = sections[0]?.id || "";

    for (const section of sections) {
        if (scrollPosition >= section.offsetTop) {
            activeId = section.id;
        }
    }

    for (const link of sectionLinks) {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("is-active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    }
}

function syncScrolledState() {
    document.body.classList.toggle("is-scrolled", window.scrollY > 16);
}

function handleViewportChange() {
    updateHeaderOffset();

    if (!mobileNavQuery.matches) {
        setMenuOpen(false);
    }

    syncActiveLink();
}

if (navToggle) {
    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        setMenuOpen(!isOpen);
    });
}

document.addEventListener("click", (event) => {
    if (!mobileNavQuery.matches || !navToggle || !navPanel) {
        return;
    }

    if (navToggle.getAttribute("aria-expanded") !== "true") {
        return;
    }

    if (!(event.target instanceof Node)) {
        return;
    }

    if (navToggle.contains(event.target) || navPanel.contains(event.target)) {
        return;
    }

    setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setMenuOpen(false);
    }
});

for (const link of navLinks) {
    link.addEventListener("click", (event) => {
        const href = link.getAttribute("href") || "";

        if (!href.startsWith("#")) {
            setMenuOpen(false);
            return;
        }

        const didScroll = scrollToSection(href);
        if (!didScroll) {
            return;
        }

        event.preventDefault();
        history.pushState(null, "", href);
        setMenuOpen(false);
    });
}

for (const item of faqItems) {
    item.addEventListener("toggle", () => {
        if (!item.open) {
            return;
        }

        for (const otherItem of faqItems) {
            if (otherItem !== item) {
                otherItem.open = false;
            }
        }
    });
}

window.addEventListener(
    "scroll",
    () => {
        syncScrolledState();
        syncActiveLink();
    },
    { passive: true },
);

window.addEventListener("resize", handleViewportChange);
mobileNavQuery.addEventListener("change", handleViewportChange);
window.addEventListener("hashchange", () => {
    if (!window.location.hash) {
        return;
    }

    scrollToSection(window.location.hash, { instant: true });
    syncActiveLink();
});

window.addEventListener("load", () => {
    updateHeaderOffset();
    syncScrolledState();
    syncActiveLink();

    if (window.location.hash) {
        requestAnimationFrame(() => {
            scrollToSection(window.location.hash, { instant: true });
            syncActiveLink();
        });
    }
});

updateHeaderOffset();
syncScrolledState();
syncActiveLink();
