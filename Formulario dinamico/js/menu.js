// Control del menu hamburguesa
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.createElement('div');
    
    // Selectores de los botones de la barra lateral (los que abren modales)
    const cartBtn = document.getElementById('cart-btn');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    // Selectores de los modales y botones de cierre
    const cartModal = document.getElementById('cart-modal');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');
    const switchToRegisterLink = document.getElementById('switch-to-register');
    const switchToLoginLink = document.getElementById('switch-to-login');

    // Crear overlay
    overlay.classList.add('overlay-mobile'); // Renombramos para evitar conflicto con modal overlay
    document.body.appendChild(overlay);

    // --- Funciones de Modales ---

    function openModal(modal) {
        // Asegura que el overlay del modal esté visible
        const modalOverlay = document.querySelector('.modal-overlay:not(.overlay-mobile)'); 
        if(modalOverlay) modalOverlay.classList.remove('active'); // Ocultar otros modales si están abiertos
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita el scroll en el body
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        
        // Verifica si algún otro modal está abierto antes de restaurar el scroll
        const anyModalActive = document.querySelectorAll('.modal-overlay.active').length > 0;
        if (!anyModalActive) {
            document.body.style.overflow = '';
        }
    }

    // --- Event Listeners de Modales ---

    // Abrir modales
    if (cartBtn) cartBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(cartModal); });
    if (loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(loginModal); });
    if (registerBtn) registerBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(registerModal); });

    // Cerrar modales (botón X y botón de pie de modal)
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.modal;
            const modalToClose = document.getElementById(modalId);
            if (modalToClose) {
                closeModal(modalToClose);
            }
        });
    });
    
    // Cerrar modal al hacer clic fuera del contenido (en el overlay)
    document.querySelectorAll('.modal-overlay').forEach(overlayElement => {
        overlayElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeModal(overlayElement);
            }
        });
    });

    // Cambiar entre Login y Registro
    if (switchToRegisterLink) switchToRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(registerModal);
    });
    
    if (switchToLoginLink) switchToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(registerModal);
        openModal(loginModal);
    });

    // --- Funciones de Menú Hamburguesa (Mantenidas) ---

    // Alternar menu al hacer clic en el botón de hamburguesa
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function () {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Cerrar menu al hacer clic en el overlay móvil
    overlay.addEventListener('click', function () {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Cerrar menu al hacer clic en un enlace (solo móviles)
    const menuLinks = document.querySelectorAll('.sidebar-menu a:not(#cart-btn):not(#login-btn):not(#register-btn)');
    menuLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Ajustar menu al cambiar el tamaño de la ventana
    window.addEventListener('resize', function () {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});