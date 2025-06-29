// Initialize quotes array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

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

// Dynamically create Add Quote form
function createAddQuoteForm() {
  const container = document.getElementById('formContainer');
  // Clear old form if any
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

  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(addButton);
}

// Add new quote & update DOM
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (text && category) {
    quotes.push({ text, category });
    localStorage.setItem('quotes', JSON.stringify(quotes));
    document.getElementById('quoteDisplay').innerText = `"${text}" - Category: ${category}`;
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Load quotes from localStorage on start
function loadQuotesFromLocalStorage() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadQuotesFromLocalStorage();
  createAddQuoteForm();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
});