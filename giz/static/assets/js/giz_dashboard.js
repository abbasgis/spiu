$(document).ready(function () {
    let dashboard = new GIZDashboard();
    dashboard.initialize();
});
let GIZDashboard = function () {
    let me = this;
    me.sunBurstchart = null;
    me.gridVM = null;
    me.initialize = function () {
        // me.getSunBurstChartData(2, 'chart_scope_of_work', 'Scope of Work');
        // me.getSunBurstChartData(-1, 'chart_env_data', 'Environmental Data');
        // me.getSunBurstChartData(4, 'chart_constarints', 'Constraints');
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
                // me.createOrganizationBarChart(response.chart_data)
                // me.createJqxGrid(response.data)
                me.updateTiles(response.summary)
                me.createOrganizationTreeGrid(response.data);
                // me.createSunBurstChart('chart_dept', response.data, 'Organization Inventory');

            }
        });
    }
    me.getEnvironmentData = function () {
        $.ajax({
            url: "/ioed/get_env_data/", success: function (response) {
                response = JSON.parse(response);
                me.createEnvironmentTreeGrid(response)
                // me.getSunBurstChartData(row.id,);
                me.createSunBurstChart('chart_env_data', response, 'Environment Data Inventory');
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
            if (obj['category'] === "academia" && obj['category_level'] === "parent") {
                document.getElementById("academia").innerHTML = 'Parent: ' + obj["count"];
                total = total + obj["count"]
                academia = academia + obj["count"]
                total_parent = total_parent + obj["count"]
            }
            if (obj['category'] === "academia" && obj['category_level'] === "attached") {
                document.getElementById("academia_attached").innerHTML = 'Attach: ' + obj["count"]
                total = total + obj["count"]
                academia = academia + obj["count"]
                total_attach = total_attach + obj["count"]
            }
            if (obj['category'] === "govt" && obj['category_level'] === "parent") {
                document.getElementById("govt").innerHTML = 'Parent: ' + obj["count"]
                total = total + obj["count"];
                govt = govt + obj["count"]
                total_parent = total_parent + obj["count"]
            }
            if (obj['category'] === "govt" && obj['category_level'] === "attached") {
                document.getElementById("govt_attached").innerHTML = 'Attach: ' + obj["count"]
                total = total + obj["count"]
                govt = govt + obj["count"]
                total_attach = total_attach + obj["count"]
            }
            if (obj['category'] === "intl" && obj['category_level'] === "parent") {
                document.getElementById("intl").innerHTML = 'Parent: ' + obj["count"]
                total = total + obj["count"];
                intl = intl + obj["count"]
                total_parent = total_parent + obj["count"]
            }
            if (obj['category'] === "intl" && obj['category_level'] === "attached") {
                document.getElementById("intl_attached").innerHTML = 'Attach: ' + obj["count"]
                total = total + obj["count"]
                intl = intl + obj["count"]
                total_attach = total_attach + obj["count"]
            }
        }
        document.getElementById("total").innerHTML = total
        document.getElementById("total_parent").innerHTML = 'Parent: ' + total_parent
        document.getElementById("total_attach").innerHTML = 'Attach: ' + total_attach
        document.getElementById("govt_total").innerHTML = govt
        document.getElementById("academia_total").innerHTML = academia
        document.getElementById("intl_total").innerHTML = intl


    }
    me.createSunBurstChart = function (chart_div, data, chart_title) {
        let chart_type = 'sunburst';
        if (chart_div === 'chart_env_data') {
            chart_type = 'sunburst'
        }
        data.forEach(function (item) {
            item.value = 1;
        });

        // Build the chart
        Highcharts.chart(chart_div, {

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
                name: 'Root',
                allowDrillToNode: true,
                allowTraversingTree: true,
                borderRadius: 3,
                cursor: 'pointer',
                dataLabels: {
                    format: '{point.name}',
                    filter: {
                        property: 'innerArcLength',
                        operator: '>',
                        value: 16
                    }
                },
                levels: [{
                    level: 1,
                    levelIsConstant: false,
                    dataLabels: {
                        filter: {
                            property: 'outerArcLength',
                            operator: '>',
                            value: 64
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
                ]

            }],

            tooltip: {
                headerFormat: '',
                // pointFormat: 'The population of <b>{point.name}</b> is <b>{point.value}</b>'
                pointFormat: '<b>{point.label}</b>'
            }
        });
    }
    me.createOrganizationBarChart = function (chart_data) {

        Highcharts.chart('sectors_charts', {
            chart: {
                type: 'bar',
                height: 500
            },
            title: {
                text: 'SECTORS SUMMARY'
            },
            xAxis: {
                // categories: categories
                categories: ['Academia', 'Government Department', 'International Organizations.']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Count'
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    },
                    point: {
                        events: {
                            click: function () {
                                // Handle the click event here
                                alert('Bar clicked:' + this.series.name);
                            }
                        }
                    }
                }
            },
            series: [
                {
                    name: 'Attached',
                    data: chart_data.arr_attached
                },
                {
                    name: 'Parent',
                    data: chart_data.arr_parents
                }
            ]
        });
    }
    me.createJqxGrid = function (data) {
        let source =
            {
                localdata: data,
                datafields:
                    [
                        {name: 'name', type: 'string'},
                        {name: 'category', type: 'string'},
                        {name: 'category_level', type: 'string'},
                        {name: 'parent_name', type: 'string'}
                    ],
                datatype: "array"
            };
        let dataAdapter = new $.jqx.dataAdapter(source);
        $("#tgrid_org").jqxGrid(
            {
                width: '100%',
                source: dataAdapter,
                showfilterrow: true,
                filterable: true,
                selectionmode: 'multiplecellsextended',
                columns: [
                    {
                        text: '#', columntype: 'number', cellsrenderer: function (row, column, value) {
                            return "<div style='text-align: center;'>" + (value + 1) + "</div>";
                        }
                    },
                    {text: 'Name', columntype: 'textbox', filtertype: 'input', datafield: 'name', width: 300},
                    {
                        text: 'Category', filtertype: 'checkedlist', datafield: 'category'
                    },
                    {
                        text: 'Admin Level', filtertype: 'checkedlist', datafield: 'category_level'
                    },
                    {
                        text: 'Parent Name',
                        columntype: 'textbox',
                        filtertype: 'input',
                        datafield: 'parent_name',
                        width: 200
                    },
                ]
            });
        // $('#clearfilteringbutton').jqxButton({height: 25});
        // $('#clearfilteringbutton').click(function () {
        //     $("#tgrid_org").jqxGrid('clearfilters');
        // });

    }
    me.createBarChartData = function (summaryData) {
        let categories = [];
        let attachedData = [];
        let parentData = [];
        for (let i = 0; i < summaryData.length; i++) {
            let category = summaryData[i].category;
            let categoryLevel = summaryData[i].category_level;
            let count = summaryData[i].count;
            categories.push(category);

            if (categoryLevel === "attached") {
                attachedData.push(count);
                parentData.push(0);
            } else {
                attachedData.push(0);
                parentData.push(count);
            }
        }
    }
    me.createOrganizationTreeGrid = function (data) {
        // prepare the data
        let source =
            {
                datatype: "json",
                datafields: [
                    {name: 'id'},
                    {name: 'parent'},
                    {name: 'label'},
                    {name: 'category_level'},
                    {name: 'child_count'},
                    {name: 'latitude'},
                    {name: 'longitude'}
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
        $("#tgrid_org").jqxTreeGrid(
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
                    $("#tgrid_org").jqxTreeGrid('expandRow', '1');
                    $("#tgrid_org").jqxTreeGrid('expandRow', '4');
                },
                columns: [
                    {text: 'Name', dataField: 'label', width: 600},
                    {text: 'Count', dataField: 'child_count', width: 50, cellsalign: 'center'},
                    {text: 'Admin Level', dataField: 'category_level'},
                ]
            });
        $('#tgrid_org').on('rowClick',
            function (event) {
                let args = event.args;
                let row = args.row;
                if (row.child_count === 0 || row.category_level === 'attached') {
                    // alert("alert")
                    // me.getSunBurstChartData(row.id, 'chart_dept', 'Organizations');
                    let url = "https://maps.google.com/maps?q=" + row.latitude + "," + row.longitude + "&ie=UTF8&iwloc=&output=embed"
                    $("#gmap").attr('src', url)
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
                    {text: 'Name', dataField: 'name'},
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
                    me.getSunBurstChartData(row.id, 'chart_env_data', row.name);
                }
            });

    }
}
