const API_BASE_URL = 'http://localhost:8080/heros'; // Your Spring Boot API endpoint

// Helper function to display messages
function displayMessage(elementId, message, isError = false) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = message;
    messageElement.className = 'message'; // Reset classes
    if (isError) {
        messageElement.classList.add('error');
    } else {
        messageElement.classList.add('success');
    }
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = 'message';
    }, 5000); // Clear message after 5 seconds
}

// 1. Create Hero (POST)
async function createHero() {
    const nameInput = document.getElementById('createHeroName');
    const imageUrlInput = document.getElementById('createHeroImageUrl'); // Get new image URL input
    const heroName = nameInput.value.trim();
    const imageUrl = imageUrlInput.value.trim(); // Get image URL value

    if (!heroName) {
        displayMessage('createHeroMessage', 'A hero must have a name!', true);
        return;
    }

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Include imageUrl in the request body
            body: JSON.stringify({ heroName: heroName, imageUrl: imageUrl }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const newHero = await response.json();
        displayMessage('createHeroMessage', `Hero '${newHero.heroName}' (ID: ${newHero.heroID}) has been forged!`);
        nameInput.value = ''; // Clear input
        imageUrlInput.value = ''; // Clear image URL input
        getAllHeros(); // Refresh the list
    } catch (error) {
        console.error('Error creating hero:', error);
        displayMessage('createHeroMessage', `Failed to forge hero: ${error.message}`, true);
    }
}

// 2. Get All Heros (GET)
async function getAllHeros() {
    const heroListDiv = document.getElementById('heroList');
    heroListDiv.innerHTML = '<p>Loading heroes...</p>'; // Loading message

    try {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const heros = await response.json();

        if (heros.length === 0) {
            heroListDiv.innerHTML = '<p>No heroes found. Begin forging new companions!</p>';
            displayMessage('getHerosMessage', 'The lands are quiet, no heroes are currently enlisted.');
            return;
        }

        const ul = document.createElement('ul');
        heros.forEach(hero => {
            const li = document.createElement('li');
            li.classList.add('hero-item'); // Add a class for styling

            // Create a container for text info
            const heroInfoDiv = document.createElement('div');
            heroInfoDiv.classList.add('hero-info');
            heroInfoDiv.innerHTML = `<span>ID: ${hero.heroID}</span> <span>Name: ${hero.heroName}</span>`;

            // Create a container for the image
            const heroImageContainer = document.createElement('div');
            heroImageContainer.classList.add('hero-image-container');

            // Add image if URL exists
            if (hero.imageUrl) {
                const img = document.createElement('img');
                img.src = hero.imageUrl;
                img.alt = hero.heroName || 'Hero Image';
                img.classList.add('hero-image');
                heroImageContainer.appendChild(img);
            }

            li.appendChild(heroInfoDiv);
            li.appendChild(heroImageContainer); // Add image container to list item
            ul.appendChild(li);
        });
        heroListDiv.innerHTML = ''; // Clear loading message
        heroListDiv.appendChild(ul);
        displayMessage('getHerosMessage', `Successfully retrieved ${heros.length} heroes from the roster.`);

    } catch (error) {
        console.error('Error fetching heros:', error);
        heroListDiv.innerHTML = '<p class="error">Failed to fetch heroes from the realms. Is the server at the Misty Mountains running?</p>';
        displayMessage('getHerosMessage', `Failed to retrieve roster: ${error.message}`, true);
    }
}

// 3. Update Hero (PUT)
async function updateHero() {
    const idInput = document.getElementById('updateHeroId');
    const nameInput = document.getElementById('updateHeroName');
    const imageUrlInput = document.getElementById('updateHeroImageUrl'); // Get new image URL input
    const heroId = parseInt(idInput.value.trim());
    const newHeroName = nameInput.value.trim();
    const newImageUrl = imageUrlInput.value.trim(); // Get new image URL value

    if (isNaN(heroId) || !newHeroName) {
        displayMessage('updateHeroMessage', 'Provide a valid Hero ID and a new name!', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${heroId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            // Include imageUrl in the request body
            body: JSON.stringify({ heroID: heroId, heroName: newHeroName, imageUrl: newImageUrl }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const updatedHero = await response.json();
        displayMessage('updateHeroMessage', `Hero '${updatedHero.heroName}' (ID: ${updatedHero.heroID}) has had their saga updated!`);
        idInput.value = '';
        nameInput.value = '';
        imageUrlInput.value = ''; // Clear image URL input
        getAllHeros(); // Refresh the list
    } catch (error) {
        console.error('Error updating hero:', error);
        displayMessage('updateHeroMessage', `Failed to update hero's saga: ${error.message}`, true);
    }
}

// 4. Delete Hero (DELETE)
async function deleteHero() {
    const idInput = document.getElementById('deleteHeroId');
    const heroId = parseInt(idInput.value.trim());

    if (isNaN(heroId)) {
        displayMessage('deleteHeroMessage', 'Enter a valid Hero ID to banish!', true);
        return;
    }

    // Optional: Add a confirmation dialog for deleting a hero
    if (!confirm(`Are you sure you want to banish Hero ID: ${heroId} from the realms? This cannot be undone!`)) {
        displayMessage('deleteHeroMessage', 'Banishment aborted by the Loremaster.', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${heroId}`, {
            method: 'DELETE',
        });

        if (response.status === 200 || response.status === 204) { // 200 OK or 204 No Content are common for successful DELETE
            displayMessage('deleteHeroMessage', `Hero ID: ${heroId} has been sent to the Undying Lands.`);
            idInput.value = '';
            getAllHeros(); // Refresh the list
        } else {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
    } catch (error) {
        console.error('Error deleting hero:', error);
        displayMessage('deleteHeroMessage', `Failed to banish hero: ${error.message}`, true);
    }
}

// Initial load: Get all heros when the page loads
document.addEventListener('DOMContentLoaded', getAllHeros);