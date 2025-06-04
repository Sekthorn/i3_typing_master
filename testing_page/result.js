// DOM elements
const finalWpm = document.getElementById('final-wpm');
const finalAccuracy = document.getElementById('final-accuracy');
const finalTime = document.getElementById('final-time');
const charsTyped = document.getElementById('chars-typed');
const correctChars = document.getElementById('correct-chars');
const errorCount = document.getElementById('error-count');
const tryAgainBtn = document.getElementById('try-again-btn');
const resultsList = document.getElementById('results-list');

// Display results
function displayResults() {
    // Get latest result from localStorage
    const latestResult = JSON.parse(localStorage.getItem('typingTestResults'));
    
    if (latestResult) {
        finalWpm.textContent = latestResult.wpm;
        finalAccuracy.textContent = latestResult.accuracy;
        finalTime.textContent = `${latestResult.timeSpent}s`;
        charsTyped.textContent = latestResult.totalChars;
        correctChars.textContent = latestResult.correctChars;
        errorCount.textContent = latestResult.errors;
    } else {
        // No results found, handle this case
        console.error('No test results found');
        finalWpm.textContent = 'N/A';
        finalAccuracy.textContent = 'N/A';
    }
    
    // Display all previous results
    displayAllResults();
}

// Display all previous results
function displayAllResults() {
    const allResults = JSON.parse(localStorage.getItem('allTypingResults')) || [];
    
    if (allResults.length === 0) {
        resultsList.innerHTML = '<p class="no-results">No previous results</p>';
        return;
    }
    
    let resultsHTML = '';
    
    allResults.forEach((result, index) => {
        resultsHTML += `
            <div class="result-item ${index === 0 ? 'latest' : ''}">
                <div class="result-date">${result.date}</div>
                <div class="result-details-row">
                    <span class="result-detail"><strong>WPM:</strong> ${result.wpm}</span>
                    <span class="result-detail"><strong>Accuracy:</strong> ${result.accuracy}</span>
                    <span class="result-detail"><strong>Time:</strong> ${result.timeSpent}s</span>
                </div>
                <div class="result-details-row">
                    <span class="result-detail"><strong>Characters:</strong> ${result.totalChars}</span>
                    <span class="result-detail"><strong>Correct:</strong> ${result.correctChars}</span>
                    <span class="result-detail"><strong>Errors:</strong> ${result.errors}</span>
                </div>
            </div>
        `;
    });
    
    resultsList.innerHTML = resultsHTML;
}

// Event listeners
tryAgainBtn.addEventListener('click', () => {
    // Go back to the test page
    window.location.href = 'test.html';
});

// Clear history button
document.getElementById('clear-history-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all your typing test history?')) {
        // Keep only the latest result
        const latestResult = JSON.parse(localStorage.getItem('typingTestResults'));
        localStorage.setItem('allTypingResults', JSON.stringify(latestResult ? [latestResult] : []));
        displayAllResults();
    }
});

// Initialize on page load
window.addEventListener('load', displayResults);