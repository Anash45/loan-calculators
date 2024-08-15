<?php
// dashboard.php

// Include the database connection file
require_once 'db_conn.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['admin_id'])) {
    $admin_id = $_POST['admin_id'];

    $sql = "DELETE FROM admins WHERE admin_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$admin_id]);

    header('Location: dashboard.php');
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['admin_name'])) {
    $admin_id = $_POST['admin_id'];
    $name = $_POST['admin_name'];
    $email = $_POST['admin_email'];
    $password = !empty($_POST['admin_password']) ? password_hash($_POST['admin_password'], PASSWORD_DEFAULT) : null;

    // Check if the new email is already taken by another admin
    $sql = "SELECT COUNT(*) FROM admins WHERE admin_email = ? AND admin_id != ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email, $admin_id]);
    $email_exists = $stmt->fetchColumn() > 0;

    if ($email_exists) {
        $info = '<div class="alert alert-danger">Error: The email address is already in use by another admin.</div>';
        exit;
    }

    // Update admin details
    if ($password) {
        $sql = "UPDATE admins SET admin_name = ?, admin_email = ?, admin_password = ? WHERE admin_id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $email, $password, $admin_id]);
    } else {
        $sql = "UPDATE admins SET admin_name = ?, admin_email = ? WHERE admin_id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $email, $admin_id]);
    }

    header('Location: dashboard.php');
}
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['admin_name'];
    $email = $_POST['admin_email'];
    $password = !empty($_POST['admin_password']) ? password_hash($_POST['admin_password'], PASSWORD_DEFAULT) : null;

    // Check if the email is already taken
    $sql = "SELECT COUNT(*) FROM admins WHERE admin_email = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email]);
    $email_exists = $stmt->fetchColumn() > 0;

    if ($email_exists) {
        echo "Fout: het e-mailadres is al in gebruik door een andere beheerder.";
        exit;
    }

    // Insert new admin record
    $sql = "INSERT INTO admins (admin_name, admin_email, admin_password, createdAt) VALUES (?, ?, ?, NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$name, $email, $password]);

    header('Location: dashboard.php');
}
// Fetch admins from the database
$sql = "SELECT * FROM admins";
$stmt = $pdo->query($sql);
$admins = $stmt->fetchAll(PDO::FETCH_ASSOC);

?>
<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Administratief beheer</title>
        <link rel="stylesheet" href="./assets/css/bootstrap.min.css">
        <link rel="stylesheet" href="./assets/css/style.css?v=9">
    </head>

    <body>
        <?php include './header.php'; ?>
        <div class="container-fluid flex-grow-1 d-flex">
            <!-- Sidebar -->
            <nav class="sidebar col-md-3 col-lg-2 d-flex flex-column py-3">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link active" href="./dashboard.php">Dashboard</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-danger" href="./logout.php">Logout</a>
                    </li>
                </ul>
            </nav>
            <!-- Main content -->
            <main class="content col-md-9 col-lg-10">
                <div class="bg-white card">
                    <div class="card-body">
                        <h1 class="mb-4 text-center fw-bold">User Management</h1>
                        <!-- Button to open Add Admin modal -->
                        <button type="button" class="btn btn-primary mb-3" data-bs-toggle="modal"
                            data-bs-target="#addAdminModal">Add User</button>
                        <!-- Admin Table -->
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Naam</th>
                                    <th>E-mail</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($admins as $admin): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($admin['admin_id']); ?></td>
                                        <td><?php echo htmlspecialchars($admin['admin_name']); ?></td>
                                        <td><?php echo htmlspecialchars($admin['admin_email']); ?></td>
                                        <td><?php echo htmlspecialchars($admin['createdAt']); ?></td>
                                        <td>
                                            <!-- Edit Button -->
                                            <button type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal"
                                                data-bs-target="#editAdminModal"
                                                data-id="<?php echo htmlspecialchars($admin['admin_id']); ?>"
                                                data-name="<?php echo htmlspecialchars($admin['admin_name']); ?>"
                                                data-email="<?php echo htmlspecialchars($admin['admin_email']); ?>">
                                                Edit </button>
                                            <!-- Delete Button -->
                                            <form action="dashboard.php" method="POST" class="d-inline">
                                                <input type="hidden" name="admin_id"
                                                    value="<?php echo htmlspecialchars($admin['admin_id']); ?>">
                                                <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
        <!-- Add Admin Modal -->
        <div class="modal fade" id="addAdminModal" tabindex="-1" aria-labelledby="addAdminModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addAdminModalLabel">Add User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form action="add_admin.php" method="POST">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="admin_name" class="form-label">Name</label>
                                <input type="text" class="form-control" id="admin_name" name="admin_name" required>
                            </div>
                            <div class="mb-3">
                                <label for="admin_email" class="form-label">E-mail</label>
                                <input type="email" class="form-control" id="admin_email" name="admin_email" required>
                            </div>
                            <div class="mb-3">
                                <label for="admin_password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="admin_password" name="admin_password"
                                    required>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary" name="add_admin">Add User</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- Edit Admin Modal -->
        <div class="modal fade" id="editAdminModal" tabindex="-1" aria-labelledby="editAdminModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editAdminModalLabel">Edit User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                    </div>
                    <form action="edit_admin.php" method="POST">
                        <div class="modal-body">
                            <input type="hidden" id="edit_admin_id" name="admin_id">
                            <div class="mb-3">
                                <label for="edit_admin_name" class="form-label">Name</label>
                                <input type="text" class="form-control" id="edit_admin_name" name="admin_name" required>
                            </div>
                            <div class="mb-3">
                                <label for="edit_admin_email" class="form-label">E-mail</label>
                                <input type="email" class="form-control" id="edit_admin_email" name="admin_email"
                                    required>
                            </div>
                            <div class="mb-3">
                                <label for="edit_admin_password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="edit_admin_password"
                                    name="admin_password">
                                <small class="form-text text-muted">Leave this empty if you don't want to update the password.</small>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary" name="edit_admin">Update User</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <script src="./assets/js/jquery.min.js"></script>
        <script src="./assets/js/bootstrap.bundle.min.js"></script>
        <script>
            // Populate edit form with admin data
            document.addEventListener('DOMContentLoaded', function () {
                var editAdminModal = document.getElementById('editAdminModal');
                editAdminModal.addEventListener('show.bs.modal', function (event) {
                    var button = event.relatedTarget;
                    var adminId = button.getAttribute('data-id');
                    var adminName = button.getAttribute('data-name');
                    var adminEmail = button.getAttribute('data-email');

                    var modal = bootstrap.Modal.getInstance(editAdminModal);
                    $('#edit_admin_id').val(adminId);
                    $('#edit_admin_name').val(adminName);
                    $('#edit_admin_email').val(adminEmail);
                });
            });
        </script>
    </body>

</html>