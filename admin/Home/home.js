// Event Listener für Formulare und Laden der Daten
document.addEventListener('DOMContentLoaded', function() {
    // Daten beim Laden der Seite laden
    loadData();
    
    // Background Form
    document.getElementById('backgroundForm').addEventListener('submit', function(e) {
        e.preventDefault();
        uploadBackground();
    });

    // About Form
    document.getElementById('aboutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSection('about');
    });

    // Events Form
    document.getElementById('eventsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSection('events');
    });

    // Gallery Form
    document.getElementById('galleryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSection('gallery');
    });
});

// Daten beim Laden der Seite laden
function load() {
    loadData();
}

function loadData() {
    fetch('./Home/load.php')
        .then(response => {
            console.log('Response Status:', response.status);
            console.log('Response Headers:', response.headers.get('content-type'));
            return response.text();
        })
        .then(text => {
            console.log('Response Text:', text);
            try {
                const data = JSON.parse(text);
                console.log('Geladene Daten:', data);
                if (data.sections) {
                    data.sections.forEach(section => {
                        fillForm(section.id, section);
                    });
                }
                // Aktuelles Hintergrundbild anzeigen
                if (data.backgroundImage) {
                    const previewDiv = document.getElementById('background-preview');
                    const previewImg = document.getElementById('background-preview-img');
                    if (previewDiv && previewImg) {
                        // Konvertiere relativen Pfad zu absolutem Web-Pfad
                        // data.backgroundImage ist z.B. "./uploads/home-background.jpg"
                        const imagePath = data.backgroundImage.replace('./', '/');
                        previewImg.src = imagePath;
                        previewDiv.style.display = 'block';
                    }
                }
            } catch (e) {
                console.error('JSON Parse Fehler:', e);
                console.error('Empfangener Text:', text);
            }
        })
        .catch(error => {
            console.error('Fehler beim Laden:', error);
        });
}

// Formular mit Daten füllen
function fillForm(sectionId, data) {
    console.log('Fülle Formular für:', sectionId, data);
    const titleInput = document.getElementById(`${sectionId}-title`);
    const textInput = document.getElementById(`${sectionId}-text`);
    const linkTextInput = document.getElementById(`${sectionId}-linkText`);
    const linkUrlInput = document.getElementById(`${sectionId}-linkUrl`);
    
    if (titleInput) titleInput.value = data.title || '';
    if (textInput) textInput.value = data.text || '';
    if (linkTextInput) linkTextInput.value = data.linkText || '';
    if (linkUrlInput) linkUrlInput.value = data.linkUrl || '';
}

// File Label Update für Hintergrundbild
function updateBackgroundLabel(input) {
    const label = document.getElementById('background-label');
    if (input.files.length > 0) {
        label.textContent = input.files[0].name;
    } else {
        label.textContent = "Bild auswählen";
    }
}

// Hintergrundbild hochladen
function uploadBackground() {
    const fileInput = document.getElementById('background-image');
    if (!fileInput.files.length) {
        alert('Bitte wählen Sie ein Bild aus');
        return;
    }

    const formData = new FormData();
    formData.append('backgroundImage', fileInput.files[0]);

    fetch('./Home/uploadBackground.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(text => {
        console.log('Upload Response:', text);
        try {
            const data = JSON.parse(text);
            if (data.success) {
                alert('Hintergrundbild erfolgreich hochgeladen!');
                
                // Aktualisiere Vorschau mit neuem Bild
                const previewDiv = document.getElementById('background-preview');
                const previewImg = document.getElementById('background-preview-img');
                if (previewDiv && previewImg) {
                    // Da _public_html das DocumentRoot ist
                    previewImg.src = '../uploads/' + data.filename;
                    previewDiv.style.display = 'block';
                }
                
                // Verstecke neue Bildvorschau (nur wenn Element existiert)
                const newPreview = document.getElementById('new-background-preview');
                if (newPreview) {
                    newPreview.style.display = 'none';
                }
                
                // Reset Formular
                fileInput.value = '';
                const filenameDiv = document.getElementById('background-filename');
                if (filenameDiv) {
                    filenameDiv.textContent = '';
                }
            } else {
                alert('Fehler: ' + data.message);
            }
        } catch (e) {
            console.error('JSON Parse Fehler:', e);
            console.error('Response:', text);
            alert('Fehler beim Upload: Ungültige Antwort vom Server');
        }
    })
    .catch(error => {
        console.error('Fehler beim Hochladen:', error);
        alert('Fehler beim Hochladen!');
    });
}

// Sektion speichern
function saveSection(sectionId) {
    const formData = new FormData();
    formData.append('sectionId', sectionId);
    formData.append('title', document.getElementById(`${sectionId}-title`).value);
    formData.append('text', document.getElementById(`${sectionId}-text`).value);
    formData.append('linkText', document.getElementById(`${sectionId}-linkText`).value);
    formData.append('linkUrl', document.getElementById(`${sectionId}-linkUrl`).value);

    fetch('./Home/save.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Save Response Status:', response.status);
        console.log('Save Response Headers:', response.headers.get('content-type'));
        return response.text();
    })
    .then(text => {
        console.log('Save Response Text:', text);
        try {
            const data = JSON.parse(text);
            if (data.success) {
                alert('Erfolgreich gespeichert!');
            } else {
                alert('Fehler: ' + data.message);
            }
        } catch (e) {
            console.error('JSON Parse Fehler beim Speichern:', e);
            console.error('Empfangener Text:', text);
            alert('Fehler beim Speichern: Ungültige Antwort vom Server');
        }
    })
    .catch(error => {
        console.error('Fehler beim Speichern:', error);
        alert('Fehler beim Speichern!');
    });
}
