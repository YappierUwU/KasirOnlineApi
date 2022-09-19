$(document).ready(() => {
    let localData = [];

    const renderData = (data) => {
        $("#load-more-btn").hide()
        if (data.data.length > 0) {
            localData = localData.concat(localData, data.data)
        }
        if (data.data.length == 20) {
            $("#load-more-btn").show()
        }

        if (localData.length > 0) {
            $("#not-found-data").addClass("d-none")
        } else {
            $("#not-found-data").removeClass("d-none")
        }

        data.data.forEach(user => {
            let date = new Date(user.created_at)
            let tzo = -date.getTimezoneOffset(),
                dif = tzo >= 0 ? '+' : '-',
                pad = function(num) {
                    return (num < 10 ? '0' : '') + num;
                };

            let tgl = date.getFullYear() +
                '-' + pad(date.getMonth() + 1) +
                '-' + pad(date.getDate()) +
                ' ' + pad(date.getHours()) +
                ':' + pad(date.getMinutes())
            $("#list_pengguna").append(`<div class="nk-tb-item list-item">
            <div class="nk-tb-col">
                    <div class="user-card">
                        <div class="user-info">
                            <span class="tb-lead">${user.nama_pemilik}</span>
                            <span class="d-block">${user.email_toko}</span>
                            <span class="d-block d-lg-none">${user.nomer_toko}</span>
                        </div>
                    </div>
            </div>
            <div class="nk-tb-col tb-col-lg">
                <span>${user.nomer_toko}</span>
            </div>
            <div class="nk-tb-col tb-col-lg">
                <span>${tgl}</span>
            </div>
            <div class="nk-tb-col nk-tb-col-tools">
                <ul class="nk-tb-actions gx-1">
                    <li class="nk-tb-action">
                        <a href="https://wa.me/${user.nomer_toko}" target="_blank" class="btn btn-trigger btn-icon" data-toggle="tooltip" data-placement="top" title="Kirim Whatsapp">
                            <em class="icon ni ni-whatsapp text-success"></em>
                        </a>
                    </li>
                    <li class="nk-tb-action">
                        <a href="mailto:${user.email_toko}" class="btn btn-trigger btn-icon" data-toggle="tooltip" data-placement="top" title="Kirim Email">
                            <em class="icon ni ni-mail-fill text-danger"></em>
                        </a>
                    </li>
                    
                </ul>
            </div>
        </div>`)
        });
    }

    const getLastItemTimestamp = () => {
        if (localData.length == 0) {
            return new Date().toISOString()
        } else {
            return localData.reduce((prev, current) => prev.created_at < current.created_at ? prev : current).created_at
        }
    }

    const fetchData = () => {
        let cari = $("#search-form").val()
        $.ajax({
                url: "/admin/pelanggan",
                data: { "timestamp": getLastItemTimestamp(), cari }
            })
            .done(function(data) {
                console.log(getLastItemTimestamp());
                renderData(data)
            });
    }

    const resetData = () => {
        localData = []
        $(".nk-tb-item.list-item").remove()
        fetchData()
    }
    $("#more-btn").on("click", () => fetchData())

    $("#search-form").on("keyup", (e) => {
        if (e.keyCode == 13) {
            resetData()
        }
    })
    $(".search-back.btn.btn-icon.toggle-search").on("click",
        () => {
            $("#search-form").val("")
            resetData()
        })
    fetchData();
})