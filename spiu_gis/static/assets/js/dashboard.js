$(document).ready(function () {
    var dashboard = new DesiltingDashboard();
    dashboard.initialize();
});
var DesiltingDashboard = function () {
    var me = this;
    me.barchart = null;
    me.gridVM = null;
    me.initialize = function () {
        me.getDivisionLevelStats();
        me.gridVM = new DashboardGridsModel();
        me.gridVM.createReportGrid();
    }
    me.getDivisionLevelStats = function () {
        $.ajax({
            url: "/gis/get_highmap_json?level=division", success: function (response) {
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
            obj[row['approval_construction_phase']] = dcount
            total = total + dcount
        }
        obj['total'] = total;
        me.setTilesValues(obj);


    }
    me.setTilesValues = function (obj) {
        // var c = ((a < b) ? 'minor' : 'major');
        obj["Yes"] = ((obj.hasOwnProperty("Yes")) ? obj["Yes"] : 0)
        obj["Under Process"] = ((obj.hasOwnProperty("Under Process")) ? obj["Under Process"] : 0)
        obj["No"] = ((obj.hasOwnProperty("No")) ? obj["No"] : 0)
        document.getElementById("total").innerHTML = obj["total"]
        document.getElementById("yes").innerHTML = obj["Yes"]
        document.getElementById("p_yes").innerHTML = Math.round((obj["Yes"] / obj["total"] * 100)) + " %"
        document.getElementById("up").innerHTML = obj["Under Process"]
        document.getElementById("p_up").innerHTML = Math.round((obj["Under Process"] / obj["total"] * 100)) + " %"
        document.getElementById("no").innerHTML = obj["No"]
        document.getElementById("p_no").innerHTML = Math.round((obj["No"] / obj["total"] * 100)) + " %"

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
                var url = "/gis/get_highmap_json?level=district&division_id=" + division_id
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
                text: 'Poultry Farms Count'
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
                    text: 'Poultry Farm Data Chart'
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
        var arr_up = [];
        var arr_yes = [];
        var arr_no = [];
        var series_data = [];
        for (var j in categories) {
            var row = me.create_barchart_series_row(data, categories[j])
            series_data.push(row);
        }
        for (var m = 0; m < series_data.length; m++) {
            arr_up.push(series_data[m].up)
            arr_yes.push(series_data[m].yes)
            arr_no.push(series_data[m].no)
        }
        var series = [
            {
                name: 'Under Process', data: arr_up, color: '#f7bb07'
            }, {
                name: 'No', data: arr_no, color: '#d53343'
            },
            {
                name: 'Yes', data: arr_yes, color: '#198754'
            }
        ]
        return series;
    }
    me.create_barchart_series_row = function (data, key) {
        var row = {'name': key, 'up': 0, 'yes': 0, 'no': 0}
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            if (obj.name === key) {
                var count = parseInt(obj.dcount);
                if (typeof (count) == "undefined" || count == null || count < 0) {
                    count = 0;
                }
                if (obj.approval_construction_phase === 'Under Process') {
                    row['up'] = count
                } else if (obj.approval_construction_phase === 'Yes') {
                    row['yes'] = count
                } else if (obj.approval_construction_phase === 'No') {
                    row['no'] = count
                }
            }

        }
        return row;
    }

}

