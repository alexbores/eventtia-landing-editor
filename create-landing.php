<?php
header('Content-Type: application/json');

// Retrieve POST data (as JSON)
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Check if both htmlContent and jsonContent are provided
if (!isset($data['htmlContent']) || !isset($data['jsonContent'])) {
    echo json_encode(['error' => 'Both htmlContent and jsonContent must be provided']);
    exit;
}

$htmlContent = $data['htmlContent'];
$jsonContent = $data['jsonContent'];

// Define the folder path (absolute path)
$folder = __DIR__ . '/landing';

// Create the folder if it doesn't exist
if (!is_dir($folder)) {
    if (!mkdir($folder, 0755, true)) {
        echo json_encode(['error' => "Failed to create folder: $folder"]);
        exit;
    }
}

// Generate a random filename base
$randomBase = 'landing_' . substr(md5(uniqid(rand(), true)), 0, 10);

// Define file paths for HTML and JSON files
$filePathHtml = $folder . '/' . $randomBase . '.html';
$filePathJson = $folder . '/' . $randomBase . '.json';

// Write the HTML content to the HTML file
$htmlWriteSuccess = file_put_contents($filePathHtml, $htmlContent) !== false;

// Write the JSON content to the JSON file (we assume it's already JSON or you can encode it)
$jsonWriteSuccess = file_put_contents($filePathJson, json_encode($jsonContent, JSON_PRETTY_PRINT)) !== false;

if ($htmlWriteSuccess && $jsonWriteSuccess) {
    // Return relative paths
    echo json_encode([
        'success' => true,
        'filePath' => '/landing/' . $randomBase . '.html',
    ]);
} else {
    echo json_encode(['error' => 'Error writing file(s).']);
}
?>
