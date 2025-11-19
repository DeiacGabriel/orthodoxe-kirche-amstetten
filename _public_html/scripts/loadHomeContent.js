// Lade Home-Sektionen beim Laden der Seite
document.addEventListener('DOMContentLoaded', function() {
    loadHomeSections();
});

function loadHomeSections() {
    fetch('./api/getHomeData.php')
        .then(response => response.json())
        .then(data => {
            if (data.sections) {
                data.sections.forEach(section => {
                    updateSection(section);
                });
            }
            // Setze Hintergrund der Hero-Section falls vorhanden
            if (data.backgroundImage) {
                const heroSection = document.querySelector('.hero-section');
                if (heroSection) {
                    heroSection.style.backgroundImage = `url('${data.backgroundImage}')`;
                    heroSection.style.backgroundSize = 'cover';
                    heroSection.style.backgroundPosition = 'center';
                    heroSection.style.backgroundRepeat = 'no-repeat';
                }
            }
        })
        .catch(error => {
            console.error('Fehler beim Laden der Home-Sektionen:', error);
        });
}

function updateSection(section) {
    // Finde die entsprechende Sektion im DOM
    const sections = document.querySelectorAll('.normal-section');
    let targetSection = null;

    if (section.id === 'about') {
        targetSection = sections[0];
    } else if (section.id === 'events') {
        targetSection = sections[1];
    } else if (section.id === 'gallery') {
        targetSection = sections[2];
    }

    if (targetSection) {
        const content = targetSection.querySelector('.normal-content');
        if (content) {
            // Aktualisiere Titel (h2)
            const h2 = content.querySelector('h2');
            if (h2) h2.textContent = section.title;

            // Aktualisiere Text (p)
            const p = content.querySelector('p');
            if (p) p.textContent = section.text;

            // Aktualisiere Link (a)
            const a = content.querySelector('a');
            if (a) {
                a.textContent = section.linkText;
                a.href = section.linkUrl;
            }
        }
    }
}
