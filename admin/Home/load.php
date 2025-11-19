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

$jsonFile = 'home.json';

if (file_exists($jsonFile)) {
    $jsonData = file_get_contents($jsonFile);
    // Validiere JSON
    $decoded = json_decode($jsonData, true);
    if ($decoded !== null) {
        echo $jsonData;
    } else {
        // Wenn JSON ungültig, sende Standardwerte
        sendDefaultData();
    }
} else {
    sendDefaultData();
}

function sendDefaultData() {
    $defaultData = [
        'backgroundImage' => '',
        'sections' => [
            [
                'id' => 'about',
                'title' => 'Über uns',
                'text' => 'Die Orthodoxe Kirche Amstetten ist eine lebendige Gemeinschaft von Gläubigen, die sich dem Glauben und der Tradition der Orthodoxen Kirche verpflichtet fühlt.',
                'linkText' => 'Mehr erfahren',
                'linkUrl' => './AboutUs.html'
            ],
            [
                'id' => 'events',
                'title' => 'Events',
                'text' => 'Die Orthodoxe Kirche Amstetten bietet regelmäßige Veranstaltungen/Gottesdienste an, zu denen alle Gläubigen herzlich eingeladen sind.',
                'linkText' => 'Events',
                'linkUrl' => './Events.html'
            ],
            [
                'id' => 'gallery',
                'title' => 'Galerie',
                'text' => 'In unserer Galerie finden Sie eine Auswahl an Bildern und Eindrücken aus dem Leben der Orthodoxen Kirche Amstetten.',
                'linkText' => 'Mehr Bilder',
                'linkUrl' => './Galerie.html'
            ]
        ]
    ];
    echo json_encode($defaultData, JSON_UNESCAPED_UNICODE);
}
?>
