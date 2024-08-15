<?php
session_start();
// db_conn.php

$host = 'localhost';        // Database host
$dbname = 'tcad_loan_calculator';  // Database name
$user = 'root';    // Database username
$pass = 'root';


$host = 'localhost';        // Database host
$dbname = 'u956940883_loan_cal';  // Database name
$user = 'u956940883_loan_cal';    // Database username
$pass = ']pR=nw40'; // Database password

try {
    // Create a new PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch (PDOException $e) {
    // Handle connection errors
    echo "Connection failed: " . $e->getMessage();
}
?>
