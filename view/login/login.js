document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('email', document.getElementById('username').value);
        formData.append('password', document.getElementById('password').value);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                window.location.href = '/fishForm/fishForm.html';
            } else {
                const errorMessage = await response.text();
                alert('Login failed: ' + errorMessage);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again later.');
        }
    });
});
