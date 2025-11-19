<?php
header('Content-Type: application/json');

$uploadDir = '../../_public_html/uploads/persons/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$role = $_POST['role'] ?? '';
$description = $_POST['description'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';

if (empty($id) || empty($name) || empty($role) || empty($description) || empty($email) || empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Alle Felder sind erforderlich']);
    exit;
}

// JSON-Datei laden
$jsonFile = './persons.json';
if (!file_exists($jsonFile)) {
    echo json_encode(['success' => false, 'message' => 'Keine Personen vorhanden']);
    exit;
}

$jsonContent = file_get_contents($jsonFile);
$persons = json_decode($jsonContent, true) ?? [];

// Person finden und aktualisieren
$found = false;
foreach ($persons as &$person) {
    if ($person['id'] === $id) {
        $found = true;
        $person['name'] = $name;
        $person['role'] = $role;
        $person['description'] = $description;
        $person['email'] = $email;
        $person['phone'] = $phone;
        
        // Neues Bild hochladen, falls vorhanden
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            // Altes Bild löschen
            if (!empty($person['image']) && file_exists('../../_public_html/' . $person['image'])) {
                unlink('../../_public_html/' . $person['image']);
            }
            
            $imageExtension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
            $imageName = uniqid('person_') . '.' . $imageExtension;
            $imagePath = $uploadDir . $imageName;
            
            if (move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
                $person['image'] = './uploads/persons/' . $imageName;
            }
        }
        
        break;
    }
}

if (!$found) {
    echo json_encode(['success' => false, 'message' => 'Person nicht gefunden']);
    exit;
}

// JSON speichern
if (file_put_contents($jsonFile, json_encode($persons, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode(['success' => true, 'message' => 'Person erfolgreich aktualisiert']);
} else {
    echo json_encode(['success' => false, 'message' => 'Fehler beim Speichern']);
}
?>
