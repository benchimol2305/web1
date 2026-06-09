class Panel extends HTMLElement {

    constructor() {
        super();
        // Crear el shadow dom
        this.attachShadow({ mode: "open" });
    }

    
    setMenuData(data) {
        const contenedor = this.shadowRoot.querySelector(".menu-options");
        contenedor.innerHTML = ''; 

        data.forEach(item => {
            const hasSubmenu = item.submenus && item.submenus.length > 0;
            
            // Contenedor principal 
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
                    
                    // Evento para el submenú
                    subItem.addEventListener("click", (e) => {
                        e.stopPropagation(); 
                        this.dispatchSelect(sub);
                        
                        // Mueve todo el bloque padre al principio del menú
                        contenedor.prepend(menuItem); 
                    });
                    
                    subContainer.appendChild(subItem);
                });

                menuItem.appendChild(subContainer);

                
                menuItem.querySelector(".menu-header").addEventListener("click", () => {
                    subContainer.classList.toggle("open-submenu");
                    
                    // Mueve el bloque al principio 
                    contenedor.prepend(menuItem); 
                });
            } else {
                // Evento para ítems normales sin submenú
                menuItem.addEventListener("click", () => {
                    this.dispatchSelect(item.text);
                    
                    // Mueve el ítem al principio
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

    // Muestra el menú
    show() {
        this.shadowRoot
            .querySelector(".side-menu")
            .classList.add("open-menu");
    }

    // Oculta el menú
    hide() {
        this.shadowRoot
            .querySelector(".side-menu")
            .classList.remove("open-menu");
    }

    // Estructura HTML interna del componente
    getTemplate() {
        return `
            <div class="side-menu">
                <div class="dropdown-wrapper">
                    <div class="user-info">
                        <h2>Menú</h2>
                    </div>
                    <hr>
                    <div class="menu-options"></div>
                </div>
            </div>
        `;
    }

    // Estilos del Shadow DOM
    getCss() {
        return `
            .side-menu{
                position:fixed;
                top:0;
                left:0;
                width:250px;
                height:100vh;
                background:white;
                padding:20px;
                transform:translateX(-100%);
                transition:transform 0.3s ease;
                box-shadow:2px 0 10px rgba(0,0,0,0.2);
                z-index:1000;
            }

            .open-menu{
                transform:translateX(0);
            }

            .dropdown-wrapper{
                padding:20px;
            }

            .user-info{
                display:flex;
                align-items:center;
                gap:15px;
            }

            hr{
                border:0;
                height:1px;
                background:#851717;
                margin:15px 0;
            }

            .menu-options{
                display:flex;
                flex-direction:column;
                gap:13px;
            }

            .menu-item {
                display: flex;
                flex-direction: column;
            }

            .menu-header {
                display:flex;
                align-items:center;
                justify-content:space-between;
                cursor:pointer;
                width: 100%;
            }

            .menu-header img{
                width:45px;
                height:45px;
            }

            .menu-header p{
                flex:1;
                margin-left:15px;
                color:#555;
            }

            .menu-header .arrow{
                font-size:14px;
                color:#999;
            }

            /* Estilos del sistema de submenús */
            .submenu-container {
                display: none;
                flex-direction: column;
                margin-left: 60px;
                margin-top: 10px;
                gap: 10px;
            }

            .submenu-container.open-submenu {
                display: flex;
            }

            .sub-item {
                cursor: pointer;
                color: #777;
                font-size: 0.9rem;
                transition: color 0.2s ease;
            }

            .sub-item:hover {
                color: #851717;
            }
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${this.getCss()}
            </style>
            ${this.getTemplate()}
        `;
    }

    connectedCallback() {
        this.render();
    }
}

customElements.define("x-panel", Panel);


window.addEventListener("DOMContentLoaded", () => {

    const userIcon = document.querySelector(".user-icon");
    const panel = document.querySelector("x-panel");
    const contenido = document.getElementById('contenido');

    let abierto = false;

    
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

    panel.setMenuData(menuConfig);

    // Control de apertura y cierre general del Sidebar
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
        
        // Cierra el sidebar solo si lo seleccionado NO es una opción padre con hijos
        const esMenuPadre = menuConfig.some(item => item.text === event.detail && item.submenus);
        if (!esMenuPadre) {
            abierto = false;
            panel.hide();
        }
    });

});