<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

try {
    // Recebe via REQUEST (funciona com GET e POST)
    $profile = $_REQUEST['profile'] ?? null;
    $index = $_REQUEST['index'] ?? null;
    $encodedText = $_REQUEST['text'] ?? null;

    if (!$profile || $index === null || $encodedText === null) {
        throw new Exception('Dados insuficientes recebidos pelo servidor.');
    }

    // Decodifica o texto que veio em Base64 para suportar quebras de linha e acentos na URL
    $text = base64_decode($encodedText);
    if ($text === false) {
        throw new Exception('Erro ao decodificar os dados (Base64 inválido).');
    }

    $filename = 'comments.json';
    $currentData = [];

    if (file_exists($filename)) {
        $jsonContent = file_get_contents($filename);
        $currentData = json_decode($jsonContent, true) ?: [];
    }

    if (!isset($currentData[$profile])) {
        $currentData[$profile] = [];
    }

    $currentData[$profile][$index] = $text;

    if (file_put_contents($filename, json_encode($currentData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(['status' => 'success']);
    } else {
        throw new Exception('Erro ao gravar no arquivo comments.json. Verifique as permissões de escrita.');
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
