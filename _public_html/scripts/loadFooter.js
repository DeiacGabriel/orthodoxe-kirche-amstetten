// Footer dynamisch laden
async function loadFooterAddress() {
    try {
        const response = await fetch('./api/getAddress.php');
        const address = await response.json();
        
        if (address.street) {
            const footerStreet = document.getElementById('footerStreet');
            const footerCity = document.getElementById('footerCity');
            const footerEmail = document.getElementById('footerEmail');
            const footerPhone = document.getElementById('footerPhone');
            const footerIban = document.getElementById('footerIban');
            
            if (footerStreet) footerStreet.textContent = address.street;
            if (footerCity) footerCity.textContent = address.city;
            if (footerEmail) footerEmail.textContent = address.email;
            if (footerPhone) footerPhone.textContent = address.phone;
            if (footerIban) footerIban.textContent = address.iban;
        }
    } catch (error) {
        console.error('Fehler beim Laden der Footer-Adresse:', error);
    }
}

// Beim Laden der Seite ausführen
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooterAddress);
} else {
    loadFooterAddress();
}
