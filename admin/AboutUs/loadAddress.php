<?php
header('Content-Type: application/json');

$jsonFile = './address.json';
if (!file_exists($jsonFile)) {
    echo json_encode([
        'street' => '',
        'city' => '',
        'phone' => '',
        'email' => '',
        'iban' => ''
    ]);
    exit;
}

$jsonContent = file_get_contents($jsonFile);
$address = json_decode($jsonContent, true) ?? [];

echo json_encode($address);
?>
