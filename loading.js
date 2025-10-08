document.addEventListener('DOMContentLoaded', function() {
    // Apply theme
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('themeToggle').textContent = '☀️';
    } else {
        document.getElementById('themeToggle').textContent = '🌙';
    }

    // Retrieve form data
    const formDataStr = localStorage.getItem('formData');
    if (!formDataStr) {
        // No data, redirect back
        window.location.href = 'index.html';
        return;
    }

    const formDataObj = JSON.parse(formDataStr);
    const data = new FormData();
    data.append('jobTitle', formDataObj.jobTitle);
    data.append('jobDescription', formDataObj.jobDescription);
    if (formDataObj.resume) {
        // Convert base64 to Blob
        const resumeData = formDataObj.resume.data.split(',')[1]; // Remove data:image/pdf;base64,
        const byteCharacters = atob(resumeData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: formDataObj.resume.type });
        data.append('resume', blob, formDataObj.resume.name);
    }

    // Send fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    fetch('http://localhost:5678/webhook-test/jobdescription', {
        method: 'POST',
        body: data,
        signal: controller.signal
    })
    .finally(() => clearTimeout(timeoutId))
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    })
    .then(data => {
        document.getElementById('loading').style.display = 'none';
        const analysisEl = document.getElementById('analysis');
        analysisEl.style.display = 'block';
        analysisEl.classList.add('show');
        document.querySelector('.container').classList.add('wide');
        document.body.classList.add('analysis-page');
        document.getElementById('analysisText').innerHTML = marked.parse(data.analysis);
        localStorage.removeItem('formData'); // Clean up
    })
    .catch(error => {
        console.error('Error:', error);
        // Keep spinner, or show error after some time
        setTimeout(() => {
            document.getElementById('loading').innerHTML = '<h1>Error</h1><p>Failed to process your request. Please try again.</p><button onclick="window.location.href=\'index.html\'">Go Back</button>';
        }, 10000); // Show error after 10 seconds if still no response
    });
});

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
    const toggleBtn = document.getElementById('themeToggle');
    if (document.body.classList.contains('light-mode')) {
        toggleBtn.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    } else {
        toggleBtn.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    }
});
