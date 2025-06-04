// Sample typing text paragraphs
const typingTexts = [
    "The quick brown fox jumps over the lazy dog. This pangram contains all the letters of the English alphabet. It is widely used for touch-typing practice, testing typewriters and computer keyboards, displaying examples of fonts, and other applications requiring text that makes use of all letters in the alphabet.",
    "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using a variety of computer programming languages, such as JavaScript, Python, and C++.",
    "According to all known laws of aviation, there is no way that a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible.",
    "The Internet is the global system of interconnected computer networks that uses the Internet protocol suite to communicate between networks and devices. It is a network of networks that consists of private, public, academic, business, and government networks of local to global scope."
];

// DOM elements
const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const timer = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');

// Variables
let currentText = '';
let timeLeft = 60;
let timerInterval;
let testActive = false;
let totalTypedChars = 0;
let correctTypedChars = 0;
let startTime;

// Initialize the test
function initTest() {
    // Choose random text
    currentText = typingTexts[Math.floor(Math.random() * typingTexts.length)];
    
    // Format and display the text
    textDisplay.innerHTML = currentText.split('').map(char => 
        `<span>${char}</span>`
    ).join('');
    
    // Reset variables
    inputField.value = '';
    timeLeft = 60;
    totalTypedChars = 0;
    correctTypedChars = 0;
    testActive = false;
    
    // Update displays
    timer.textContent = timeLeft;
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    
    // Clear any existing intervals
    if (timerInterval) clearInterval(timerInterval);
    
    // Enable input field
    inputField.disabled = false;
    inputField.focus();
}

// Start the timer
function startTimer() {
    startTime = new Date();
    testActive = true;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

// End the test
function endTest() {
    clearInterval(timerInterval);
    testActive = false;
    inputField.disabled = true;
    
    // Save results to localStorage
    const results = {
        id: Date.now(), // Add unique ID based on timestamp
        date: new Date().toLocaleString(),
        wpm: parseInt(wpmDisplay.textContent),
        accuracy: accuracyDisplay.textContent,
        timeSpent: 60 - timeLeft,
        totalChars: totalTypedChars,
        correctChars: correctTypedChars,
        errors: totalTypedChars - correctTypedChars
    };
    
    // Get existing results or create new array
    let allResults = JSON.parse(localStorage.getItem('allTypingResults')) || [];
    
    // Add new result to the beginning of the array
    allResults.unshift(results);
    
    // Store in localStorage
    localStorage.setItem('allTypingResults', JSON.stringify(allResults));
    localStorage.setItem('typingTestResults', JSON.stringify(results)); // Keep for compatibility
    
    // Redirect to results page
    window.location.href = 'result.html';
}

// Calculate WPM and accuracy
function updateStats() {
    const timeElapsed = (new Date() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = inputField.value.trim().split(/\s+/).length;
    
    // Calculate WPM (standardized to 5 characters per word)
    const wpm = Math.round(correctTypedChars / 5 / timeElapsed);
    wpmDisplay.textContent = wpm;
    
    // Calculate accuracy
    const accuracy = totalTypedChars === 0 ? 100 : Math.floor((correctTypedChars / totalTypedChars) * 100);
    accuracyDisplay.textContent = `${accuracy}%`;
}

// Event listeners
inputField.addEventListener('input', () => {
    if (!testActive && inputField.value.length > 0) {
        startTimer();
    }
    
    const inputValue = inputField.value;
    totalTypedChars = inputValue.length;
    correctTypedChars = 0;
    
    const textSpans = textDisplay.querySelectorAll('span');
    
    for (let i = 0; i < textSpans.length; i++) {
        if (i < inputValue.length) {
            textSpans[i].classList.remove('active');
            
            if (inputValue[i] === textSpans[i].textContent) {
                textSpans[i].classList.add('correct');
                textSpans[i].classList.remove('incorrect');
                correctTypedChars++;
            } else {
                textSpans[i].classList.add('incorrect');
                textSpans[i].classList.remove('correct');
            }
        } else {
            textSpans[i].classList.remove('correct', 'incorrect');
            
            if (i === inputValue.length) {
                textSpans[i].classList.add('active');
            } else {
                textSpans[i].classList.remove('active');
            }
        }
    }
    
    updateStats();
    
    // Auto-end test when the whole text is typed
    if (inputValue.length >= currentText.length) {
        endTest();
    }
});

restartBtn.addEventListener('click', initTest);

// Initialize on page load
window.addEventListener('load', initTest);