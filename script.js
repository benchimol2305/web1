class Panel extends HTMLElement {

    constructor() {
        super();
        // Crear el shadow dom en modo abierto
        this.attachShadow({ mode: "open" });
    }

    // Método que clona la estructura HTML externa desde el index.html
    initTemplate() {
        const template = document.getElementById("panel-template");
        if (template) {
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }
    }

    // Carga los datos inyectados de forma dinámica
    setMenuData(data) {
        const contenedor = this.shadowRoot.querySelector(".menu-options");
        if (!contenedor) return;
        
        contenedor.innerHTML = ''; 

        data.forEach(item => {
            const hasSubmenu = item.submenus && item.submenus.length > 0;
            
            // Creamos los nodos usando la API nativa del DOM
            const menuItem = document.createElement("div");
            menuItem.classList.add("menu-item");
            menuItem.dataset.title = item.text;
            
            menuItem.innerHTML = `
                <div class="menu-header">
                    <img src="${item.icon}" alt="${item.text}">
                    <p>${item.text}</p>
                    <span class="arrow">${hasSubmenu ? '▼' : '&gt;'}</span>
                </div>
            `;

            if (hasSubmenu) {
                const subContainer = document.createElement("div");
                subContainer.classList.add("submenu-container");
                
                item.submenus.forEach(sub => {
                    const subItem = document.createElement("div");
                    subItem.classList.add("sub-item");
                    subItem.dataset.title = sub;
                    subItem.innerHTML = `<p>${sub}</p>`;
                    
                    subItem.addEventListener("click", (e) => {
                        e.stopPropagation();
                        this.dispatchSelect(sub);
                        
                        // Lógica de posicionamiento (se pone de primera en el sideboard)
                        contenedor.prepend(menuItem); 
                    });
                    
                    subContainer.appendChild(subItem);
                });

                menuItem.appendChild(subContainer);

                menuItem.querySelector(".menu-header").addEventListener("click", () => {
                    subContainer.classList.toggle("open-submenu");
                    contenedor.prepend(menuItem); 
                });
            } else {
                menuItem.addEventListener("click", () => {
                    this.dispatchSelect(item.text);
                    contenedor.prepend(menuItem); 
                });
            }

            contenedor.appendChild(menuItem);
        });
    }

    dispatchSelect(title) {
        window.dispatchEvent(new CustomEvent('menu-select', {
            detail: title
        }));
    }

    show() {
        const menu = this.shadowRoot.querySelector(".side-menu");
        if (menu) menu.classList.add("open-menu");
    }

    hide() {
        const menu = this.shadowRoot.querySelector(".side-menu");
        if (menu) menu.classList.remove("open-menu");
    }

    // Se ejecuta inmediatamente cuando el componente se añade al DOM
    connectedCallback() {
        this.initTemplate();
    }
}

customElements.define("x-panel", Panel);

// ==========================================================================
// LÓGICA DE CONTROL GLOBAL
// ==========================================================================
window.addEventListener("DOMContentLoaded", () => {

    const userIcon = document.querySelector(".user-icon");
    const panel = document.querySelector("x-panel");
    const contenido = document.getElementById('contenido');

    let abierto = false;

    // Configuración estructurada y modular de las opciones
    const menuConfig = [
        { icon: "images/feedback.png", text: "Enviar comentarios" },
        { 
            icon: "images/setting.png", 
            text: "Configuración",
            submenus: ["Perfil de usuario", "Privacidad y seguridad"] 
        },
        { icon: "images/help.png", text: "Ayuda y soporte" },
        { icon: "images/display.png", text: "Pantalla y accesibilidad" },
        { icon: "images/logout.png", text: "Cerrar sesión" }
    ];

    // Población de opciones desde el script externo
    panel.setMenuData(menuConfig);

    userIcon.addEventListener("click", () => {
        if (abierto) {
            panel.hide();
        } else {
            panel.show();
        }
        abierto = !abierto;
    });

    window.addEventListener('menu-select', event => {
        contenido.textContent = event.detail;
        
        const esMenuPadre = menuConfig.some(item => item.text === event.detail && item.submenus);
        if (!esMenuPadre) {
            abierto = false;
            panel.hide();
        }
    });
});