// API Base URLs for each entity
const API_BASE_URL_HEROES = 'http://localhost:8080/api/heroes';
const API_BASE_URL_TEAMS = 'http://localhost:8080/api/teams';
const API_BASE_URL_QUESTS = 'http://localhost:8080/api/quests';

// --- Helper Functions ---

// Function to display messages (success/error) in the UI
function displayMessage(elementId, message, isError = false) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = message;
    messageElement.className = 'message'; // Reset classes
    if (isError) {
        messageElement.classList.add('error');
    } else {
        messageElement.classList.add('success');
    }
    // Clear the message after 5 seconds
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = 'message';
    }, 5000);
}

// --- Hero Operations ---

// 1. Create Hero (POST)
async function createHero() {
    const nameInput = document.getElementById('createHeroName');
    const imageUrlInput = document.getElementById('createHeroImageUrl');
    const teamIdInput = document.getElementById('createHeroTeamId');

    const heroName = nameInput.value.trim();
    const imageUrl = imageUrlInput.value.trim();
    const teamId = teamIdInput.value.trim();

    if (!heroName) {
        displayMessage('createHeroMessage', 'A hero must have a name!', true);
        return;
    }

    // Prepare the hero object to send
    const heroData = {
        heroName: heroName,
        imageUrl: imageUrl
    };

    // If a team ID is provided, include it in the request body
    if (teamId) {
        heroData.team = { teamID: parseInt(teamId) }; // Spring expects a nested object for relationships
    }

    try {
        const response = await fetch(API_BASE_URL_HEROES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(heroData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const newHero = await response.json();
        displayMessage('createHeroMessage', `Hero '${newHero.heroName}' (ID: ${newHero.heroID}) has been forged!`);
        nameInput.value = '';
        imageUrlInput.value = '';
        teamIdInput.value = '';
        getAllHeroes(); // Refresh the list of heroes
        getAllTeams(); // Refresh teams to show updated hero counts if applicable
    } catch (error) {
        console.error('Error creating hero:', error);
        displayMessage('createHeroMessage', `Failed to forge hero: ${error.message}`, true);
    }
}

// 2. Get All Heroes (GET)
async function getAllHeroes() {
    const heroListDiv = document.getElementById('heroList');
    heroListDiv.innerHTML = '<p>Loading heroes...</p>';

    try {
        const response = await fetch(API_BASE_URL_HEROES);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const heroes = await response.json();

        if (heroes.length === 0) {
            heroListDiv.innerHTML = '<p>No heroes found. Begin forging new companions!</p>';
            displayMessage('getHeroesMessage', 'The lands are quiet, no heroes are currently enlisted.');
            return;
        }

        const ul = document.createElement('ul');
        heroes.forEach(hero => {
            const li = document.createElement('li');
            li.classList.add('entity-list-item'); // Use generic class for list styling

            const heroInfoDiv = document.createElement('div');
            heroInfoDiv.classList.add('entity-info');
            heroInfoDiv.innerHTML = `
                <span><strong>ID:</strong> ${hero.heroID}</span>
                <span><strong>Name:</strong> ${hero.heroName}</span>
                <span><strong>Team:</strong> ${hero.team ? hero.team.teamName + ' (ID: ' + hero.team.teamID + ')' : 'None'}</span>
                <span><strong>Quests:</strong> ${hero.quests && hero.quests.length > 0 ? hero.quests.map(q => q.questName + ' (ID: ' + q.questID + ')').join(', ') : 'None'}</span>
            `;

            const heroImageContainer = document.createElement('div');
            heroImageContainer.classList.add('entity-image-container');

            if (hero.imageUrl) {
                const img = document.createElement('img');
                img.src = hero.imageUrl;
                img.alt = hero.heroName || 'Hero Image';
                img.classList.add('entity-image');
                img.onerror = () => { img.src = 'https://placehold.co/60x60/333/FFF?text=No+Img'; img.alt = 'Image not found'; }; // Fallback for broken images
                heroImageContainer.appendChild(img);
            } else {
                const img = document.createElement('img');
                img.src = 'https://placehold.co/60x60/333/FFF?text=No+Img'; // Placeholder if no URL
                img.alt = 'No Image Available';
                img.classList.add('entity-image');
                heroImageContainer.appendChild(img);
            }

            li.appendChild(heroInfoDiv);
            li.appendChild(heroImageContainer);
            ul.appendChild(li);
        });
        heroListDiv.innerHTML = '';
        heroListDiv.appendChild(ul);
        displayMessage('getHeroesMessage', `Successfully retrieved ${heroes.length} heroes from the roster.`);

    } catch (error) {
        console.error('Error fetching heroes:', error);
        heroListDiv.innerHTML = '<p class="error">Failed to fetch heroes from the realms. Is the server at the Misty Mountains running?</p>';
        displayMessage('getHeroesMessage', `Failed to retrieve roster: ${error.message}`, true);
    }
}

// 3. Update Hero (PUT)
async function updateHero() {
    const idInput = document.getElementById('updateHeroId');
    const nameInput = document.getElementById('updateHeroName');
    const imageUrlInput = document.getElementById('updateHeroImageUrl');
    const teamIdInput = document.getElementById('updateHeroTeamId');

    const heroId = parseInt(idInput.value.trim());
    const newHeroName = nameInput.value.trim();
    const newImageUrl = imageUrlInput.value.trim();
    const newTeamId = teamIdInput.value.trim(); // Can be empty string or '0' for unassign

    if (isNaN(heroId) || !newHeroName) {
        displayMessage('updateHeroMessage', 'Provide a valid Hero ID and a new name!', true);
        return;
    }

    const heroData = {
        heroID: heroId, // Ensure ID is sent in body for update
        heroName: newHeroName,
        imageUrl: newImageUrl
    };

    // Handle team assignment/unassignment during update
    if (newTeamId) {
        const parsedTeamId = parseInt(newTeamId);
        if (isNaN(parsedTeamId)) {
            displayMessage('updateHeroMessage', 'Invalid Team ID provided.', true);
            return;
        }
        if (parsedTeamId === 0) { // If 0, explicitly unassign team
            heroData.team = null;
        } else {
            heroData.team = { teamID: parsedTeamId };
        }
    } else {
        // If teamId input is empty, do not send team data, preserving existing team or null
        // If you want to explicitly unassign if input is empty, set heroData.team = null;
    }


    try {
        const response = await fetch(`${API_BASE_URL_HEROES}/${heroId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(heroData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const updatedHero = await response.json();
        displayMessage('updateHeroMessage', `Hero '${updatedHero.heroName}' (ID: ${updatedHero.heroID}) has had their saga updated!`);
        idInput.value = '';
        nameInput.value = '';
        imageUrlInput.value = '';
        teamIdInput.value = '';
        getAllHeroes(); // Refresh the list
        getAllTeams(); // Refresh teams to show updated hero counts if applicable
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

    if (!confirm(`Are you sure you want to banish Hero ID: ${heroId} from the realms? This cannot be undone!`)) {
        displayMessage('deleteHeroMessage', 'Banishment aborted by the Loremaster.', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL_HEROES}/${heroId}`, {
            method: 'DELETE',
        });

        if (response.status === 204) { // 204 No Content is expected for successful DELETE
            displayMessage('deleteHeroMessage', `Hero ID: ${heroId} has been sent to the Undying Lands.`);
            idInput.value = '';
            getAllHeroes(); // Refresh the list
            getAllTeams(); // Refresh teams to show updated hero counts if applicable
        } else if (response.ok) { // For other 2xx responses if any
            displayMessage('deleteHeroMessage', `Hero ID: ${heroId} deleted successfully.`);
            idInput.value = '';
            getAllHeroes();
            getAllTeams();
        }
        else {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
    } catch (error) {
        console.error('Error deleting hero:', error);
        displayMessage('deleteHeroMessage', `Failed to banish hero: ${error.message}`, true);
    }
}

// --- Team Operations ---

// 1. Create Team (POST)
async function createTeam() {
    const nameInput = document.getElementById('createTeamName');
    const mottoInput = document.getElementById('createTeamMotto');

    const teamName = nameInput.value.trim();
    const motto = mottoInput.value.trim();

    if (!teamName) {
        displayMessage('createTeamMessage', 'A team must have a name!', true);
        return;
    }

    try {
        const response = await fetch(API_BASE_URL_TEAMS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ teamName: teamName, motto: motto }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const newTeam = await response.json();
        displayMessage('createTeamMessage', `Team '${newTeam.teamName}' (ID: ${newTeam.teamID}) has been formed!`);
        nameInput.value = '';
        mottoInput.value = '';
        getAllTeams(); // Refresh the list of teams
    } catch (error) {
        console.error('Error creating team:', error);
        displayMessage('createTeamMessage', `Failed to form team: ${error.message}`, true);
    }
}

// 2. Get All Teams (GET)
async function getAllTeams() {
    const teamListDiv = document.getElementById('teamList');
    teamListDiv.innerHTML = '<p>Loading teams...</p>';

    try {
        const response = await fetch(API_BASE_URL_TEAMS);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const teams = await response.json();

        if (teams.length === 0) {
            teamListDiv.innerHTML = '<p>No teams found. Form new fellowships!</p>';
            displayMessage('getTeamsMessage', 'No teams are currently formed.');
            return;
        }

        const ul = document.createElement('ul');
        teams.forEach(team => {
            const li = document.createElement('li');
            li.classList.add('entity-list-item');

            const teamInfoDiv = document.createElement('div');
            teamInfoDiv.classList.add('entity-info');
            teamInfoDiv.innerHTML = `
                <span><strong>ID:</strong> ${team.teamID}</span>
                <span><strong>Name:</strong> ${team.teamName}</span>
                <span><strong>Motto:</strong> ${team.motto || 'N/A'}</span>
                <span><strong>Members:</strong> ${team.heroes && team.heroes.length > 0 ? team.heroes.map(h => h.heroName + ' (ID: ' + h.heroID + ')').join(', ') : 'None'}</span>
            `;
            li.appendChild(teamInfoDiv);
            ul.appendChild(li);
        });
        teamListDiv.innerHTML = '';
        teamListDiv.appendChild(ul);
        displayMessage('getTeamsMessage', `Successfully retrieved ${teams.length} teams.`);

    } catch (error) {
        console.error('Error fetching teams:', error);
        teamListDiv.innerHTML = '<p class="error">Failed to fetch teams. Is the server at the Misty Mountains running?</p>';
        displayMessage('getTeamsMessage', `Failed to retrieve teams: ${error.message}`, true);
    }
}

// 3. Update Team (PUT)
async function updateTeam() {
    const idInput = document.getElementById('updateTeamId');
    const nameInput = document.getElementById('updateTeamName');
    const mottoInput = document.getElementById('updateTeamMotto');

    const teamId = parseInt(idInput.value.trim());
    const newTeamName = nameInput.value.trim();
    const newMotto = mottoInput.value.trim();

    if (isNaN(teamId) || !newTeamName) {
        displayMessage('updateTeamMessage', 'Provide a valid Team ID and a new name!', true);
        return;
    }

    const teamData = {
        teamID: teamId,
        teamName: newTeamName,
        motto: newMotto
    };

    try {
        const response = await fetch(`${API_BASE_URL_TEAMS}/${teamId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teamData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const updatedTeam = await response.json();
        displayMessage('updateTeamMessage', `Team '${updatedTeam.teamName}' (ID: ${updatedTeam.teamID}) has had its banner updated!`);
        idInput.value = '';
        nameInput.value = '';
        mottoInput.value = '';
        getAllTeams(); // Refresh the list
        getAllHeroes(); // Refresh heroes to show updated team names if applicable
    } catch (error) {
        console.error('Error updating team:', error);
        displayMessage('updateTeamMessage', `Failed to update team: ${error.message}`, true);
    }
}

// 4. Delete Team (DELETE)
async function deleteTeam() {
    const idInput = document.getElementById('deleteTeamId');
    const teamId = parseInt(idInput.value.trim());

    if (isNaN(teamId)) {
        displayMessage('deleteTeamMessage', 'Enter a valid Team ID to disband!', true);
        return;
    }

    if (!confirm(`Are you sure you want to disband Team ID: ${teamId}? All associated heroes will become unassigned!`)) {
        displayMessage('deleteTeamMessage', 'Disbandment aborted.', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL_TEAMS}/${teamId}`, {
            method: 'DELETE',
        });

        if (response.status === 204) {
            displayMessage('deleteTeamMessage', `Team ID: ${teamId} has been disbanded.`);
            idInput.value = '';
            getAllTeams(); // Refresh the list
            getAllHeroes(); // Refresh heroes to show unassigned status
        } else if (response.ok) {
            displayMessage('deleteTeamMessage', `Team ID: ${teamId} deleted successfully.`);
            idInput.value = '';
            getAllTeams();
            getAllHeroes();
        }
        else {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
    } catch (error) {
        console.error('Error deleting team:', error);
        displayMessage('deleteTeamMessage', `Failed to disband team: ${error.message}`, true);
    }
}

// --- Quest Operations ---

// 1. Create Quest (POST)
async function createQuest() {
    const nameInput = document.getElementById('createQuestName');
    const descriptionInput = document.getElementById('createQuestDescription');

    const questName = nameInput.value.trim();
    const questDescription = descriptionInput.value.trim();

    if (!questName) {
        displayMessage('createQuestMessage', 'A quest must have a name!', true);
        return;
    }

    try {
        const response = await fetch(API_BASE_URL_QUESTS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ questName: questName, questDescription: questDescription }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const newQuest = await response.json();
        displayMessage('createQuestMessage', `Quest '${newQuest.questName}' (ID: ${newQuest.questID}) has been initiated!`);
        nameInput.value = '';
        descriptionInput.value = '';
        getAllQuests(); // Refresh the list of quests
    } catch (error) {
        console.error('Error creating quest:', error);
        displayMessage('createQuestMessage', `Failed to initiate quest: ${error.message}`, true);
    }
}

// 2. Get All Quests (GET)
async function getAllQuests() {
    const questListDiv = document.getElementById('questList');
    questListDiv.innerHTML = '<p>Loading quests...</p>';

    try {
        const response = await fetch(API_BASE_URL_QUESTS);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const quests = await response.json();

        if (quests.length === 0) {
            questListDiv.innerHTML = '<p>No quests found. Initiate new epic journeys!</p>';
            displayMessage('getQuestsMessage', 'No quests are currently active.');
            return;
        }

        const ul = document.createElement('ul');
        quests.forEach(quest => {
            const li = document.createElement('li');
            li.classList.add('entity-list-item');

            const questInfoDiv = document.createElement('div');
            questInfoDiv.classList.add('entity-info');
            questInfoDiv.innerHTML = `
                <span><strong>ID:</strong> ${quest.questID}</span>
                <span><strong>Name:</strong> ${quest.questName}</span>
                <span><strong>Description:</strong> ${quest.questDescription || 'N/A'}</span>
                <span><strong>Participants:</strong> ${quest.heroes && quest.heroes.length > 0 ? quest.heroes.map(h => h.heroName + ' (ID: ' + h.heroID + ')').join(', ') : 'None'}</span>
            `;
            li.appendChild(questInfoDiv);
            ul.appendChild(li);
        });
        questListDiv.innerHTML = '';
        questListDiv.appendChild(ul);
        displayMessage('getQuestsMessage', `Successfully retrieved ${quests.length} quests.`);

    } catch (error) {
        console.error('Error fetching quests:', error);
        questListDiv.innerHTML = '<p class="error">Failed to fetch quests. Is the server at the Misty Mountains running?</p>';
        displayMessage('getQuestsMessage', `Failed to retrieve quests: ${error.message}`, true);
    }
}

// 3. Update Quest (PUT)
async function updateQuest() {
    const idInput = document.getElementById('updateQuestId');
    const nameInput = document.getElementById('updateQuestName');
    const descriptionInput = document.getElementById('updateQuestDescription');

    const questId = parseInt(idInput.value.trim());
    const newQuestName = nameInput.value.trim();
    const newQuestDescription = descriptionInput.value.trim();

    if (isNaN(questId) || !newQuestName) {
        displayMessage('updateQuestMessage', 'Provide a valid Quest ID and a new name!', true);
        return;
    }

    const questData = {
        questID: questId,
        questName: newQuestName,
        questDescription: newQuestDescription
    };

    try {
        const response = await fetch(`${API_BASE_URL_QUESTS}/${questId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const updatedQuest = await response.json();
        displayMessage('updateQuestMessage', `Quest '${updatedQuest.questName}' (ID: ${updatedQuest.questID}) has had its details updated!`);
        idInput.value = '';
        nameInput.value = '';
        descriptionInput.value = '';
        getAllQuests(); // Refresh the list
        getAllHeroes(); // Refresh heroes to show updated quest names if applicable
    } catch (error) {
        console.error('Error updating quest:', error);
        displayMessage('updateQuestMessage', `Failed to update quest: ${error.message}`, true);
    }
}

// 4. Delete Quest (DELETE)
async function deleteQuest() {
    const idInput = document.getElementById('deleteQuestId');
    const questId = parseInt(idInput.value.trim());

    if (isNaN(questId)) {
        displayMessage('deleteQuestMessage', 'Enter a valid Quest ID to abandon!', true);
        return;
    }

    if (!confirm(`Are you sure you want to abandon Quest ID: ${questId}? All hero assignments to this quest will be removed!`)) {
        displayMessage('deleteQuestMessage', 'Abandonment aborted.', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL_QUESTS}/${questId}`, {
            method: 'DELETE',
        });

        if (response.status === 204) {
            displayMessage('deleteQuestMessage', `Quest ID: ${questId} has been abandoned.`);
            idInput.value = '';
            getAllQuests(); // Refresh the list
            getAllHeroes(); // Refresh heroes to show removed quest assignments
        } else if (response.ok) {
            displayMessage('deleteQuestMessage', `Quest ID: ${questId} deleted successfully.`);
            idInput.value = '';
            getAllQuests();
            getAllHeroes();
        }
        else {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
    } catch (error) {
        console.error('Error deleting quest:', error);
        displayMessage('deleteQuestMessage', `Failed to abandon quest: ${error.message}`, true);
    }
}

// --- Relationship Operations (Hero-Quest Many-to-Many) ---

// Assign Hero to Quest
async function assignHeroToQuest() {
    const heroIdInput = document.getElementById('assignHeroId');
    const questIdInput = document.getElementById('assignQuestId');

    const heroId = parseInt(heroIdInput.value.trim());
    const questId = parseInt(questIdInput.value.trim());

    if (isNaN(heroId) || isNaN(questId)) {
        displayMessage('assignQuestMessage', 'Please enter valid Hero and Quest IDs.', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL_HEROES}/${heroId}/assignQuest/${questId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const updatedHero = await response.json();
        displayMessage('assignQuestMessage', `Hero '${updatedHero.heroName}' assigned to Quest ID: ${questId}!`);
        heroIdInput.value = '';
        questIdInput.value = '';
        getAllHeroes(); // Refresh heroes to show new quest assignment
        getAllQuests(); // Refresh quests to show new hero participant
    } catch (error) {
        console.error('Error assigning hero to quest:', error);
        displayMessage('assignQuestMessage', `Failed to assign hero: ${error.message}`, true);
    }
}

// Remove Hero from Quest
async function removeHeroFromQuest() {
    const heroIdInput = document.getElementById('assignHeroId'); // Reusing same inputs
    const questIdInput = document.getElementById('assignQuestId');

    const heroId = parseInt(heroIdInput.value.trim());
    const questId = parseInt(questIdInput.value.trim());

    if (isNaN(heroId) || isNaN(questId)) {
        displayMessage('assignQuestMessage', 'Please enter valid Hero and Quest IDs.', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL_HEROES}/${heroId}/removeQuest/${questId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const updatedHero = await response.json();
        displayMessage('assignQuestMessage', `Hero '${updatedHero.heroName}' removed from Quest ID: ${questId}.`);
        heroIdInput.value = '';
        questIdInput.value = '';
        getAllHeroes(); // Refresh heroes
        getAllQuests(); // Refresh quests
    } catch (error) {
        console.error('Error removing hero from quest:', error);
        displayMessage('assignQuestMessage', `Failed to remove hero: ${error.message}`, true);
    }
}

// --- Initial Load ---

// Call all "get all" functions when the page loads to populate the lists
document.addEventListener('DOMContentLoaded', () => {
    getAllHeroes();
    getAllTeams();
    getAllQuests();
});
