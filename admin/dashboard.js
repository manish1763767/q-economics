// Auth check
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/admin/login.html';
        return;
    }
    return token;
}

// API helpers
async function fetchWithAuth(url, options = {}) {
    const token = checkAuth();
    const headers = {
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    try {
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/admin/login.html';
        }
        return response;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Section visibility
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Modal handlers
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Load data functions
async function loadTests() {
    try {
        const response = await fetchWithAuth('/api/mock-tests');
        const tests = await response.json();
        const tbody = document.querySelector('#testsTable tbody');
        tbody.innerHTML = tests.map(test => `
            <tr>
                <td>${test.title}</td>
                <td>${test.duration}</td>
                <td>${test.questions}</td>
                <td>
                    <button class="action-btn" onclick="editTest(${test.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteTest(${test.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading tests:', error);
    }
}

async function loadPapers() {
    try {
        const response = await fetchWithAuth('/api/previous-papers');
        const papers = await response.json();
        const tbody = document.querySelector('#papersTable tbody');
        tbody.innerHTML = papers.map(paper => `
            <tr>
                <td>${paper.title}</td>
                <td>${paper.type}</td>
                <td>
                    <button class="action-btn" onclick="editPaper(${paper.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deletePaper(${paper.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading papers:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetchWithAuth('/api/auth/users');
        const users = await response.json();
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Form handlers
async function handleAddTest(event) {
    event.preventDefault();
    try {
        const response = await fetchWithAuth('/api/mock-tests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: document.getElementById('testTitle').value,
                duration: document.getElementById('testDuration').value + ' hours',
                questions: parseInt(document.getElementById('testQuestions').value)
            })
        });

        if (response.ok) {
            closeModal('addTestModal');
            document.getElementById('addTestForm').reset();
            loadTests();
        }
    } catch (error) {
        console.error('Error adding test:', error);
    }
}

async function handleAddPaper(event) {
    event.preventDefault();
    try {
        const formData = new FormData();
        formData.append('title', document.getElementById('paperTitle').value);
        formData.append('type', document.getElementById('paperType').value);
        formData.append('file', document.getElementById('paperFile').files[0]);

        const response = await fetchWithAuth('/api/previous-papers', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            closeModal('addPaperModal');
            document.getElementById('addPaperForm').reset();
            loadPapers();
        }
    } catch (error) {
        console.error('Error adding paper:', error);
    }
}

// Delete handlers
async function deleteTest(id) {
    if (confirm('Are you sure you want to delete this test?')) {
        try {
            await fetchWithAuth(`/api/mock-tests/${id}`, { method: 'DELETE' });
            loadTests();
        } catch (error) {
            console.error('Error deleting test:', error);
        }
    }
}

async function deletePaper(id) {
    if (confirm('Are you sure you want to delete this paper?')) {
        try {
            await fetchWithAuth(`/api/previous-papers/${id}`, { method: 'DELETE' });
            loadPapers();
        } catch (error) {
            console.error('Error deleting paper:', error);
        }
    }
}

async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await fetchWithAuth(`/api/auth/users/${id}`, { method: 'DELETE' });
            loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/admin/login.html';
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadTests();
    loadPapers();
    loadUsers();
});
