$(document).ready(function() {
    $("#formChangePass").on("submit", (e) => {
        e.preventDefault();
        if ($("#formChangePass").valid()) {
            Swal.fire({
                title: 'Apakah anda yakin?',
                text: "Mengubah kata sandi",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Iya',
                cancelButtonText: 'Tidak',
            }).then(function(result) {
                if (result.value) {
                    $.post("/admin/change_password", $(e.target).serialize(), function(data) {
                        if (data.status) {
                            Swal.fire("Berhasil!", "Password berhasil diubah", "success");
                        } else {
                            Swal.fire("Kesalahan!", "Password lama salah harap coba lagi", "error");
                        }
                    });
                }
            });
        }
    })
})