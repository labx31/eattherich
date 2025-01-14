const userWeightInput = document.getElementById('user-weight');
const userWealthInput = document.getElementById('user-wealth');
const calculateBiteValueButton = document.getElementById('calculate-bite-value');
const userBiteValueDisplay = document.getElementById('user-bite-value');
const achievementListElement = document.getElementById('achievement-list');
const BITES_PER_POUND = 22;


const billionaires = [
    {
        name: 'Elon Musk',
        netWorth: 432000000000,
        weightLbs: 190,
        id: 'musk',
        img: 'musk.png',
        flavorText: 'Notes of burnt circuits and rocket fuel, served on a bed of unhinged tweets.',
        buttonText: 'Munch on Musk'
    },
    {
        name: 'Jeff Bezos',
        netWorth: 238000000000,
        weightLbs: 154,
        id: 'bezos',
        img: 'bezos.png',
        flavorText: 'Efficiency with a hint of cardboard and a lingering aftertaste of worker exploitation.',
        buttonText: 'Take a Bite of Bezos'
    },
    {
        name: 'Mark Zuckerberg',
        netWorth: 215000000000,
        weightLbs: 155,
        id: 'zuckerberg',
        img: 'zuck.png',
        flavorText: 'Baked-in privacy violations, with a red-pilled boomer drizzle.',
        buttonText: 'Tuck into Zuck'
    }
];

const unlockedAchievements = new Set(); // Keep track of unlocked achievements

function calculateUserBiteValue() {
    const weight = parseFloat(userWeightInput.value);
    const wealth = parseFloat(userWealthInput.value);

    if (isNaN(weight) || isNaN(wealth) || weight <= 0 || wealth <= 0) {
        alert('Please enter valid weight and net worth.');
        return;
    }

    const userBiteValue = wealth / (weight * BITES_PER_POUND);
    userBiteValueDisplay.textContent = `Your value per bite: $${userBiteValue.toLocaleString('en-US', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function calculateBiteValue(billionaire) {
    const totalBites = billionaire.weightLbs * BITES_PER_POUND;
    return billionaire.netWorth / totalBites;
}

function initializeBillionaires() {
    const billionaireCardsContainer = document.getElementById('billionaire-cards');

    billionaires.forEach(billionaire => {
        const card = document.createElement('div');
        card.classList.add('billionaire-card');
        card.id = billionaire.id;

        card.innerHTML = `
        <h3 class="name">${billionaire.name}</h3>
        <img src="${billionaire.img}" alt="${billionaire.name}" class="billionaire-img">
        <p class="flavor-text">${billionaire.flavorText}</p>
        <div class="stats-grid">
            <div class="stat">
                <span class="stat-label">Net Worth:</span>
                <span class="stat-value">$${billionaire.netWorth.toLocaleString()}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Per Bite:</span>
                <span class="stat-value">$${calculateBiteValue(billionaire).toLocaleString('en-US', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Bites Taken:</span>
                <span class="stat-value bite-count">0</span>
            </div>
        </div>
        <button class="take-bite-button">${billionaire.buttonText}</button>
    `;

        billionaireCardsContainer.appendChild(card);

        // Attach event listener to the "Take a Bite" button here (inside initializeBillionaires)
        const button = card.querySelector('.take-bite-button');
        button.addEventListener('click', () => takeBite(billionaire.id));
    });
}

function takeBite(billionaireId) {
    const billionaire = billionaires.find(b => b.id === billionaireId);
    const card = document.getElementById(billionaireId);
    const biteCountSpan = card.querySelector('.bite-count');
    let biteCount = parseInt(biteCountSpan.textContent);
    biteCount++;
    biteCountSpan.textContent = biteCount;

    const biteValue = calculateBiteValue(billionaire);
    updateTotalWealth(biteValue);
}

let totalWealth = 0;
const totalWealthDisplay = document.getElementById('total-wealth');
const resetMealButton = document.getElementById('reset-meal');

function updateTotalWealth(amount) {
    totalWealth += amount;
    totalWealthDisplay.textContent = `Meal Value: $${totalWealth.toLocaleString('en-US', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
    checkAchievements(); // Check for achievements after updating wealth

    // Temporarily change text color for animation
    totalWealthDisplay.style.color = '#daa520';
    setTimeout(() => {
        totalWealthDisplay.style.color = ''; // Reset to original color
    }, 500);
}

function resetMeal() {
    totalWealth = 0;
    totalWealthDisplay.textContent = `Meal Value: $0`;

    billionaires.forEach(billionaire => {
        const card = document.getElementById(billionaire.id);
        const biteCountSpan = card.querySelector('.bite-count');
        biteCountSpan.textContent = 0;
    });

    // **4. Reset Achievements on Meal Reset:**
    unlockedAchievements.clear(); // Clear the set of unlocked achievements
    achievementListElement.innerHTML = ''; // Remove the achievement list items from the display
}

const achievementsList = [
    {
        id: 'first-bite',
        title: "First Taste of the Rich",
        description: "You've taken your first bite!",
        condition: (bites) => Object.values(bites).some(count => count > 0)
    },
    {
        id: 'millionaire',
        title: "Instant Millionaire",
        description: "Your accumulated wealth exceeds $1 million!",
        condition: (bites, wealth) => wealth >= 1000000
    },
    {
        id: 'billionaire',
        title: "Billionaire by Bite",
        description: "You've eaten your way to billionaire status!",
        condition: (bites, wealth) => wealth >= 1000000000
    },
    {
        id: 'gourmet',
        title: "Gourmet Taster",
        description: "You've sampled all three billionaires!",
        condition: (bites) => bites['musk'] >= 1 && bites['zuckerberg'] >= 1 && bites['bezos'] >= 1
    },
    {
        id: 'feast',
        title: "Feast of Fortune",
        description: "You've taken 10 or more bites!",
        condition: (bites) => Object.values(bites).reduce((a, b) => a + b, 0) >= 10
    },
    {
        id: 'expensive-taste',
        title: "Expensive Taste",
        description: "Took 5 bites of the priciest billionaire. Fancy!",
        condition: (bites) => bites['musk'] >= 5
    },
    {
        id: 'wealth-hoarder',
        title: "Wealth Hoarder",
        description: "Accumulated more than $10 billion. Dragon status achieved!",
        condition: (bites, wealth) => wealth >= 10000000000
    },
    {
        id: 'buffet-master',
        title: "All You Can Eat",
        description: "Took 20+ bites total. Hope you're not full!",
        condition: (bites) => Object.values(bites).reduce((a, b) => a + b, 0) >= 20
    },
    {
        id: 'social-security',
        title: "Social Security Secured",
        description: "Accumulated enough to fund Social Security for a day!",
        condition: (bites, wealth) => wealth >= 2300000000
    },
    {
        id: 'universal-healthcare',
        title: "Healthcare Hero",
        description: "Enough bites to fund a small city's healthcare for a year!",
        condition: (bites, wealth) => wealth >= 5000000000
    },
    {
        id: 'education-enthusiast',
        title: "Education Enthusiast",
        description: "Could fund an entire university's yearly budget!",
        condition: (bites, wealth) => wealth >= 1000000000
    },
    {
        id: 'foodie-philanthropist',
        title: "Foodie Philanthropist",
        description: "Acquired a taste for eating the rich... for good causes!",
        condition: (bites, wealth) => wealth >= 10000000000
    },
    {
        id: 'michelin-star',
        title: "Michelin Star Wealth Redistribution",
        description: "Expertly sampled each billionaire in perfect proportion!",
        condition: (bites) => {
            const total = Object.values(bites).reduce((a, b) => a + b, 0);
            return total >= 10 && Object.values(bites).every(count => count >= 3);
        }
    },
    {
        id: 'space-program',
        title: "Space Program Funded",
        description: "Accumulated enough wealth to fund a mission to Mars!",
        condition: (bites, wealth) => wealth >= 100000000000
    },
    {
        id: 'world-hunger',
        title: "World Hunger Solver",
        description: "Could end world hunger for a year with your accumulated wealth!",
        condition: (bites, wealth) => wealth >= 330000000000
    },
    {
        id: 'climate-champion',
        title: "Climate Change Champion",
        description: "Enough wealth to fund major climate change initiatives!",
        condition: (bites, wealth) => wealth >= 150000000000
    },
    {
        id: 'housing-hero',
        title: "Housing Hero",
        description: "Could provide affordable housing for an entire city!",
        condition: (bites, wealth) => wealth >= 50000000000
    },
    {
        id: 'infrastructure-icon',
        title: "Infrastructure Icon",
        description: "Accumulated enough to rebuild America's bridges and roads!",
        condition: (bites, wealth) => wealth >= 200000000000
    },
    {
        id: 'equality-enthusiast',
        title: "Equality Enthusiast",
        description: "Redistributed enough wealth to significantly reduce income inequality!",
        condition: (bites, wealth) => wealth >= 500000000000
    }
];

function checkAchievements() {
    const currentBites = {};
    billionaires.forEach(billionaire => {
        const card = document.getElementById(billionaire.id);
        const biteCountSpan = card.querySelector('.bite-count');
        currentBites[billionaire.id] = parseInt(biteCountSpan.textContent);
    });

    let achievementsUnlocked = false; // Flag to track if any achievements were unlocked

    achievementsList.forEach(achievement => {
        if (!unlockedAchievements.has(achievement.id) && achievement.condition(currentBites, totalWealth)) {
            unlockedAchievements.add(achievement.id);
            displayAchievement(achievement);
            achievementsUnlocked = true; // Set the flag to true
        }
    });

    // Show or hide the achievements section based on the flag
    const achievementsSection = document.getElementById('achievements');
    
    // ALWAYS show the section if achievements have been unlocked
    if (unlockedAchievements.size > 0) { 
        achievementsSection.style.display = 'block';
    } else {
        achievementsSection.style.display = 'none';
    }
}

function displayAchievement(achievement) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <div class="achievement-title">${achievement.title}</div>
        <div class="achievement-description">${achievement.description}</div>
    `;
    listItem.classList.add('new-achievement'); // Add animation class
    achievementListElement.appendChild(listItem);
}

// Initialize billionaires and calculate bite value button
initializeBillionaires();
calculateBiteValueButton.addEventListener('click', calculateUserBiteValue);
resetMealButton.addEventListener('click', resetMeal);