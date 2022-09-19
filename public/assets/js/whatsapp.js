$(document).ready(() => {
    var socket = io({
        path: "/socket.io.whatsapp",
    });
    var logsEl = $("#logs");

    socket.on("message", (msg) => {
        logsEl.append($("<li>").text(msg));
    });

    socket.on("authed", (msg) => {
        logsEl.append($("<li>").text(msg));
        $("#qr-scan").removeClass("d-none")
        $("#qrcode").attr("src", "/assets/images/success.png");
        $("#qrcode").attr("width", "200");
        $("#qrcode").attr("height", "200");
        $("#qr-scan h4").remove()
        $("#qr-scan h5").html("Terhubung")
        $("#qr-scan p").remove()
        $("#loader").remove();
    });

    socket.on("qr", (qr) => {
        $("#loader").remove()
        $("#qrcode").attr("src", qr);
        $("#qr-scan").removeClass("d-none")
    });
});