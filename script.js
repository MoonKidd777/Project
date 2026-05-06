// --- Словарь ---
const WORDS = {
    "Яблоко": "apple",
    "Банан": "banana",
    "Кот": "cat",
    "Собака": "dog",
    "Дом": "house",
    "Машина": "car",
    "Книга": "book"
};

// --- Элементы DOM ---
const wordDisplay = document.getElementById('word-display');
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const resetBtn = document.getElementById('reset-btn');
const resultBox = document.getElementById('result-box');
const finalScore = document.getElementById('final-score');
const mistakesList = document.getElementById('mistakes-list');
const directionRadios = document.querySelectorAll('input[name="direction"]');

// --- Состояние игры ---
let wordsArray = [];
let currentIndex = 0;
let stats = { correct: 0, mistakes: 0 };
let mistakesLog = [];
let alreadyMistaked = false; // Флаг для логики "ошибка + исправление = 0 баллов"
let currentCorrectAnswer = '';
let wordForLog = ''; // Какое слово записывать в лог ошибок

// --- Функции ---
function shuffleArray(array) {
    // Перемешивание массива (Алгоритм Фишера-Йетса)
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function resetGame() {
    // Сброс игры при старте или смене направления
    wordsArray = Object.entries(WORDS);
    shuffleArray(wordsArray);
    
    currentIndex = 0;
    stats = { correct: 0, mistakes: 0 };
    mistakesLog = [];
    alreadyMistaked = false;
    
    resultBox.classList.add('hidden');
    
    updateWordDisplay();
}

function updateWordDisplay() {
    if (currentIndex < wordsArray.length) {
        const [ruWord, enWord] = wordsArray[currentIndex];
        const direction = document.querySelector('input[name="direction"]:checked').value;
        
        if (direction === 'ru_to_en') {
            wordDisplay.textContent = `Введите перевод (RU → EN): ${ruWord}`;
            currentCorrectAnswer = enWord.toLowerCase();
            wordForLog = ruWord; // Логируем русское слово
        } else {
            wordDisplay.textContent = `Введите перевод (EN → RU): ${enWord}`;
            currentCorrectAnswer = ruWord.toLowerCase();
            wordForLog = enWord; // Логируем английское слово
        }
        
        userInput.value = '';
        userInput.disabled = false;
        checkBtn.disabled = false;
        userInput.focus();
        
    } else {
        showResults();
    }
}

function checkAnswer() {
    const userAnswer = userInput.value.trim().toLowerCase();
    
    if (userAnswer === currentCorrectAnswer) {
        // Логика подсчета баллов согласно вашему требованию:
        if (!alreadyMistaked) {
            stats.correct += 1; // +1 балл только если не было ошибок
        }
        
        currentIndex++;
        alreadyMistaked = false; // Сбрасываем флаг для следующего слова
        
        updateWordDisplay();
        
    } else {
        // Ошибка
        if (!alreadyMistaked) {
            stats.mistakes += 1;
            
            if (!mistakesLog.includes(wordForLog)) {
                mistakesLog.push(wordForLog);
            }
            
            alert(`❌ Ошибка! Правильный ответ: ${currentCorrectAnswer.charAt(0).toUpperCase() + currentCorrectAnswer.slice(1)}`);
            
            alreadyMistaked = true; // Устанавливаем флаг, что ошибка уже была на этом слове
        }
        
        userInput.value = ''; // Очищаем поле ввода после ошибки
        userInput.focus();
    }
}

function showResults() {
    wordDisplay.textContent = '';
    userInput.disabled = true;
    
    finalScore.textContent = `✅ Правильных ответов: ${stats.correct}\n❌ Ошибок допущено: ${stats.mistakes}`;
    
    if (mistakesLog.length > 0) {
        mistakesList.textContent = `Слова с ошибками:\n${mistakesLog.join(', ')}`;
    } else {
        mistakesList.textContent = 'Слова с ошибками:\n—';
    }
    
    resultBox.classList.remove('hidden');
}

// --- Слушатели событий ---
checkBtn.addEventListener('click', checkAnswer);
resetBtn.addEventListener('click', resetGame);
directionRadios.forEach(radio => radio.addEventListener('change', resetGame));
userInput.addEventListener('keydown', function(event) {
   if (event.key === 'Enter') checkAnswer(); 
});

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', resetGame);
