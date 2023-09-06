let OL6MapModel = function (mapTarget) {
    let me = this;
    me.mapTarget = mapTarget;
    me.extent_4326 = [69.330466, 27.703041, 75.365624, 34.023247];
    me.extent_3857 = [7716814.100825837, 3214945.70321603, 8392792.597287048, 4031550.978240683]
    me.view = null;
    me.map = null;
    me.minZoom = 5;
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
    me.geoServerURL = "http://idm.pgdp.pk:8080/geoserver/";
    me.geoServerLayers = [
        {
            'title': 'District',
            'namespace': 'cite',
            'name': 'tbl_districts',
            'displayInSwitcher': true,
            'isVisible': true,
            'group': 'General Layers'
        },
    ];
    me.attrFormEl = $('#pnlAttribute');
    me.windowEl = $('#jqxwindow')
    me.attrForm = null;
    me.window = null;
    me.olPopup = null;
    me.initialize = function (data) {
        // me.createStyle();
        me.addBaseLayer();
        me.addSelectedFeatureLayer();
        me.view = new ol.View({
            // center: ol.extent.getCenter(me.extent_4326),
            // extent: me.extent_4326,
            center: [72.348045, 30.863144],
            zoom: 6.5,
            minZoom: 2,
            maxZoom: 20,
            //  rotation: -Math.PI / 8,
            // zoom: 2,
            // minZoom: 2,
            // maxZoom: 20,
            projection: 'EPSG:4326',

        });
        me.map = new ol.Map({
            target: me.mapTarget,
            layers: [
                me.baseLayers,
                me.specialLayers["selectedFeatureLayer"],
            ],
            view: me.view,
            controls: ol.control.defaults.defaults({
                zoom: true,
                attribution: false,
                rotate: false
            }).extend([
                // new ol.control.ZoomSlider(),
                new ol.control.FullScreen(),
                new ol.control.ZoomToExtent({extent: me.extent_4326}),
            ]),
        });
        me.defaultInteractionsColl = me.map.getInteractions();
        me.viewport = me.map.getViewport();
        me.addGeoServerLayers()
        me.addOrganizationLayer(data);
        me.addOverlayPopup();
        me.addIdentifyInfo();
    }
    me.addOrganizationLayer = function (data) {
        let features = [];
        data.forEach(function (item) {
            if (item.latitude) {
                let coords = [item.longitude, item.latitude];
                let transformedCoords = ol.proj.transform(coords, 'EPSG:4326', 'EPSG:4326');
                let markerGeometry = new ol.geom.Point(transformedCoords);
                let feature = new ol.Feature({
                    geometry: markerGeometry,
                    attributes: {
                        label: item.label,
                        name: item.name,
                        parent_name: item.parent_name,
                        url: item.url,
                        address: item.address
                    }
                });
                features.push(feature);
            }
        });
        let vectorSource = new ol.source.Vector({
            features: features
        });
        let org_layer = new ol.layer.Vector({
            visible: true,
            title: "Organization Layer",
            source: vectorSource,
            style: new ol.style.Style({
                // image: new ol.style.Circle({
                //     radius: 4,
                //     fill: new ol.style.Fill({color: 'red'}),
                //     stroke: new ol.style.Stroke({
                //         color: [0, 0, 0],
                //         width: 1.5
                //     })
                // })
                image: new ol.style.Icon({
                    // anchor: [0.5, 0.5],
                    // opacity: 1,
                    src: '/static/assets/img/red-circle.png'
                })
            })
        });
        me.getMap().addLayer(org_layer)

    }
    me.addIdentifyInfo = function () {
        let map = me.getMap();
        map.on('click', function (event) {
            let coordinate = event.coordinate;
            let clickedLayer = null;
            let clickedFeature = map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
                clickedLayer = layer
                return feature;
            });
            if (clickedFeature) {
                let attributes = clickedFeature.get('attributes');
                // me.showAttributeDetailInJqxForm(attributes, clickedLayer, event);
                // alert(attributes.label)
                let content = '<div>Name: ' + attributes.label + '</div>' +
                    '<div>Category: ' + attributes.name + '</div>';
                let nameInput = document.getElementById('name');
                let urlHref = document.getElementById('url');
                nameInput.textContent = attributes.label;
                urlHref.href = attributes.url;
                me.olPopup.setOffset([0, -25]);
                me.olPopup.setPosition(coordinate);
                // me.olPopup.getElement().innerHTML = content;
                me.olPopup.getElement().style.display = 'block';
                let vectorSource = me.specialLayers["selectedFeatureLayer"].getSource();
                vectorSource.clear();
                vectorSource.addFeature(clickedFeature);
                // me.zoomToSelectedFeatures();
            } else {
                me.olPopup.getElement().style.display = 'none';
            }
        });
    }
    me.addOverlayPopup = function () {
        me.olPopup = new ol.Overlay({
            element: document.getElementById('popup'),
            positioning: 'bottom-center',
            stopEvent: false
        });
        me.getMap().addOverlay(me.olPopup);
    }
    me.addGeoServerLayers = function () {
        for (let i = 0; i < me.geoServerLayers.length; i++) {
            let layer = me.geoServerLayers[i];
            me.addGeoServerWMSImageLayer(layer.group, layer.title, layer.namespace, layer.name, layer.displayInSwitcher, layer.isVisible);
        }
    };


    me.getMap = function () {
        return me.map;
    }

    me.getView = function () {
        return me.view;
    }


    me.addBaseLayer = function () {
        if (!me.baseLayers) {
            me.baseLayers = new ol.layer.Group({
                name: 'Base Layers',
                title: 'Base Layers',
                info: false,
                openInLayerSwitcher: true,
                layers: [
                    new ol.layer.Tile({
                        name: 'Road Map',
                        title: 'Road Map',
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
                        title: "Satellite",
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
                        title: "OSM",
                        type: "base",
                        visible: false,
                        source: new ol.source.OSM()
                    }),

                ]
            });
        }

    };
    me.addGeoServerWMSImageLayer = function (group_name, title, name_space, layerName, displayInLyrSwicher, isVisible) {
        let gs_layer = name_space + ':' + layerName;
        let params = {
            'TILED': true,
            srs: 'EPSG:3857',
            'FORMAT': 'image/png',
            // 'VERSION': '1.1.1',
            "LAYERS": gs_layer,
            // CQL_FILTER: cql_filter
            // "exceptions": 'application/vnd.ogc.se_inimage',
        }

        me.overlayLayers[title] = new ol.layer.Tile({
            name: title,
            title: title,
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
                params: params
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
        let groupLayers = me.groupLayers[group_name].getLayers();
        groupLayers.insertAt(groupLayers.getLength(), me.overlayLayers[title]);
        // me.map.addLayer(me.overlayLayers[layerName]);
        return me.overlayLayers[title];
    };
    me.getFeatureStyle = function (fill_color, stroke_color, stroke_width, radius) {
        let circle = new ol.style.Circle({
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
    me.addSelectedFeatureLayer = function () {
        me.specialLayers["selectedFeatureLayer"] = new ol.layer.Vector({
            name: "selected features",
            info: false,
            // visible:false,
            hideInLegend: true,
            displayInLayerSwitcher: true,
            source: new ol.source.Vector({
                features: []
            }),
            style: function (feature) {
                return me.getSelectStyle(feature)
            }
        });
        // let source = me.specialLayers["selectedFeatureLayer"].getSource();
        // source.on('addfeature', function (e) {
        //     me.flash(e.feature);
        // });
        me.specialLayers["selectedFeatureLayer"].setZIndex(999)
    };

    me.showSelectedFeatureGeometry = function (wkt, clearPrevious) {
        // if (!clearPrevious) clearPrevious = true;
        let format = new ol.format.WKT();
        let feature = format.readFeature(wkt, {
            dataProjection: 'EPSG:32643',
            featureProjection: 'EPSG:32643'
        });
        let vectorSource = me.specialLayers["selectedFeatureLayer"].getSource();
        if (clearPrevious) vectorSource.clear();
        vectorSource.addFeature(feature);

    };
    me.showSelectedFeatureGeojson = function (geojson, featureID, layerName) {
        if (geojson.features != null) {
            let features = (new ol.format.GeoJSON()).readFeatures(geojson);
            if (featureID) {
                features = (new ol.format.GeoJSON()).readFeatures(geojson, {
                    dataProjection: 'EPSG:32643',
                    featureProjection: 'EPSG:32643'
                });
            }
            if (features.length > 0) {
                let vectorSource = me.specialLayers["selectedFeatureLayer"].getSource();
                vectorSource.clear();
                features[0].set('layerName', layerName);
                vectorSource.addFeatures(features);
                // me.zoomToSelectedFeatures();
                let data = features[0].getProperties();
                // alert(data);
                me.showAttributeDetailInJqxForm(data, layerName);
                // let grid = me.jqxGridVM.createPropertyGrid(data, '', layerName);
                // if (featureID === null) {
                //     me.jqxGridVM.showItemInWindow(grid, "Attribute Detail")
                // }

                // let content = me.createPropertyTableConent(features[0].getProperties())
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
        let content = "<table class='table table-condensed'>"
        content += "<th>Name</th><th>Value</th>"
        for (let key in json) {
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
    me.refreshMap = function () {
        me.map.render();
        me.map.renderSync();
    };
    me.getSelectStyle = function (feature) {
        let g_type = feature.getGeometry().getType();
        if (!g_type) g_type = feature.f;
        if (g_type.indexOf('Point') !== -1) {
            let selStyle = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({color: 'rgb(247,255,0)'}),
                    stroke: new ol.style.Stroke({
                        color: [0, 0, 0], width: 1.5
                    })
                })
                // image: new ol.style.Icon({
                //     // anchor: [0.5, 0.5],
                //     // opacity: 1,
                //     src: '/static/assets/img/marker.png'
                // })
            });
            return selStyle
        } else if (g_type.indexOf('LineString') !== -1) {
            let selStyle = new ol.style.Style({
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
            let selStyle = new ol.style.Style({
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
    me.addBasicInteraction = function () {
        me.removeAllInteraction();
        me.defaultInteractionsColl.forEach(function (interaction) {
            me.map.addInteraction(interaction)
        })
    }
    me.removeInteraction = function (interaction) {
        me.map.removeInteraction(interaction)
    }
    me.zoomToSelectedFeatures = function () {
        let extent = me.specialLayers["selectedFeatureLayer"].getSource().getExtent();
        if (isFinite(extent[0])) {
            me.getView().fit(extent, me.getMap().getSize());
            me.getView().setZoom(me.getView().getZoom() - 5);
        }
    }
    me.zoomToLatLong = function (row) {
        let coords = [row.longitude, row.latitude];
        let transformedCoords = ol.proj.transform(coords, 'EPSG:4326', 'EPSG:4326');
        let markerGeometry = new ol.geom.Point(transformedCoords);
        let feature = new ol.Feature({
            geometry: markerGeometry,
            attributes: {
                label: row.org_name,
                name: row.org_name,
                parent_name: row.parent.org_name,
                url: row.url
            }
        });
        let vectorSource = me.specialLayers["selectedFeatureLayer"].getSource();
        vectorSource.clear();
        vectorSource.addFeature(feature);
        me.zoomToSelectedFeatures()
    }
    me.setViewExtent = function (extent) {
        me.getView().fit(extent, me.getMap().getSize());
        // me.getView().fit(extent, me.getMap().getSize())
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
    me.identifier = function () {
        let identifyClick = me.map.on('click', function (evt) {
            let layerClicked = me.map.forEachLayerAtPixel(evt.pixel,
                function (layer) {
                    if (layer.get('layerName') === "tbl_desilting") {
                        return layer;
                    }
                })
            if (layerClicked) {
                let layerName = layerClicked.get('name');
                let source = layerClicked.getSource();
                if (source instanceof ol.source.TileWMS) {
                    me.getFeatureInfoFromGeoServer(evt, layerClicked, null);
                } else if (source instanceof ol.source.Vector) {
                    let feature = me.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                        //you can add a condition on layer to restrict the listener
                        return feature;
                    });
                    if (feature) {
                        let vectorSource = me.specialLayers["selectedFeatureLayer"].getSource();
                        vectorSource.clear();
                        vectorSource.addFeatures([feature]);
                        // me.zoomToSelectedFeatures();
                        let data = feature.getProperties();
                        if (layerName === 'selected features') {
                            layerName = feature.get('layerName');
                        }
                        let grid = me.jqxGridVM.createPropertyGrid(data, '', layerName);
                        me.jqxGridVM.showItemInWindow(grid, "Attribute Detail")
                        //here you can add you code to display the coordinates or whatever you want to do
                    }
                }

            }

        });
        return identifyClick;
    }

    me.showAttributeDetailInJqxForm = function (data, layerName, event) {
        if (me.attrForm) {
            me.attrFormEl.val(data);
        } else {
            let template = [];
            let excludedFields = ['objectid'];
            for (let key in data) {
                if (excludedFields.indexOf(key) === -1 && key.indexOf('code') === -1) {
                    let label = (key.replaceAll('_', ' ')).toUpperCase();
                    if (label === "SHAPE LENGTH") {
                        label = "Desilted Length (rft)"
                    }
                    let row = {
                        bind: key,
                        name: key,
                        type: 'text',
                        label: label,
                        labelPosition: 'top',
                        labelWidth: '350px',
                        width: '350px',
                    };
                    template.push(row);
                }
            }
            me.attrFormEl.empty();
            me.attrForm = me.attrFormEl.jqxForm({
                template: template,
                value: data
            });

        }
        if (!me.window) {
            me.window = me.windowEl.jqxWindow({
                width: 400,
                height: 300,
                // resizable: false,
                // isModal: true,
                position: {x: 300, y: 400}
            });
        }
        let pixelCoordinates = event.pixel;
        // me.window.html(me.attrFormEl);
        me.windowEl.jqxWindow('open')
    }
}

