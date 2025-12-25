let countries = [];
let currentMode = 0; 
let score = 0;
let timeLeft = 0;
let timerInterval;
let gameActive = false;
let currentQuestion = null;
let questionsList = [];

// --- DEV ÜLKE LİSTESİ (ISO KODU -> TÜRKÇE İSİM) ---
// Haritadaki id="TR" kodunu "Türkiye" ile eşleştirir.
const countryNames = {
    "TR": "Türkiye", "US": "ABD", "DE": "Almanya", "FR": "Fransa", "GB": "İngiltere",
    "RU": "Rusya", "CN": "Çin", "IN": "Hindistan", "BR": "Brezilya", "CA": "Kanada",
    "AU": "Avustralya", "IT": "İtalya", "ES": "İspanya", "JP": "Japonya", "KR": "Güney Kore",
    "MX": "Meksika", "AR": "Arjantin", "EG": "Mısır", "ZA": "Güney Afrika", "SA": "Suudi Arabistan",
    "IR": "İran", "IQ": "Irak", "GR": "Yunanistan", "UA": "Ukrayna", "SE": "İsveç",
    "NO": "Norveç", "FI": "Finlandiya", "PL": "Polonya", "NL": "Hollanda", "PT": "Portekiz",
    "AZ": "Azerbaycan", "KZ": "Kazakistan", "UZ": "Özbekistan", "PK": "Pakistan", "ID": "Endonezya",
    "CH": "İsviçre", "BE": "Belçika", "AT": "Avusturya", "DK": "Danimarka", "HU": "Macaristan",
    "CZ": "Çekya", "RS": "Sırbistan", "RO": "Romanya", "BG": "Bulgaristan", "SY": "Suriye",
    "IL": "İsrail", "AE": "Birleşik Arap Emirlikleri", "QA": "Katar", "KW": "Kuveyt", "LB": "Lübnan",
    "JO": "Ürdün", "YE": "Yemen", "OM": "Umman", "AF": "Afganistan", "TM": "Türkmenistan",
    "KG": "Kırgızistan", "TJ": "Tacikistan", "MN": "Moğolistan", "TH": "Tayland", "VN": "Vietnam",
    "MY": "Malezya", "PH": "Filipinler", "NZ": "Yeni Zelanda", "DZ": "Cezayir", "MA": "Fas",
    "TN": "Tunus", "LY": "Libya", "SD": "Sudan", "ET": "Etiyopya", "KE": "Kenya",
    "NG": "Nijerya", "GH": "Gana", "CM": "Kamerun", "SN": "Senegal", "SO": "Somali",
    "TZ": "Tanzanya", "UG": "Uganda", "MZ": "Mozambik", "ZW": "Zimbabve", "AO": "Angola",
    "CI": "Fildişi Sahili", "CL": "Şili", "PE": "Peru", "CO": "Kolombiya", "VE": "Venezuela",
    "EC": "Ekvador", "BO": "Bolivya", "PY": "Paraguay", "UY": "Uruguay", "CU": "Küba",
    "DO": "Dominik Cumhuriyeti", "HT": "Haiti", "JM": "Jamaika", "PA": "Panama", "CR": "Kosta Rika",
    "GT": "Guatemala", "HN": "Honduras", "SV": "El Salvador", "NI": "Nikaragua", "IS": "İzlanda",
    "IE": "İrlanda", "EE": "Estonya", "LV": "Letonya", "LT": "Litvanya", "BY": "Belarus",
    "MD": "Moldova", "SK": "Slovakya", "SI": "Slovenya", "HR": "Hırvatistan", "BA": "Bosna Hersek",
    "ME": "Karadağ", "MK": "Kuzey Makedonya", "AL": "Arnavutluk", "CY": "Kıbrıs", "GE": "Gürcistan",
    "AM": "Ermenistan", "TW": "Tayvan", "KP": "Kuzey Kore", "BD": "Bangladeş", "LK": "Sri Lanka",
    "NP": "Nepal", "MM": "Myanmar", "KH": "Kamboçya", "LA": "Laos"
};

// --- TÜRKÇE KARAKTER TEMİZLEME VE DÜZELTME ---
function trToEng(str) {
    if (!str) return "";
    let clean = str.replace(/Ğ/g, 'g').replace(/Ü/g, 'u').replace(/Ş/g, 's').replace(/I/g, 'i').replace(/İ/g, 'i').replace(/Ö/g, 'o').replace(/Ç/g, 'c')
                   .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
                   .toLowerCase().trim();
    return clean;
}

// --- HARİTAYI KUR ---
window.addEventListener("DOMContentLoaded", () => {
    setupMap();
    
    // Enter tuşu ile tahmin (Mod 1)
    document.getElementById("world-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") handleTypeGuess();
    });
});

function setupMap() {
    const paths = document.querySelectorAll("path");
    paths.forEach(path => {
        // SVG içindeki ID bazen "TR", bazen "path342" olabilir ama name="Türkiye" olabilir.
        // Genelde ID veya name attribute kullanılır.
        let code = path.id.toUpperCase();
        
        // Eğer ID yoksa veya uzunsa class veya name'e bak (SVG yapısına göre değişir)
        if (!code || code.length > 2) {
             // Yedek kontrol: name özelliği var mı?
             const nameAttr = path.getAttribute("name");
             if(nameAttr) {
                 // İsmi bizim listede tersine aratmamız gerekebilir ama şimdilik ID'den gidelim
             }
        }

        if (countryNames[code]) {
            countries.push({
                element: path,
                code: code,
                name: countryNames[code],
                cleanName: trToEng(countryNames[code])
            });
            
            // Mouse gelince isim göster (Tooltip)
            const titleEl = document.createElement("title");
            titleEl.textContent = countryNames[code];
            path.appendChild(titleEl);
            
            // Tıklama olayı (Mod 1 ve Mod 2 için farklı işleyecek)
            path.addEventListener("click", () => {
                // Şimdilik sadece görsel efekt veya ileride tıklayarak bulma için
            });
        }
    });
}

// --- OYUN SEÇİMİ ---
function selectWorldGame(mode) {
    currentMode = mode;
    document.getElementById("world-menu").style.display = "none";
    const title = document.getElementById("game-title");
    
    // Alanları temizle/gizle
    document.getElementById("input-area").style.display = "none";
    document.getElementById("options-area").style.display = "none";
    document.getElementById("flag-container").style.display = "none";
    document.getElementById("target-display").textContent = "";

    if (mode === 1) {
        // İSİM YAZMA MODU
        title.textContent = "Mod 1: İsmini Yaz & Boya";
        document.getElementById("input-area").style.display = "block";
        document.getElementById("target-display").textContent = "Bildiğin ülke isimlerini yaz...";
        document.getElementById("world-input").focus();
        startGame(240); // 4 Dakika (Çok ülke var)
    } else if (mode === 2) {
        // ŞIKLI BAYRAK MODU
        title.textContent = "Mod 2: Bayrağı Bil";
        document.getElementById("flag-container").style.display = "block";
        document.getElementById("options-area").style.display = "flex";
        startGame(90); // 90 saniye
    }
}

function startGame(time) {
    score = 0;
    timeLeft = time;
    gameActive = true;
    updateStats();
    questionsList = [...countries]; // Listeyi kopyala

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateStats();
        if (timeLeft <= 0) endGame();
    }, 1000);

    if (currentMode === 2) askFlagQuestion();
}

// --- MOD 1: İSİM YAZMA (AKILLI KONTROL) ---
function handleTypeGuess() {
    if (!gameActive || currentMode !== 1) return;

    const input = document.getElementById("world-input");
    const feedback = document.getElementById("typed-feedback");
    let val = trToEng(input.value);

    // --- EŞ ANLAMLI VE YAYGIN HATALAR ---
    // Kullanıcı "Amerika" yazar ama kod "ABD"dir.
    if (val === "amerika" || val === "usa" || val === "birlesik devletler") val = "abd";
    if (val === "ingiltere" || val === "birlesik krallik" || val === "uk") val = "ingiltere";
    if (val === "guney kore" || val === "kore") val = "guney kore";
    if (val === "kuzey kore") val = "kuzey kore";
    if (val === "bosna" || val === "bosna hersek") val = "bosna hersek";
    if (val === "cekya" || val === "cek cumhuriyeti") val = "cekya";
    if (val === "bae" || val === "birlesik arap emirlikleri") val = "birlesik arap emirlikleri";
    // ------------------------------------

    const foundCountry = countries.find(c => c.cleanName === val);

    if (foundCountry) {
        if (foundCountry.element.style.fill === "rgb(46, 204, 113)") { // Zaten yeşilse
            feedback.textContent = "Bunu zaten buldun!";
            feedback.style.color = "orange";
        } else {
            // DOĞRU
            foundCountry.element.style.fill = "#2ecc71"; // Yeşil
            score += 10;
            updateStats();
            feedback.textContent = "✅ " + foundCountry.name;
            feedback.style.color = "green";
            input.value = "";
        }
    } else {
        feedback.textContent = "❌ Ülke bulunamadı veya haritada yok.";
        feedback.style.color = "red";
    }
}

// --- MOD 2: ŞIKLI BAYRAK ---
function askFlagQuestion() {
    if (questionsList.length === 0) {
        endGame(true);
        return;
    }
    
    // Soru seç
    const randomIndex = Math.floor(Math.random() * questionsList.length);
    currentQuestion = questionsList[randomIndex];
    questionsList.splice(randomIndex, 1); // Listeden çıkar

    // Bayrağı göster (FlagCDN küçük harf ister: tr, us)
    document.getElementById("flag-img").src = `https://flagcdn.com/w320/${currentQuestion.code.toLowerCase()}.png`;
    document.getElementById("target-display").textContent = "Hangi Ülke?";

    // Şıkları Hazırla (1 Doğru + 3 Yanlış)
    let options = [currentQuestion];
    
    // Yanlış şıklar bul
    while (options.length < 4) {
        const randomWrong = countries[Math.floor(Math.random() * countries.length)];
        // Eğer zaten şıklarda yoksa ve undefined değilse ekle
        if (randomWrong && !options.includes(randomWrong)) {
            options.push(randomWrong);
        }
    }

    // Şıkları karıştır
    options.sort(() => Math.random() - 0.5);

    // Butonları oluştur
    const area = document.getElementById("options-area");
    area.innerHTML = ""; // Temizle
    
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
    
    // Tıklamaları engelle
    allBtns.forEach(b => b.onclick = null);

    if (selected.code === currentQuestion.code) {
        // DOĞRU
        btnElement.classList.add("correct");
        score += 10;
        // Haritada da yeşil yakalım (hoşluk olsun)
        currentQuestion.element.style.fill = "#2ecc71";
        setTimeout(askFlagQuestion, 1000);
    } else {
        // YANLIŞ
        btnElement.classList.add("wrong");
        score -= 5;
        // Doğru olanı göster
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
    document.getElementById("final-message").textContent = win ? "Tebrikler! Hepsini bildin. 🎉" : "Süre Doldu!";
    document.getElementById("final-score").textContent = score;
    
    if (win) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
}