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

// POST-Daten empfangen
$sectionId = $_POST['sectionId'] ?? '';
$title = $_POST['title'] ?? '';
$text = $_POST['text'] ?? '';
$linkText = $_POST['linkText'] ?? '';
$linkUrl = $_POST['linkUrl'] ?? '';

if (empty($sectionId) || empty($title) || empty($text) || empty($linkText) || empty($linkUrl)) {
    echo json_encode(['success' => false, 'message' => 'Alle Felder sind erforderlich']);
    exit;
}

// JSON-Datei laden
$data = [];
if (file_exists($jsonFile)) {
    $jsonData = file_get_contents($jsonFile);
    $data = json_decode($jsonData, true);
}

// Wenn keine Daten vorhanden, initialisieren
if (!isset($data['sections'])) {
    $data['sections'] = [];
}

// Sektion aktualisieren oder hinzufügen
$updated = false;
foreach ($data['sections'] as &$section) {
    if ($section['id'] === $sectionId) {
        $section['title'] = $title;
        $section['text'] = $text;
        $section['linkText'] = $linkText;
        $section['linkUrl'] = $linkUrl;
        $updated = true;
        break;
    }
}

// Wenn nicht gefunden, neue Sektion hinzufügen
if (!$updated) {
    $data['sections'][] = [
        'id' => $sectionId,
        'title' => $title,
        'text' => $text,
        'linkText' => $linkText,
        'linkUrl' => $linkUrl
    ];
}

// In Datei speichern
if (file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode(['success' => true, 'message' => 'Erfolgreich gespeichert']);
} else {
    echo json_encode(['success' => false, 'message' => 'Fehler beim Speichern']);
}
?>
