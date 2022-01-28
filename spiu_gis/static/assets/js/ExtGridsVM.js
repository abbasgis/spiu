var ExtGridVM = function (olMapModel) {
    var me = this;
    me.olMapModel = olMapModel;
    me.url = "http://localhost:8080/geoserver/wfs?request=GetFeature&version=1.1.0&typeName=wasa_assert:tbl_water_supply_network&outputFormat=json&FEATUREID=2"
    me.showItemInWindow = function (item, windowTitle) {
        var me = this;
        var extWin = Ext.getCmp("extWin");
        if (extWin) {
            extWin.destroy();
        }
        var win = Ext.create('Ext.window.Window', {
            id: 'extWin',
            title: windowTitle,
            layout: 'fit',
            x: 990,
            y: 60,
            width: 320,
            //   height:500,
            minHeight: 50,
            maxHeight: 1000,
            //    autoScroll:true,
            closeAction: 'destroy',
            maximizable: true,
            constrainHeader: true,
            collapsible: true,
            plain: true,
            items: item
        });
        win.show();
    };
    me.createPropertyGrid = function (row, infoRequired, layerName) {
        // alert(layerName);
        var source = {};
        var excludedFields = ['objectid', 'shape_length', 'shape_area', 'geometry', 'layerName'];
        if (infoRequired === 'prop') {
            source = {};
        } else {
            for (var key in row) {
                if (excludedFields.indexOf(key) === -1 && key.indexOf('code') === -1) {
                    var val = row[key];
                    var col_title = (key.replace('_', ' ')).toUpperCase();
                    if (val == "null" || val == "No Info" || val == "No" || val == "") {
                        source[col_title] = "N/A";
                    } else {
                        source[col_title] = val;
                    }
                }
            }
        }
        var grid = Ext.create('Ext.grid.property.Grid', {
            //    width: 220,
            //    minHeight:50,
            //    maxHeight: 1000,
            //    layout:'fit',
            hideHeaders: true,
            defaults: {sortable: false},
            loadMask: true,
            listeners: {
                'beforeedit': function (e) {
                    return false;
                }
            },
            propertyNames: {
                tested: 'QA',
                borderWidth: 'Border Width'
            },
            source: source
        });
        grid.getStore().sorters.items = [];
        grid.setSource(source);
        return grid;
    };
    me.requestErrorHandler = function (err) {
        alert("Error in request  = " + err)
    };
    me.getFeatureGeomFromDB = function (layerName, attr_name, attr_val) {
        Ext.MessageBox.wait("Fetching data...", "Please wait");
        var url = "/gis/get_feature_geom/?layer=" + layerName + "&attr_name=" + attr_name + "&attr_val=" + attr_val;
        var requestName = "feature_geom";
        var requestData = JSON.stringify({
            'LAYER': layerName
        });
        var requestManager = new RequestManager();
        requestManager.sendAJAXRequest(url, requestName, requestData, null, me.parseFeatureGeomResponse, me.requestErrorHandler, me)
    };
    me.getAttributeTableFromDB = function (layerName, town_id, sub_division_id) {
        me.olMapModel.attributesLayer = me.olMapModel.getVectorLayerByName(layerName);
        Ext.MessageBox.wait("Fetching data...", "Please wait");
        var url = "/gis/get_attribute_table/?layer=" + layerName + "&town_id=" + town_id + "&sub_div_id=" + sub_division_id;
        var requestName = "attribute_table";
        var requestData = JSON.stringify({
            'LAYER': layerName
        });
        var requestManager = new RequestManager();
        requestManager.sendAJAXRequest(url, requestName, requestData, null, me.showAttributeDataInGrid, me.requestErrorHandler, me)
    };
    me.parseFeatureGeomResponse = function (requestdata, result, etc, context) {
        Ext.MessageBox.hide();
        requestdata = JSON.parse(requestdata);
        var layerName = requestdata['LAYER'];
        var response = JSON.parse(result.responseText);
        if (response.code === 200) {
            var geojson = JSON.parse(response.data);
            me.olMapModel.showSelectedFeatureGeojson(geojson[0].result, -1, layerName);
            // var layer = me.olMapModel.attributesLayer;
            // me.populateattribuesGrid(response.data, layer);
        }

    };
    me.showAttributeDataInGrid = function (requestdata, result, etc, context) {
        Ext.MessageBox.hide();
        var response = JSON.parse(result.responseText);
        if (response.code === 200) {
            var layer = me.olMapModel.attributesLayer;
            me.populateattribuesGrid(response.data, layer);
        } else if (response.code === 404) {
            Ext.Msg.alert('Message', 'No Record Found')
        } else if (response.code === 400) {
            Ext.Msg.alert('Message', 'Internal Server Error')
        }

    };
    me.getSurveyDetailFromDB = function (layerName, hierarchy_id, from_date, to_date, period) {
        me.olMapModel.attributesLayer = me.olMapModel.getVectorLayerByName(layerName);
        Ext.MessageBox.wait("Fetching data...", "Please wait");
        var url = "/get_survey_detail/";
        var requestName = "get_survey_detail";
        var requestData = JSON.stringify({
            'layerName': layerName,
            'hierarchy_id': hierarchy_id,
            'from_date': from_date,
            'to_date': to_date,
            'period': period
        });
        var requestManager = new RequestManager();
        requestManager.sendAJAXRequest(url, requestName, requestData, null, me.getSurveyDetailResponse, me.requestErrorHandler, me)
    };
    me.getSurveyDetailResponse = function (requestdata, result, etc, context) {
        Ext.MessageBox.hide();
        var layer_corona = me.olMapModel.getVectorLayerByName('tbl_lgs_survey');
        var layer_landmark = me.olMapModel.getVectorLayerByName('tbl_lgs_survey_landmarks');
        var response = eval('(' + JXG.decompress(result.responseText) + ')');
        // response = JSON.parse(result.responseText);
        var geojson_corona = response.data_corona;//JSON.parse(response.data);
        if (geojson_corona && geojson_corona.features) {
            var size = geojson_corona.features.length;
            // me.attributeData = me.getAttributeTableFromGeoJson(geojson);
            // me.populateattribuesGrid(me.attributeData, layer);
            me.showAdminLevelNameInStatusBar(response.admin_level_name, response.admin_name);
            me.setPropertyCountInStatusBar('Count: ' + size + '/' + size);
            me.addGeoJSON2Layer(geojson_corona, layer_corona);
            // me.showAttributeTable(layer_corona);
        } else {
            me.showAdminLevelNameInStatusBar('', '');
            me.setPropertyCountInStatusBar('Count: 0');
            // var tblPnl = Ext.getCmp('mainSouthRegionId');
            // tblPnl.collapse();
            // Ext.Msg.alert('Message', 'No Record Found on this date')
        }
        var geojson_landmark = response.data_landmark;
        if (geojson_landmark && geojson_landmark.features) {
            // var layer_landmark = me.olMapModel.getVectorLayerByName('tbl_lgs_survey_landmarks');
            me.addGeoJSON2Layer(geojson_landmark, layer_landmark);
        }
        var tblPnl = Ext.getCmp('mainSouthRegionId');
        tblPnl.collapse();
    };
    me.showAttributeTable = function (layer) {
        var source = layer.getSource();
        var myFeatures = source.getFeatures();
        var data = [];
        for (var i = 0; i < myFeatures.length; i++) {
            data.push(myFeatures[i].getProperties());
        }
        me.attributeData = data;
        me.populateattribuesGrid(me.attributeData, layer);
        var size = myFeatures.length;
        var title = layer.get('name');
        me.setPropertyCountInStatusBar(title + ' Count: ' + size + '/' + size);
    };
    me.addGeoJSON2Layer = function (geojson, layer) {
        if (geojson.features != null) {
            var features = (new ol.format.GeoJSON()).readFeatures(geojson, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            // var features = (new ol.format.GeoJSON()).readFeatures(geojson);
            if (features.length > 0) {
                var vectorSource = layer.getSource();
                vectorSource.clear();
                vectorSource.addFeatures(features);
                var extent = vectorSource.getExtent();
                me.olMapModel.getView().fit(extent, me.olMapModel.getMap().getSize());
            }
        }
    }
    me.getAttributeTableFromGeoJson = function (geojson) {
        var data = [];
        var myFeatures = geojson.features;
        for (var i = 0; i < myFeatures.length; i++) {
            data.push(myFeatures[i].properties);
        }
        return data;
    }
    me.attributeGrid = null;
    me.gridStore = null;
    me.getAttributeDetail = function (town_id, sub_division_id) {
        me.populateattribuesGrid([], '');
    };
    /*
    me.populateattribuesGrid = function (dataArray, layer) {
        var tblPnl = Ext.getCmp('mainSouthRegionId');
        tblPnl.expand();
        me.gridStore = Ext.create('Ext.data.Store', {
            fields: [],
            data: [],
        });
        var columns = [];

        // if (me.attributeGrid) {
        //     if (dataArray.length > 0) {
        //         columns = me.getTableColumns(dataArray[0], layer);
        //         me.gridStore = me.getAttributeGridStore(dataArray, layer);
        //     }
        //     me.attributeGrid.reconfigure(me.gridStore, columns);
        //
        // } else {
        me.attributeGrid = me.getAttributeGrid(me.gridStore, columns);
        me.removeItemsFromPanel(tblPnl);
        var cmb = Ext.getCmp('cmb_category').getValue();
        if (cmb == null) {
            cmb = 'ws';
        }
        var tabsItems = [];
        if (cmb === 'ws') {
            tabsItems = [
                {title: 'Filtration Plants', id: 'filterPlantTab', items: []},
                {title: 'OHR', id: 'ohrTab', items: []},
                {title: 'Tubewels', id: 'tubeWelsTab', items: []},
                {title: 'Supply Network', id: 'supplyTab', items: []},
                {title: 'Fire Hydrant', id: 'fireHydrantTab', items: []},
                {title: 'Sluice Valves', id: 'sluiceValvesTab', items: []},
                {title: 'Lorry Hydrant', id: 'lorryHydrantTab', items: []}
            ];
        } else if (cmb === 'sew') {
            tabsItems = [
                {title: 'Disposal Station', id: 'disposalTab', items: []},
                {title: 'Lift Station', id: 'liftStationTab', items: []},
                {title: 'Sewerage Lines', id: 'sewerageTab', items: []},
                {title: 'Manholes', id: 'manholesTab', items: []},
                {title: 'Gully Grating', id: 'gullyGratingTab', items: []},
                {title: 'Invert Levels', id: 'invertLevelsTab', items: []},
                {title: 'Conduit', id: 'conduitTab', items: []},
                {title: 'Waste Water Treatment Plan', id: 'waterTreatmentTab', items: []},
            ]
        } else if (cmb === 'dng') {
            tabsItems = [
                {title: 'Existing Drain', id: 'existDrainTab', items: []},
                {title: 'Cover Drain', id: 'coverDrainTab', items: []},
                {title: 'Encroachment', id: 'encroachTab', items: []},
                {title: 'Lift Station', id: 'liftStationTab', items: []},
                {title: 'Gully Grating', id: 'gullyGratingTab', items: []},
                {title: 'Disposal Station', id: 'disposalTab', items: []},
                {title: 'Primary Drain', id: 'primaryDrainTab', items: []},
                {title: 'Secondary Drain', id: 'secondaryDrainTab', items: []},
                {title: 'Tertiary Drain', id: 'tertiaryDrainTab', items: []},
                {title: 'Non Wasa Primary Drain', id: 'nonWasaPrimaryTab', items: []},
                {title: 'Contours', id: 'contoursTab', items: []},
            ]
        }

        var tabs = me.getGridTabs(null, tabsItems);
        tblPnl.add(tabs);
        // tblPnl.add(me.attributeGrid);
        tblPnl.updateLayout();
        me.attributeGrid.getView().refresh();
        // }

    };
     */
    me.populateattribuesGrid = function (dataArray, layer) {
        var tblPnl = Ext.getCmp('mainSouthRegionId');
        tblPnl.expand();
        me.gridStore = Ext.create('Ext.data.Store', {
            fields: [],
            data: [],
        });
        var columns = [];
        if (me.attributeGrid == null) {
            me.attributeGrid = me.getAttributeGrid(me.gridStore, columns);
            // me.removeItemsFromPanel(tblPnl);
            tblPnl.add(me.attributeGrid);
            tblPnl.updateLayout();
            me.attributeGrid.getView().refresh();
        }
        if (dataArray.length > 0) {
            columns = me.getTableColumns(dataArray[0], layer);
            me.gridStore = me.getAttributeGridStore(dataArray, layer);
            me.attributeGrid.reconfigure(me.gridStore, columns);
            layer.setVisible(true);
            var size = dataArray.length;
            var title = layer.get('name');
            me.setPropertyCountInStatusBar(title + ', Count: ' + size);
        }


    };
    me.getGridTabs = function (map, items) {
        var me = this;
        var tabs = Ext.create('Ext.tab.Panel', {
            id: "tabPanelId",
            //            width: 470,
            activeTab: 0,
            defaults: {
                layout: 'fit'
//                autoScroll: true
            },
            resizeTabs: true, // turn on tab resizing
            minTabWidth: 115,
            tabWidth: 135,
            enableTabScroll: true,
            tabPosition: 'bottom',
            tabBar: {
                //plain:true,
                items: [{
                    xtype: 'tbfill'
                }, {
                    text: "Logout",
                    id: 'btnLogoutOnTabbar',
                    hidden: true,
                    icon: '/static/assets/img/icons/logout.png',
                    tooltip: "Logout",
                    closable: false,
                    handler: function (btn, e) {
                        window.location = 'logout.php';
                    }
                }]
            },
            items: items,
            listeners: {
                'tabchange': function (tabPanel, tab) {
                    if (tab.title == "Commercial Detail") {
                        if (me.commLayer.features.length > 0 > 0) {
                            //   me.mapConf.activateControlOnLayer(map, 'Commercial');
                            me.setPropertyCountInStatusBar("Commercial Record = " + me.commLayer.features.length + "/" + me.commLayer.features.length);
                            me.propLayer.setVisibility(false);
                            me.litLayer.setVisibility(false);
                            if (!me.commLayer.getVisibility()) {
                                me.commLayer.setVisibility(true);
                            }
                        } else {
                            Ext.Msg.alert('Result', 'No Commercial Record Found');
                            Ext.getCmp("tabPanelId").setActiveTab(Ext.getCmp("propertyTab"));
                        }
                    } else if (tab.title == "Litigation Detail") {
                        if (me.litLayer.features.length > 0) {
                            me.setPropertyCountInStatusBar("Litigation Record = " + me.litLayer.features.length + "/" + me.litLayer.features.length);
                            me.propLayer.setVisibility(false);
                            me.commLayer.setVisibility(false);
                            if (!me.litLayer.getVisibility()) {
                                me.litLayer.setVisibility(true);
                            }

                        } else {
                            Ext.Msg.alert('Result', 'No Litigation Record Found');
                            Ext.getCmp("tabPanelId").setActiveTab(Ext.getCmp("propertyTab"));
                        }
                    } else {
                        if (me.filterStatus != 200) {
                            me.setPropertyCountInStatusBar("Property Record = " + me.propLayer.features.length + "/" + me.propLayer.features.length);
                        } else {
                            var selectionLayer = map.getLayersByName("Filters", map)[0];
                            me.setPropertyCountInStatusBar("Property Record = " + selectionLayer.features.length + "/" + me.propLayer.features.length);
                        }
                        me.commLayer.setVisibility(false);
                        me.litLayer.setVisibility(false);
                        if (!me.propLayer.getVisibility()) {
                            me.propLayer.setVisibility(true);
                        }
                    }
                }
            }
        });
        return tabs;
    };
    me.getAttributeGrid = function (store, columns) {
        if (me.attributeGrid) {
            return me.attributeGrid;
        } else {
            me.attributeGrid = Ext.create('Ext.grid.Panel', {
                store: store,
                autoScroll: true,
                border: true,
                columnLines: true,
                stripeRows: true,
                columns: columns,
                forceFit: true,
                // features: [{
                //     ftype: 'summary',
                //     dock: 'bottom'
                // }],
                //    plugins: 'gridexporter',
                plugins: 'gridfilters',
                listeners: {
                    cellclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
                        var linkClicked = (e.target.tagName == 'ABBR');
                        var clickedDataText = view.panel.headerCt.getHeaderAtIndex(cellIndex).text;
                        // var district=record.get('Name');
                    }
                },
                viewConfig: {
                    getRowClass: function (record, index, rowParams) {
                        return (index % 2 == 0) ? 'grid-row1' : 'grid-row2';
                    },

                },
                dockedItems: [Ext.create('Ext.toolbar.Toolbar', {
                    dock: 'top',
                    items: me.getGridToolbarItems()
                })]
                //renderTo: Ext.getBody()
            });
            return me.attributeGrid;
        }
    }
    me.getAttributeGridStore = function (dataArray, layer) {
        var store = null;
        store = Ext.create('Ext.data.Store', {
            fields: me.getGridFields(dataArray[0]),
            data: dataArray,
        });
        // if (layer.get('layerName') === 'tbl_lgs_survey' || layer.get('layerName') === 'tbl_lgs_survey_landmarks') {
        //     store = Ext.create('GeoExt.data.store.Features', {
        //         layer: layer,
        //         map: me.olMapModel.getMap(),
        //         listeners: {
        //             refresh: function (store, eOpts) {
        //                 try {
        //                     layer.getSource().forEachFeature(function (feature) {
        //                         feature.setStyle(new ol.style.Style({}));
        //                     });
        //                     var records = store.data.items;
        //                     me.setPropertyCountInStatusBar(" Count = " + store.getCount() + "/" + layer.getSource().getFeatures().length);
        //                     if (store.isFiltered()) {
        //                         // layer.setStyle(new ol.style.Style({}));
        //                         for (var i = 0; i < records.length; i++) {
        //                             // var gid = parseInt(records[i].data["gid"]);
        //                             var feature = records[i].getFeature();// layer.getSource().getFeatureById("tbl_lgs_survey." + gid);
        //                             var surveyStyle = me.olMapModel.getVectorLayerStyle(feature, layer);
        //                             feature.setStyle(surveyStyle);
        //                         }
        //                     } else {
        //                         layer.getSource().forEachFeature(function (feature) {
        //                             var surveyLayerStyle = me.olMapModel.getVectorLayerStyle(feature, layer);
        //                             feature.setStyle(surveyLayerStyle);
        //                         });
        //                     }
        //                 } catch (err) {
        //                     console.log(err.message);
        //                 }
        //             }
        //         }
        //     });
        // } else {
        //     store = Ext.create('Ext.data.Store', {
        //         fields: me.getGridFields(dataArray[0]),
        //         data: dataArray,
        //     });
        //
        // }
        return store;
    };
    me.showAdminLevelNameInStatusBar = function (level, levelName) {
        var lblCount = Ext.getCmp("lblLevel");
        lblCount.setText(level + ': ' + levelName);
    };
    me.setPropertyCountInStatusBar = function (propertyCountText) {
        var lblCount = Ext.getCmp("lblCount");
        lblCount.setText(propertyCountText);
    };
    me.removeItemsFromPanel = function (panel) {
        for (var i = 0; i < panel.items.items.length; i++) {
            panel.remove(panel.items.keys[i], true);
        }
        panel.updateLayout();
    };
    me.getGridFields = function (obj) {
        var fields = [];
        var type = 'string';
        for (var key in obj) {
            if (key.indexOf('date') > -1 || key === 'time') {
                type = 'date'
            } else {
                type = 'string'
            }
            var field = {
                name: key,
                type: type
            };
            fields.push(field);
        }
        //alert(fields);
        return fields;
    };
    me.getTableColumns = function (obj, layer) {
        // if (layer && layer.get('layerName') === 'tbl_lgs_survey' || layer.get('layerName') === 'tbl_lgs_survey_landmarks') {
        //     columns = me.createSurveyColumnList()
        // } else {
        //     var columns = me.getGridColumn(obj);
        // }
        var columns = me.getGridColumn(obj);
        return columns;
    }
    me.getGridColumn = function (obj) {
        var columns = [];
        columns.push(Ext.create('Ext.grid.RowNumberer',
            {
                width: 60,
                header: 'Sr. No.'
            }
        ));
        var type = 'string';
        for (var key in obj) {
            if (key === 'id' || key === 'code') {
            } else {
                var col_title = (key.replace('_', ' ')).toUpperCase();
                var field = {
                    text: col_title,
                    dataIndex: key,
                    filter: {
                        type: type
                    },
                    summaryType: 'count',
                    summaryRenderer: function (value) {
                        return 'Count: ' + value;
                    }
                };
                columns.push(field);
            }
        }
        return columns;
    };
    me.getGridToolbarItems = function () {
        var me = this;
        var items = [
            '-',
            {
                xtype: 'button',
                tooltip: "Zoom To Asset Location",
                icon: '/static/assets/img/icons/icon_zoomin.gif',
                text: 'Zoom To Selected Row',
                handler: function (b, e) {
                    var selectedRow = b.up('grid').getSelectionModel().getSelection()[0];
                    if (selectedRow) {
                        var layer = me.olMapModel.attributesLayer;
                        me.getFeatureGeomFromDB(layer.get('layerName'), 'objectid', selectedRow.get('objectid'));

                        // var source = layer.getSource();
                        // if (source instanceof ol.source.TileWMS || layer.get('layerName') === 'tbl_lgs_survey' || layer.get('layerName') === 'tbl_lgs_survey_landmarks') {
                        //     me.olMapModel.getFeatureInfoFromGeoServer(null, layer, selectedRow.get('objectid'));
                        // }

                    } else {
                        Ext.Msg.alert('Message', 'Please Select any Row from Table');
                    }

                }
            },
            '-',
            {
                xtype: 'button',
                tooltip: "Download Excel",
                icon: '/static/assets/img/icons/excel.png',
                text: 'Export To Excel',
                //    disabled:true,
                handler: function (b, e) {
                    //var exceldata = 'data:application/vnd.ms-excel;base64,'+ Ext.ux.Exporter.exportGrid(b.up('grid'),null,null);
                    //location.href=exceldata;
                    b.up('grid').downloadExcelXml(b.up('grid'), "AssetsDetail");
                    // me.attributeGrid.saveDocumentAs({
                    //     type: 'xlsx',
                    //     title: 'My export',
                    //     fileName: 'myExport.xlsx'
                    // });
                }
            },
            '-',

            // {
            //     xtype: 'button',
            //     tooltip: "Close Windows",
            //     icon: '/static/assets/img/icons/closeAll.png',
            //     text: 'Close All Windows',
            //     handler: function () {
            //         // me.closeAllWindows();
            //     }
            // },
            // '-',


        ];
        return items;
    };
    me.createSurveyColumnList = function (p) {
        //   p["Area"] = me.getAreaInProperFormat(p);
        var me = this;
        var columns = [];
        columns.push(Ext.create('Ext.grid.RowNumberer',
            {
                width: 50,
                header: 'Sr. #'
            }
        ));
        var featureColumn = {
            xtype: 'widgetcolumn',
            width: 40,
            widget: {
                xtype: 'gx_renderer'
            },
            // onWidgetAttach: function (column, gxRenderer, record) {
            //     // update the symbolizer with the related feature
            //     var feature = record.olObject;
            //     gxRenderer.update({
            //         feature: feature,
            //         symbolizers: featRenderer.determineStyle(record)
            //     });
            // }
        };
        // columns.push(featureColumn);
        columns.push({
            dataIndex: 'division_name',
            header: 'Division',
            width: 50,
            filter: {
                type: "string"
            }
        });
        columns.push({
            dataIndex: 'district_name',
            header: 'Districts',
            width: 70,
            filter: {
                type: "string"
            }
        });
        columns.push({
            dataIndex: 'lg_name',
            header: 'Local Govt. Name',
            width: 140,
            filter: {
                type: "string"
            }
        });
        columns.push({
            dataIndex: 'activity_name',
            header: 'Activity Type',
            width: 100,
            filter: {
                type: "string"
            }
        });
        columns.push({
            dataIndex: 'remarks',
            header: 'Caption',
            width: 100,
            filter: {
                type: "string"
            }
        });
        columns.push({
            dataIndex: 'surver_date',
            hidden: true,
            format: 'd-M-Y',
            header: 'Survey Date',
            width: 100,
            filter: {
                type: 'date',
                dateFormat: 'Y-m-d'
            },
            renderer: Ext.util.Format.dateRenderer('d/m/Y')
        });
        columns.push({
            dataIndex: 'time',
            // hidden: true,
            format: 'd-M-Y',
            header: 'Upload Time',
            width: 100,
            filter: {
                type: 'date',
                dateFormat: 'Y-m-d'
            },
            renderer: Ext.util.Format.dateRenderer('d/m/Y h:i A')
        });
        columns.push({
            dataIndex: 'lg_number',
            header: 'LG Nnumber',
            hidden: true,
            width: 100,
            filter: {
                type: "string"
            }
        });

        columns.push({
            dataIndex: 'username',
            header: 'Surveyor',
            hidden: true,
            width: 100,
            filter: {
                type: "string"
            }
        });
        return columns;
    };
    me.convertDateFormat = function (d) {
        var fm = d.getMonth() + 1;
        d = d.getDate() + '-' + fm + '-' + d.getFullYear();
        return d;
    };
};