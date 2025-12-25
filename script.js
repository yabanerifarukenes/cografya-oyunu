// --- VERİLER ---
let cities = [];      
let currentMode = 0;  
let score = 0;
let timeLeft = 0;
let timerInterval;
let gameActive = false;
let currentQuestion = null; 
let questionsList = [];     

// Plaka Listesi (Referans Veri)
const plateData = {
    "adana": 1, "adiyaman": 2, "afyonkarahisar": 3, "agri": 4, "amasya": 5, "ankara": 6, "antalya": 7, "artvin": 8, "aydin": 9, "balikesir": 10,
    "bilecik": 11, "bingol": 12, "bitlis": 13, "bolu": 14, "burdur": 15, "bursa": 16, "canakkale": 17, "cankiri": 18, "corum": 19, "denizli": 20,
    "diyarbakir": 21, "edirne": 22, "elazig": 23, "erzincan": 24, "erzurum": 25, "eskisehir": 26, "gaziantep": 27, "giresun": 28, "gumushane": 29, "hakkari": 30,
    "hatay": 31, "isparta": 32, "mersin": 33, "istanbul": 34, "izmir": 35, "kars": 36, "kastamonu": 37, "kayseri": 38, "kirklareli": 39, "kirsehir": 40,
    "kocaeli": 41, "konya": 42, "kutahya": 43, "malatya": 44, "manisa": 45, "kahramanmaras": 46, "mardin": 47, "mugla": 48, "mus": 49, "nevsehir": 50,
    "nigde": 51, "ordu": 52, "rize": 53, "sakarya": 54, "samsun": 55, "siirt": 56, "sinop": 57, "sivas": 58, "tekirdag": 59, "tokat": 60,
    "trabzon": 61, "tunceli": 62, "sanliurfa": 63, "usak": 64, "van": 65, "yozgat": 66, "zonguldak": 67, "aksaray": 68, "bayburt": 69, "karaman": 70,
    "kirikkale": 71, "batman": 72, "sirnak": 73, "bartin": 74, "ardahan": 75, "igdir": 76, "yalova": 77, "karabuk": 78, "kilis": 79, "osmaniye": 80, "duzce": 81
};

// --- TÜRKÇE KARAKTER DÜZELTİCİ ---
function trToEng(str) {
    if (!str) return "";
    return str.replace(/Ğ/g, 'g').replace(/Ü/g, 'u').replace(/Ş/g, 's').replace(/I/g, 'i').replace(/İ/g, 'i').replace(/Ö/g, 'o').replace(/Ç/g, 'c')
              .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
              .toLowerCase()
              .trim();
}

// --- HARİTA YÜKLEME VE İSİM DÜZELTMELERİ ---
document.addEventListener("DOMContentLoaded", () => {
    const paths = document.querySelectorAll("path");
    
    paths.forEach(path => {
        let rawName = path.getAttribute("title") || path.getAttribute("name") || path.id;
        
        if (rawName) {
            let cleanKey = trToEng(rawName);

            // ===========================================
            // SENİN İSTEDİĞİN İSİM DÜZELTME KODU BURADA
            // ===========================================

            // Afyon -> Afyonkarahisar
            if (cleanKey === "afyon") cleanKey = "afyonkarahisar";

            // Antep -> Gaziantep
            if (cleanKey === "antep") cleanKey = "gaziantep";

            // Maraş -> Kahramanmaraş (veya kahramanmaras)
            if (cleanKey === "maras" || cleanKey.includes("kahraman")) cleanKey = "kahramanmaras";

            // Urfa -> Şanlıurfa
            if (cleanKey === "urfa") cleanKey = "sanliurfa";

            // İçel -> Mersin
            if (cleanKey === "icel") cleanKey = "mersin";

            // Kırıkkale Hataları
            if (cleanKey.includes("kirik") && cleanKey.includes("kale")) cleanKey = "kirikkale";
            if (cleanKey.includes("kinkkale")) cleanKey = "kirikkale"; // Haritadaki yazım hatası için

            // Zonguldak Hataları
            if (cleanKey.includes("zongul")) cleanKey = "zonguldak";

            // ===========================================

            if (plateData[cleanKey]) {
                cities.push({
                    element: path,
                    key: cleanKey, 
                    displayName: rawName,
                    plate: plateData[cleanKey]
                });
            }

            path.addEventListener("click", () => handleMapClick(path, cleanKey));
        }
    });

    document.getElementById("game-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            handleInputGuess();
        }
    });
});

// --- MENÜ İŞLEMLERİ ---
function showMainMenu() {
    document.getElementById("main-menu").style.display = "flex";
    document.getElementById("game-over-modal").style.display = "none";
    gameActive = false;
    clearInterval(timerInterval);
    resetMapColors();
}

function selectGame(mode) {
    currentMode = mode;
    document.getElementById("main-menu").style.display = "none";
    resetMapColors();
    
    const qArea = document.getElementById("question-area");
    const iArea = document.getElementById("input-area");
    const title = document.getElementById("game-title");
    const input = document.getElementById("game-input");

    if (mode === 1) {
        title.textContent = "Mod 1: Haritada Bul";
        qArea.style.display = "block";
        iArea.style.display = "none";
        startGameCommon(60); 
    } else if (mode === 2) {
        title.textContent = "Mod 2: Şehir İsimlerini Yaz";
        qArea.style.display = "none";
        iArea.style.display = "block";
        input.placeholder = "Şehir ismini yaz ve Enter'a bas...";
        input.value = "";
        input.focus();
        startGameCommon(180); 
    } else if (mode === 3) {
        title.textContent = "Mod 3: Şehrin Plakasını Yaz";
        qArea.style.display = "block";
        iArea.style.display = "block";
        input.placeholder = "Plaka kodunu yaz (örn: 06)";
        input.value = "";
        input.focus();
        startGameCommon(90); 
    }
}

function startGameCommon(time) {
    score = 0;
    timeLeft = time;
    gameActive = true;
    updateStats();
    document.getElementById("typed-feedback").textContent = "";
    
    questionsList = [...cities]; 

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateStats();
        if (timeLeft <= 0) endGame();
    }, 1000);

    if (currentMode === 1 || currentMode === 3) {
        askNewQuestion();
    }
}

function restartCurrentGame() {
    selectGame(currentMode);
    document.getElementById("game-over-modal").style.display = "none";
}

// --- OYUN AKIŞI ---

function askNewQuestion() {
    if (questionsList.length === 0) {
        endGame(true);
        return;
    }
    const randomIndex = Math.floor(Math.random() * questionsList.length);
    currentQuestion = questionsList[randomIndex];
    questionsList.splice(randomIndex, 1);

    const display = document.getElementById("target-display");
    
    if (currentMode === 1) {
        display.textContent = currentQuestion.displayName.toUpperCase();
    } else if (currentMode === 3) {
        display.textContent = currentQuestion.displayName.toUpperCase() + " plakası kaç?";
        document.getElementById("game-input").value = "";
        document.getElementById("game-input").focus();
    }
}

function handleMapClick(path, clickedKey) {
    if (!gameActive || currentMode !== 1) return;

    if (clickedKey === currentQuestion.key) {
        path.classList.add("correct");
        score += 10;
        updateStats();
        setTimeout(askNewQuestion, 400);
    } else {
        path.classList.add("wrong");
        score -= 5;
        updateStats();
        setTimeout(() => path.classList.remove("wrong"), 400);
    }
}

function handleInputGuess() {
    if (!gameActive) return;
    
    const inputEl = document.getElementById("game-input");
    const feedback = document.getElementById("typed-feedback");
    const rawVal = inputEl.value;
    const cleanVal = trToEng(rawVal); 

    if (currentMode === 2) {
        // --- İSİM DÜZELTMELERİ (Yazarken de geçerli olsun) ---
        let searchKey = cleanVal;
        if (searchKey === "afyon") searchKey = "afyonkarahisar";
        if (searchKey === "antep") searchKey = "gaziantep";
        if (searchKey === "maras") searchKey = "kahramanmaras";
        if (searchKey === "urfa") searchKey = "sanliurfa";
        if (searchKey === "icel") searchKey = "mersin";
        if (searchKey.includes("kirik") && searchKey.includes("kale")) searchKey = "kirikkale";
        // -----------------------------------------------------

        const foundCity = cities.find(c => c.key === searchKey);

        if (foundCity) {
            if (foundCity.element.classList.contains("correct")) {
                feedback.textContent = "Bunu zaten buldun!";
                feedback.style.color = "orange";
            } else {
                foundCity.element.classList.add("correct");
                score += 10;
                feedback.textContent = "✅ " + foundCity.displayName.toUpperCase();
                feedback.style.color = "green";
                inputEl.value = "";
            }
        } else {
            feedback.textContent = "❌ Şehir bulunamadı.";
            feedback.style.color = "red";
        }
    }

    else if (currentMode === 3) {
        const userPlate = parseInt(rawVal);
        if (userPlate === currentQuestion.plate) {
            score += 10;
            feedback.textContent = "✅ Doğru!";
            feedback.style.color = "green";
            currentQuestion.element.classList.add("correct");
            setTimeout(askNewQuestion, 600);
        } else {
            score -= 5;
            feedback.textContent = "❌ Yanlış! Tekrar dene.";
            feedback.style.color = "red";
        }
        updateStats();
    }
    updateStats();
}

function updateStats() {
    document.getElementById("score").textContent = score;
    document.getElementById("timer").textContent = timeLeft;
}

function resetMapColors() {
    cities.forEach(c => c.element.classList.remove("correct", "wrong"));
}

function endGame(win = false) {
    gameActive = false;
    clearInterval(timerInterval);
    const modal = document.getElementById("game-over-modal");
    
    // Mesajı ayarla
    document.getElementById("final-message").textContent = win ? "Tebrikler! Hepsini bitirdin! 🎉" : "Süre Doldu!";
    document.getElementById("final-score").textContent = score;
    modal.style.display = "flex";

    // EĞER KAZANDIYSA KONFETİ PATLAT
    if (win) {
        var duration = 3 * 1000; // 3 saniye sürsün
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            // Ekranın iki yanından rastgele fırlat
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }
}