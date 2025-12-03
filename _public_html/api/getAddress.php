<?php
header("Content-Type: application/json");

$jsonFile = "../../admin/AboutUs/address.json";
if (!file_exists($jsonFile)) {
    echo json_encode([
        "street" => "Dornacher Str. 17",
        "city" => "3300 Amstetten",
        "phone" => "",
        "email" => "",
        "iban" => ""
    ]);
    exit;
}

$jsonContent = file_get_contents($jsonFile);
$address = json_decode($jsonContent, true) ?? [];

echo json_encode($address);
?>
