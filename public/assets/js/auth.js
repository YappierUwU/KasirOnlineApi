$(document).ready(function() {
    $("#formLogin").on("submit", (e) => {
        e.preventDefault();
        $.post("/admin/auth", $(e.target).serialize(), function(data) {
            if (data.status) {
                window.location = "/admin/dashboard"
            } else {
                $(".error-login").removeClass("d-none")
            }
        });
    })
    $(".form-control").on("keyup", (e) => {
        if (!$(".error-login").hasClass("d-none")) {
            $(".error-login").addClass("d-none")
        }
    })
})