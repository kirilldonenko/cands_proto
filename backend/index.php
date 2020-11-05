<?php

header('Access-Control-Allow-Origin: http://localhost:8080');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Headers: origin, x-requested-with, content-type');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');

$getData = __DIR__ . '/../public/api/v1/objects1.json';
$postData = __DIR__ . '/../public/api/v1/objects1-post.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    file_put_contents($postData, $data);
}
else {
    header("Content-Type: application/json");
    echo file_get_contents($getData);
}
