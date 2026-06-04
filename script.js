class Panel extends HTMLElement {

    constructor() {
        super();

        // Crea el Shadow DOM
        this.attachShadow({ mode: "open" });
    }

    // Agrega una opción al menú
    addRow(icono, texto) {

        const contenedor =
            this.shadowRoot.querySelector(".menu-options");

        contenedor.innerHTML += `
            <div>
                <img src="${icono}" alt="${texto}">
                <p>${texto}</p>
                <span>&gt;</span>
            </div>
        `;
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

    // HTML del componente
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

    // CSS del componente
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

            .menu-options div{
                display:flex;
                align-items:center;
                justify-content:space-between;
                cursor:pointer;
            }

            .menu-options img{
                width:45px;
                height:45px;
            }

            .menu-options p{
                flex:1;
                margin-left:15px;
                color:#555;
            }

            .menu-options span{
                font-size:20px;
                color:#999;
            }
        `;
    }

    // Renderiza el componente
    render() {

        this.shadowRoot.innerHTML = `
            <style>
                ${this.getCss()}
            </style>

            ${this.getTemplate()}
        `;
    }

    // Se ejecuta al cargar el componente
    connectedCallback() {

        this.render();

        this.addRow("images/feedback.png", "Enviar comentarios");
        this.addRow("images/setting.png", "Configuración");
        this.addRow("images/help.png", "Ayuda y soporte");
        this.addRow("images/display.png", "Pantalla y accesibilidad");
        this.addRow("images/logout.png", "Cerrar sesión");
    }
}

customElements.define("x-panel", Panel);

window.addEventListener("DOMContentLoaded", () => {

    const userIcon = document.querySelector(".user-icon");
    const panel = document.querySelector("x-panel");

    let abierto = false;

    userIcon.addEventListener("click", () => {

        if (abierto) {
            panel.hide();
        } else {
            panel.show();
        }

        abierto = !abierto;
    });

});