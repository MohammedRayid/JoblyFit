document.getElementById('jobForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const resumeFile = document.getElementById('resume').files[0];
    if (resumeFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64 = event.target.result;
            const formData = {
                jobTitle: document.getElementById('jobTitle').value,
                jobDescription: document.getElementById('jobDescription').value,
                resume: {
                    name: resumeFile.name,
                    type: resumeFile.type,
                    data: base64
                }
            };
            localStorage.setItem('formData', JSON.stringify(formData));
            localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
            window.location.href = 'loading.html';
        };
        reader.readAsDataURL(resumeFile);
    } else {
        const formData = {
            jobTitle: document.getElementById('jobTitle').value,
            jobDescription: document.getElementById('jobDescription').value
        };
        localStorage.setItem('formData', JSON.stringify(formData));
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
        window.location.href = 'loading.html';
    }
});

function showMessage(type) {
    const messageEl = document.getElementById(type + 'Message');
    messageEl.classList.add('show');
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
    const toggleBtn = document.getElementById('themeToggle');
    if (document.body.classList.contains('light-mode')) {
        toggleBtn.textContent = '☀️';
    } else {
        toggleBtn.textContent = '🌙';
    }
});
