<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Loan Calculator - TCAD BUYER ESTIMATED NET SHEET</title>
        <link rel="stylesheet" href="./assets/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
            integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
            crossorigin="anonymous" referrerpolicy="no-referrer" />
        <link rel="stylesheet" href="./assets/css/style.css">
    </head>

    <body>
        <header class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand d-flex align-items-center gap-2 fw-bold" href="./index.html">
                    <img src="./assets/images/TCAD_Logo.png" alt="Logo" width="45" height="45"
                        class="d-inline-block align-text-top"> TCAD BUYER ESTIMATED NET SHEET </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <nav class="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="./index.html">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="./loan-calculator.html">Loan Calculator</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./logout.php">Logout</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
        <main>
            <h1 class="text-center mt-4">Loan Calculators</h1>
            <div class="loans pb-5">
                <ul class="nav mt-4 nav-pills mb-4 justify-content-center" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pills-fha-buyer-tab" data-bs-toggle="pill"
                            data-bs-target="#pills-fha-buyer" type="button" role="tab" aria-controls="pills-fha-buyer"
                            aria-selected="true">FHA Buyer</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pills-conv-buyer-tab" data-bs-toggle="pill"
                            data-bs-target="#pills-conv-buyer" type="button" role="tab" aria-controls="pills-conv-buyer"
                            aria-selected="false">Conv Buyer</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pills-va-buyer-tab" data-bs-toggle="pill"
                            data-bs-target="#pills-va-buyer" type="button" role="tab" aria-controls="pills-va-buyer"
                            aria-selected="false">VA Buyer</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="pills-usda-buyer-tab" data-bs-toggle="pill"
                            data-bs-target="#pills-usda-buyer" type="button" role="tab" aria-controls="pills-usda-buyer"
                            aria-selected="false">USDA Buyer</button>
                    </li>
                </ul>
                <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade" id="pills-fha-buyer" role="tabpanel"
                        aria-labelledby="pills-fha-buyer-tab">
                        <?php require './calculators/fha_calculator.html'; ?>
                    </div>
                    <div class="tab-pane fade" id="pills-conv-buyer" role="tabpanel"
                        aria-labelledby="pills-conv-buyer-tab">
                        <?php require './calculators/conv_calculator.html'; ?>
                    </div>
                    <div class="tab-pane fade" id="pills-va-buyer" role="tabpanel" aria-labelledby="pills-va-buyer-tab">
                        <?php require './calculators/va_calculator.html'; ?>
                    </div>
                    <div class="tab-pane fade show active" id="pills-usda-buyer" role="tabpanel"
                        aria-labelledby="pills-usda-buyer-tab">
                        <?php require './calculators/usda_calculator.html'; ?>
                    </div>
                </div>
            </div>
        </main>
        <script src="./assets/js/jquery-3.6.1.min.js"></script>
        <script src="./assets/js/bootstrap.bundle.min.js"></script>
        <script src="./assets/js/fha_calculator.js"></script>
        <script src="./assets/js/conv_calculator.js"></script>
        <script src="./assets/js/va_calculator.js"></script>
        <script src="./assets/js/usda_calculator.js"></script>
        <script src="./assets/js/script.js"></script>
    </body>

</html>