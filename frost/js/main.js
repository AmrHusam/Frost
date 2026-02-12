document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileBackdrop = document.querySelector('.mobile-backdrop');

    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        mobileBackdrop.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', toggleMobileMenu);
    }

    // Modal Logic
    const modalButtons = document.querySelectorAll('.js-open-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const modalContent = document.querySelector('.modal-content');

    function openModal(e) {
        e.preventDefault();
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus trap or auto-focus input could go here
            const firstInput = modalContent.querySelector('input');
            if (firstInput) firstInput.focus();
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    modalButtons.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
});
