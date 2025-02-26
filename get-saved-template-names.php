<?php
header('Content-Type: application/json');

// Define the folder path (relative to this PHP file)
$folder = __DIR__ . '/landing';

if (!is_dir($folder)) {
    echo json_encode(['error' => 'Folder not found']);
    exit;
}

// Get all files in the folder
$files = scandir($folder);

// Filter to include only .json files (case-insensitive)
$jsonFiles = array_filter($files, function($file) use ($folder) {
    return is_file($folder . '/' . $file) && strtolower(pathinfo($file, PATHINFO_EXTENSION)) === 'json';
});

// Return only the filenames as a JSON array
$result = array_values($jsonFiles);
echo json_encode($result);
?>
