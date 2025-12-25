let countries = [];
let currentMode = 0; // 1: İsim, 2: Bayrak
let score = 0;
let timeLeft = 0;
let timerInterval;
let gameActive = false;
let currentQuestion = null;
let questionsList = [];

// Ülke Kodları Sözlüğü (SVG kodunu Türkçeye çevirir)
// SVG'deki id'ler genelde 2 harfli ISO kodudur (TR, US, DE, FR...)
const countryNames = {
    "TR": "Türkiye", "US": "ABD", "DE": "Almanya", "FR": "Fransa", "GB": "İngiltere",
    "RU": "Rusya", "CN": "Çin", "IN": "Hindistan", "BR": "Brezilya", "CA": "Kanada",
    "AU": "Avustralya", "IT": "İtalya", "ES": "İspanya", "JP": "Japonya", "KR": "Güney Kore",
    "MX": "Meksika", "AR": "Arjantin", "EG": "Mısır", "ZA": "Güney Afrika", "SA": "Suudi Arabistan",
    "IR": "İran", "IQ": "Irak", "GR": "Yunanistan", "UA": "Ukrayna", "SE": "İsveç",
    "NO": "Norveç", "FI": "Finlandiya", "PL": "Polonya", "NL": "Hollanda", "PT": "Portekiz",
    "AZ": "Azerbaycan", "KZ": "Kazakistan", "UZ": "Özbekistan", "PK": "Pakistan", "ID": "Endonezya"
};

// --- HARİTAYI YÜKLE ---
window.addEventListener("DOMContentLoaded", async () => {
    // world.svg dosyasını çek ve sayfaya göm
    try {
        const response = await fetch('world.svg');
        const svgText = await response.text();
        document.getElementById('map-wrapper').innerHTML = svgText;
        
        // Harita yüklendikten sonra ülkeleri tara
        setupMap();
    } catch (error) {
        document.getElementById('svg-placeholder').textContent = "Hata: world.svg dosyası bulunamadı! Dosyayı oluşturup içine SVG kodlarını yapıştırdın mı?";
        document.getElementById('svg-placeholder').style.color = "red";
    }
});

function setupMap() {
    const paths = document.querySelectorAll("path");
    
    paths.forEach(path => {
        const code = path.id.toUpperCase(); // TR, US, DE...
        
        // Eğer bizim sözlükte bu ülke varsa listeye ekle
        if (countryNames[code]) {
            countries.push({
                element: path,
                code: code,
                name: countryNames[code]
            });

            // Tıklama olayı
            path.addEventListener("click", () => handleMapClick(path, code));
            
            // Mouse üzerine gelince ismi göster (Title ekle)
            const titleEl = document.createElement("title");
            titleEl.textContent = countryNames[code];
            path.appendChild(titleEl);
        }
    });
}

// --- OYUN SEÇİMİ ---
function selectWorldGame(mode) {
    currentMode = mode;
    document.getElementById("world-menu").style.display = "none";
    
    const title = document.getElementById("game-title");
    
    if (mode === 1) {
        title.textContent = "Mod 1: Ülkeyi Bul";
        startGame(90);
    } else if (mode === 2) {
        title.textContent = "Mod 2: Bayrağı Bul";
        document.getElementById("flag-container").style.display = "block"; // Bayrağı aç
        startGame(90);
    }
}

function startGame(time) {
    score = 0;
    timeLeft = time;
    gameActive = true;
    updateStats();
    document.getElementById("question-area").style.display = "block";
    
    questionsList = [...countries]; // Listeyi kopyala

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateStats();
        if (timeLeft <= 0) endGame();
    }, 1000);

    askNewQuestion();
}

function askNewQuestion() {
    if (questionsList.length === 0) {
        endGame(true);
        return;
    }

    // Rastgele Ülke Seç
    const randomIndex = Math.floor(Math.random() * questionsList.length);
    currentQuestion = questionsList[randomIndex];
    questionsList.splice(randomIndex, 1);

    const display = document.getElementById("target-display");
    const flagImg = document.getElementById("flag-img");

    if (currentMode === 1) {
        // İsim Sor
        display.textContent = currentQuestion.name.toUpperCase() + " nerede?";
        document.getElementById("flag-container").style.display = "none";
    } else if (currentMode === 2) {
        // Bayrak Sor
        display.textContent = "Bu bayrak hangi ülkenin?";
        document.getElementById("flag-container").style.display = "block";
        // FlagCDN'den bayrağı çek (kodları küçük harf ister: tr, us)
        flagImg.src = `https://flagcdn.com/w320/${currentQuestion.code.toLowerCase()}.png`;
    }
}

function handleMapClick(path, clickedCode) {
    if (!gameActive) return;

    if (clickedCode === currentQuestion.code) {
        // DOĞRU
        path.style.fill = "#2ecc71"; // Yeşil (Style.css'i ezmek için style ile verdim)
        score += 10;
        updateStats();
        setTimeout(() => {
            path.style.fill = ""; // Rengi eski haline getir
            askNewQuestion();
        }, 500);
    } else {
        // YANLIŞ
        path.style.fill = "#e74c3c"; // Kırmızı
        score -= 5;
        updateStats();
        setTimeout(() => {
            path.style.fill = "";
        }, 500);
    }
}

function updateStats() {
    document.getElementById("score").textContent = score;
    document.getElementById("timer").textContent = timeLeft;
}

function endGame(win = false) {
    gameActive = false;
    clearInterval(timerInterval);
    document.getElementById("game-over-modal").style.display = "flex";
    document.getElementById("final-message").textContent = win ? "Dünya Turu Tamamlandı! 🎉" : "Süre Doldu!";
    document.getElementById("final-score").textContent = score;

    if (win) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
}