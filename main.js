lucide.createIcons();
// =========================
// DOM ELEMENTS
// =========================

/* Menu elements */
const menuButton = document.querySelector(".menu-button");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");

/* Theme toggle elements */
const themeToggleButton = document.querySelector(".theme-toggle");
const body = document.body;

// =========================
// EVENT LISTENERS
// =========================

/* Menu toggle */
const closeMenu = () => {
    if(!menuButton || !navMenu) return;
    menuButton.classList.remove("active");
    navMenu.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
};

const openMenu = () => {
    if(!menuButton || !navMenu) return;
    menuButton.classList.add("active");
    navMenu.classList.add("active");
    menuButton.setAttribute("aria-expanded", "true");
};

if (menuButton && navMenu) {
    menuButton.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = navMenu.classList.contains("active");
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        const clickedButton = menuButton.contains(event.target);
        const clickedNav = navMenu.contains(event.target);
        if (!clickedButton && !clickedNav) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }    
    });

}
