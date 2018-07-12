document.addEventListener('DOMContentLoaded', () => {
    const spinner =  document.getElementById('spinner');
    const loginBtn =  document.getElementById('loginBtn');

    loginBtn.addEventListener('click', () => {
        spinner.style.display = 'inline-block';
    });

    
}, false);
