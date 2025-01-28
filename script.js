// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Update active link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// API URL configuration
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : '/api';

// Fetch and render mock tests
async function loadMockTests() {
    try {
        const response = await fetch(`${API_URL}/mock-tests`);
        const tests = await response.json();
        const testGrid = document.querySelector('.test-grid');
        testGrid.innerHTML = tests.map(test => `
            <div class="test-card">
                <h3>${test.title}</h3>
                <p>Duration: ${test.duration}</p>
                <p>${test.questions} Questions</p>
                <button class="start-btn" data-id="${test.id}">Start Test</button>
            </div>
        `).join('');

        // Add event listeners to new buttons
        document.querySelectorAll('.start-btn').forEach(button => {
            button.addEventListener('click', function() {
                const testId = this.getAttribute('data-id');
                alert(`Starting test ID: ${testId}... \n\nThis feature will be implemented soon.`);
            });
        });
    } catch (error) {
        console.error('Error loading mock tests:', error);
    }
}

// Fetch and render previous papers
async function loadPreviousPapers() {
    try {
        const response = await fetch(`${API_URL}/previous-papers`);
        const papers = await response.json();
        const papersGrid = document.querySelector('.papers-grid');
        papersGrid.innerHTML = papers.map(paper => `
            <div class="paper-card">
                <h3>${paper.title}</h3>
                <p>${paper.type}</p>
                <button class="download-btn" data-url="${paper.url}">Download PDF</button>
            </div>
        `).join('');

        // Add event listeners to new buttons
        document.querySelectorAll('.download-btn').forEach(button => {
            button.addEventListener('click', function() {
                const fileUrl = this.getAttribute('data-url');
                alert(`Downloading from: ${fileUrl}... \n\nThis feature will be implemented soon.`);
            });
        });
    } catch (error) {
        console.error('Error loading previous papers:', error);
    }
}

// Load data when page loads
window.addEventListener('load', () => {
    loadMockTests();
    loadPreviousPapers();
});

// Update active navigation link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});
