<?php
// add_admin.php

require_once 'db_conn.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['admin_name'];
    $email = $_POST['admin_email'];
    $password = password_hash($_POST['admin_password'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO admins (admin_name, admin_email, admin_password, createdAt) VALUES (?, ?, ?, NOW())";
    $stmt = $pdo->prepare($sql);

    if ($stmt->execute([$name, $email, $password])) {
        header('Location: admin_management.php');
    } else {
        echo "Error: Kan beheerder niet toevoegen.";
    }
}
?>