function toggleMenu() {
  const menu = document.getElementById('menu'); // Get the menu
  menu.classList.toggle('active'); // Toggle the 'active' class to show or hide the menu
}

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const formDataObject = {};
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });
            try {
                const response = await fetch('/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formDataObject),
                });
                const data = await response.json();
                console.log('Success response:', data);
                if (data.success) {
                    window.location.href = '/thankyou';
                } else {
                    alert(data.message || 'An unexpected error occurred. Please try again.');
                }
            } catch (error) {
                alert('Failed to submit the form. Please check your internet connection and try again.');
                console.error('Fetch error:', error);
            }
        });
    }
});
