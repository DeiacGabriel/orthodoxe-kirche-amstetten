<?php
header('Content-Type: application/json');

$uploadDir = '../../_public_html/uploads/persons/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$name = $_POST['name'] ?? '';
$role = $_POST['role'] ?? '';
$description = $_POST['description'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';

if (empty($name) || empty($role) || empty($description) || empty($email) || empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Alle Felder sind erforderlich']);
    exit;
}

// Bild hochladen
$imagePath = '';
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $imageExtension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $imageName = uniqid('person_') . '.' . $imageExtension;
    $imagePath = $uploadDir . $imageName;
    
    if (!move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
        echo json_encode(['success' => false, 'message' => 'Bild konnte nicht hochgeladen werden']);
        exit;
    }
    
    $imagePath = './uploads/persons/' . $imageName;
}

// JSON-Datei laden
$jsonFile = './persons.json';
$persons = [];
if (file_exists($jsonFile)) {
    $jsonContent = file_get_contents($jsonFile);
    $persons = json_decode($jsonContent, true) ?? [];
}

// Neue Person hinzufügen
$newPerson = [
    'id' => uniqid(),
    'name' => $name,
    'role' => $role,
    'description' => $description,
    'email' => $email,
    'phone' => $phone,
    'image' => $imagePath
];

$persons[] = $newPerson;

// JSON speichern
if (file_put_contents($jsonFile, json_encode($persons, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode(['success' => true, 'message' => 'Person erfolgreich hinzugefügt', 'person' => $newPerson]);
} else {
    echo json_encode(['success' => false, 'message' => 'Fehler beim Speichern']);
}
?>
