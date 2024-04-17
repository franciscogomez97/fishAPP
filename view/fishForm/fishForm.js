document.addEventListener('DOMContentLoaded', function () {
    const addFishForm = document.getElementById('addFishForm');

    addFishForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const species = document.getElementById('species').value;
        const weight = document.getElementById('weight').value;
        const location = document.getElementById('location').value;
        const dateCaught = document.getElementById('dateCaught').value;
        const lure = document.getElementById('lure').value;
        const lureColour = document.getElementById('lureColour').value;
        const waterTemp = document.getElementById('waterTemp').value;

        try {
            const response = await fetch('/api/fish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ species, weight, location, dateCaught, lure, lureColour, waterTemp })
            });

            if (response.ok) {
                alert('Fish added successfully!');
                addFishForm.reset();
            } else {
                const errorMessage = await response.text();
                alert('Failed to add fish: ' + errorMessage);
            }
        } catch (error) {
            console.error('Error adding fish:', error);
            alert('An error occurred while adding fish. Please try again later.');
        }
    });
});
