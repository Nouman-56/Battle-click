// Secure Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDrH91_90321shECBZ8mFmTAk86MpBeu6I",
    authDomain: "battle-clicks.firebaseapp.com",
    projectId: "battle-clicks",
    storageBucket: "battle-clicks.appspot.com",
    messagingSenderId: "930865479621",
    appId: "1:930865479621:web:5262af035fe2938740d5ac"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

document.getElementById('startBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    
    if(username.length >= 3) {
        try {
            // 1. Save username
            localStorage.setItem('battleUsername', username);
            
            // 2. Anonymous auth
            await firebase.auth().signInAnonymously();
            
            // 3. Create user in database
            await firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
                username: username,
                clicks: 0,
                joined: Date.now()
            });
            
            // 4. Redirect with 100% guarantee
            window.location.href = "dashboard.html";
            
        } catch (error) {
            console.error("Auth error:", error);
            alert("Login failed. Please try again.");
        }
    } else {
        alert("Battle ID must be at least 3 characters");
    }
});