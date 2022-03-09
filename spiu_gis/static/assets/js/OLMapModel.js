var OLMapModel = function (mapTarget, viewModel, token) {
    var me = this;
    // var mapDiv = mapDiv
    me.viewModel = viewModel;
    me.extGridVM = null;
    me.statsModel = null;
    me.fullScreenTarget = 'jqxLayout';
    me.mapTarget = mapTarget;
    // me.layerSwitcherTarget = layerSwitcherTarget;
    me.defaultInteractionsColl = null;
    // me.specialLayers =[];
    me.weatherApiKey = 'ef579e032d1c22b773d73939a7cd7dbe';
    me.extent_adj = [8155481.071400, 3374642.561600, 8386950.542200, 3617622.785500];
    me.extent_3857 = [7716814.100825835, 3214945.703216026, 8392792.597287048, 4031550.978240683];
    me.extent = [7716814.100825835, 3214945.703216026, 8392792.597287048, 4031550.978240683];
    me.bing_map_key = 'nIpvP3DE4KDIPD5rbvf8~tYqmHfqtK9FrpulnwqB6Ow~AlfsQeqqd1RiQqE5rzdQnrgwjgawr26TNXWuLLIrlyMRj2JEp_IhUATReKhb4rCt';
    me.style = null;
    me.view = null;
    me.map = null;
    me.minZoom = 5;
    // me.center = ol.extent.getCenter(extent);
    // me.progressbar = new ProgressBarModel();
    me.previousExtentList = [];
    me.nextExtentList = [];
    me.overlayLayers = [];
    me.specialLayers = [];
    me.labelLayers = [];
    me.groupLayers = [];
    me.measureLayer = null;
    me.attributesLayer = null;
    me.selectedFeatureLayer = null;
    me.selectInteraction = null;
    me.drawFeatureLayer = null;
    me.goToLocationLayer = null;
    me.csrfToken = token;
    me.geocoder = null;
    me.geolocation = null;
    me.geoServerPort = '8080';
    me.httpProtocol = 'http';
    if (location.protocol === 'https:') {
        me.geoServerPort = '8080';
        me.httpProtocol = 'https';
    }
    me.setViewModel = function (viewModel) {
        me.viewModel = viewModel;
    };
    // var host = '116.58.43.35';
    var host = window.location.hostname;
    me.geoServerURL = me.httpProtocol + '://' + host + ':' + me.geoServerPort + '/geoserver/';
    me.geoJSONLayers = [
        // {
        //     'title': 'Districts',
        //     'name': 'districts',
        //     'displayInSwitcher': true,
        //     'isVisible': true,
        //     'url': '/static/assets/district.geojson',
        //     'isLoadFromDb': false
        // },
        // {
        //     'title': 'Union Councils',
        //     'name': 'uc',
        //     'displayInSwitcher': true,
        //     'isVisible': true,
        //     'url': '/get_layer_geojson/?layer=uc',
        //     'isLoadFromDb': true
        // },
    ];
    me.geoServerLayers = [
        {
            'title': 'Division Boundary',
            'namespace': 'cite',
            'name': 'tbl_divisions',
            'displayInSwitcher': true,
            'isVisible': true,
            'group': 'General Layers'
        },
        {
            'title': 'District Boundary',
            'namespace': 'cite',
            'name': 'tbl_districts',
            'displayInSwitcher': true,
            'isVisible': true,
            'group': 'General Layers'
        },
        {
            'title': 'Tehsil Boundary',
            'namespace': 'cite',
            'name': 'tbl_tehsils',
            'displayInSwitcher': true,
            'isVisible': true,
            'group': 'General Layers'
        },
                {
            'title': 'Poultry Farms',
            'namespace': 'cite',
            'name': 'tbl_poultry_farms',
            'displayInSwitcher': true,
            'isVisible': true,
            'group': 'General Layers'
        },
    ];
    me.weatherLayers = [
        {
            'title': 'Clouds',
            'name': 'clouds_new',
            'displayInSwitcher': true,
            'isVisible': false,
            'opacity': 1,
            'group': 'Weather Layers'
        },
        {
            'title': 'Precipitation',
            'name': 'precipitation_new',
            'displayInSwitcher': true,
            'isVisible': false,
            'opacity': 1,
            'group': 'Weather Layers'
        },
        {
            'title': 'Wind Speed',
            'name': 'wind_new',
            'displayInSwitcher': true,
            'isVisible': false,
            'opacity': 1,
            'group': 'Weather Layers'
        },
        {
            'title': 'Temperature',
            'name': 'temp_new',
            'displayInSwitcher': true,
            'isVisible': false,
            'opacity': 1,
            'group': 'Weather Layers'
        },
    ];
    me.initialize = function () {
        // proj4.defs("EPSG:3857", "+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs");
        me.createStyle();
        me.addBaseLayer();
        me.addSelectedFeatureLayer();
        me.addMeasureToolLayer();
        me.addGoToLocationLayer();
        me.addCurrentLocationLayer();
        me.addBufferPopulationLayer();
        me.addBufferPoultryFarmLayer();
        // me.addDrawFeatureLayer();
        // me.addPathFeatureLayer();
        me.projection = new ol.proj.Projection({
            code: 'EPSG:3857',
            units: 'm',
            //    extent: me.extent,
            worldExtent: me.extent,
            global: false
        });
        me.view = new ol.View({
            center: ol.extent.getCenter(me.extent),
            // zoom: me.minZoom,
            extent: me.extent,
            zoom: 16,
            minZoom: 2,
            maxZoom: 20,
            //  rotation: -Math.PI / 8,
            // zoom: 2,
            // minZoom: 2,
            // maxZoom: 20,
            projection: me.projection,
        });
        me.map = new ol.Map({
            target: me.mapTarget,
            // openInLayerSwitcher: true,
            controls: me.getControls(),
            interactions: ol.interaction.defaults({
                pinchRotate: true,
                dragPan: true,
                DragRotate: false,
                DragZoom: true,
                mouseWheelZoom: true
            }),
            layers: [
                me.baseLayers,
                me.specialLayers["selectedFeatureLayer"],
                me.specialLayers["measurement"],
                me.specialLayers["goToLocationLayer"],
                me.specialLayers["currentLocationLayer"],
                me.specialLayers["bufferPopulationLayer"],
                me.specialLayers["bufferPoultryFarmLayer"],
                // me.specialLayers["drawFeatureLayer"],
                // me.specialLayers["pathFeatureLayer"]
            ],
            view: me.view

        });
        me.geolocation = new ol.Geolocation({
            projection: me.view.getProjection()
        });
        // me.zoomToGeoserverWMSLayerExtent('tbl_divisions');
        me.addGeoServerLayers();
        // me.addWeatherLayers();
        me.graticuleControl = new ol.control.Graticule({
            step: 0.001,
            stepCoord: .5,
            margin: 1,
            style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'rgba(12,12,12,0.9)',
                        width: .1,
                        lineDash: [0.5, 4]
                    }),
                    fill: new ol.style.Fill({color: true ? "#fff" : "#000"}),
                    text: new ol.style.Text({
                        stroke: new ol.style.Stroke({color: "#fff", width: 2}),
                        fill: new ol.style.Fill({color: 'black'}),
                        font: 'bold' + ' ' + '10' + 'px ' + 'Arial, Helvetica, Helvetica, sans-serif',
                    })
                }
            ),
            projection: 'EPSG:4326',
            formatCoord: function (c) {
                return c.toFixed(3) + "°"
            },
        });
        //    me.map.addControl(me.graticuleControl);
        var geoloc = new ol.control.GeolocationButton({
            delay: 20000 // 2s
        });
        me.map.addControl(geoloc);
        // Print control
        me.printControl = new ol.control.Print();
        // me.map.addControl(me.printControl);
        // me.printControl.on('printing', function (e) {
        //     // $('body').css('opacity', .5);
        //     var imageType = 'image/jpeg';
        //     var canvas = document.getElementsByClassName("ol-unselectable");
        //  //   var imgData = canvas[0].toDataURL("image/png");
        //     canvas[0].toBlob(function (blob) {
        //         saveAs(blob, 'map.' + imageType.replace('image/', ''));
        //     }, imageType);
        // });


        // var scaleLineControl = new ol.control.CanvasScaleLine();
        // me.map.addControl(scaleLineControl);
        // var ctrl = new ol.control.Scale({});
        // me.map.addControl(ctrl);
        // me.addVectorLayerFromGeoJson();
        // me.addGeoServerWMSImageLayer("Water Supply");
        // me.map.getLayers().on("propertychange", function (e) {
        //     // triggered when layer added or removed
        //     // alert(e);
        //     console.log(e)
        //
        // });
        // me.setViewExtent(me.extent);
        me.defaultInteractionsColl = me.map.getInteractions();
        me.viewport = me.map.getViewport();
        me.extGridVM = new ExtGridVM(me);
        me.setViewExtent(me.extent_adj);
        // me.addLayerSwitcher();
        // me.addPopupOverlay();

        // me.geocoder = new Geocoder('nominatim', {
        //     provider: 'osm',
        //     lang: 'en',
        //     placeholder: 'Search for ...',
        //     limit: 5,
        //     debug: false,
        //     autoComplete: true,
        //     keepOpen: true
        // });
        // me.map.addControl(me.geocoder);
        // // me.geocoder.getLayer().setVisible(false);
        // me.geocoder.on('addresschosen', function (evt) {
        //     window.setTimeout(function () {
        //         // me.geocoder.getLayer().getSource().clear();
        //         // alert(evt.coordinate+" ---,--- "+evt.address.formatted);
        //     }, 3000);
        // });

    }
    me.addVectorLayerFromGeoJson = function () {
        for (var i = 0; i < me.geoJSONLayers.length; i++) {
            var layer = me.geoJSONLayers[i];
            me.addVectorLayer(layer.title, layer.name, layer.url, layer.displayInSwitcher, layer.isVisible, layer.isLoadFromDb);
        }
    };
    me.addVectorLayer = function (title, name, url, displayInSwitcher, isVisible, isLoadFromDb) {
        me.url = url;
        me.vectorSource = me.getVectorLayerSource(name, url);
        me.overlayLayers[name] = new ol.layer.Vector({
            title: title,
            name: name,
            source: me.vectorSource,
            // style: function (feature) {
            //     return me.getVectorLayerStyle(feature, name);
            // }
        });
        me.map.addLayer(me.overlayLayers[name]);
        if (isLoadFromDb) {
            // me.getGeoJsonFromDB(me.overlayLayers[name], url);
        }
        return me.overlayLayers[name];
    }
    me.getVectorLayerSource = function (name, url) {
        var source = null;
        if (name === 'districts' || name === 'tehsils') {
            source = new ol.source.Vector({
                url: '/static/assets/tehsil.geojson',
                format: new ol.format.GeoJSON()
            });
        } else {
            source = new ol.source.Vector({
                features: []
            })

        }
        return source;
    }
    me.addGeoServerLayers = function () {
        for (var i = 0; i < me.geoServerLayers.length; i++) {
            var layer = me.geoServerLayers[i];
            if (layer.name === 'tbl_lgs_survey' || layer.name === 'tbl_lgs_survey_landmarks') {
                // me.readStyleFromGeoServerSLD(layer.namespace, layer.name);
                me.addGeoServerWFSVectorLayer(layer.title, layer.namespace, layer.name, layer.displayInSwitcher, layer.isVisible);
            } else {
                me.addGeoServerWMSImageLayer(layer.group, layer.title, layer.namespace, layer.name, layer.displayInSwitcher, layer.isVisible);
            }
        }
    };
    me.addWeatherLayers = function () {
        for (var i = 0; i < me.weatherLayers.length; i++) {
            var layer = me.weatherLayers[i];
            var layerName = layer.name;
            var group_name = layer.group;
            var url = 'https://tile.openweathermap.org/map/' + layerName + '/{z}/{x}/{y}.png?appid='+me.weatherApiKey
            if (layerName == 'clouds_new') {
                url = 'http://maps.openweathermap.org/maps/2.0/weather/WND/{z}/{x}/{y}?date=1527811099&use_norm=true&arrow_step=128&appid=' + me.weatherApiKey
            }
            me.overlayLayers[layerName] = new ol.layer.Tile({
                name: layer.title,
                layerName: layerName,
                visible: layer.isVisible,
                opacity: layer.opacity,
                displayInLayerSwitcher: layer.displayInLyrSwicher,
                source: new ol.source.XYZ({
                    url: url,
                    crossOrigion: 'anonymous'
                }),
            });
            if (!me.groupLayers[group_name]) {
                me.groupLayers[group_name] = new ol.layer.Group({
                    title: group_name,
                    name: group_name,
                    identify: false,
                    openInLayerSwitcher: true,
                    layers: []
                });
                me.map.addLayer(me.groupLayers[group_name]);
            }
            var groupLayers = me.groupLayers[group_name].getLayers();
            groupLayers.insertAt(groupLayers.getLength(), me.overlayLayers[layerName]);
            // me.map.addLayer(me.overlayLayers[layerName]);
            // return me.overlayLayers[layerName];
        }
    };
    me.stripHtml = function (html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }
    me.addPopupOverlay = function () {
        me.popup = new Popup();
        me.map.addOverlay(me.popup);
    }

    me.getMap = function () {
        return me.map;
    }

    me.getView = function () {
        return me.view;
    }
    me.resizeMapArea = function () {
        me.map.updateSize();
    }

    me.addBaseLayer = function () {
        if (!me.baseLayers) {
            me.baseLayers = new ol.layer.Group({
                name: 'Base Layers',
                info: false,
                openInLayerSwitcher: true,
                layers: [
                    new ol.layer.Tile({
                        name: 'Population Count',
                        type: "base",
                        visible: false,
                        opacity: 0.7,
                        displayInLayerSwitcher: true,
                        legendUrl: '/static/assets/img/sld/population.png',
                        source: new ol.source.XYZ({
                            url: "https://ogc.worldpop.org/geoserver/gwc/service/tms/1.0.0/wpGlobal:ppp_2020@EPSG:900913@png/{z}/{x}/{-y}.png"
                            // url: "https://ogc.worldpop.org/geoserver/gwc/service/tms/1.0.0/wpGlobal%3Appp_2020@EPSG%3A900913@png/{z}/{x}/{-y}.png",
                        })
                    }),
                    new ol.layer.Tile({
                        name: 'Road Map',
                        type: "base",
                        visible: true,
                        displayInLayerSwitcher: true,
                        source: new ol.source.OSM({
                            url: "http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",

                            // attributions: [new ol.Attribution({
                            //     html: "© Google"
                            // }),
                            //     new ol.Attribution({
                            //     html: '<a href="https://developers.google.com/maps/terms">Terms of Use.</a>'
                            // })
                            //]
                        })
                    }),
                    new ol.layer.Tile({
                        name: "Satellite",
                        type: "base",
                        visible: false,
                        source: new ol.source.OSM({
                            url: "http://mt{0-3}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
                            // attributions: [new ol.Attribution({
                            //                             //     html: "© Google"
                            //                             // }), new ol.Attribution({
                            //                             //     html: '<a href="https://developers.google.com/maps/terms">Terms of Use.</a>'
                            //                             // })]
                        })
                    }),
                    new ol.layer.Tile({
                        name: "OSM",
                        type: "base",
                        visible: false,
                        source: new ol.source.OSM()
                    }),

                ]
            });
        }

    };

    me.addOSM2BaseLayers = function (visible) {
        var osmLayer = new ol.layer.Tile({
            title: "OSM",
            info: false,
            // baseLayer: true,
            source: new ol.source.OSM(),
            visible: visible
        });
        var layers = me.baseLayers.getLayers();
        layers.insertAt(layers.getLength(), osmLayer);
    }

    me.addBingMap2BaseLayers = function (bing_type, visible) {
        var imagerySet = [];
        switch (bing_type) {
            case "Bing-Aerial":
                imagerySet.push({title: bing_type, iSet: "Aerial"});
                break;
            case "Bing-Road":
                imagerySet.push({title: bing_type, iSet: "Road"});
                break;
            case "Bing-Hybrid":
                imagerySet.push({title: bing_type, iSet: 'AerialWithLabels'});
                break;
            default:
                imagerySet.push({title: "Bing-Aerial", iSet: "Aerial"});
                imagerySet.push({title: "Bing-Road", iSet: "Road"});
                imagerySet.push({title: "Bing-Hybrid", iSet: 'AerialWithLabels'});
        }
        for (var i = 0; i < imagerySet.length; i++) {
            visible = (imagerySet[i].title == "Bing-Hybrid" ? true : visible);
            var bingLayer = new ol.layer.Tile({
                title: imagerySet[i].title,
                info: false,
                visible: visible,
                source: new ol.source.BingMaps({key: me.bing_map_key, imagerySet: imagerySet[i].iSet})
            })
            var layers = me.baseLayers.getLayers();
            layers.insertAt(layers.getLength(), bingLayer);
        }
    }

    me.getVectorLayerByName = function (layer_name) {
        return me.overlayLayers[layer_name];
    };
    me.getLayerNames = function () {
        var layerNames = [];
        me.map.getLayers().forEach(function (layer) {
            var layerName = layer.get('title');
            for (var key in me.overlayLayers) {
                if (layerName == key) {
                    layerNames.push(layerName);
                    break;
                }
            }


        })

        return layerNames;
    };
    me.getLayerNamesWithStyle = function () {
        var layers = [];
        me.map.getLayers().forEach(function (layer) {
            var layerName = layer.get('title');
            for (var key in me.overlayLayers) {
                if (layerName == key) {
                    var layerStyle = me.getLayerStyle(layerName);
                    layers.push({'layer_name': layerName, 'layer_style': layerStyle});
                    break;
                }
            }


        })

        return layers;
    }
    me.getAnyVisibleLayer = function () {
        var lyr = null;
        me.map.getLayers().forEach(function (layer) {
            var name = layer.get('name');
            if (name == 'Base Layers') {
                layer.getLayers().forEach(function (baseLayer) {
                    if (baseLayer.getVisible()) {
                        lyr = baseLayer;
                    }
                });

            }
        });

        return lyr;
    }
    me.getLayerNamesInGroupWithStyle = function (group_name) {
        var layers = [];
        var groupLayers = me.groupLayers[group_name];
        groupLayers.getLayers().forEach(function (layer) {
            var layerName = layer.get('title');
            for (var key in me.overlayLayers) {
                if (layerName == key) {
                    var layerStyle = me.getLayerStyle(layerName);
                    layers.push({'layer_name': layerName, 'layer_style': layerStyle});
                    break;
                }
            }


        })

        return layers;
    }
    me.addResultImageWMSLayer = function (result_table, url, layer_name, style) {
        var layers = layer_name;
        var params = {'LAYERS': layers, 'RESULT_TABLE': result_table};
        if (style && style !== '') {
            var styles = {"style": style};
            params.STYLES = JSON.stringify(styles);
        }
        me.overlayLayers[layer_name] = new ol.layer.Image({
            // extent: me.extent,
            title: layer_name,
            info: true,
            openInLayerSwitcher: true,
            source: new ol.source.ImageWMS({
                url: url,
                params: params,
                ratio: 1,
                // serverType: 'geoserver'
            })
        });
        me.map.addLayer(me.overlayLayers[layer_name]);
        return me.overlayLayers[layer_name];
    }
    me.addGeoServerWMSImageLayer = function (group_name, title, name_space, layerName, displayInLyrSwicher, isVisible) {
        var gs_layer = name_space + ':' + layerName;
        me.overlayLayers[layerName] = new ol.layer.Tile({
            name: title,
            layerName: layerName,
            nameSpace: name_space,
            visible: isVisible,
            displayInLayerSwitcher: displayInLyrSwicher,
            legendUrl: me.geoServerURL + 'wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=' + gs_layer,
            source: new ol.source.TileWMS({
                ratio: 1,
                url: me.geoServerURL + name_space + '/wms',
                serverType: 'geoserver',
                crossOrigin: 'anonymous',
                params: {
                    'TILED': true,
                    'srs': 'EPSG:3857',
                    'FORMAT': 'image/png',
                    // 'VERSION': '1.1.1',
                    "LAYERS": gs_layer,
                    // "exceptions": 'application/vnd.ogc.se_inimage',
                }
            })
        });
        if (!me.groupLayers[group_name]) {
            me.groupLayers[group_name] = new ol.layer.Group({
                title: group_name,
                name: group_name,
                identify: false,
                openInLayerSwitcher: true,
                layers: []
            });
            me.map.addLayer(me.groupLayers[group_name]);
        }
        var groupLayers = me.groupLayers[group_name].getLayers();
        groupLayers.insertAt(groupLayers.getLength(), me.overlayLayers[layerName]);
        // me.map.addLayer(me.overlayLayers[layerName]);
        return me.overlayLayers[layerName];
    };
    me.addGeoServerWFSVectorLayer = function (title, name_space, layerName, displayInLyrSwicher, isVisible) {
        var gs_layer = name_space + ':' + layerName;
        me.overlayLayers[layerName] = new ol.layer.Vector({
            name: title,
            layerName: layerName,
            nameSpace: name_space,
            displayInLayerSwitcher: displayInLyrSwicher,
            legendUrl: me.geoServerURL + 'wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=' + gs_layer,
            // source: new ol.source.Vector({
            //     format: new ol.format.GeoJSON(),
            //     url: function (extent) {
            //         return me.geoServerURL + name_space + '/ows?service=WFS&' +
            //             'version=1.1.0&request=GetFeature&typeName=' + gs_layer + '&' +
            //             'outputformat=json&srsname=EPSG:4326&' +
            //             'bbox=' + extent.join(',') + ',EPSG:3857';
            //     },
            //     strategy: ol.loadingstrategy.bbox
            // }),
            source: new ol.source.Vector({
                features: []
            }),
            style: function (feature) {
                return me.getVectorLayerStyle(feature, layerName)
            }
        });
        me.map.addLayer(me.overlayLayers[layerName]);
        return me.overlayLayers[layerName];
    };
    me.readStyleFromGeoServerSLD = function (name_space, layerName) {
        var gs_layer = name_space + ':' + layerName;
        var url = me.geoServerURL + '/wms?service=WMS&version=1.1.1&request=GetStyles&layers=' + gs_layer;
        $.ajax({
            url: url,
            // dataType: 'application/xml',
            success: function (data) {
                var sld = me.xml2json(data);
                var fs = sld['sld:StyledLayerDescriptor']['sld:NamedLayer']['sld:UserStyle']['sld:FeatureTypeStyle'];
                var arrRules = fs['sld:Rule'];

            }
        });
    };
    me.createSurveyLayerStyle = function (rules) {
        var style = '';
        for (var i = 0; i < rules.length; i++) {
            r = rules[i];
            me.getFeatureStyle();
        }

    };
    me.xml2json = function (xml) {
        try {
            var obj = {};
            if (xml.children.length > 0) {
                for (var i = 0; i < xml.children.length; i++) {
                    var item = xml.children.item(i);
                    var nodeName = item.nodeName;

                    if (typeof (obj[nodeName]) == "undefined") {
                        obj[nodeName] = me.xml2json(item);
                    } else {
                        if (typeof (obj[nodeName].push) == "undefined") {
                            var old = obj[nodeName];

                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(me.xml2json(item));
                    }
                }
            } else {
                obj = xml.textContent;
            }
            return obj;
        } catch (e) {
            console.log(e.message);
        }
    }
    me.getVectorLayerStyle = function (feature, layerName) {
        var style = null;
        if (layerName === 'tbl_lgs_survey') {
            style = me.getSurveyStyle(feature);
        } else {
            style = me.getSurveyLandMarkStyle(feature)
        }

        return style;

    };
    me.getSurveyStyle = function (feature) {
        var style = null;
        var columnVal = feature.get('activity_name');
        if (columnVal === 'Public Awareness Activity') {
            style = me.getFeatureStyle('#ff20d6', '#232323', 0.5, 7);
        } else if (columnVal === 'Burial of Corona effected Dead Bodies') {
            style = me.getFeatureStyle('#959b1b', '#232323', 0.5, 7);
        } else if (columnVal === 'Carpet Removal From Mosque') {
            style = me.getFeatureStyle('#bd6623', '#232323', 0.5, 7);
        } else if (columnVal === 'Disinfection Activity') {
            style = me.getFeatureStyle('#fb9a99', '#232323', 0.5, 7);
        } else if (columnVal === 'Handwashing Facility') {
            style = me.getFeatureStyle('#59db2e', '#232323', 0.5, 7);
        } else if (columnVal === 'Quarantine Facility') {
            style = me.getFeatureStyle('#ff7f00', '#232323', 0.5, 7);
        } else if (columnVal === 'Meeting/Training Sessions') {
            style = me.getFeatureStyle('#a6cee3', '#232323', 0.5, 7);
        } else if (columnVal === 'Others') {
            style = me.getFeatureStyle('#19e8de', '#232323', 0.5, 7);
        } else if (columnVal === 'Promoting Social Distancing') {
            style = me.getFeatureStyle('#1325c8', '#232323', 0.5, 7);
        } else if (columnVal === 'Supervisory Visits') {
            style = me.getFeatureStyle('#f0dd02', '#232323', 0.5, 7);
        } else if (columnVal === 'Red Zone Area') {
            style = me.getFeatureStyle('#e73018', '#232323', 0.5, 7);
        } else if (columnVal === 'LG Field Office') {
            // var stroke = new ol.style.Stroke({color: '#325780', width: 1});
            // var fill = new ol.style.Fill({color: '#ffb546'});
            var circle = new ol.style.RegularShape({
                radius: 9,
                fill: new ol.style.Fill({
                    color: '#ffb546'
                }),
                stroke: new ol.style.Stroke({
                    color: '#325780',
                    width: 1
                }),
                points: 4,
                angle: Math.PI / 4
            });
            style = new ol.style.Style({
                image: circle
            });
            // style = me.getFeatureStyle('#ffb546', '#325780', 0.5, 7);
        }
        return style;
    }
    me.getSurveyLandMarkStyle = function (feature) {
        var style = null;
        var columnVal = feature.get('activity_name');
        if (columnVal === 'Hospital') {
            style = me.regularShapeStyle('#f64200', '#232323', 0.5, 7);
        } else if (columnVal === 'Petrol Pump') {
            style = me.regularShapeStyle('#142cff', '#232323', 0.5, 7);
        } else if (columnVal === 'Police Station') {
            style = me.regularShapeStyle('#827113', '#232323', 0.5, 7);
        } else if (columnVal === 'Rescue 1122') {
            style = me.regularShapeStyle('#ff6767', '#232323', 0.5, 7);
        } else if (columnVal === 'Quarantine Facility') {
            style = me.regularShapeStyle('#56d2d0', '#232323', 0.5, 7);
        } else if (columnVal === 'Disposal Work') {
            style = me.regularShapeStyle('#2eff17', '#232323', 0.5, 7);
        } else if (columnVal === 'Slaughter House') {
            style = me.regularShapeStyle('#db6eda', '#232323', 0.5, 7);
        } else if (columnVal === 'LG office') {
            style = me.regularShapeStyle('#edea17', '#232323', 0.5, 7);
        } else if (columnVal === 'LG Field Office') {
            style = me.getIconStyle('/static/assets/img/sld/lg_field_office.png');
        }
        return style;
    };
    me.getIconStyle = function (icon_src) {
        var image = new ol.style.Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: icon_src
        });
        return new ol.style.Style({
            image: image
        });
    };
    me.regularShapeStyle = function (fill_color, stroke_color, stroke_width, radius, shape) {
        var style;
        var fill = new ol.style.Fill({
            color: fill_color
        });
        var stroke = new ol.style.Stroke({
            color: stroke_color,
            width: 1
        });
        var image = new ol.style.RegularShape({
            radius: 9,
            fill: fill,
            stroke: stroke,
            points: 4,
            angle: Math.PI / 4
        });

        style = new ol.style.Style({
            image: image
        });
        return style;
    }
    me.getFeatureStyle = function (fill_color, stroke_color, stroke_width, radius) {
        var circle = new ol.style.Circle({
            radius: radius,
            fill: new ol.style.Fill({
                color: fill_color
            }),
            stroke: new ol.style.Stroke({
                color: stroke_color,
                width: stroke_width
            }),
        });
        return new ol.style.Style({
            image: circle
        });

    };
    me.addImageWMSLayer = function (url, layer_name, style) {
        if (!url) url = "web_services/wms/get_map/";
        var layers = layer_name;
        var params = {'LAYERS': layers};
        if (style && style !== '') {
            var styles = {"style": style};
            params.STYLES = JSON.stringify(styles);
        }
        me.overlayLayers[layer_name] = new ol.layer.Image({
            // extent: me.extent,
            title: layer_name,
            info: true,
            openInLayerSwitcher: true,
            source: new ol.source.ImageWMS({
                url: url,
                params: params,
                ratio: 1,
                // serverType: 'geoserver'
            })
        });
        me.map.addLayer(me.overlayLayers[layer_name]);
        return me.overlayLayers[layer_name];
    }

    me.addTileWMSLayer = function (url, layer_name, style, group_name) {
        if (!me.overlayLayers[layer_name]) {
            if (group_name === '') group_name = 'Unspecified'
            var layers = layer_name;
            var params = {'LAYERS': layers};
            var minResolution = 0;
            var maxResolution = 100000;
            if (style && style !== '') {
                // style = JSON.parse(style);
                var styles;
                if ('style' in style) {
                    styles = style
                } else {
                    styles = {"style": style};
                }
                params.STYLES = JSON.stringify(styles);
                // params.STYLES = style
            }
            me.overlayLayers[layer_name] = new ol.layer.Tile({
                // extent: me.extent,
                openInLayerSwitcher: true,
                title: layer_name,
                info: true,
                source: new ol.source.TileWMS({
                    url: url,
                    params: params,
                    ratio: 1,
                    // serverType: 'geoserver'
                }),
                minResolution: minResolution,
                maxResolution: maxResolution
            });
            if (!me.groupLayers[group_name]) {
                me.groupLayers[group_name] = new ol.layer.Group({
                    title: group_name,
                    identify: false,
                    openInLayerSwitcher: true,
                    layers: []
                });
                me.map.addLayer(me.groupLayers[group_name]);
            }
            var groupLayers = me.groupLayers[group_name].getLayers();
            groupLayers.insertAt(groupLayers.getLength(), me.overlayLayers[layer_name]);
        }
        // me.map.addLayer(me.overlayLayers[layer_name]);
        return me.overlayLayers[layer_name]
    }
    me.showDialog = function (title, modalbody, size) {
        BootstrapDialog.show({
            title: title,
            type: BootstrapDialog.TYPE_SUCCESS,
            size: size,
            message: modalbody,
            draggable: true,
            buttons: [{
                label: 'Close',
                action: function (dialogItself) {
                    dialogItself.close()
                }
            }]
        })
    };
    me.addTileVectorLayer = function (url, layer_name) {
        // var url = url + '?version=1.1.0&request=GetFeature&layer_name=' + layer_name;
        var tiledSource = new ol.source.VectorTile({
            // format: new ol.format.MVT(),
            format: new ol.format.GeoJSON(),
            tileLoadFunction: function (tile) {
                var format = tile.getFormat();
                var tileCoord = tile.getTileCoord();
                var data = tileIndex.getTile(tileCoord[0], tileCoord[1], -tileCoord[2] - 1);
                var feature = data;
                // var features = format.readFeatures(
                //     JSON.stringify({
                //         type: 'FeatureCollection',
                //         features: data ? data.features : []
                //     }, replacer));
                tile.setLoader(function () {
                    tile.setFeatures(features);
                    // tile.setProjection(tilePixels);
                });
            },
            url: url
        });


        // var tiledVector = new ol.layer.Vector({
        //     source: tiledSource,
        //     style: vectorStyle
        // });

        me.overlayLayers[layer_name] = new ol.layer.VectorTile({
            // source: vectorSource
            title: layer_name,
            info: true,
            source: tiledSource,
            style: function (feature) {
                // highlightStyle.getText().setText(feature.get('name'));
                // return highlightStyle;
                return me.getStyle(feature);
            }
        })
        me.map.addLayer(me.overlayLayers[layer_name]);
        return me.overlayLayers[layer_name];
    }
    me.addFeaturesToPathLayer = function (features) {
        // for (var i = 0; i < features.length; i++) {
        var vectorSource = me.specialLayers["pathFeatureLayer"].getSource();
        // if (clearPrevious) vectorSource.clear();
        vectorSource.addFeatures(features);
        // }
    }
    me.addGeoJSON2PathLayer = function (geojson) {
        if (geojson.features != null) {
            var features = (new ol.format.GeoJSON()).readFeatures(geojson);
            if (features.length > 0) {
                me.addFeaturesToPathLayer(features)
            } else {
                showAlertDialog("No Path found", dialogTypes.info)
            }
        } else {
            showAlertDialog("No Path found", dialogTypes.info)
        }
    }
    me.clearPathLayer = function () {
        var vectorSource = me.specialLayers["pathFeatureLayer"].getSource();
        vectorSource.clear();
    }
    me.addPathFeatureLayer = function () {
        me.specialLayers["pathFeatureLayer"] = new ol.layer.Vector({
            title: "Path Layer",
            info: true,
            // openInLayerSwitcher: false,
            displayInLayerSwitcher: false,
            source: new ol.source.Vector({
                features: []
            }),
            style: function (feature) {
                return me.getPathStyle(feature)
            }
        });
        me.specialLayers["pathFeatureLayer"].setZIndex(995)
    }
    me.addMeasureToolLayer = function () {
        me.specialLayers["measurement"] = new ol.layer.Vector({
            title: "Measurement layer",
            info: false,
            // openInLayerSwitcher: false,
            displayInLayerSwitcher: false,
            source: new ol.source.Vector({
                features: []
            }),
            style: function (feature) {
                return me.getSelectStyle(feature)
            }
        });

    };
    me.addGoToLocationLayer = function () {
        me.specialLayers["goToLocationLayer"] = new ol.layer.Vector({
            title: "Location Layer",
            info: false,
            // openInLayerSwitcher: false,
            displayInLayerSwitcher: false,
            source: new ol.source.Vector({
                features: []
            })
        });
        var source = me.specialLayers["goToLocationLayer"].getSource();
        source.on('addfeature', function (e) {
            me.flash(e.feature);
        });

    }

    me.addCurrentLocationLayer = function () {
        me.specialLayers["currentLocationLayer"] = new ol.layer.Vector({
            title: "Location Layer",
            info: false,
            // openInLayerSwitcher: false,
            displayInLayerSwitcher: false,
            source: new ol.source.Vector({
                features: []
            })
        });
        var source = me.specialLayers["currentLocationLayer"].getSource();
        // source.on('addfeature', function (e) {
        //     me.flash(e.feature);
        // });

    }
    me.addDrawFeatureLayer = function () {
        me.specialLayers["drawFeatureLayer"] = new ol.layer.Vector({
            title: "Draw layer",
            info: false,
            // openInLayerSwitcher: false,
            displayInLayerSwitcher: false,
            source: new ol.source.Vector({
                features: []
            }),
            style: function (feature) {
                return me.getSelectStyle(feature)
            }
        });
        var source = me.specialLayers["drawFeatureLayer"].getSource();
        source.on('addfeature', function (e) {
            me.flash(e.feature);
        });

        me.specialLayers["drawFeatureLayer"].setZIndex(1000)
    }
    me.addSelectedFeatureLayer = function () {
        me.specialLayers["selectedFeatureLayer"] = new ol.layer.Vector({
            name: "selected features",
            info: false,
            // visible:false,
            hideInLegend: true,
            displayInLayerSwitcher: false,
            source: new ol.source.Vector({
                features: []
            }),
            style: function (feature) {
                return me.getSelectStyle(feature)
            }
        });
        var source = me.specialLayers["selectedFeatureLayer"].getSource();
        source.on('addfeature', function (e) {
            me.flash(e.feature);
        });
        me.specialLayers["selectedFeatureLayer"].setZIndex(999)
    };
    me.addBufferPopulationLayer = function () {
        me.specialLayers["bufferPopulationLayer"] = new ol.layer.Vector({
            name: "Buffer Population",
            info: false,
            // visible:false,
            hideInLegend: true,
            displayInLayerSwitcher: false,
            source: new ol.source.Vector({
                features: []
            }),
            style: function (feature) {
                return me.getSelectStyle(feature)
            }
        });
        var source = me.specialLayers["bufferPopulationLayer"].getSource();
        source.on('addfeature', function (e) {
            me.flash(e.feature);
        });
        me.specialLayers["bufferPopulationLayer"].setZIndex(999)
    };
    me.addBufferPoultryFarmLayer = function () {
        me.specialLayers["bufferPoultryFarmLayer"] = new ol.layer.Vector({
            name: "Buffer Poultry Farms",
            info: false,
            // visible:false,
            hideInLegend: true,
            displayInLayerSwitcher: false,
            source: new ol.source.Vector({
                features: []
            }),
            style: function (feature) {
                return me.getSelectStyle(feature)
            }
        });
        var source = me.specialLayers["bufferPoultryFarmLayer"].getSource();
        source.on('addfeature', function (e) {
            me.flash(e.feature);
        });
        me.specialLayers["bufferPoultryFarmLayer"].setZIndex(999)
    };
    me.printMap = function () {
        var map = me.map;
        var dims = {
            a0: [1189, 841],
            a1: [841, 594],
            a2: [594, 420],
            a3: [420, 297],
            a4: [297, 210],
            a5: [210, 148],
        };
        var format = 'a4';
        var resolution = "72 dpi (fast)";
        var dim = dims[format];
        var width = Math.round((dim[0] * resolution) / 25.4);
        var height = Math.round((dim[1] * resolution) / 25.4);
        var size = map.getSize();
        var viewResolution = map.getView().getResolution();
        var mapCanvas = document.createElement('canvas');
        mapCanvas.width = width;
        mapCanvas.height = height;
        var mapContext = mapCanvas.getContext('2d');
        Array.prototype.forEach.call(
            document.querySelectorAll('.ol-viewport'),
            function (canvas) {
                if (canvas.width > 0) {
                    var opacity = canvas.parentNode.style.opacity;
                    mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                    var transform = canvas.style.transform;
                    // Get the transform parameters from the style's transform matrix
                    // var matrix = transform
                    //     .match(/^matrix\(([^\(]*)\)$/)[1]
                    //     .split(',')
                    //     .map(Number);
                    // // Apply the transform to the export map context
                    // CanvasRenderingContext2D.prototype.setTransform.apply(
                    //     mapContext,
                    //     matrix
                    // );
                    mapContext.drawImage(canvas, 0, 0);
                }
            }
        );
        var pdf = new jsPDF('landscape', undefined, format);
        pdf.addImage(
            mapCanvas.toDataURL('image/jpeg'),
            'JPEG',
            0,
            0,
            dim[0],
            dim[1]
        );
        pdf.save('map.pdf');
        // Reset original map size
        map.setSize(size);
        map.getView().setResolution(viewResolution);
    };
    me.clearSelection = function () {
        me.map.removeInteraction(me.draw);
        // ol.Observable.unByKey(me.selectInteraction);
        var vectorSource = me.specialLayers["selectedFeatureLayer"].getSource();
        vectorSource.clear();
        var goToLocationLayerSource = me.specialLayers["goToLocationLayer"].getSource();
        goToLocationLayerSource.clear();
        var measurementSource = me.specialLayers["measurement"].getSource();
        measurementSource.clear();
        var currentLocationLayer = me.specialLayers["currentLocationLayer"].getSource();
        currentLocationLayer.clear();
        me.geolocation.setTracking(false);
        //    var printMapLayer = me.specialLayers["printMapLayer"].getSource();
        //    printMapLayer.clear();
        me.map.getOverlays().clear();
        me.map.removeOverlay(me.measureTooltip);
        me.extGridVM.showAdminLevelNameInStatusBar('', '');
        me.extGridVM.setPropertyCountInStatusBar('');
        // me.clearPathLayer();
        // me.removeAllInteraction();
        // me.addBasicInteraction();
        // me.geocoder.getLayer().getSource().clear();

    };
    me.convertGeom2WKT = function (geometry) {
        var format = new ol.format.WKT();
        var wkt = format.writeGeometry(geometry);
        return wkt;
    }
    me.getSelectedFeatureGeometryCombined = function () {
        // import {Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon} from 'ol/geom.js';
        var vectorSource = me.specialLayers["selectedFeatureLayer"].getSource();
        var features = vectorSource.getFeatures();
        var parser = new jsts.io.OL3Parser();
        parser.inject(ol.geom.Point, ol.geom.LineString, ol.geom.LinearRing, ol.geom.Polygon,
            ol.geom.MultiPoint, ol.geom.MultiLineString, ol.geom.MultiPolygon);
        var geom = null;
        for (var i = 0; i < features.length; i++) {
            var jstsGeom = parser.read(features[i].getGeometry());
            if (i == 0)
                geom = jstsGeom;
            else
                geom = geom.union(jstsGeom);

        }
        finalGeom = parser.write(geom)
        return finalGeom;

    }
    me.showSelectedFeatureGeometry = function (wkt, clearPrevious) {
        // if (!clearPrevious) clearPrevious = true;
        var format = new ol.format.WKT();
        var feature = format.readFeature(wkt, {
            dataProjection: 'EPSG:3857',
            featureProjection: 'EPSG:3857'
        });
        var vectorSource = me.specialLayers["selectedFeatureLayer"].getSource();
        if (clearPrevious) vectorSource.clear();
        vectorSource.addFeature(feature);

    };
    me.showSelectedFeatureGeojson = function (geojson, featureID, layerName) {

        // var format = new ol.format.GeoJSON();
        // var feature = format.readFeature(geojson, {
        //     dataProjection: 'EPSG:3857',
        //     featureProjection: 'EPSG:3857'
        // });
        // me.clearSelection();
        if (geojson.features != null) {
            var features = (new ol.format.GeoJSON()).readFeatures(geojson);
            if (featureID) {
                features = (new ol.format.GeoJSON()).readFeatures(geojson, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
            }
            if (features.length > 0) {
                var vectorSource = me.specialLayers["selectedFeatureLayer"].getSource();
                vectorSource.clear();
                features[0].set('layerName', layerName);
                vectorSource.addFeatures(features);
                me.zoomToSelectedFeatures();
                var data = features[0].getProperties();
                var grid = me.extGridVM.createPropertyGrid(data, '', layerName);
                if (featureID === null) {
                    me.extGridVM.showItemInWindow(grid, "Attribute Detail")
                }

                // var content = me.createPropertyTableConent(features[0].getProperties())
                //
                // me.popup.show(coordinate, content)
                // setPopupContent(features[0].getProperties())
                // me.popup.setPosition(coordinate);
            }
        } else {
            alert("No feature found")
        }
    }
    me.createPropertyTableConent = function (json) {
        var content = "<table class='table table-condensed'>"
        content += "<th>Name</th><th>Value</th>"
        for (var key in json) {
            if (key != "geometry") {
                content += "<tr>";
                content += "<td>" + key + "</td>";
                content += "<td>" + json[key] + "</td>";
                content += "</tr>";
            }
        }
        content += "</table>";
        return content;
    }
    me.getControls = function () {
        var controls = ol.control.defaults().extend([
            // new ol.control.RotateNorthControl(),
            // new ol.control.DragRotateAndZoom(),
            new ol.control.ZoomSlider(),
            new ol.control.Rotate(),
            new ol.control.FullScreen(),
            new ol.control.ZoomToExtent({extent: me.extent}),

            new ol.control.ScaleLine({
                // units: 'metric',
                // target: document.getElementById('scale-line'),
                // className: 'custom-scale-position',
                bar: true,
                steps: 5,
                text: true,
                minWidth: 140

            }),
            new ol.control.MousePosition({
                //    coordinateFormat: ol.coordinate.createStringXY(4),
                coordinateFormat: function (coordinate) {
                    return ol.coordinate.format(coordinate, '{x}, {y}', 5);
                },
                projection: 'EPSG:3857',
                // comment the following two lines to have the mouse position
                // be placed within the map.
                className: 'custom-mouse-position',
                target: document.getElementById('mouse-position12'),
                undefinedHTML: '&nbsp;',
                render: function (event) {
                    if (event.frameState) {
                        var loc = ol.proj.transform(event.frameState.focus, 'EPSG:3857', 'EPSG:4326');
                        position = loc[0].toFixed(4) + ',' + loc[1].toFixed(4);
                        target = document.getElementById('mouse-position12');
                        target.innerHTML = position
                        var fd_lat = Ext.getCmp("fd-lat");
                        var fd_long = Ext.getCmp("fd-long");
                        if (fd_lat) {
                            fd_lat.setValue(loc[1]);
                            fd_long.setValue(loc[0]);
                        }
                    }
                }
            }),
            // new ol.control.ZoomToExtent({
            //     extent: me.map.getView().calculateExtent(me.map.getSize())
            // })
            // new ol.control.FullScreen({source: me.fullScreenTarget}),
            // new ol.control.ZoomToExtent({extent: me.extent})
        ]);
        return controls;
    }
    me.addLayerSwitcher = function (target) {
        var switcher;
        if (!me.layerSwitcherTarget) {
            switcher = new ol.control.LayerSwitcher();
        } else {
            switcher = new ol.control.LayerSwitcher({
                target: $("." + me.layerSwitcherTarget).get(0),
                show_progress: true,
                extent: true,
                trash: true,
                oninfo: function (l) {
                    var info = l.get("info");
                    if (info) {
                        me.viewModel.layerContextMenuModel.openLayerContextMenu(l)
                    } else {
                        showAlertDialog("Info not available. . ", dialogTypes.info)

                    }
                }
            });
        }
        me.map.addControl(switcher)
    };
    me.addTempStyleToWMSLayer = function (layerName, style) {
        var layer = me.overlayLayers[layerName];
        var source = layer.getSource();
        var params = source.getParams();
        // if (params.STYLES ==""){
        var styles = {"style": style};
        params.STYLES = JSON.stringify(styles);
        // }else{
        //
        // }
        params.t = new Date().getMilliseconds();
        source.updateParams(params);
    }

    me.createLabelStyle = function (labelInfo) {
        var font = labelInfo.fontSize + 'px Calibri,sans-serif'; //+label.fontType
        var labelStyle = new ol.style.Style({
            text: new ol.style.Text({
                font: font, //'12px Calibri,sans-serif',
                overflow: true,
                fill: new ol.style.Fill({
                    color: labelInfo.labelColor
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 2
                })
            })
        });
        return labelStyle;
    }
    me.changeLabelStyle = function (labelInfo, layerName) {
        var labelLayer = me.labelLayers[layerName]['layer'];
        var labelStyle = me.createLabelStyle(labelInfo);
        // me.labelLayers[layerName]['labelStyle'] = labelStyle
        // function (feature) {
        //         me.labelLayers[layerName]['labelStyle'].getText().setText(feature.get('label'));
        //         return labelStyle;
        //     },

        var styleFunction = function (feature) { //, resolution
            labelStyle.getText().setText(feature.get('label'));
            return labelStyle;
        }
        labelLayer.setStyle(styleFunction);
        // var source = labelLayer.getSource().clear();
        // var url = '/web_services/wfs/get_label/geojson/?layer_name=' + layerName + "&label_field=" + labelInfo.colName;
        // $.getJSON(url, function (data) {
        //     me.labelLayers[layerName]['layer'].get('source').addFeatures((new ol.format.GeoJSON()).readFeatures(data));
        // });
    }
    me.addLabelLayer = function (labelInfo, layerName) {
        var title = layerName + "_label";
        var labelStyle = me.createLabelStyle(labelInfo)
        var labelLayer = new ol.layer.Vector({
            title: title,
            info: false,
            // openInLayerSwitcher: false,
            displayInLayerSwitcher: false,
            source: new ol.source.Vector({
                // url: url,
                format: new ol.format.GeoJSON()
            }),
            // labelStyle: labelStyle,
            style: function (feature) {
                me.labelLayers[layerName]['labelStyle'].getText().setText(feature.get('label'));
                return labelStyle;
            },
            declutter: true
        });
        me.map.addLayer(labelLayer);
        me.labelLayers[layerName] = {layer: labelLayer, labelStyle: labelStyle};
        var url = '/web_services/wfs/get_label/geojson/?layer_name=' + layerName + "&label_field=" + labelInfo.colName;
        $.getJSON(url, function (data) {
            me.labelLayers[layerName]['layer'].get('source').addFeatures((new ol.format.GeoJSON()).readFeatures(data));
        });

    }
    me.getLabelLayer = function (layerName) {
        return me.labelLayers[layerName];
    }
    me.addLabel2WMSLayer = function (layerName, colName, fontSize, fontType, labelColor) {
        var layer = me.overlayLayers[layerName];
        var source = layer.getSource();
        var params = source.getParams();
        var label = {"colName": colName, "fontSize": fontSize, "fontType": fontType, "labelColor": labelColor};
        var styles = {"label": label};
        params.STYLES = JSON.stringify(styles);
        params.t = new Date().getMilliseconds();
        source.updateParams(params);
    }

    me.removeLabelFromWMSLayer = function (layerName) {
        var layer = me.overlayLayers[layerName];
        var source = layer.getSource();
        var params = source.getParams();

        params.STYLES = "";
        params.t = new Date().getMilliseconds();
        source.updateParams(params);
    }
    me.showLegendgraphics = function (layerName) {
        var modalbody = $('<div ></div>');
        var legends = me.getLegendGraphics(layerName)
        var table = $('<table class="table table-condensed"></table>');
        var thead = $('<thead><tr><th>Value</th><th>Symbol</th></tr></thead>');
        table.append(thead);
        var tbody = $('<tbody></tbody>');
        for (var i = 0; i < legends.length; i++) {
            var graphic = legends[i];
            var row = $('<tr><td>' + graphic.literal + '</td><td>' + graphic.style + '</td></tr>');
            tbody.append(row);
        }
        table.append(tbody)
        modalbody.append(table)
        BootstrapDialog.show({
            title: "Legend",
            type: BootstrapDialog.TYPE_SUCCESS,
            size: BootstrapDialog.SIZE_SMALL,
            message: modalbody,
            draggable: true,
            buttons: [{
                label: 'Close',
                action: function (dialogItself) {
                    dialogItself.close()
                }
            }]
        })
    };
    me.getLegendGraphics = function (layerName) {
        var style = me.getLayerStyle(layerName);
        var rules = style.rules;
        var legend = [];
        if (rules) {
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                var graphic = {}
                for (var key in rule) {
                    if (key == "filter") {
                        if (rule[key].literal) {
                            graphic.literal = rule[key].literal;
                        } else {
                            graphic.literal = 'default';
                        }
                    }
                    if (key == "point_symbolizer") {
                        var symbolizer = rule[key]
                        var style = {}
                        style.fillColor = symbolizer.fill;
                        style.pointSize = symbolizer.size;
                        style.stroke = symbolizer.stroke;
                        style.strokeWidth = symbolizer["stroke-width"];
                        // var svg = $('<svg width="150" height="40"></svg>');
                        var shape = '<svg width="150" height="40"><circle cx="75" cy="10" r="' + style.pointSize + '" stroke="' + style.stroke +
                            '" stroke-width="' + style.strokeWidth + '" fill="' + style.fillColor + '" /> </svg>'
                        // svg.html(shape);
                        graphic.style = shape;
                        legend.push(graphic)
                    } else if (key == "polygon_symbolizer") {
                        var symbolizer = rule[key]
                        var style = {}
                        style.strokeWidth = symbolizer["stroke-width"];
                        style.stroke = symbolizer["stroke"];
                        style.fillColor = symbolizer["fill"];
                        style.fillOpacity = symbolizer["fill_opacity"];
                        var shape = '<svg width="150" height="40"><rect width="150" height="40"style="stroke-width:' + style.strokeWidth + ';stroke:' +
                            style.stroke + ';fill:' + style.fillColor + ';fill-opacity:' + style.fillOpacity + '" /></svg>'
                        graphic.style = shape;
                        legend.push(graphic)
                    } else if (key == "line_symbolizer") {
                        var symbolizer = rule[key]
                        var style = {}
                        style.strokeWidth = symbolizer["stroke-width"];
                        style.stroke = symbolizer["stroke"];
                        var shape = '<svg width="150" height="40"><line x1="0" y1="20" x2="150" y2="20" style="stroke-width:' +
                            style.strokeWidth + ';stroke:' + style.stroke + '" /></svg>';
                        graphic.style = shape;
                        legend.push(graphic)
                    } else if (key == 'raster_symbolizer') {
                        var symbolizer = rule[key]
                        var colorMaps = symbolizer["color_map"]
                        for (var i = 0; i < colorMaps.length; i++) {
                            graphic = {}
                            var style = {}
                            var colorMap = colorMaps[i]
                            style.fillColor = colorMap["color"];
                            style.fillOpacity = colorMap["opacity"];
                            var shape = '<svg width="150" height="40"><rect width="150" height="40"style=' +
                                '"fill:' + style.fillColor + ';fill-opacity:' + style.fillOpacity + '" /></svg>'
                            graphic.style = shape;
                            graphic.literal = colorMap["label"];
                            legend.push(graphic)
                        }

                    }
                }

            }
        }
        return legend;
    }
    me.getLayerStyle = function (layerName) {
        var layer = me.overlayLayers[layerName];
        var source = layer.getSource();
        var params = source.getParams();
        layerStyle = params.STYLES;
        if (!layerStyle) {
            var url = "/web_services/get_layer_style?layer_name=" + layerName;
            var layerStyle = callSJAX({url: url});
            layerStyle = JSON.parse(layerStyle);
        }
        if (typeof layerStyle == 'string') {
            layerStyle = JSON.parse(layerStyle);
        }
        return layerStyle
    }
    me.refreshLayer = function (layerName) {
        var layer = me.overlayLayers[layerName];
        var source = layer.getSource();
        var params = source.getParams();
        params.t = new Date().getMilliseconds();
        source.updateParams(params);
    };
    me.refreshMap = function () {
        me.map.render();
        me.map.renderSync();
    };
    me.createStyle = function () {
        var image = new ol.style.Circle({
            radius: 5,
            fill: null,
            stroke: new ol.style.Stroke({color: 'red', width: 1})
        });
        me.styles = {
            'Point': new ol.style.Style({
                image: image
            }),
            'LineString': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'green',
                    width: 1
                })
            }),
            'MultiLineString': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'green',
                    width: 1
                })
            }),
            'MultiPoint': new ol.style.Style({
                image: image
            }),
            'MultiPolygon': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'yellow',
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 0, 0.1)'
                })
            }),
            'Polygon': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'blue',
                    lineDash: [4],
                    width: 3
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 255, 0.1)'
                })
            }),
            'GeometryCollection': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'magenta',
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: 'magenta'
                }),
                image: new ol.style.Circle({
                    radius: 10,
                    fill: null,
                    stroke: new ol.style.Stroke({
                        color: 'magenta'
                    })
                })
            }),
            'Circle': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'red',
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255,0,0,0.2)'
                })
            }),
            'Select': new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(209, 113, 20, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'd17114',
                    width: 3
                })
            })
        };
    }

    me.getPathStyle = function (feature) {
        var stroke = new ol.style.Stroke({color: 'black', width: 2});
        var fill = new ol.style.Fill({color: 'red'});
        var styles = {
            'triangle': new ol.style.Style({
                image: new ol.style.RegularShape({
                    fill: fill,
                    stroke: stroke,
                    points: 3,
                    radius: 10,
                    rotation: Math.PI / 4,
                    angle: 0
                })
            }),
            'star': new ol.style.Style({
                image: new ol.style.RegularShape({
                    fill: fill,
                    stroke: stroke,
                    points: 6,
                    radius: 10,
                    radius2: 5,
                    angle: 0
                })
            }),
            'cross': new ol.style.Style({
                image: new ol.style.RegularShape({
                    fill: fill,
                    stroke: stroke,
                    points: 4,
                    radius: 10,
                    radius2: 0,
                    angle: 0
                })
            }),

            'path': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: fill, //'#d17114',
                    width: 5
                })
            })
        };
        var g_type = feature.getGeometry().getType();
        if (!g_type) g_type = feature.f;
        var key = "path";
        if (g_type.indexOf('Point') != -1) {
            key = "star"
        } else if (g_type.indexOf('LineString') != -1) {
            key = "path"
        }
        return styles[key];
    }
    me.getStyle = function (feature) {
        g_type = feature.getGeometry().getType();
        if (!g_type) g_type = feature.f;
        return me.styles[g_type];
    };
    me.getSelectStyle = function (feature) {
        g_type = feature.getGeometry().getType();
        if (!g_type) g_type = feature.f;
        if (g_type.indexOf('Point') != -1) {
            var selStyle = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({color: 'rgba(0, 0, 0, 0.33)'}),
                    stroke: new ol.style.Stroke({
                        color: [0, 0, 0], width: 1.5
                    })
                })
                // image: new ol.style.Icon({
                //     anchor: [0.5, 0.5],
                //     opacity: 1,
                //     src: '/static/assets/img/icons/flashing_circle.gif'
                // })
            });
        } else if (g_type.indexOf('LineString') != -1) {
            var selStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#d17114',
                    width: 5
                }),
                text: new ol.style.Text({
                    text: feature.get('measurement'),
                    stroke: new ol.style.Stroke({color: "#fff", width: 2}),
                    fill: new ol.style.Fill({color: 'black'}),
                    font: 'bold' + ' ' + '15' + 'px ' + 'Arial, Helvetica, Helvetica, sans-serif',
                })
            });
        } else {
            var selStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(209, 113, 20, 0)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#d17114',
                    width: 3
                }),
                text: new ol.style.Text({
                    text: feature.get('measurement'),
                    stroke: new ol.style.Stroke({color: "#fff", width: 2}),
                    fill: new ol.style.Fill({color: 'black'}),
                    overflow: true,
                    font: 'bold' + ' ' + '15' + 'px ' + 'Arial, Helvetica, Helvetica, sans-serif',
                })
            });
        }
        return selStyle;
    }
    me.changeStyle = function () {
        var newStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({color: 'red'}),
                stroke: new ol.style.Stroke({color: 'yellow', width: 1})
            })
        });
        selectedFeature.setStyle(newStyle)
    }

    me.capturePicture = function () {
        var c = $("canvas.ol-unselectable").get(0);
        // <canvas class="ol-unselectable" style="width: 100%; height: 100%; display: block;" width="1640" height="23"></canvas>
// ?        var t = c.getContext('2d');
        // window.location.href = image;
        var aspectRatio = c.width / c.height;
        var newHeight = 120;
        var newWidth = 200; //parseInt(newHeight * aspectRatio)
        var newAspectRatio = newWidth / newHeight;
        if (aspectRatio >= 1) {
            clipWidth = newAspectRatio * c.height;
            clipHeight = c.height;
            diff = (c.width - clipWidth) / 2;
            clipX = diff
            clipY = 0
        }

        var resizeCanvas = document.createElement("canvas");
        resizeCanvas.height = clipHeight;
        resizeCanvas.width = clipWidth;

        var resizeCtx = resizeCanvas.getContext('2d');
// Put original canvas contents to the resizing canvas
        resizeCtx.drawImage(c, clipX, clipY, clipWidth, clipHeight, 0, 0, clipWidth, clipHeight);

// Resize using Hermite resampling
        var HERMITE = new Hermite_class();
//default resize
        HERMITE.resample_single(resizeCanvas, newWidth, newHeight, true);
        var image = resizeCanvas.toDataURL();
        return image
    }

//manupulating interactions.
    me.removeAllInteraction = function () {
        var interactionColl = me.map.getInteractions();
        interactionColl.forEach(function (interaction) {
            if (interaction)
                me.map.removeInteraction(interaction)
        })
    }
    me.addBasicInteraction = function () {
        me.removeAllInteraction();
        me.defaultInteractionsColl.forEach(function (interaction) {
            me.map.addInteraction(interaction)
        })
    }
    me.removeInteraction = function (interaction) {
        me.map.removeInteraction(interaction)
    }

// navigation Operations
    me.addToPerviousExtentList = function (extent) {
        if (extent) {
            me.previousExtentList.push(extent);
        } else {
            me.previousExtentList.push(me.view.calculateExtent(me.map.getSize()));
        }
    }
    me.addToNextExtentList = function (extent) {
        if (extent) {
            me.nextExtentList.push(extent)
        } else {
            me.previousExtentList.push(me.view.calculateExtent(me.map.getSize()));
        }
    }
    me.getPreviousExtent = function () {
        return me.previousExtentList.pop();
    }
    me.getCurrentExtent = function () {
        return me.getView().calculateExtent();

    }
    me.getNextExtent = function () {
        return me.nextExtentList.pop();
    }
    me.getSizeOfPreviousExtent = function () {
        return me.previousExtentList.length;
    }
    me.getSizeOfNextExtent = function () {
        return me.nextExtentList.length;
    }
    me.setFullExtent = function () {
        // me.addToPerviousExtentList();
        // var ext = [7716814.100800, 4031550.978200, 8392792.597300, 3214945.703200];
        // me.map.getView().calculateExtent(me.map.getSize());
        me.getView().fit(me.extent, me.getMap().getSize());
        // me.view.fit(ext, {});
    }
    me.zoomToSelectedFeatures = function () {
        var extent = me.specialLayers["selectedFeatureLayer"].getSource().getExtent();
        me.getView().fit(extent, me.getMap().getSize());
    }
    me.setViewExtent = function (extent) {
        me.getView().fit(extent, me.getMap().getSize());
        // me.getView().fit(extent, me.getMap().getSize())
    }
    me.zoomToRectangle = function () {
        me.removeAllInteraction();
        var dragBox = new ol.interaction.DragBox();
        me.map.addInteraction(dragBox);

        dragBox.on('boxend', function () {
            // features that intersect the box are added to the collection of
            // selected features
            // me.addToPerviousExtentList();
            var extent = dragBox.getGeometry().getExtent();
            me.view.fit(extent, {})
        });
        return dragBox;
    }
    me.getGeometryWKT = function (geom) {
        var format = new ol.format.WKT();
        var wkt = format.writeGeometry(geom);
        return wkt;
    };
    me.convertVectorLayerToGeoJSON = function (layer) {
        var vectorSource = layer.getSource();
        var writer = new ol.format.GeoJSON();
        var geojsonStr = writer.writeFeatures(vectorSource.getFeatures());
        return geojsonStr;
    }
    ////////// callback with return as geometry
    //value could be Point, LineString,Polygon,Circle
    /// to get WKT use me.getGeometryWKT(feature.getGeometry());
    me.drawShape = function (value, callback) {
        me.removeAllInteraction();
        var source = me.specialLayers["drawFeatureLayer"].getSource();
        var drawShape = new ol.interaction.Draw({
            source: source,
            type: value
        });
        me.map.addInteraction(drawShape, callback);
        drawShape.on('drawstart', function (e) {
            // console.log("draw start...")
            source.clear();
        });
        drawShape.on('drawend', function (e) {
            // console.log("draw end...")
            // var features = source.getFeatures();
            // var geometry = e.feature.getGeometry();
            callback(e.feature);
            // me.removeAllInteraction();
            // me.addBasicInteraction();

        })
        return drawShape
    }
    me.zoomIn = function () {
        me.addToPerviousExtentList();
        me.view.setZoom(me.view.getZoom() + 1)
    }

    me.zoomOut = function () {
        me.addToPerviousExtentList();
        me.view.setZoom(me.view.getZoom() - 1)
    }
    me.selectFeature = function () {
        me.removeAllInteraction();
        me.selectInteraction = new ol.interaction.Select();
        me.map.addInteraction(me.selectInteraction);
        me.selectInteraction.on('select', function (e) {
            me.selectedFeature = e.target.getFeatures();
            // alert(e.target.getFeatures().getLength() + ' selected features (last operation selected ' +
            //     e.selected.length + ' and deselected ' + e.deselected.length + ' features)');
        });
        return me.selectInteraction;
    }
    me.pan = function () {
        me.removeAllInteraction();
        var dragPan = new ol.interaction.DragPan();
        me.map.addInteraction(dragPan);

        dragPan.on('change:active', function () {
            me.addToPerviousExtentList();
        })
        return dragPan;
    }
    me.identifier = function () {
        var identifyClick = me.map.on('click', function (evt) {
            var layerClicked = me.map.forEachLayerAtPixel(evt.pixel,
                function (layer) {
                    return layer
                });
            if (layerClicked) {
                var layerName = layerClicked.get('name');
                var source = layerClicked.getSource();
                if (source instanceof ol.source.TileWMS) {
                    me.getFeatureInfoFromGeoServer(evt, layerClicked, null);
                } else if (source instanceof ol.source.Vector) {
                    var feature = me.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                        //you can add a condition on layer to restrict the listener
                        return feature;
                    });
                    if (feature) {
                        var vectorSource = me.specialLayers["selectedFeatureLayer"].getSource();
                        vectorSource.clear();
                        vectorSource.addFeatures([feature]);
                        // me.zoomToSelectedFeatures();
                        var data = feature.getProperties();
                        if (layerName === 'selected features') {
                            layerName = feature.get('layerName');
                        }
                        var grid = me.extGridVM.createPropertyGrid(data, '', layerName);
                        me.extGridVM.showItemInWindow(grid, "Attribute Detail")
                        //here you can add you code to display the coordinates or whatever you want to do
                    }
                }

            }

        });
        return identifyClick;
    }
    me.getFeatureInfoFromGeoServer = function (evt, layer, featureID) {
        var url = null;
        if (featureID) {
            var typeName = layer.get('nameSpace') + ':' + layer.get('layerName');
            url = me.geoServerURL + "wfs?request=GetFeature&version=1.1.0&typeName=" + typeName + "&outputFormat=json&FEATUREID=" + featureID;
        } else {
            var coordinate = evt.coordinate;
            var viewResolution = me.getView().getResolution();
            url = layer.getSource().getGetFeatureInfoUrl(
                coordinate, viewResolution, 'EPSG:3857',
                {'INFO_FORMAT': 'application/json',});
        }

        if (url) {
            fetch(url)
                .then(function (response) {
                    return response.text();
                })
                .then(function (html) {
                    var data = JSON.parse(html);
                    me.showSelectedFeatureGeojson(data, featureID, layer.get('layerName'))
                });
        }

    }
    me.measuringTool = null;
    me.measurement = function (typeSelect) {

        // me.map.removeInteraction(me.measuringTool);
        // var geometryType = (typeSelect === 'area' ? 'Polygon' : 'LineString');
        // me.measuringTool = new ol.interaction.Draw({
        //     type: geometryType,
        //     source: me.specialLayers["measurement"].getSource()
        // });
        // me.measuringTool.on('drawstart', function (event) {
        //     me.specialLayers["measurement"].getSource().clear();
        //     event.feature.on('change', function (event) {
        //         var measurement = geometryType === 'Polygon' ? event.target.getGeometry().getArea() : event.target.getGeometry().getLength();
        //         var measurementFormatted = measurement > 100 ? (measurement / 1000).toFixed(2) + 'km' : measurement.toFixed(2) + 'm';
        //         console.log(measurementFormatted)
        //         // resultElement.html(measurementFormatted + html);
        //     });
        // });
        // me.map.addInteraction(me.measuringTool);
        // me.clearSelection();
        me.map.removeInteraction(me.draw);
        var source = me.specialLayers["measurement"].getSource();
        var type = (typeSelect === 'area' ? 'Polygon' : 'LineString');
        me.draw = new ol.interaction.Draw({
            source: source,
            type: type,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.7)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            })
        });

        me.map.addInteraction(me.draw);
        me.createMeasureTooltip();
        // me.createHelpTooltip();
        me.listener = null;
        var output = '';
        me.draw.on('drawstart',
            function (evt) {
                // set me.sketch
                me.sketch = evt.feature;

                /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
                var tooltipCoord = evt.coordinate;

                me.listener = me.sketch.getGeometry().on('change', function (evt) {
                    var geom = evt.target;
                    output = '';
                    if (geom instanceof ol.geom.Polygon) {
                        output = me.formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                        output = me.formatLength(geom);
                        tooltipCoord = ol.extent.getCenter(geom.getExtent());
                    }
                    me.measureTooltipElement.innerHTML = output;
                    me.measureTooltip.setPosition(tooltipCoord);
                });
            });

        me.draw.on('drawend',
            function (evt) {
                evt.feature.set('measurement', output);
                me.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static ol-measure-tooltip-hide';
                me.measureTooltip.setOffset([0, -7]);
                // unset me.sketch
                me.sketch = null;
                // unset tooltip so that a new one can be created
                me.measureTooltipElement = null;
                me.createMeasureTooltip();
                ol.Observable.unByKey(me.listener);
            });

    }
    me.zoomToGeoserverWMSLayerExtent = function (layer_name) {
        var parser = new ol.format.WMSCapabilities();
        // var url ='http://localhost:8080/geoserver/wasa_assert/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities'
        var url = me.geoServerURL + 'cite/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities';
        fetch(url).then(function (response) {
            return response.text();
        }).then(function (text) {
            var result = parser.read(text);
            var layer = result.Capability.Layer.Layer.find(l => l.Name === layer_name);
            // var lye = layer.EX_GeographicBoundingBox;
            var extent = layer.BoundingBox[0].extent;
            //    var extent_3857 = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:3857');
            me.getView().fit(extent, me.getMap().getSize())
        });

    };
    me.zoom2PreviousExtent = function () {
        extent = me.getPreviousExtent();
        if (extent) {
            me.addToNextExtentList(extent);
            me.view.fit(extent, {});
        }
    }

    me.zoom2NextExtent = function () {
        extent = me.getNextExtent();
        if (extent) {
            me.addToPerviousExtentList(extent);
            me.view.fit(extent, {})
        }
    }
    me.sketch = null;
    me.measureTooltipElement = null;
    me.measureTooltip = null;
    me.createMeasureTooltip = function () {
        if (me.measureTooltipElement) {
            me.measureTooltipElement.parentNode.removeChild(me.measureTooltipElement);
        }
        me.measureTooltipElement = document.createElement('div');
        me.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        me.measureTooltip = new ol.Overlay({
            element: me.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        me.map.addOverlay(me.measureTooltip);
    }
    me.formatLength = function (line) {
        var length = line.getLength();
        // var length = ol.sphere.getLength(line);
        var output;
        if (length > 1000) {
            output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
        }
        return output;
    };
    me.formatArea = function (polygon) {
        var area = polygon.getArea();
        var output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km' + '\u00B2';
        } else {
            output = (Math.round(area * 100) / 100) +
                ' ' + 'm' + '\u00B2';
        }
        return output;
    };

    me.mointoredViewChange = function () {
        me.view.on('')
    }
    me.wait4LayerLoad = function (layer) {
        var source = layer.getSource();
        me.noOfTiles = 0;
        source.on('tileloadstart', function (event) {
            me.noOfTiles++;
            $("#waiting-div").css('visibility', 'visible');
        });

        source.on('tileloadend', function (event) {
            me.noOfTiles--;
            if (me.noOfTiles == 0)
                $("#waiting-div").css('visibility', 'hidden');
        });

        source.on('tileloaderror', function (event) {
            me.noOfTiles--
            if (me.noOfTiles == 0)
                $("#waiting-div").css('visibility', 'hidden');
            // showAlertDialog("Error in loading tile", dialogTypes.error)
        });
    }
    me.flash = function (feature) {
        var duration = 3000;
        var map = me.getMap();
        var view = me.getView();
        var start = new Date().getTime();
        var listenerKey;

        var extent = feature.getGeometry().getExtent();
        var viewExtent = view.calculateExtent(map.getSize());
        if (!ol.extent.containsExtent(viewExtent, extent)) {
            var center = ol.extent.getCenter(extent);
            view.setCenter(center);
        }

        function getAnimateStyle(feature, radius, opacity) {
            var style = null;
            g_type = feature.getGeometry().getType();
            if (!g_type) g_type = feature.f;
            if (g_type.indexOf('Point') != -1) {
                style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: radius,
                        snapToPixel: false,
                        stroke: new ol.style.Stroke({
                            color: 'rgba(255, 0, 0, ' + opacity + ')',
                            width: 0.25 + opacity
                        })
                    })
                });
            }
            // else if (g_type.indexOf('LineString') != -1) {
            //     var selStyle = new ol.style.Style({
            //         stroke: new ol.style.Stroke({
            //             color: 'rgba(255, 0, 0, ' + opacity + ')',
            //             width: 5
            //         })
            //     });
            // } else {
            //     var selStyle = new ol.style.Style({
            //         fill: new ol.style.Fill({
            //             color: 'rgba(0, 0, 0, 0)'
            //         }),
            //         stroke: new ol.style.Stroke({
            //             color: 'rgba(255, 0, 0, ' + opacity + ')',
            //             width: 3
            //         })
            //     });
            // }
            return style;
        }

        function animate(event) {
            var vectorContext = event.vectorContext;
            var frameState = event.frameState;
            var flashGeom = feature.getGeometry().clone();
            var elapsed = frameState.time - start;
            var elapsedRatio = elapsed / duration;
            // radius will be 5 at start and 30 at end.
            var radius = ol.easing.easeOut(elapsedRatio) * 25 + 5;
            var opacity = ol.easing.easeOut(1 - elapsedRatio);

            var style = getAnimateStyle(feature, radius, opacity);
            if (style != null) {
                vectorContext.setStyle(style);
                vectorContext.drawGeometry(flashGeom);
                if (elapsed > duration) {
                    ol.Observable.unByKey(listenerKey);
                    return;
                }
                // tell OpenLayers to continue postcompose animation
                map.render();
            }
        }

        listenerKey = map.on('postcompose', animate);
    }
    me.getLayersTreeMenu = function (grid, record, item, index, event) {
        var treeMenu = Ext.create('Ext.menu.Menu', {
            width: 100,
            plain: true,
            // margin: '0 0 10 0',
            items: [{
                text: 'Zoom To Layer',
                handler: function () {
                    var layer = record.getOlLayer();
                    var source = layer.getSource();
                    if (source instanceof ol.source.TileWMS) {
                        me.zoomToGeoserverWMSLayerExtent(layer.get('layerName'));
                    }

                }
            }, {
                text: 'Open Attribute Table',
                handler: function () {
                    me.attributesLayer = record.getOlLayer();
                    var source = me.attributesLayer.getSource();
                    if (source instanceof ol.source.TileWMS && me.attributesLayer.get('layerName') !== 'tbl_lgs_survey_landmarks') {
                        me.extGridVM.getAttributeTableFromDB(me.attributesLayer.get('layerName'), null, null);
                    } else if (me.attributesLayer.get('layerName') === 'tbl_lgs_survey_landmarks') {
                        var landmark_layer = me.getVectorLayerByName('tbl_lgs_survey_landmarks');
                        me.extGridVM.showAttributeTable(landmark_layer);
                        landmark_layer.setVisible(true);
                        // var start_date = Ext.getCmp('start_date').getValue();
                        // start_date = me.extGridVM.convertDateFormat(start_date);
                        // var end_date = Ext.getCmp('end_date').getValue();
                        // end_date = me.extGridVM.convertDateFormat(end_date);
                        // me.extGridVM.getSurveyDetailFromDB("tbl_lgs_survey_landmarks", -1, start_date, end_date, 'landmark');
                        // me.extGridVM.showAttributeTable(layer1);
                    } else if (me.attributesLayer.get('layerName') === 'tbl_lgs_survey') {
                        var survey_layer = me.getVectorLayerByName('tbl_lgs_survey');
                        me.extGridVM.showAttributeTable(survey_layer);
                        survey_layer.setVisible(true);
                    }
                }
            }]
        });
        return treeMenu;
    };
    me.noOfLayers = function () {
        var layerCount = _.keys(me.overlayLayers).length;
        return layerCount;
    }
    me.createLayerNameSelect = function (selectId, isAddSpecialLayers) {
        var layerCount = me.noOfLayers();
        if (layerCount > 1 || isAddSpecialLayers) {
            var select = $('<select id="' + selectId + '" class="form-control layerNameCls" ></select>');
            select.append('<option value="-1">Select Layer</option>');
            for (var key in me.overlayLayers) {
                select.append("<option value='" + key + "'>" + me.overlayLayers[key].get("title") + "</option>")
            }
            // select.selectpicker('refresh');
            if (isAddSpecialLayers) {
                for (var key in me.specialLayers) {
                    select.append("<option value='" + key + "'>" + me.specialLayers[key].get("title") + "</option>");
                }
            }
            return select;
        } else {
            var input = "<input type='text' id='" + selectId + "' class='form-control' value='No Layer Available' disabled>";
            for (var key in me.overlayLayers) {
                input = "<input type='text' id='" + selectId + "' class='form-control' value='" + key + "' disabled>";
            }
            return input;
        }
    }
    me.setMapViewRotation = function (val) {
        me.view.setRotation(val)
    }

    me.getStatsModel = function () {
        if (me.statsModel == null) {
            var statsModel = new StatsModel();
            statsModel.initializeStatsModel(me);
        }
        return statsModel;
    }
}

var setPopupContent = function (json) {
    for (var key in json) {
        var name = '<tr>' + key + '</tr>';
        var value = '<tr>' + json[key] + '</tr>';
        $('#prop-table > tbody:last-child').append(name + value);
    }
}


