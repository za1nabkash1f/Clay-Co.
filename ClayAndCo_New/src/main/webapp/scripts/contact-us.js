document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
	
    const btn = this.querySelector('button[type="submit"]');
    btn.innerText = 'SENDING...';
    btn.disabled = true;

    fetch('/ClayAndCo_New/contact', {
        method: 'POST',
        body: new URLSearchParams(formData) // sends as form-encoded, not JSON
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg); // shows the servlet's response
        btn.innerText = 'SEND MESSAGE';
        btn.disabled = false;
        this.reset();
    })
    .catch(err => {
        alert('Something went wrong. Please try again.');
        btn.innerText = 'SEND MESSAGE';
        btn.disabled = false;
    });
});