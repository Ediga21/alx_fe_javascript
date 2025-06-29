// Initialize quotes array
let quotes = [];

// Load quotes from localStorage on start
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
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

// Show random quote based on selected category & save to sessionStorage
function showRandomQuote() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    let filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        alert("No quotes available in this category!");
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    document.getElementById('quoteDisplay').textContent = `"${quote.text}" - Category: ${quote.category}`;
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Add new quote & update dropdown if category is new
function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
    if (text && category) {
        quotes.push({ text, category });
        saveQuotes();
        populateCategories();
        alert("Quote added successfully!");
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert("Please enter both quote text and category.");
    }
}

// Export quotes to JSON
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
                populateCategories();
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

// Populate category dropdown dynamically
function populateCategories() {
    const dropdown = document.getElementById('categoryFilter');
    const selected = dropdown.value;
    dropdown.innerHTML = '<option value="all">All Categories</option>';

    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        dropdown.appendChild(option);
    });

    dropdown.value = selected;
}

// Filter quotes by selected category and show one
function filterQuote() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);
    showRandomQuote();
}

// Fetch quotes from server (mock)
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // mock GET
        const data = await response.json();
        return data.slice(0, 5).map(item => ({
            text: item.title,
            category: "Server"
        }));
    } catch (error) {
        console.error("Fetch failed:", error);
        return [];
    }
}

// Post local quotes to server (mock POST)
async function postQuotesToServer() {
    try {
        await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quotes)
        });
    } catch (error) {
        console.error("Post failed:", error);
    }
}

// Sync quotes: fetch from server, post local, merge & resolve conflicts
async function syncQuotes() {
    const statusEl = document.getElementById('syncStatus');
    statusEl.textContent = "Syncing...";

    const serverQuotes = await fetchQuotesFromServer();

    // conflict resolution: add server quotes not in local
    const existingTexts = new Set(quotes.map(q => q.text));
    const newServerQuotes = serverQuotes.filter(q => !existingTexts.has(q.text));
    if (newServerQuotes.length > 0) {
        quotes.push(...newServerQuotes);
        saveQuotes();
        populateCategories();
        statusEl.textContent = `Synced! Added ${newServerQuotes.length} new quotes from server.`;
    } else {
        statusEl.textContent = "Already up to date with server.";
    }

    // post local quotes to server
    await postQuotesToServer();
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    populateCategories();

    const savedCategory = localStorage.getItem('lastSelectedCategory');
    if (savedCategory) {
        document.getElementById('categoryFilter').value = savedCategory;
    }

    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('syncNow').addEventListener('click', syncQuotes);

    // Periodic sync every 60 seconds
    setInterval(syncQuotes, 60000);
});