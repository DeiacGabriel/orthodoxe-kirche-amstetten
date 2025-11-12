<?php
// Fehleranzeige unterdrücken, damit JSON sauber bleibt
error_reporting(0);
ini_set('display_errors', 0);

// Keine Ausgabe vor dem JSON
if (ob_get_level()) {
    ob_clean();
}

header('Content-Type: application/json; charset=utf-8');

$jsonFile = 'home.json';
$uploadDir = '../../_public_html/uploads/';

// Stelle sicher, dass der Upload-Ordner existiert
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Prüfe ob Datei hochgeladen wurde
if (!isset($_FILES['backgroundImage']) || $_FILES['backgroundImage']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'Keine Datei hochgeladen oder Fehler beim Upload']);
    exit;
}

$file = $_FILES['backgroundImage'];
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Validiere Dateityp
if (!in_array($file['type'], $allowedTypes)) {
    echo json_encode(['success' => false, 'message' => 'Nur Bilddateien (JPG, PNG, GIF, WEBP) sind erlaubt']);
    exit;
}

// Generiere eindeutigen Dateinamen
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'home-background-' . time() . '.' . $extension;
$targetPath = $uploadDir . $filename;

// Verschiebe Datei
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    // Lade aktuelle JSON-Daten
    $data = [];
    if (file_exists($jsonFile)) {
        $jsonData = file_get_contents($jsonFile);
        $data = json_decode($jsonData, true);
    }
    
    // Lösche altes Hintergrundbild falls vorhanden
    if (isset($data['backgroundImage']) && !empty($data['backgroundImage'])) {
        $oldFile = $uploadDir . basename($data['backgroundImage']);
        if (file_exists($oldFile)) {
            unlink($oldFile);
        }
    }
    
    // Speichere neuen Bildpfad (relativer Pfad für die Website)
    $data['backgroundImage'] = './uploads/' . $filename;
    
    // Speichere in JSON
    if (file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(['success' => true, 'message' => 'Bild erfolgreich hochgeladen', 'filename' => $filename]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Fehler beim Speichern der Daten']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Fehler beim Verschieben der Datei']);
}
?>
