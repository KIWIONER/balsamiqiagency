document.addEventListener('DOMContentLoaded', () => {
    // ... (existing code for agent and navigation) ...

    // --- Custom Popup Logic ---
    const auditForm = document.getElementById('audit-form');
    const popup = document.getElementById('custom-popup');
    const closePopupBtn = document.getElementById('close-popup');

    if (auditForm) {
        auditForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop default submission
            showPopup();
            auditForm.reset(); // Optional: reset form after submission
        });
    }

    function showPopup() {
        if (popup) {
            popup.style.display = 'flex';
        }
    }

    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            if (popup) {
                popup.style.display = 'none';
            }
        });
    }

    // Close on outside click
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.display = 'none';
            }
        });
    }
});
