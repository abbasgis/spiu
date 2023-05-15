let DashboardGridsModel = function () {
    let me = this;
    me.gridDistrictsReport = $('#grid_report_district');
    me.gridLabsReport = $('#grid_labs_count');
    me.reports_detail_grid = $('#reports_detail_grid');
    me.districtsReportGrid = null;
    me.labReportGrid = null;
    me.labReportsDetailGrid = null;
    $("#btnSearch").click(function () {
        me.updateReportGrid(me.gridDistrictsReport, "/labs/get_district_reports_count/");
        me.updateReportGrid(me.gridLabsReport, "/labs/get_laboratory_reports_count/");
    });
    $("#btnGetReportsDetail").click(function () {
        me.createReportsDetailGrid();
    });

    $("#btnDownload").click(function () {
        me.districtsReportGrid.jqxGrid('exportdata', 'xlsx', 'Download_' + new Date().getMilliseconds());
    });

    $("#btnReportsGridDownload").click(function () {
        // me.water_reports_grid.jqxGrid('exportdata', 'xlsx', 'Download_' + new Date().getMilliseconds());
        me.reports_detail_grid.jqxGrid('exportdata', 'xlsx', 'Download_' + new Date().getMilliseconds());
    });
    me.initialize = function () {

    }
    me.createDistrictReportGrid = function () {
        let cols = me.getReportGridColumns();
        let arrData = [];
        me.districtsReportGrid = me.createJqxGrid(me.gridDistrictsReport, arrData, cols, "district");
        me.updateReportGrid(me.gridDistrictsReport, "/labs/get_district_reports_count/");
    }
    me.createLaboratoryReportGrid = function () {
        let cols = me.getReportGridColumns();
        let arrData = [];
        me.labReportGrid = me.createJqxGrid(me.gridLabsReport, arrData, cols, "labs");
        me.updateReportGrid(me.gridLabsReport, "/labs/get_laboratory_reports_count/");
    }

    me.createReportsDetailGrid = function () {
        $("#jqxLoader").jqxLoader({isModal: true, width: 100, height: 60, imagePosition: 'top'});
        $('#jqxLoader').jqxLoader('open');
        let url = "/labs/get_labs_reports/";
        let params = {
            'lab_name': $("#lab_name").val(),
            'report_type': $("#report_type").val(),
            csrfmiddlewaretoken: token,
            state: "inactive"
        };
        let request = $.ajax({
            url: url,
            method: "post",
            //contentType: 'application/json',
            dataType: "json",
            data: params
        });
        request.done(function (response) {
            let data = response;
            $('#jqxLoader').jqxLoader('close');
            if (data.length > 0) {
                let cols = me.getGridColumns(data[0])
                if (me.labReportsDetailGrid) {
                    let fields = me.createFields(data[1])
                    let source =
                        {
                            datatype: "json",
                            datafields: fields,
                            localdata: data
                        };
                    let dataAdapter = new $.jqx.dataAdapter(source);
                    dataAdapter.dataBind();
                    // me.labReportsDetailGrid.jqxGrid({_cachedcolumns: null});

                    me.labReportsDetailGrid.jqxGrid({columns: cols});
                    me.labReportsDetailGrid.jqxGrid({source: dataAdapter});
                    me.labReportsDetailGrid.jqxGrid('updatebounddata');
                    me.labReportsDetailGrid.refresh();
                } else {
                    me.labReportsDetailGrid = me.createJqxGrid(me.reports_detail_grid, data, cols, "reports_detail_grid");
                }
            }

        });
        request.fail(function (jqXHR, textStatus) {
            $('#jqxLoader').jqxLoader('close');
            alert("Request failed: " + textStatus);
        });


    }
    me.updateReportGrid = function (gridEl, url) {
        let params = {
            'start_date': $("#startdate").val(),
            'end_date': $("#enddate").val(),
            csrfmiddlewaretoken: token,
            state: "inactive"
        };
        me.updateGridData(gridEl, params, url);
    }
    me.getGridColumns = function (row) {
        let cols = [];
        for (let key in row) {
            let col = {
                text: key,
                width: 150,
                datafield: key,
                shrinkToFit: true,
                filtertype: 'input',

            };
            cols.push(col);
        }
        return cols;
    }
    me.getReportGridColumns = function () {
        let columns = [
            {
                text: 'Id',
                hidden: true,
                width: 50,
                datafield: 'unique_id',
                shrinkToFit: true,
                filtertype: 'number',

            },
            {
                text: 'Name',
                // width: 200,
                datafield: 'name',
                shrinkToFit: true,
                filtertype: 'input',
                aggregates: ['count']
            },
            {
                text: 'Report Type',
                width: 200,
                datafield: 'report_title',
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
    me.createJqxGrid = function (gridEl, data, columns, gridName) {
        let groupable = true;
        // if (gridName === 'district') {
        //     groupable = false
        // }
        let source =
            {
                datatype: "json",
                datafields: me.createFields(data[1]),
                localData: data
            };
        let grid = gridEl.jqxGrid(
            {
                source: source,
                groupable: groupable,
                width: "100%",
                height: "450",
                theme: "arctic",
                //    autoheight: true,
                //height: height,
                sortable: true,
                showfilterrow: true,
                filterable: true,
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
        let arrFields = [];
        for (let key in obj) {
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
        let request = $.ajax({
            url: url,
            method: "post",
            //contentType: 'application/json',
            dataType: "json",
            data: params
        });
        request.done(function (response) {
            let data = response;
            $('#jqxLoader').jqxLoader('close');
            let adapter = gridEl.jqxGrid('source');
            let source =
                {
                    datatype: "json",
                    datafields: adapter._source.datafields,
                    localdata: data
                };
            let dataAdapter = new $.jqx.dataAdapter(source);
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