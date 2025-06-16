if (obj && obj.isInitialized) {
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch('../backend/register.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        const messageDiv = document.getElementById('message');
        if (response.ok) {
            messageDiv.style.color = 'green';
            messageDiv.textContent = data.success;
            this.reset();
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = data.error;
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
});
// Formulaire inscription déjà là, on ajoute login

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        try {
            const response = await fetch('../backend/login.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            const messageDiv = document.getElementById('message');
            if (response.ok) {
                messageDiv.style.color = 'green';
                messageDiv.textContent = data.success;
                // Redirige après 1s vers explore.php
                setTimeout(() => {
                    window.location.href = 'explore.php';
                }, 1000);
            } else {
                messageDiv.style.color = 'red';
                messageDiv.textContent = data.error;
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    });
}
}
