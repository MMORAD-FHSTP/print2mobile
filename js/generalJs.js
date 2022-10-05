$(document).ready(() => {

    $("#goToQRCode").click((el) => {
        console.log("HÄ")
        $('body, html').animate({scrollTop: $('#qr-code-section').offset().top}, 1000);
    })

    $("#goToLandingPage").click(() => {
        console.log("HÄ")
        $('body, html').animate({scrollTop: $('#welcome-container').offset().top}, 1000);
    })

    $('html').animate({scrollTop:0}, 1);
    $('body').animate({scrollTop:0}, 1);

})