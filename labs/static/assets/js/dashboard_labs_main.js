$(document).ready(function () {
    var dashboard = new LabReportsDashboard();
    dashboard.initialize();
});
var LabReportsDashboard = function () {
    var me = this;
    me.barchart = null;
    me.gridVM = null;
    me.initialize = function () {
        $('#tabs').jqxTabs({height: 550, width: '100%', position: 'top'});
        me.getDivisionLevelStats();
        me.gridVM = new DashboardGridsModel();
        me.gridVM.createDistrictReportGrid();
        me.gridVM.createLaboratoryReportGrid();
        me.gridVM.createWaterReportsDetailGrid();
        me.gridVM.createAirReportsDetailGrid();
    }
    me.getDivisionLevelStats = function () {
        $.ajax({
            url: "/labs/get_labs_highmap_json?level=division", success: function (response) {
                response = JSON.parse(response);
                data = response.high_maps
                data = JSON.parse(data)
                me.createHighMaps(data[0].geojson);
                me.createBarChart(response);
                me.updateTiles(response);
            }
        });
    }
    me.updateTiles = function (data) {
        let tiles = data.tiles_data;
        let t = JSON.parse(tiles);
        let total = 0;
        var obj = {};
        for (var k in t) {
            let row = t[k];
            let dcount = row['dcount'];
            if (typeof (dcount) === "undefined") {
                dcount = 0;
            }
            obj[row['report_title']] = dcount
            total = total + dcount
        }
        obj['total'] = total;
        me.setTilesValues(obj);


    }
    me.setTilesValues = function (obj) {
        // var c = ((a < b) ? 'minor' : 'major');
        obj["Waste Water"] = ((obj.hasOwnProperty("Waste Water")) ? obj["Waste Water"] : 0)
        obj["Air"] = ((obj.hasOwnProperty("Air")) ? obj["Air"] : 0)
        obj["Others"] = ((obj.hasOwnProperty("Others")) ? obj["Others"] : 0)
        document.getElementById("total").innerHTML = obj["total"]
        document.getElementById("yes").innerHTML = obj["Waste Water"]
        document.getElementById("p_yes").innerHTML = Math.round((obj["Waste Water"] / obj["total"] * 100)) + " %"
        document.getElementById("up").innerHTML = obj["Air"]
        document.getElementById("p_up").innerHTML = Math.round((obj["Air"] / obj["total"] * 100)) + " %"
        document.getElementById("no").innerHTML = obj["Others"]
        document.getElementById("p_no").innerHTML = Math.round((obj["Others"] / obj["total"] * 100)) + " %"

    }
    me.createHighMaps = function (input_data) {
        const drilldown = async function (e) {
            if (!e.seriesOptions) {
                const chart = this;
                const mapKey = `countries/us/${e.point.drilldown}-all`;
                const division_id = e.point.properties.code;
                // Handle error, the timeout is cleared on success
                let fail = setTimeout(() => {
                    if (!Highcharts.maps[mapKey]) {
                        chart.showLoading(`
                    <i class="icon-frown"></i>
                    Failed loading ${e.point.name}
                `);
                        fail = setTimeout(() => {
                            chart.hideLoading();
                        }, 1000);
                    }
                }, 3000);

                // Show the Font Awesome spinner
                chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>');
                // Load the drilldown map
                var url = "/labs/get_labs_highmap_json?level=district&division_id=" + division_id
                var res = await fetch(url).then(response => response.json());
                rs = res.high_maps
                rs = JSON.parse(rs)
                const input_data = rs[0].geojson;
                const data = Highcharts.geojson(input_data);
                // Set a non-random bogus value
                data.forEach((d, i) => {
                    if (d.properties) {
                        d.value = d.properties.total;
                        d.name = d.properties.name
                    }

                });
                // Apply the recommended map view if any
                chart.mapView.update(Highcharts.merge({insets: undefined}, "map"), false);

                // Hide loading and add series
                chart.hideLoading();
                clearTimeout(fail);
                chart.addSeriesAsDrilldown(e.point, {
                    name: e.point.drilldown, data, dataLabels: {
                        enabled: true, format: '{point.drilldown}'
                    }
                });
                me.createBarChart(res);
                me.updateTiles(res);
            }
        };
// On drill up, reset to the top-level map view
        const drillup = function (e) {
            if (e.seriesOptions.custom && e.seriesOptions.custom.mapView) {
                e.target.mapView.update(e.seriesOptions.custom.mapView, false);
            }
            me.getDivisionLevelStats();
        };
        const data = Highcharts.geojson(input_data);
        data.forEach((d, i) => {
            var name = null;
            if (d.properties != null) {
                name = d.properties.name
                d.value = d.properties.total;
                d.name = d.properties.name
            }
            d.drilldown = name;
            // d.value = i; // Non-random bogus data
        });

        // Instantiate the map
        Highcharts.mapChart('highMap', {
            chart: {
                events: {
                    drilldown, drillup
                }
            },

            title: {
                text: 'Reports Count Map'
            },

            colorAxis: {
                min: 0, minColor: '#E6E7E8', maxColor: '#005645'
            },

            // mapView,

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'top'
                }
            },
            plotOptions: {
                map: {
                    borderColor: "#2F4F4F",
                    borderWidth: 1.5,
                    states: {
                        hover: {
                            color: '#EEDD66'
                        }
                    }
                }
            },

            series: [{
                data,
                name: 'Punjab Divisions',
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.name}'
                },
                // custom: {
                //     mapView
                // }
            }],

            drilldown: {
                activeDataLabelStyle: {
                    color: '#FFFFFF', textDecoration: 'none', textOutline: '1px #000000'
                }, drillUpButton: {
                    relativeTo: 'spacingBox', position: {
                        x: 0, y: 60
                    }
                }
            }
        });

    }
    me.createBarChart = function (data) {
        data = data.chart
        data = JSON.parse(data)
        var categories = me.create_barchart_categories(data);
        var series = me.create_barchart_series(categories, data);
        if (!me.barchart) {
            me.barchart = Highcharts.chart('barchart', {
                chart: {
                    type: 'bar'
                }, title: {
                    text: 'Report Count Chart'
                }, xAxis: {
                    categories: categories
                }, yAxis: {
                    min: 0, title: {
                        text: 'Total Count'
                    }
                }, legend: {
                    reversed: true
                }, plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                tooltip: {
                    //headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    //pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:0f}</b> of <br/>' + total
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.name}</b><b>{point.y:0f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                series: series
            });
        } else {
            me.barchart.update({
                xAxis: {
                    categories: categories
                },
                series: series
            })
        }
    }
    me.create_barchart_categories = function (data) {
        var categories = [];
        for (var i = 0; i < data.length; i++) {
            var key = data[i].name;
            if (categories.indexOf(key) === -1) {
                categories.push(key)
            }
        }
        categories.sort();
        return categories;
    }
    me.create_barchart_series = function (categories, data) {
        var arr_water = [];
        var arr_air = [];
        var arr_others = [];
        var series_data = [];
        for (var j in categories) {
            var row = me.create_barchart_series_row(data, categories[j])
            series_data.push(row);
        }
        for (var m = 0; m < series_data.length; m++) {
            arr_water.push(series_data[m].water)
            arr_air.push(series_data[m].air)
            arr_others.push(series_data[m].other)
        }
        var series = [
            {
                name: 'Water', data: arr_water, color: '#f7bb07'
            }, {
                name: 'Air', data: arr_air, color: '#d53343'
            },
            {
                name: 'Other', data: arr_others, color: '#198754'
            }
        ]
        return series;
    }
    me.create_barchart_series_row = function (data, key) {
        var row = {'name': key, 'water': 0, 'air': 0, 'other': 0}
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            if (obj.name === key) {
                var count = parseInt(obj.dcount);
                if (typeof (count) == "undefined" || count == null || count < 0) {
                    count = 0;
                }
                if (obj.report_title === 'Waste Water') {
                    row['water'] = count
                } else if (obj.report_title === 'Air') {
                    row['air'] = count
                } else if (obj.report_title === 'Other') {
                    row['other'] = count
                }
            }

        }
        return row;
    }

}

