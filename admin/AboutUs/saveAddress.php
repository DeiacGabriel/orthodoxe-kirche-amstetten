<?php
header('Content-Type: application/json');

$street = $_POST['street'] ?? '';
$city = $_POST['city'] ?? '';
$phone = $_POST['phone'] ?? '';
$email = $_POST['email'] ?? '';
$iban = $_POST['iban'] ?? '';

if (empty($street) || empty($city) || empty($phone) || empty($email) || empty($iban)) {
    echo json_encode(['success' => false, 'message' => 'Alle Felder sind erforderlich']);
    exit;
}

$address = [
    'street' => $street,
    'city' => $city,
    'phone' => $phone,
    'email' => $email,
    'iban' => $iban
];

$jsonFile = './address.json';
if (file_put_contents($jsonFile, json_encode($address, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode(['success' => true, 'message' => 'Adresse erfolgreich gespeichert']);
} else {
    echo json_encode(['success' => false, 'message' => 'Fehler beim Speichern']);
}
?>
