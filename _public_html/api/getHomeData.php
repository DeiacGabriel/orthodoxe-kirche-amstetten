<?php
// Fehleranzeige unterdrücken, damit JSON sauber bleibt
error_reporting(0);
ini_set('display_errors', 0);

// Keine Ausgabe vor dem JSON
if (ob_get_level()) {
    ob_clean();
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$jsonFile = '../../admin/Home/home.json';

// Standarddaten
$defaultData = [
    'backgroundImage' => '',
    'sections' => [
        [
            'id' => 'about',
            'title' => 'Über uns',
            'text' => 'Herzlich willkommen in unserer orthodoxen Kirchengemeinde...',
            'linkText' => 'Mehr erfahren',
            'linkUrl' => './AboutUs.html'
        ],
        [
            'id' => 'events',
            'title' => 'Veranstaltungen',
            'text' => 'Besuchen Sie unsere kommenden Veranstaltungen und Gottesdienste...',
            'linkText' => 'Zum Kalender',
            'linkUrl' => './Calendar.html'
        ],
        [
            'id' => 'gallery',
            'title' => 'Galerie',
            'text' => 'Entdecken Sie Impressionen aus unserem Gemeindeleben...',
            'linkText' => 'Zur Galerie',
            'linkUrl' => './Galerie.html'
        ]
    ]
];

// JSON-Datei laden
if (file_exists($jsonFile)) {
    $jsonData = file_get_contents($jsonFile);
    $data = json_decode($jsonData, true);
    
    // Validierung
    if (json_last_error() === JSON_ERROR_NONE && isset($data['sections'])) {
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode($defaultData, JSON_UNESCAPED_UNICODE);
    }
} else {
    echo json_encode($defaultData, JSON_UNESCAPED_UNICODE);
}
?>
