$(document).ready(function () {
    let olMapModel = new OL6MapModel('map');
    let dashboard = new GIZDashboard();
    dashboard.initialize(olMapModel);


});
let GIZDashboard = function () {
    let me = this;
    me.sunBurstchart = null;
    me.gridVM = null;
    me.olMapModel = null;
    me.initialize = function (olMapModel) {
        me.olMapModel = olMapModel;
        me.getOrganizationData()
        me.getEnvironmentData()

    }
    me.getSunBurstChartData = function (database_id_for_parent, chart_div_id, chart_title) {
        $.ajax({
            url: "/ioed/get_sunburst_data/?id=" + database_id_for_parent + "&chart=" + chart_div_id,
            success: function (response) {
                response = JSON.parse(response);
                me.createSunBurstChart(chart_div_id, response, chart_title);
            }
        });
    }
    me.getOrganizationData = function () {
        $.ajax({
            url: "/ioed/get_org_data/", success: function (response) {
                response = JSON.parse(response);
                me.updateTiles(response.summary)
                me.createOrganizationTreeGrid(response.data);
                me.olMapModel.initialize(response.data);

            }
        });
    }
    me.getEnvironmentData = function () {
        $.ajax({
            url: "/ioed/get_env_data/", success: function (response) {
                response = JSON.parse(response);
                me.createEnvironmentTreeGrid(response)
                me.createSunBurstChart('chart_env_data', response, 'Organizations Inventory Chart');
            }
        });
    }
    me.updateTiles = function (summary) {
        let total = 0;
        let govt = 0;
        let academia = 0;
        let intl = 0;
        let total_parent = 0;
        let total_attach = 0;
        for (let r in summary) {
            let obj = summary[r]
            // if (obj['category'] === "academia" && obj['category_level'] === "parent") {
            //     // document.getElementById("academia").innerHTML = 'Parent: ' + obj["count"];
            //     total = total + obj["count"]
            //     academia = academia + obj["count"]
            //     total_parent = total_parent + obj["count"]
            // }
            if (obj['category'] === "academia" && obj['category_level'] === "attached") {
                // document.getElementById("academia_attached").innerHTML = 'Attach: ' + obj["count"]
                total = total + obj["count"]
                academia = academia + obj["count"]
                total_attach = total_attach + obj["count"]
            }
            // if (obj['category'] === "govt" && obj['category_level'] === "parent") {
            //     // document.getElementById("govt").innerHTML = 'Parent: ' + obj["count"]
            //     total = total + obj["count"];
            //     govt = govt + obj["count"]
            //     total_parent = total_parent + obj["count"]
            // }
            if (obj['category'] === "govt" && obj['category_level'] === "attached") {
                // document.getElementById("govt_attached").innerHTML = 'Attach: ' + obj["count"]
                total = total + obj["count"]
                govt = govt + obj["count"]
                total_attach = total_attach + obj["count"]
            }
            if (obj['category'] === "intl" && obj['category_level'] === "parent") {
                // document.getElementById("intl").innerHTML = 'Parent: ' + obj["count"]
                total = total + obj["count"];
                intl = intl + obj["count"]
                total_parent = total_parent + obj["count"]
            }
            if (obj['category'] === "intl" && obj['category_level'] === "attached") {
                // document.getElementById("intl_attached").innerHTML = 'Attach: ' + obj["count"]
                total = total + obj["count"]
                intl = intl + obj["count"]
                total_attach = total_attach + obj["count"]
            }
        }

        let span_total = document.getElementById("total")
        span_total.setAttribute('data-purecounter-end', total + 1);
        span_total.textContent = total + 1;
        let govt_total = document.getElementById("govt_total")
        govt_total.setAttribute('data-purecounter-end', govt + 1);
        govt_total.textContent = govt + 1;
        let academia_total = document.getElementById("academia_total")
        academia_total.setAttribute('data-purecounter-end', academia);
        academia_total.textContent = academia;
        let intl_total = document.getElementById("intl_total")
        intl_total.setAttribute('data-purecounter-end', intl);
        intl_total.textContent = intl;
        // document.getElementById("total_parent").innerHTML = 'Parent: ' + total_parent
        // document.getElementById("total_attach").innerHTML = 'Attach: ' + total_attach
        // document.getElementById("govt_total").innerHTML = govt
        // document.getElementById("academia_total").innerHTML = academia
        // document.getElementById("intl_total").innerHTML = intl


    }
    me.createSunBurstChart = function (chart_div, data, chart_title) {
        let chart_type = 'sunburst';
        if (chart_div === 'chart_env_data') {
            chart_type = 'sunburst'
        }
        data.forEach(function (item) {
            item.value = 1;
        });
        let colors = Highcharts.getOptions().colors.filter(function (color) {
            return color !== '#ffffff';
        })
        // Build the chart
        Highcharts.chart(chart_div, {
            credits: {
                enabled: false
            },
            chart: {
                height: '500'
            },

            // Let the center circle be transparent
            colors: ['transparent'].concat(Highcharts.getOptions().colors),
            title: {
                text: chart_title
            },
            series: [{
                type: chart_type,
                data: data,
                colors: colors,
                name: 'Root',
                allowDrillToNode: true,
                allowTraversingTree: true,
                borderRadius: 3,
                cursor: 'pointer',
                dataLabels: {
                    format: '{point.name}',
                    // filter: {
                    //     property: 'innerArcLength',
                    //     operator: '>',
                    //     value: 16
                    // },
                    // rotation: -45,
                    // padding: -5,
                    // textOverflow: 'ellipsis',
                    style: {
                        // fontWeight: '10px',
                        // textOverflow: 'ellipsis'
                    },

                },
                levels: [
                    {
                        level: 1,
                        levelIsConstant: false,
                        dataLabels: {
                            filter: {
                                property: 'outerArcLength',
                                operator: '>',
                                value: 64
                            },
                            textOverflow: 'ellipsis',
                            style: {
                                textOverflow: 'ellipsis'
                            }
                        }
                    }, {
                        level: 2,
                        colorByPoint: true
                    },
                    {
                        level: 3,
                        colorletiation: {
                            key: 'brightness',
                            to: -0.5
                        }
                    },
                    {
                        level: 4,
                        colorletiation: {
                            key: 'brightness',
                            to: 0.5
                        }
                    }
                ],
                point: {
                    events: {
                        click: function () {
                            if (this.node.isLeaf) {
                                // Handle leaf node click here
                                // alert('Leaf node clicked:' + this.name);
                                let org_id = this.org_id
                                if (org_id) {
                                    me.getOrganizationDetail(org_id)
                                }
                            }
                        }
                    }
                }

            }],

            tooltip: {
                headerFormat: '',
                // pointFormat: 'The population of <b>{point.name}</b> is <b>{point.value}</b>'
                pointFormat: '<b>{point.label}</b>'
            }
        });
    }
    me.createOrganizationTreeGrid = function (data) {
        // prepare the data
        let source =
            {
                dataType: "json",
                dataFields: [
                    {name: 'org_id', type: 'number'},
                    {name: 'parent_org_id', type: 'number'},
                    {name: 'org_name', type: 'string'},
                    {name: 'child_count'},
                    {name: 'category_level'},
                    {name: 'latitude'},
                    {name: 'longitude'},
                    {name: 'url', type: 'string'},
                    {name: 'address', type: 'string'},
                ],
                hierarchy:
                    {
                        keyDataField: {name: 'org_id'},
                        parentDataField: {name: 'parent_org_id'}
                    },
                id: 'org_id',
                localData: data
            };
        // create data adapter.
        let dataAdapter = new $.jqx.dataAdapter(source);
        dataAdapter.dataBind();
        $("#tgrid_org").jqxTreeGrid(
            {
                width: '100%',
                height: '500px',
                source: dataAdapter,
                filterable: true,
                filterMode: 'simple',
                sortable: true,
                columnsResize: true,
                icons: true,
                ready: function () {
                    $("#tgrid_org").jqxTreeGrid('expandRow', '1');
                    $("#tgrid_org").jqxTreeGrid('expandRow', '4');
                },
                columns: [
                    {text: 'Name', dataField: 'org_name', width: 600},
                    // {text: 'Count', dataField: 'child_count', width: 50, cellsalign: 'center'},
                    // {text: 'Admin Level', dataField: 'category_level'},
                ]
            });
        $('#tgrid_org').on('rowClick',
            function (event) {
                let args = event.args;
                let row = args.row;
                if (row.latitude) {
                    me.olMapModel.zoomToLatLong(row)
                }
            });

    }
    me.createEnvironmentTreeGrid = function (data) {
        // prepare the data
        let source =
            {
                datatype: "json",
                datafields: [
                    {name: 'id'},
                    {name: 'parent'},
                    {name: 'name'},
                    {name: 'label'},
                    {name: 'level'},
                ],
                id: 'id',
                localdata: data,
                hierarchy:
                    {
                        keyDataField: {name: 'id'},
                        parentDataField: {name: 'parent'}
                    },
            };
        // create data adapter.
        let dataAdapter = new $.jqx.dataAdapter(source);
        dataAdapter.dataBind();
        $("#tgrid_env").jqxTreeGrid(
            {
                width: '100%',
                height: '500px',
                source: dataAdapter,
                // filterable: true,
                // filterMode: 'simple',
                sortable: true,
                columnsResize: true,
                icons: true,
                ready: function () {
                    $("#tgrid_env").jqxTreeGrid('expandRow', '1');
                    $("#tgrid_env").jqxTreeGrid('expandRow', '2');
                    $("#tgrid_env").jqxTreeGrid('expandRow', '4');
                },
                columns: [
                    {text: 'Name', dataField: 'label'},
                    // {text: 'Count', dataField: 'level', width: 50, cellsalign: 'center'},
                    // {
                    //     text: 'Chart', dataField: 'level', width: 63,
                    //     cellsRenderer: function (rowKey, dataField, value, data) {
                    //         if (value === 2) {
                    //             return "<div style='margin: 0px 20px;'><img style='margin-top: 2px;' width='16' height='16' src='/static/assets/img/sunburst_chart.png'/></div>";
                    //         } else {
                    //             return ""
                    //         }
                    //
                    //     }
                    // }
                ]
            });
        $('#tgrid_env').on('rowClick',
            function (event) {
                let args = event.args;
                let row = args.row;
                if (row.level === 2) {
                    me.getSunBurstChartData(row.id, 'chart_env_data', row.label);
                }
            });

    }
    me.getOrganizationDetail = function (org_id) {
        $.ajax({
            url: "/ioed/get_org_detail?id=" + org_id, success: function (response) {
                response = JSON.parse(response);
                let url = response.url
                myWindow = window.open(url, "", "width=600,height=800");
                // alert(url)
            }
        });
    }

}
