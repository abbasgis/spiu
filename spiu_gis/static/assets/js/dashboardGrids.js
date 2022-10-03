var DashboardGridsModel = function () {
    var me = this;
    me.gridReport = $('#grid_report');
    me.reportGrid = null;
    $("#btnSearch").click(function () {
        me.updateReportGrid();
    });
    $("#btnDownload").click(function () {
        me.reportGrid.jqxGrid('exportdata', 'xlsx', 'Download_' + new Date().getMilliseconds());
    });
    me.initialize = function () {

    }
    me.createReportGrid = function () {
        var cols = me.getReportGridColumns();
        var arrData = [];
        me.reportGrid = me.createJqxGrid(me.gridReport, arrData, cols);
        me.updateReportGrid();
    }
    me.updateReportGrid = function () {
        var params = {
            'start_date': $("#startdate").val(),
            'end_date': $("#enddate").val(),
            csrfmiddlewaretoken: token,
            state: "inactive"
        };
        me.updateGridData(me.gridReport, params, "/gis/get_report_json/");
    }
    me.getReportGridColumns = function () {
        var columns = [
            {
                text: 'Id',
                hidden: true,
                width: 50,
                datafield: 'unique_id',
                shrinkToFit: true,
                filtertype: 'number',

            },
            {
                text: 'District',
                // width: 200,
                datafield: 'name',
                shrinkToFit: true,
                filtertype: 'input',
                aggregates: ['count']
            },
            {
                text: "Count",
                datafield: 'dcount',
                // width: 100,
                // cellformat: f2,
                cellsalign: 'center',
                shrinkToFit: true,
                filtertype: 'number',
                aggregates: ['sum']
            },
        ];
        return columns;
    };
    me.createJqxGrid = function (gridEl, data, columns) {
        var source =
            {
                datatype: "json",
                datafields: me.createFields(data[1]),
                localData: data
            };
       let grid =  gridEl.jqxGrid(
            {
                source: source,
                width: "100%",
                height: "450",
                theme: "arctic",
                //    autoheight: true,
                //height: height,
                sortable: true,
                //  showfilterrow: true,
                //  filterable: true,
                columnsResize: true,
                altrows: true,
                enabletooltips: true,
                columnsreorder: true,
                showstatusbar: true,
                statusbarheight: 25,
                showaggregates: true,
                showgroupaggregates: false,
                columns: columns,
            });
       return grid;
        // $(btnId).click(function () {
        //     me.gridEl.jqxGrid('exportdata', 'xlsx', 'Download_' + new Date().getMilliseconds());
        // });
    };
    me.createFields = function (obj) {
        var arrFields = [];
        for (var key in obj) {
            if (key.indexOf("progres") != -1 || key.indexOf("cumulative") != -1 || key == 'target_total' || key == 'target_achieved' || key == 'achieved_percentage') {
                arrFields.push({name: key, type: 'float'});
            } else {
                arrFields.push({name: key, type: 'string'});
            }

        }
        return arrFields;
    };
    me.updateGridData = function (gridEl, params, url) {
        $("#jqxLoader").jqxLoader({isModal: true, width: 100, height: 60, imagePosition: 'top'});
        $('#jqxLoader').jqxLoader('open');
        var request = $.ajax({
            url: url,
            method: "post",
            //contentType: 'application/json',
            dataType: "json",
            data: params
        });
        request.done(function (response) {
            var data = response;
            $('#jqxLoader').jqxLoader('close');
            var adapter = gridEl.jqxGrid('source');
            var source =
                {
                    datatype: "json",
                    datafields: adapter._source.datafields,
                    localdata: data
                };
            var dataAdapter = new $.jqx.dataAdapter(source);
            dataAdapter.dataBind();
            gridEl.jqxGrid({source: dataAdapter});
            gridEl.jqxGrid('updatebounddata');
        });
        request.fail(function (jqXHR, textStatus) {
            $('#jqxLoader').jqxLoader('close');
            alert("Request failed: " + textStatus);
        });
    }
};