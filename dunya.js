let countries = [];
let currentMode = 0; 
let score = 0;
let timeLeft = 0;
let timerInterval;
let gameActive = false;
let currentQuestion = null;
let questionsList = [];

// --- HARİTA VERİ TABANI (Senin SVG dosyana özel) ---
// Hem ID (AF, DE) hem CLASS (Turkey, Russian Federation) destekler.
const countryData = {
    // --- SINIF İSMİ (CLASS) KULLANANLAR ---
    "TURKEY": { name: "Türkiye", flag: "tr" },
    "RUSSIAN FEDERATION": { name: "Rusya", flag: "ru" },
    "UNITED STATES": { name: "ABD", flag: "us" },
    "CHINA": { name: "Çin", flag: "cn" },
    "BRAZIL": { name: "Brezilya", flag: "br" },
    "CANADA": { name: "Kanada", flag: "ca" },
    "AUSTRALIA": { name: "Avustralya", flag: "au" },
    "INDIA": { name: "Hindistan", flag: "in" },
    "ARGENTINA": { name: "Arjantin", flag: "ar" },
    "KAZAKHSTAN": { name: "Kazakistan", flag: "kz" },
    "ALGERIA": { name: "Cezayir", flag: "dz" },
    "GREENLAND": { name: "Grönland", flag: "gl" },
    "MONGOLIA": { name: "Moğolistan", flag: "mn" },
    "INDONESIA": { name: "Endonezya", flag: "id" },
    "MEXICO": { name: "Meksika", flag: "mx" },
    "SAUDI ARABIA": { name: "Suudi Arabistan", flag: "sa" },
    "IRAN": { name: "İran", flag: "ir" },
    "NORWAY": { name: "Norveç", flag: "no" },
    "SWEDEN": { name: "İsveç", flag: "se" },
    "FINLAND": { name: "Finlandiya", flag: "fi" },
    "UKRAINE": { name: "Ukrayna", flag: "ua" },
    "UNITED KINGDOM": { name: "İngiltere", flag: "gb" },
    "FRANCE": { name: "Fransa", flag: "fr" },
    "SPAIN": { name: "İspanya", flag: "es" },
    "ITALY": { name: "İtalya", flag: "it" },
    "GERMANY": { name: "Almanya", flag: "de" },
    "POLAND": { name: "Polonya", flag: "pl" },
    "JAPAN": { name: "Japonya", flag: "jp" },
    "SOUTH AFRICA": { name: "Güney Afrika", flag: "za" },
    "EGYPT": { name: "Mısır", flag: "eg" },
    "PAKISTAN": { name: "Pakistan", flag: "pk" },
    "THAILAND": { name: "Tayland", flag: "th" },
    "VIETNAM": { name: "Vietnam", flag: "vn" },
    "PHILIPPINES": { name: "Filipinler", flag: "ph" },
    "NEW ZEALAND": { name: "Yeni Zelanda", flag: "nz" },
    "CHILE": { name: "Şili", flag: "cl" },
    "PERU": { name: "Peru", flag: "pe" },
    "COLOMBIA": { name: "Kolombiya", flag: "co" },
    "VENEZUELA": { name: "Venezuela", flag: "ve" },
    "MALAYSIA": { name: "Malezya", flag: "my" },
    "GREECE": { name: "Yunanistan", flag: "gr" },
    "ROMANIA": { name: "Romanya", flag: "ro" },
    
    // --- ID KODU KULLANANLAR (Senin SVG'deki 2 harfliler) ---
    "AF": { name: "Afganistan", flag: "af" },
    "AL": { name: "Arnavutluk", flag: "al" },
    "AO": { name: "Angola", flag: "ao" },
    "AT": { name: "Avusturya", flag: "at" },
    "AZ": { name: "Azerbaycan", flag: "az" },
    "BD": { name: "Bangladeş", flag: "bd" },
    "BE": { name: "Belçika", flag: "be" },
    "BG": { name: "Bulgaristan", flag: "bg" },
    "BO": { name: "Bolivya", flag: "bo" },
    "BA": { name: "Bosna Hersek", flag: "ba" },
    "BY": { name: "Belarus", flag: "by" },
    "CH": { name: "İsviçre", flag: "ch" },
    "CU": { name: "Küba", flag: "cu" },
    "CZ": { name: "Çekya", flag: "cz" },
    "DK": { name: "Danimarka", flag: "dk" },
    "EC": { name: "Ekvador", flag: "ec" },
    "EE": { name: "Estonya", flag: "ee" },
    "ET": { name: "Etiyopya", flag: "et" },
    "GE": { name: "Gürcistan", flag: "ge" },
    "GH": { name: "Gana", flag: "gh" },
    "HU": { name: "Macaristan", flag: "hu" },
    "HR": { name: "Hırvatistan", flag: "hr" },
    "IQ": { name: "Irak", flag: "iq" },
    "IE": { name: "İrlanda", flag: "ie" },
    "IL": { name: "İsrail", flag: "il" },
    "IS": { name: "İzlanda", flag: "is" },
    "JO": { name: "Ürdün", flag: "jo" },
    "KE": { name: "Kenya", flag: "ke" },
    "KG": { name: "Kırgızistan", flag: "kg" },
    "KH": { name: "Kamboçya", flag: "kh" },
    "KP": { name: "Kuzey Kore", flag: "kp" },
    "KR": { name: "Güney Kore", flag: "kr" },
    "KW": { name: "Kuveyt", flag: "kw" },
    "LA": { name: "Laos", flag: "la" },
    "LK": { name: "Sri Lanka", flag: "lk" },
    "LT": { name: "Litvanya", flag: "lt" },
    "LV": { name: "Letonya", flag: "lv" },
    "LY": { name: "Libya", flag: "ly" },
    "MA": { name: "Fas", flag: "ma" },
    "MD": { name: "Moldova", flag: "md" },
    "MG": { name: "Madagaskar", flag: "mg" },
    "MK": { name: "Kuzey Makedonya", flag: "mk" },
    "MM": { name: "Myanmar", flag: "mm" },
    "MZ": { name: "Mozambik", flag: "mz" },
    "NG": { name: "Nijerya", flag: "ng" },
    "NL": { name: "Hollanda", flag: "nl" },
    "NP": { name: "Nepal", flag: "np" },
    "NZ": { name: "Yeni Zelanda", flag: "nz" },
    "OM": { name: "Umman", flag: "om" },
    "PH": { name: "Filipinler", flag: "ph" },
    "PK": { name: "Pakistan", flag: "pk" },
    "PL": { name: "Polonya", flag: "pl" },
    "PT": { name: "Portekiz", flag: "pt" },
    "PY": { name: "Paraguay", flag: "py" },
    "QA": { name: "Katar", flag: "qa" },
    "RO": { name: "Romanya", flag: "ro" },
    "RS": { name: "Sırbistan", flag: "rs" },
    "SD": { name: "Sudan", flag: "sd" },
    "SI": { name: "Slovenya", flag: "si" },
    "SK": { name: "Slovakya", flag: "sk" },
    "SN": { name: "Senegal", flag: "sn" },
    "SO": { name: "Somali", flag: "so" },
    "SY": { name: "Suriye", flag: "sy" },
    "TJ": { name: "Tacikistan", flag: "tj" },
    "TM": { name: "Türkmenistan", flag: "tm" },
    "TN": { name: "Tunus", flag: "tn" },
    "TZ": { name: "Tanzanya", flag: "tz" },
    "UG": { name: "Uganda", flag: "ug" },
    "UY": { name: "Uruguay", flag: "uy" },
    "UZ": { name: "Özbekistan", flag: "uz" },
    "YE": { name: "Yemen", flag: "ye" },
    "ZM": { name: "Zambiya", flag: "zm" },
    "ZW": { name: "Zimbabve", flag: "zw" }
};

// --- TÜRKÇE KARAKTER TEMİZLEME ---
function trToEng(str) {
    if (!str) return "";
    return str.replace(/Ğ/g, 'g').replace(/Ü/g, 'u').replace(/Ş/g, 's').replace(/I/g, 'i').replace(/İ/g, 'i').replace(/Ö/g, 'o').replace(/Ç/g, 'c')
              .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
              .toLowerCase().trim();
}

// --- HARİTAYI KUR ---
window.addEventListener("DOMContentLoaded", () => {
    setupMap();
    
    // Yazma alanına Enter özelliği
    const inputField = document.getElementById("world-input");
    if (inputField) {
        inputField.addEventListener("keypress", function(event) {
            if (event.key === "Enter") handleTypeGuess();
        });
    }
});

function setupMap() {
    const paths = document.querySelectorAll("path");
    
    // Her bir path için kontrol et
    paths.forEach(path => {
        // 1. Önce ID var mı bak (AF, TR gibi)
        let idKey = path.id ? path.id.toUpperCase() : "";
        
        // 2. Class var mı bak (Turkey, United States gibi)
        let classKey = path.getAttribute("class") ? path.getAttribute("class").toUpperCase() : "";
        
        // Eşleşme bul (Önce Class, sonra ID dene)
        let match = countryData[classKey] || countryData[idKey];

        if (match) {
            // Path elementine bizim verimizi ekle
            path.setAttribute("data-game-name", match.name); // Türkçe isim
            path.setAttribute("data-game-key", trToEng(match.name)); // Karşılaştırma anahtarı (turkiye)
            
            // Eğer ülke zaten listede yoksa listeye ekle (Tekrarları önle)
            if (!countries.find(c => c.name === match.name)) {
                countries.push({
                    name: match.name,
                    cleanName: trToEng(match.name),
                    flagCode: match.flag
                });
            }

            // Mouse üzerine gelince isim göster (Title)
            let title = path.querySelector("title");
            if (!title) {
                title = document.createElement("title");
                path.appendChild(title);
            }
            title.textContent = match.name;
        }
    });
    
    console.log("Harita Yüklendi. Tanınan Ülke Sayısı:", countries.length);
}

// --- OYUN SEÇİMİ ---
function selectWorldGame(mode) {
    currentMode = mode;
    document.getElementById("world-menu").style.display = "none";
    const title = document.getElementById("game-title");
    
    document.getElementById("input-area").style.display = "none";
    document.getElementById("options-area").style.display = "none";
    document.getElementById("flag-container").style.display = "none";
    document.getElementById("target-display").textContent = "";

    if (mode === 1) {
        title.textContent = "Mod 1: İsmini Yaz & Boya";
        document.getElementById("input-area").style.display = "block";
        document.getElementById("target-display").textContent = "Bildiğin ülke isimlerini yaz...";
        document.getElementById("world-input").focus();
        startGame(240); 
    } else if (mode === 2) {
        title.textContent = "Mod 2: Bayrağı Bil";
        document.getElementById("flag-container").style.display = "block";
        document.getElementById("options-area").style.display = "flex";
        startGame(90); 
    }
}

function startGame(time) {
    score = 0;
    timeLeft = time;
    gameActive = true;
    updateStats();
    questionsList = [...countries]; 

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateStats();
        if (timeLeft <= 0) endGame();
    }, 1000);

    if (currentMode === 2) askFlagQuestion();
}

// --- MOD 1: İSİM YAZMA ---
function handleTypeGuess() {
    if (!gameActive || currentMode !== 1) return;

    const input = document.getElementById("world-input");
    const feedback = document.getElementById("typed-feedback");
    let val = trToEng(input.value);

    // Eş Anlamlı Düzeltmeler
    if (val === "amerika" || val === "usa") val = "abd";
    if (val === "ingiltere" || val === "birlesik krallik") val = "ingiltere";
    if (val === "guney kore") val = "guney kore";
    if (val === "cek cumhuriyeti") val = "cekya";

    // Listede var mı?
    const foundCountry = countries.find(c => c.cleanName === val);

    if (foundCountry) {
        // Haritada bu ülkeye ait TÜM parçaları bul ve boya
        // (Çünkü Türkiye SVG'de 2 parça, ABD 50 parça olabilir)
        const allPaths = document.querySelectorAll(`path[data-game-key="${val}"]`);
        let alreadyFound = false;

        allPaths.forEach(p => {
            if (p.style.fill === "rgb(46, 204, 113)") alreadyFound = true;
            p.style.fill = "#2ecc71"; // Yeşil
        });

        if (alreadyFound) {
            feedback.textContent = "Bunu zaten buldun!";
            feedback.style.color = "orange";
        } else {
            score += 10;
            updateStats();
            feedback.textContent = "✅ " + foundCountry.name;
            feedback.style.color = "green";
            input.value = "";
        }
    } else {
        feedback.textContent = "❌ Haritada bulunamadı (veya ismi farklı).";
        feedback.style.color = "red";
    }
}

// --- MOD 2: ŞIKLI BAYRAK ---
function askFlagQuestion() {
    if (questionsList.length === 0) {
        endGame(true);
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * questionsList.length);
    currentQuestion = questionsList[randomIndex];
    questionsList.splice(randomIndex, 1);

    // FlagCDN
    document.getElementById("flag-img").src = `https://flagcdn.com/w320/${currentQuestion.flagCode}.png`;
    document.getElementById("target-display").textContent = "Hangi Ülke?";

    // Şıklar
    let options = [currentQuestion];
    while (options.length < 4) {
        const randomWrong = countries[Math.floor(Math.random() * countries.length)];
        if (randomWrong && !options.includes(randomWrong)) {
            options.push(randomWrong);
        }
    }
    options.sort(() => Math.random() - 0.5);

    const area = document.getElementById("options-area");
    area.innerHTML = ""; 
    
    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.textContent = opt.name;
        btn.onclick = () => checkFlagAnswer(opt, btn);
        area.appendChild(btn);
    });
}

function checkFlagAnswer(selected, btnElement) {
    if (!gameActive) return;

    const allBtns = document.querySelectorAll(".option-btn");
    allBtns.forEach(b => b.onclick = null);

    if (selected.name === currentQuestion.name) {
        btnElement.classList.add("correct");
        score += 10;
        
        // Haritada o ülkeyi yeşil yak (Görsel efekt)
        const mapPaths = document.querySelectorAll(`path[data-game-name="${currentQuestion.name}"]`);
        mapPaths.forEach(p => p.style.fill = "#2ecc71");

        setTimeout(askFlagQuestion, 1000);
    } else {
        btnElement.classList.add("wrong");
        score -= 5;
        allBtns.forEach(b => {
            if (b.textContent === currentQuestion.name) b.classList.add("correct");
        });
        setTimeout(askFlagQuestion, 1500);
    }
    updateStats();
}

function updateStats() {
    document.getElementById("score").textContent = score;
    document.getElementById("timer").textContent = timeLeft;
}

function endGame(win = false) {
    gameActive = false;
    clearInterval(timerInterval);
    document.getElementById("game-over-modal").style.display = "flex";
    document.getElementById("final-message").textContent = win ? "Tebrikler! 🎉" : "Süre Doldu!";
    document.getElementById("final-score").textContent = score;
    
    if (win) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
}