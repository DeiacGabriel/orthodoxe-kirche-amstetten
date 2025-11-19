<?php
header('Content-Type: application/json');

$id = $_POST['id'] ?? '';

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'ID fehlt']);
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

// Person finden und löschen
$found = false;
$newPersons = [];
foreach ($persons as $person) {
    if ($person['id'] === $id) {
        $found = true;
        // Bild löschen
        if (!empty($person['image']) && file_exists('../../_public_html/' . $person['image'])) {
            unlink('../../_public_html/' . $person['image']);
        }
    } else {
        $newPersons[] = $person;
    }
}

if (!$found) {
    echo json_encode(['success' => false, 'message' => 'Person nicht gefunden']);
    exit;
}

// JSON speichern
if (file_put_contents($jsonFile, json_encode($newPersons, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode(['success' => true, 'message' => 'Person erfolgreich gelöscht']);
} else {
    echo json_encode(['success' => false, 'message' => 'Fehler beim Speichern']);
}
?>
