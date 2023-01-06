var DashboardGridsModel = function () {
    var me = this;
    me.gridDistrictsReport = $('#grid_report_district');
    me.gridLabsReport = $('#grid_labs_count');
    me.water_reports_grid = $('#water_reports_grid');
    me.air_reports_grid = $('#air_reports_grid');
    me.districtsReportGrid = null;
    me.labReportGrid = null;
    $("#btnSearch").click(function () {
        me.updateReportGrid(me.gridDistrictsReport, "/labs/get_district_reports_count/");
        me.updateReportGrid(me.gridLabsReport, "/labs/get_laboratory_reports_count/");
    });
    $("#btnDownload").click(function () {
        me.districtsReportGrid.jqxGrid('exportdata', 'xlsx', 'Download_' + new Date().getMilliseconds());
    });
    $("#btnGridDownlaodWater").click(function () {
        me.water_reports_grid.jqxGrid('exportdata', 'xlsx', 'Download_' + new Date().getMilliseconds());
        // me.air_reports_grid.jqxGrid('exportdata', 'xlsx', 'Download_' + new Date().getMilliseconds());
    });
    $("#btnGridDownlaodAir").click(function () {
        // me.water_reports_grid.jqxGrid('exportdata', 'xlsx', 'Download_' + new Date().getMilliseconds());
        me.air_reports_grid.jqxGrid('exportdata', 'xlsx', 'Download_' + new Date().getMilliseconds());
    });
    me.initialize = function () {

    }
    me.createDistrictReportGrid = function () {
        var cols = me.getReportGridColumns();
        var arrData = [];
        me.districtsReportGrid = me.createJqxGrid(me.gridDistrictsReport, arrData, cols);
        me.updateReportGrid(me.gridDistrictsReport, "/labs/get_district_reports_count/");
    }
    me.createLaboratoryReportGrid = function () {
        var cols = me.getReportGridColumns();
        var arrData = [];
        me.labReportGrid = me.createJqxGrid(me.gridLabsReport, arrData, cols);
        me.updateReportGrid(me.gridLabsReport, "/labs/get_laboratory_reports_count/");
    }
    me.createWaterReportsDetailGrid = function () {
        var row = {
            "laboratory_name": 'Lahore',
            "district": "Lahore",
            "category": "category",
            "letter_no": "20 DD(LAB)/SKP/2022",
            "letter_date": "2022-01-31",
            "letter_issued_by": "DD(LAB)",
            "name_industry": "HAJI MUHAMMAD BASHIR TANNERIES PVT LTD",
            "address_industry": "23 KM GT ROAD MURIDKEY",
            "sample_type": "Grab",
            "sampling_point": "Not Provided",
            "treatment_facility": "Nil",
            "treatment_facility_type": "Primary",
            "process_generating_wastewater": "Not Provided",
            "discharge": "Not Provided",
            "sampling_date": "2022-01-19",
            "sample_receiving_date": "2022-01-19",
            "sample_id_no": "06/RA/WW/EPA/SKP/2022",
            "sample_received_from": "ZAHID MAHMOOD, RESEARCH ASSISTANT",
            "sample_received_by": "RESEARCH OFFICER LAB",
            "form_d_path": "form_d/D_beoRSGh.jpg",
            "form_b_path": "form_b/B_QrvSFgx.jpg",
            "letter_path": "letters/L_EUZn6yi.jpg",
            "latitude": null,
            "longitude": null,
            "updated_at": "2022-10-12T07:30:33.168915+00:00",
            "Sulfide (S2-)": null,
            "Temerature or Temperature Increase": null,
            "pH value (H)": 8.81,
            "Biochenical Oxygen Demand (BOD:) at 20°C": 1318.0,
            "Chemical Oxygen Demand 150 mg/L 100 SMWW 5220 B PEQS (COD)": 2230.0,
            "Total Dissolved Solids (TDS)": 4888.0,
            "Total Suspended Solids (TSS)": 1164.0,
            "Chloride (as Cl)": 2040.0,
            "Sulfate (SO4)2-": 751.0
        };
        var cols = me.getGridColumns(row);
        var arrData = [];
        me.labReportGrid = me.createJqxGrid(me.water_reports_grid, arrData, cols);
        me.updateReportGrid(me.water_reports_grid, "/labs/get_labs_reports/?report_type=water");
    }
    me.createAirReportsDetailGrid = function () {
        var row = {
            "laboratory_name": 'Lahore',
            "district": "Lahore",
            "category": "category",
            "report_no": "--",
            "letter_no": "--",
            "letter_date": "2022-05-17",
            "letter_issued_by": "--",
            "name_industry": "M/S Abdul Hadi Bricks Company",
            "address_industry": "Ellahi Petrol Pump Near Ada Gulzarpur, Dunyapur ROad Multan",
            "sampling_source": "Not Provided",
            "monitoring_date": "2022-05-17",
            "fuel_type": "Not Provided",
            "emission_control_system": "Not Provided",
            "sample_monitored_by": "--",
            "latitude": null,
            "longitude": null,
            "form_d_path": "form_d/1_Form_D_1S4iehu.jpeg",
            "form_b_path": "form_b/10.jpg",
            "letter_path": "letters/2_Letter_yWMBwXD.jpeg",
            "updated_at": "2022-11-25T05:04:21.932954+00:00",
            "Smoke": 60.0
        };
        var cols = me.getGridColumns(row);
        var arrData = [];
        me.labReportGrid = me.createJqxGrid(me.air_reports_grid, arrData, cols);
        me.updateReportGrid(me.air_reports_grid, "/labs/get_labs_reports/?report_type=air");
    }
    me.updateReportGrid = function (gridEl, url) {
        var params = {
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
                text: 'Name',
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
        let grid = gridEl.jqxGrid(
            {
                source: source,
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