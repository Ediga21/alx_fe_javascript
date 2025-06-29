// Initialize quotes array
let quotes = [];

// Load quotes from localStorage on start
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        // If none exist, initialize with defaults
        quotes = [
            { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
            { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
            { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
        ];
        saveQuotes();
    }
}

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show random quote & save to sessionStorage
function showRandomQuote() {
    if (quotes.length === 0) {
        alert("No quotes available!");
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = `"${quote.text}" - Category: ${quote.category}`;
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Dynamically create Add Quote form + import/export buttons
function createAddQuoteForm() {
    const container = document.getElementById('formContainer');
    container.innerHTML = '';

    const textInput = document.createElement('input');
    textInput.id = 'newQuoteText';
    textInput.type = 'text';
    textInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    const addButton = document.createElement('button');
    addButton.innerText = 'Add Quote';
    addButton.onclick = addQuote;

    const exportButton = document.createElement('button');
    exportButton.innerText = 'Export Quotes';
    exportButton.onclick = exportToJsonFile;

    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.onchange = importFromJsonFile;

    container.appendChild(textInput);
    container.appendChild(categoryInput);
    container.appendChild(addButton);
    container.appendChild(exportButton);
    container.appendChild(importInput);
}

// Add new quote & update DOM
function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
    if (text && category) {
        quotes.push({ text, category });
        saveQuotes();
        document.getElementById('quoteDisplay').innerText = `"${text}" - Category: ${category}`;
        alert("Quote added successfully!");
    } else {
        alert("Please enter both quote text and category.");
    }
}

// Export quotes to JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert('Quotes imported successfully!');
            } else {
                alert('Invalid file format.');
            }
        } catch (error) {
            alert('Error parsing JSON file.');
        }
    };
    reader.readAsText(file);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    createAddQuoteForm();
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
});