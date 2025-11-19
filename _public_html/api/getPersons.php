<?php
header("Content-Type: application/json");

$jsonFile = "../../admin/AboutUs/persons.json";
if (!file_exists($jsonFile)) {
    echo json_encode([]);
    exit;
}

$jsonContent = file_get_contents($jsonFile);
$persons = json_decode($jsonContent, true) ?? [];

echo json_encode($persons);
?>
