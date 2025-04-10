// Initialize
let userClicks = 0;
let isPremium = false;
let isBoosted = false;

// DOM Elements
const clickBtn = document.getElementById('clickBtn');
const userClicksDisplay = document.getElementById('userClicks');
const globalClicksDisplay = document.getElementById('globalClicks');

// Click Handler
clickBtn.addEventListener('click', () => {
    // Calculate clicks (premium = 2x, boost = 2x)
    const clickValue = (isPremium ? 2 : 1) * (isBoosted ? 2 : 1);
    userClicks += clickValue;
    
    // Update displays
    userClicksDisplay.textContent = userClicks;
    
    // Animation
    clickBtn.classList.add('clicked');
    setTimeout(() => clickBtn.classList.remove('clicked'), 200);
    
    // Save to Firebase
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + userId).update({
        clicks: userClicks,
        lastClick: Date.now()
    });
});

// Real-time Updates
firebase.database().ref('users').on('value', (snapshot) => {
    let totalClicks = 0;
    const users = [];
    
    snapshot.forEach((user) => {
        totalClicks += user.val().clicks || 0;
        users.push({
            name: user.val().username,
            clicks: user.val().clicks
        });
    });
    
    // Update global counter
    globalClicksDisplay.textContent = totalClicks;
    
    // Update leaderboard
    updateLeaderboard(users.sort((a,b) => b.clicks - a.clicks).slice(0,5));
});

function updateLeaderboard(topUsers) {
    const leaderboard = document.getElementById('top5');
    leaderboard.innerHTML = '';
    
    topUsers.forEach((user, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="rank">${index + 1}.</span>
            <span class="name">${user.name}</span>
            <span class="score">${user.clicks} clicks</span>
        `;
        leaderboard.appendChild(li);
    });
}