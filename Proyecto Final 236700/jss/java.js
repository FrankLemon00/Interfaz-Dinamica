// ==========================================
// CONTROLADOR PRINCIPAL (UI & USUARIOS)
// ==========================================

// IMPORTAR funciones del módulo de juego
import { initGameCanvas, startGameLoop, stopGame } from './game_logic.js';

// --- VARIABLES UI ---
const USER_DB_KEY = 'userDB';
const SESSION_KEY = 'currentUser';
let views = {}; 

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    const u = getCurrentUser();
    if(u) renderView('profile', u); else renderView('login');
});

function initializeElements() {
    views = {
        login: document.getElementById('login-view'),
        register: document.getElementById('register-view'),
        profile: document.getElementById('profile-view'),
        game: document.getElementById('game-view')
    };
    
    // Inicializar Canvas
    const c = document.getElementById('gameCanvas');
    initGameCanvas(c, c.getContext('2d'));
    
    // Listeners Formularios
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Navegación
    document.getElementById('btnLogout').addEventListener('click', logoutUser);
    document.getElementById('show-register').addEventListener('click', (e) => { e.preventDefault(); renderView('register'); });
    document.getElementById('show-login').addEventListener('click', (e) => { e.preventDefault(); renderView('login'); });
    
    // Botones Juego
    document.getElementById('btnStartGame').addEventListener('click', () => { 
        const u = getCurrentUser(); 
        if(u) renderView('game', u); 
    });
    document.getElementById('btnBackToProfile').addEventListener('click', () => renderView('profile', getCurrentUser()));
    
    // Stats Modal
    document.getElementById('inGameStatsRetry').addEventListener('click', () => {
        document.getElementById('inGameStats').classList.add('hidden');
        launchGame();
    });
    document.getElementById('inGameStatsClose').addEventListener('click', () => {
        document.getElementById('inGameStats').classList.add('hidden');
    });
    document.getElementById('btnShowStats').addEventListener('click', () => {
        document.getElementById('inGameStats').classList.toggle('hidden');
    });
}

// --- FUNCIONES DEL JUEGO (PUENTE CON MÓDULO) ---

function launchGame() {
    startGameLoop(
        (score, lives) => updateHUD(score, lives), // Callback update
        (finalScore) => handleGameEnd(finalScore)  // Callback game over
    );
}

function updateHUD(score, lives) {
    document.getElementById('hud-score').textContent = `Score: ${Math.floor(score)}`;
    document.getElementById('hud-lives').textContent = `Vidas: ${lives}`;
}

function handleGameEnd(finalScore) {
    document.getElementById('inGameStats').classList.remove('hidden');
    
    const u = getCurrentUser();
    const score = Math.floor(finalScore);
    
    document.getElementById('inGameStatsUsername').textContent = u.username;
    document.getElementById('inGameStatsScore').textContent = score;
    document.getElementById('inGameStatsRecord').textContent = Math.floor(u.bestScore);
    
    // Guardar datos
    const db = loadUserDB();
    const idx = db.findIndex(x => x.email === u.email);
    
    if(idx !== -1) {
        db[idx].gamesPlayed++;
        db[idx].totalScore = (db[idx].totalScore || 0) + score;
        
        if(score > db[idx].bestScore) {
            db[idx].bestScore = score;
            document.getElementById('inGameStatsRecord').textContent = score + " (NUEVO)";
        }
        
        if(!db[idx].history) db[idx].history = [];
        db[idx].history.push({ date: new Date(), score: score, status: 'Perdió' });
        
        saveUserDB(db);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(db[idx]));
    }
}

// --- GESTIÓN DE USUARIOS ---

function loadUserDB() { try { return JSON.parse(localStorage.getItem(USER_DB_KEY)) || []; } catch(e){ return []; } }
function saveUserDB(db) { localStorage.setItem(USER_DB_KEY, JSON.stringify(db)); }
function getCurrentUser() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch(e){ return null; } }

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    const db = loadUserDB();
    const user = db.find(u => u.email === email && u.password === pass);
    if(user) { sessionStorage.setItem(SESSION_KEY, JSON.stringify(user)); renderView('profile', user); }
    else document.getElementById('login-message').textContent = "Credenciales incorrectas";
}

function handleRegister(e) {
    e.preventDefault();
    const user = {
        username: document.getElementById('reg-username').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value,
        favoriteColor: document.getElementById('reg-favorite-color').value,
        gamesPlayed: 0, bestScore: 0, totalScore: 0, history: []
    };
    const db = loadUserDB();
    if(db.some(u => u.email === user.email)) { document.getElementById('register-message').textContent = "Correo ya existe"; return; }
    db.push(user); saveUserDB(db);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    renderView('profile', user);
}

function logoutUser() { sessionStorage.removeItem(SESSION_KEY); renderView('login'); }

function renderView(name, user) {
    stopGame(); 
    Object.values(views).forEach(v => v.classList.add('hidden'));
    
    if(name === 'profile') {
        const db = loadUserDB();
        user = db.find(u => u.email === user.email) || user;
        
        document.getElementById('profile-username').textContent = user.username;
        document.getElementById('prof-email').textContent = user.email;
        document.getElementById('prof-color').textContent = user.favoriteColor;
        document.getElementById('prof-best-score').textContent = Math.floor(user.bestScore || 0);
        document.getElementById('prof-games-played').textContent = user.gamesPlayed || 0;
        document.getElementById('prof-total-score').textContent = Math.floor(user.totalScore || 0);
        
        const list = document.getElementById('game-history-list');
        list.innerHTML = '';
        (user.history || []).sort((a,b)=>new Date(b.date)-new Date(a.date)).forEach(h => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${h.status}</span><span>${h.score} pts</span>`;
            li.className = h.status === 'Ganó' ? 'status-win' : 'status-loss';
            list.appendChild(li);
        });
        views.profile.classList.remove('hidden');
    } 
    else if(name === 'game') {
        document.getElementById('hud-username').textContent = user.username;
        document.getElementById('inGameStats').classList.add('hidden');
        views.game.classList.remove('hidden');
        launchGame(); 
    }
    else if(name === 'register') views.register.classList.remove('hidden');
    else views.login.classList.remove('hidden');
}