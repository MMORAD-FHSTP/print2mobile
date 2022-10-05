<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" type="text/css" href="style.css"/>
    <title>Print2Mobile</title>
    <script src="https://code.jquery.com/jquery-3.6.1.min.js"
            integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>
</head>
<body class="animation-container">
    <script rel="script" src="js/generalJs.js"></script>

    <ul class="circles" aria-hidden="true">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul>

    <section>
        <div id="welcome-container">
            <h1>
                Welcome to XYZ!
            </h1>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                sed diam nonumy eirmod tempor invidunt ut labore et dolore
                magna aliquyam erat, sed diam voluptua. At vero eos et accusam
                et justo duo dolores et ea rebum. Stet clita kasd gubergren,
                no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
                ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
                sed diam voluptua. At vero eos et accusam et justo duo dolores
                et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
                est Lorem ipsum dolor sit amet.
            </p>
            <!--
            <div class="dividers">
                <div class="left-divider"></div>
                <div class="icon"><i>&#10061;</i></div>
                <div class="right-divider"></div>
            </div>
            -->
        </div>
        <div class="how-it-works-container">
            <h2>
                How it works:
            </h2>
            <div class="images-container">
                <img class="image">
                <img class="image">
                <img class="image">
            </div>
        </div>

        <button id="goToQRCode">Scan the QR Code!</button>

        <div class="arrow-icon-down">
            <i>&#8595;</i>
        </div>
    </section>

    <section>
        <div class="arrow-icon-up">
            <i>&#8593;</i>
        </div>
        <button id="goToLandingPage">Back to instructions</button>
        <div id="qr-code-section">
            <h2>Scan with your phone here!</h2>
            <div class="qr-code">
                <img src="img/QR_code_example.png">
            </div>
        </div>
    </section>

</body>
</html>
