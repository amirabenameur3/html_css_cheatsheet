// =========================
// INITIALIZE ICONS
// =========================

lucide.createIcons();

// =========================
// DOM ELEMENTS
// =========================

const menuButton = document.querySelector(".menu-button");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");

const themeToggleButton = document.querySelector(".theme-toggle");
const body = document.body;

const copyButtons = document.querySelectorAll(".copy-button");

const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");
const sections = document.querySelectorAll("section");

// =========================
// MOBILE / DROPDOWN MENU
// =========================

const closeMenu = () => {
    if (!menuButton || !navMenu) return;

    menuButton.classList.remove("active");
    navMenu.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
};

const openMenu = () => {
    if (!menuButton || !navMenu) return;

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

// =========================
// THEME TOGGLE
// =========================

const updateThemeIcon = (isLightTheme) => {
    if (!themeToggleButton) return;

    themeToggleButton.innerHTML = isLightTheme ? `<i data-lucide="moon"></i>` : `<i data-lucide="sun"></i>`;
    lucide.createIcons();
};

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    body.classList.add("light-theme");
    updateThemeIcon(true);
}

if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
        body.classList.toggle("light-theme");

        const isLightTheme = body.classList.contains("light-theme");

        updateThemeIcon(isLightTheme);

        localStorage.setItem("theme", isLightTheme ? "light" : "dark");
    });
}

// =========================
// COPY TO CLIPBOARD
// =========================

copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
        const codeExample = button.closest(".code-example");
        const codeBlock = codeExample.querySelectorAll("code");

        if (!codeBlock.length) return;

        const codeText = Array.from(codeBlock).map((code) => code.textContent.trim()).join(", ");

        try {
            await navigator.clipboard.writeText(codeText);

            button.innerHTML = `<i data-lucide="check"></i>`;
            button.classList.add("copied");
            lucide.createIcons();

            setTimeout(() => {
                button.innerHTML = `<i data-lucide="copy"></i>`;
                button.classList.remove("copied");
                lucide.createIcons();
            }, 1500);
        } catch (err) {
            button.innerHTML = `<i data-lucide="x"></i>`;
            lucide.createIcons();

             setTimeout(() => {
                button.innerHTML = `<i data-lucide="copy"></i>`;
                lucide.createIcons();
            }, 1500);
        }
    });
});

// =========================
// SEARCH FILTER
// =========================
if (searchInput) {
    searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.toLowerCase().trim();

        let totalVisibleRows = 0;

        sections.forEach((section) => {
            const rows = section.querySelectorAll("tbody tr");
            let sectionHasVisibleRows = false;

            rows.forEach((row) => {
                // Remove previous highlights
                row.querySelectorAll(".highlight").forEach((highlight) => {
                    const parent = highlight.parentNode;
                    parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                    parent.normalize();
                });

                const rowText = row.textContent.toLowerCase().trim();
                const isVisible = rowText.includes(searchValue);

                row.style.display = isVisible ? "" : "none";

                if (isVisible) {
                    sectionHasVisibleRows = true;
                    totalVisibleRows++;

                    // Highlight matching text
                    if (searchValue !== "") {
                        highlightText(row, searchValue);
                    }
                }
            });

            section.style.display = sectionHasVisibleRows || searchValue === "" ? "" : "none";
        });

        const isSearchEmpty = totalVisibleRows === 0 && searchValue !== "";
        document.body.classList.toggle("search-empty", isSearchEmpty);
    });
}

// =========================
// HIGHLIGHT FUNCTION
// =========================

function highlightText(element, searchValue) {
    const regex = new RegExp(`(${searchValue})`, "gi");

    element.childNodes.forEach((node) => {
        if (node.nodeType === 3) {
            const text = node.textContent;

            if (regex.test(text)) {
                const highlightedHTML = text.replace(regex, `<span class="highlight">$1</span>`);
                const wrapper = document.createElement("span");
                wrapper.innerHTML = highlightedHTML;
                node.replaceWith(wrapper);
            }
        } else if (
            node.nodeType === 1 && !node.classList.contains("highlight")) {
            highlightText(node, searchValue);
        }
    });
}