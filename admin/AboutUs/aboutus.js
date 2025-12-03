// Event Listeners für Formulare
function initEventListeners() {
    // Adresse Formular
    document.getElementById('addressForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveAddress();
    });
    
    // Person Formular
    document.getElementById('personForm').addEventListener('submit', function(e) {
        e.preventDefault();
        savePerson();
    });
    
    // File Input Label Update
    document.getElementById('personImage').addEventListener('change', function() {
        const label = document.getElementById('personImageLabel');
        label.textContent = this.files[0]?.name || 'Bild auswählen';
    });
}

// Adresse laden beim Seitenstart
async function loadAddress() {
    try {
        const response = await fetch('./AboutUs/loadAddress.php');
        const address = await response.json();
        
        document.getElementById('street').value = address.street || '';
        document.getElementById('city').value = address.city || '';
        document.getElementById('phone').value = address.phone || '';
        document.getElementById('email').value = address.email || '';
        document.getElementById('iban').value = address.iban || '';
    } catch (error) {
        console.error('Fehler beim Laden der Adresse:', error);
    }
}

// Adresse speichern
async function saveAddress() {
    const formData = new FormData();
    formData.append('street', document.getElementById('street').value);
    formData.append('city', document.getElementById('city').value);
    formData.append('phone', document.getElementById('phone').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('iban', document.getElementById('iban').value);

    try {
        const response = await fetch('./AboutUs/saveAddress.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        
        if (result.success) {
            alert('Adresse erfolgreich gespeichert!');
        } else {
            alert('Fehler: ' + result.message);
        }
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        alert('Fehler beim Speichern der Adresse');
    }
}

// Person hinzufügen
async function savePerson() {
    const form = document.getElementById('personForm');
    const formData = new FormData(form);

    try {
        const response = await fetch('./AboutUs/savePerson.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        
        if (result.success) {
            alert('Person erfolgreich hinzugefügt!');
            form.reset();
            loadPersons();
        } else {
            alert('Fehler: ' + result.message);
        }
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        alert('Fehler beim Speichern der Person');
    }
}

// Personen laden und anzeigen
async function loadPersons() {
    try {
        const response = await fetch('./AboutUs/loadPersons.php');
        const persons = await response.json();
        
        const container = document.getElementById('personsList');
        container.innerHTML = '';
        
        if (persons.length === 0) {
            container.innerHTML = '<p>Keine Personen vorhanden</p>';
            return;
        }
        
        persons.forEach(person => {
            const personDiv = document.createElement('div');
            personDiv.className = 'person-item';
            // Konvertiere relativen Pfad zu absolutem Web-Pfad
            const imagePath = person.image.replace('./', '/');
            personDiv.innerHTML = `
                <div class="person-preview">
                    <img src="${imagePath}" alt="${person.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;">
                    <div>
                        <h3>${person.name}</h3>
                        <p><strong>${person.role}</strong></p>
                        <p>${person.description}</p>
                        <p>${person.email}</p>
                        <p>${person.phone}</p>
                    </div>
                </div>
                <div class="person-actions">
                    <button onclick="editPerson('${person.id}')">Bearbeiten</button>
                    <button onclick="deletePerson('${person.id}')">Löschen</button>
                </div>
                
                <div id="edit-${person.id}" class="edit-form" style="display: none;">
                    <h3>Person bearbeiten</h3>
                    <input type="text" id="editName-${person.id}" value="${person.name}" placeholder="Name">
                    <input type="text" id="editRole-${person.id}" value="${person.role}" placeholder="Rolle">
                    <textarea id="editDescription-${person.id}" placeholder="Beschreibung" rows="4">${person.description}</textarea>
                    <input type="email" id="editEmail-${person.id}" value="${person.email}" placeholder="E-Mail">
                    <input type="text" id="editPhone-${person.id}" value="${person.phone}" placeholder="Telefon">
                    <input type="file" id="editImage-${person.id}" accept="image/*">
                    <button onclick="updatePerson('${person.id}')">Speichern</button>
                    <button onclick="cancelEdit('${person.id}')">Abbrechen</button>
                </div>
            `;
            container.appendChild(personDiv);
        });
    } catch (error) {
        console.error('Fehler beim Laden:', error);
    }
}

// Person bearbeiten (Formular anzeigen)
function editPerson(id) {
    document.getElementById(`edit-${id}`).style.display = 'block';
}

// Bearbeitung abbrechen
function cancelEdit(id) {
    document.getElementById(`edit-${id}`).style.display = 'none';
}

// Person aktualisieren
async function updatePerson(id) {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', document.getElementById(`editName-${id}`).value);
    formData.append('role', document.getElementById(`editRole-${id}`).value);
    formData.append('description', document.getElementById(`editDescription-${id}`).value);
    formData.append('email', document.getElementById(`editEmail-${id}`).value);
    formData.append('phone', document.getElementById(`editPhone-${id}`).value);
    
    const imageFile = document.getElementById(`editImage-${id}`).files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch('./AboutUs/updatePerson.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        
        if (result.success) {
            alert('Person erfolgreich aktualisiert!');
            loadPersons();
        } else {
            alert('Fehler: ' + result.message);
        }
    } catch (error) {
        console.error('Fehler beim Aktualisieren:', error);
        alert('Fehler beim Aktualisieren der Person');
    }
}

// Person löschen
async function deletePerson(id) {
    if (!confirm('Möchten Sie diese Person wirklich löschen?')) {
        return;
    }

    const formData = new FormData();
    formData.append('id', id);

    try {
        const response = await fetch('./AboutUs/deletePerson.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        
        if (result.success) {
            alert('Person erfolgreich gelöscht!');
            loadPersons();
        } else {
            alert('Fehler: ' + result.message);
        }
    } catch (error) {
        console.error('Fehler beim Löschen:', error);
        alert('Fehler beim Löschen der Person');
    }
}

// Beim Laden der Seite
function load() {
    initEventListeners();
    loadAddress();
    loadPersons();
}

// Automatisch beim Laden aufrufen
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
} else {
    load();
}
