$(document).ready(function () {
    $(document).on({
        ajaxStart: function () {
            $("body").addClass("loading");
        },
        ajaxStop: function () {
            $("body").removeClass("loading");
        }
    });
    var $table = $('#table');
    $(function () {
        getDataFromServer(false)
    })
    $("#btnDownload").click(function () {
        let period = $("input[name='rd_period']:checked").val();
        let sat = $("input[name='rd_satellite']:checked").val();
        let file_name = "fire_locations_" + sat + "_" + period
        $table.tableExport({type: 'excel', fileName: file_name});
    });
    $("#btnSearch").click(function () {
        getDataFromServer(false);
    });


    function getDataFromServer(isDownload) {
        let period = $("input[name='rd_period']:checked").val();
        let sat = $("input[name='rd_satellite']:checked").val();
        let file_name = "fire_locations_" + sat + "_" + period
        let url = '/fire_points/?sat=' + sat + "&period=" + period;
        $.ajax({
            url: url,
            type: "GET",
            cors: true,
            crossDomain: true,
            success: function (data) {
                data = JSON.parse(data);
                $table.bootstrapTable("destroy");
                $table.bootstrapTable({data: data})
                if (isDownload) {
                    $table.tableExport({type: 'excel', fileName: file_name});
                }
            },
            error: function (xhr, status, error) {
                alert(error);
            },
        });
    }


});

function gMapFormatter(value) {
    return [
        '<a class="like" target="_blank" href="' + value + '" title="Link"> Click to View on Map',
        '</a>'].join('');
}

function serialFormatter(v, r, i) {
    return i + 1;
}
