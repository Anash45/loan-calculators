<?php
require './db_conn.php';

if (isset($_SESSION['loggedIn']) && $_SESSION['loggedIn'] == true) {
    header('location:./admin_management.php');
}
$alertMessage = '';
$alertClass = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    try {
        // Prepare SQL statement
        $stmt = $pdo->prepare("SELECT * FROM admins WHERE admin_email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        // Fetch user record
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['admin_password'])) {
            // Login successful
            $alertMessage = 'Login successful!';
            $alertClass = 'alert-success';
            if($user['admin_id'] == 1){
                $_SESSION['superadmin'] = true;
            }else{
                $_SESSION['superadmin'] = false;
            }
            // Redirect or start session, etc.
            $_SESSION['admin_id'] = $user['admin_id'];
            $_SESSION['admin_name'] = $user['admin_name'];
            $_SESSION['loggedIn'] = true;
            header('Location: ./index.php');
        } else {
            // Invalid credentials
            $alertMessage = 'Invalid email or password';
            $alertClass = 'alert-danger';
        }

    } catch (PDOException $e) {
        $alertMessage = 'Error: ' . $e->getMessage();
        $alertClass = 'alert-danger';
    }
}
?>
<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
        <link rel="stylesheet" href="./assets/css/bootstrap.min.css">
        <link rel="stylesheet" href="./assets/css/style.css?v=9">
    </head>

    <body class="bg-light d-flex flex-column vh-100 justify-content-center">
        <div class="container">
            <div class="row">
                <div class="col-xl-4 col-lg-5 col-md-6 col-sm-8 mx-auto">
                    <div class="login-box bg-white shadow card">
                        <div class="card-body">
                            <h1 class="fw-bold text-center">TCAD Loan Calculator</h1>
                            <h2 class="text-center mb-4">Log in</h2>
                            <?php if ($alertMessage): ?>
                                <div class="alert <?php echo $alertClass; ?> alert-dismissible fade show" role="alert">
                                    <?php echo $alertMessage; ?>
                                    <button type="button" class="btn-close" data-bs-dismiss="alert"
                                        aria-label="Close"></button>
                                </div>
                            <?php endif; ?>
                            <form method="POST" action="./login.php">
                                <div class="mb-3">
                                    <label for="email" class="form-label">E-mail</label>
                                    <input type="text" class="form-control green-inp bg-white" id="email" name="email" required>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <input type="password" class="form-control green-inp bg-white" id="password" name="password" required>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Log in</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="./assets/js/jquery.min.js"></script>
        <script src="./assets/js/bootstrap.bundle.min.js"></script>
        <script src="./assets/js/script.js?v=9"></script>
    </body>

</html>