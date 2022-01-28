var ExtPrintVM = function (mapComponent, olMapModel) {
    var me = this;
    me.olMapModel = olMapModel;
    me.mapComponent = mapComponent;
    me.showPrintWindow = function () {
        var me = this;
        // me.olMapModel.map.removeControl(me.olMapModel.graticuleControl);
        me.olMapModel.map.addControl(me.olMapModel.graticuleControl);

        var extWin = Ext.getCmp("print-win");
        if (extWin) {
            extWin.destroy();
        }
        var win = Ext.create('Ext.window.Window', {
                id: 'print-win',
                title: 'Print Map',
                layout: 'fit',
                width: 320,
                //x: 990,
                y: 80,
                //   height:500,
                minHeight: 50,
                maxHeight: 1000,
                //    autoScroll:true,
                closeAction: 'destroy',
                maximizable: true,
                constrainHeader: true,
                collapsible: true,
                plain: true,
                items: [
                    me.getPrintForm()
                ],
                listeners: {
                    close: function () {
                        me.olMapModel.map.removeControl(me.olMapModel.graticuleControl);
                    }
                }
            })
        ;
        win.show();
        //    me.printOlMap();
    };
    me.getPrintForm = function () {
        var frmPrint = Ext.create('Ext.form.Panel', {
            width: 300,
            bodyPadding: 10,
            items: [{
                // xtype: 'textareafield',
                // grow: true,
                xtype: 'textfield',
                id: 'map_title',
                fieldLabel: 'Title',
                emptyText: 'Map Title'
            },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Size',
                    defaultType: 'radiofield',
                    hidden: true,
                    defaults: {
                        flex: 1
                    },
                    layout: 'hbox',
                    items: [
                        {
                            boxLabel: 'A4',
                            name: 'size',
                            checked: true,
                            id: 'a4'
                        }, {
                            boxLabel: 'A3',
                            name: 'size',
                            id: 'a3'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: ':',
                    defaultType: 'checkboxfield',
                    items: [
                        {
                            boxLabel: 'North Arrow',
                            name: 'map_elements',
                            inputValue: '1',
                            checked: true,
                            id: 'north_arrow'
                        }, {
                            boxLabel: 'Scale',
                            name: 'map_elements',
                            inputValue: '2',
                            checked: true,
                            id: 'scale'
                        }, {
                            boxLabel: 'Legend',
                            name: 'map_elements',
                            inputValue: '3',
                            checked: true,
                            id: 'legend'
                        },
                        {
                            boxLabel: 'Show Grid Lines',
                            name: 'map_elements',
                            inputValue: '4',
                            //    hidden:true,
                            checked: true,
                            id: 'grid_lines',
                            listeners: {
                                change: function (checkbox, newVal, oldVal) {
                                    if (newVal) {
                                        me.olMapModel.map.addControl(me.olMapModel.graticuleControl);
                                    } else {
                                        me.olMapModel.map.removeControl(me.olMapModel.graticuleControl);

                                    }
                                }
                            }
                        },
                        // {
                        //     boxLabel: 'Grid Labels',
                        //     name: 'map_elements',
                        //     inputValue: '4',
                        //     checked: false,
                        //     id: 'grid_labels'
                        // }
                    ],

                },
                // {
                //     xtype: 'textareafield',
                //     readOnly: true,
                //     width: '100%',
                //     // grow: true,
                //     // xtype: 'textfield',
                //     //fieldLabel: 'Note',
                //     emptyText: 'Please adjust map print area by zooming and panning map using navigation toolbar and finally click on Print button after map is loaded'
                // },
            ],
            buttons: [
                //     {
                //     text: 'Print Layout',
                //     handler: function () {
                //         var map_title = Ext.getCmp('map_title').getValue();
                //         //    me.printMap(map_title);
                //         me.olMapModel.graticule.setMap(null);
                //         me.printOlMap();
                //         // me.printGeoserverMap();
                //         //   graticule.setMap(me.map);
                //     }
                // },
                /*
                {
                    text: 'Download As JPEG',
                    handler: function () {
                        me.downloadMapAsJpg();
                    }
                },*/
                {
                    text: 'Print',
                    handler: function () {
                        var map_title = Ext.getCmp('map_title').getValue();
                        var baseLayers = me.olMapModel.baseLayers.getLayers();
                        var layer = 'undefined';
                        baseLayers.forEach(function (lyr) {
                            var isVisible = lyr.get('visible');
                            if (isVisible) {
                                layer = lyr;
                            }
                        });
                        //    var layer = me.olMapModel.overlayLayers['wasa_subdivisions'];
                        if (typeof layer == 'undefined') {
                            layer = me.olMapModel.getAnyVisibleLayer();
                        }
                        if (layer) {
                            me.printOlMap(map_title, layer);

                        } else {
                            alert("No Layer Checked");
                        }

                        // me.printGeoserverMap();
                        //   graticule.setMap(me.map);
                    }
                }
            ]
        });
        return frmPrint;
    }
    me.printMap = function (map_title, doc) {
        var north_arrow = Ext.getCmp('north_arrow').getValue();
        var scale = Ext.getCmp('scale').getValue();
        var legend = Ext.getCmp('legend').getValue();
        var a3 = Ext.getCmp('a3').getValue();
        var size = 'a4';
        if (a3) {
            size = 'a3';
        }
        var d = '' + new Date();
        d = d.split('GMT');
        var map_name = 'map_' + d[0];
        // var width = 297;
        // var height = 210;
        var width = 420;
        var height = 297;

        // var doc = new jsPDF({
        //     orientation: "l",
        //     unit: "mm",
        //     format: [width, height] //210*297 in mm
        // });

        var canvas = document.getElementsByClassName("ol-unselectable");
        var imgData = canvas[0].toDataURL("image/png");

        // const imgProps = doc.getImageProperties(imgData);
        // const pdfWidth = doc.internal.pageSize.getWidth();
        // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;


        var margin = 2;
        var footerHeight = 5;
        var legendHeight = 1;
        // if (legend) {
        //     legendHeight = 25;
        // }
        var mapHeight = height - (margin + footerHeight + legendHeight);
        var mapWidth = width - (margin * margin);
        // doc.addImage(imgData, 'PNG', margin, margin, mapWidth, mapHeight); // left,top,width,height map adding here
        doc.setTextColor(0, 0, 0);
        const textWidth = doc.getTextWidth(map_title);
        doc.setFillColor(255, 255, 200);
        if (map_title !== '') {
            doc.rect(margin + 1, margin + 1, textWidth + textWidth + 4, 12, 'FD');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(30);
            doc.text(margin + 2, margin + 10, map_title);
        }
        if (scale) {
            var ol_scale_line = document.getElementsByClassName("ol-scale-line");
            html2canvas(ol_scale_line[0], {
                onrendered: function (canvas1) {
                    var ol_scale_line_image = canvas1.toDataURL("image/png");
                    doc.addImage(ol_scale_line_image, 'PNG', margin + 2, mapHeight - 12, 80, 6);
                }
            });
        }
        var imgNorthArrow = document.createElement("img");
        imgNorthArrow.src = "/static/assets/img/icons/north_arrow.jpg";
        imgNorthArrow.id = 'imgNorthArrow';
        imgNorthArrow.setAttribute('style', 'background-color:white');
        imgNorthArrow.addEventListener('load', function (event) {
            const imgNorthArrowDataUrl = me.getDataUrl(event.currentTarget);
            if (north_arrow) {
                doc.addImage(imgNorthArrowDataUrl, "JPEG", width - 23, margin, 20, 20);
            }
            if (legend) {
                var layers = Ext.getCmp('pnlLayers').getChecked();
                var tr = document.createElement("tr");
                var legendLength = 0;
                for (var i = 0; i < layers.length; i++) {
                    var lyr = layers[i];
                    var isChecked = lyr.get('checked');
                    var isLeaf = lyr.isLeaf();
                    if (isChecked && isLeaf) {
                        var lyrData = lyr.data;
                        var label = lyrData.get('name');
                        var legendUrl = lyrData.get('legendUrl');
                        if (legendUrl) {
                            var sld = legendUrl.split('cite:');
                            legendUrl = '/static/assets/img/sld/' + sld[1] + '.png';
                            var w = width / layers.length;
                            var row = '<tr>\n' +
                                '    <td><img src="' + legendUrl + '" alt="" style="width: 50px;height: 50px"></td></td>\n' +
                                '    <td style="width: 100mm;height: 50px;font-size: xx-large">' + label + '</td>\n' +
                                '  </tr>';
                            legendLength = legendLength + 1;
                            tr.append(row)
                        }
                    }

                }

                var tbl = document.getElementById("tbl");
                tbl.style.display = 'block';
                tbl.innerHTML = '';
                tbl.innerHTML = '<caption><span style="font-size: xx-large;"><b><u>Legend:</u></b></span></caption><tr style="background-color: transparent;">' + tr.innerText + '</tr>';
                html2canvas(tbl, {
                    onrendered: function (canvas) {
                        var canvasLegend = canvas.toDataURL("image/png");
                        //   doc.addImage(canvasLegend, 'PNG', margin, mapHeight-30, mapWidth, 20);
                        doc.addHTML(tbl, mapWidth - 40, mapHeight - (legendLength * 10), function () {
                            me.addFooterToMap(doc, width, height, margin, mapWidth, mapHeight, footerHeight, legendHeight);
                            doc.save(map_name);
                            // me.olMapModel.map.removeControl(me.olMapModel.graticuleControl);
                        });

                    },
                    // width: mapWidth,
                    // height: 25
                });
            } else {
                me.addFooterToMap(doc, width, height, margin, mapWidth, mapHeight, footerHeight, legendHeight);
                //  var blob = doc.output('datauristring');
                //    var blob = doc.canvas.toDataURL("image/jpeg", 0.8);
                let blob = new Blob([doc.output('blob')], {type: 'image/jpeg'});
                var imageType = 'image/jpeg';
                saveAs(blob, 'map');
                //  window.open(dataUriString);
                // me.olMapModel.map.removeControl(me.olMapModel.graticuleControl);
            }
        });
    }
    me.getDataUrl = function (img) {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Set width and height
        canvas.width = img.width;
        canvas.height = img.height;
        // Draw the image
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL('image/jpeg');
    }
    me.addFooterToMap = function (doc, width, height, margin, mapWidth, mapHeight, footerHeight, legendHeight) {
        doc.setFillColor(150);
        //    doc.rect(10, 171, 277, 28, 'F');
        doc.setFillColor(0, 0, 0);
        doc.setTextColor(255, 255, 0);
        doc.rect(margin, height - (footerHeight + margin), mapWidth, footerHeight, 'F');
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(margin + 2, (height - (margin + 1.5)), "Prepared By: GIS Section WASA, Lahore");
        doc.text(margin + 170, (height - (margin + 1.5)), "Copyright © 2021,  All Rights Reserved,  Powered by WASA, Lahore");
        doc.setFont("helvetica", "right");
        doc.setFontSize(10);
        doc.text(width - 50, (height - (margin + 1.5)), "Print Date: " + new Date().toDateString());
        // doc.save(map_name);

    }
    me.downloadMapAsJpg = function () {
        var imageType = 'image/jpeg';
        var canvas = document.getElementsByClassName("ol-unselectable");
        //   var imgData = canvas[0].toDataURL("image/png");
        canvas[0].toBlob(function (blob) {
            saveAs(blob, 'map.' + imageType.replace('image/', ''));
        }, imageType);
    };
    me.downloadMapAsJpgOld = function (e, b) {
        var imageType = 'image/jpeg';
        var canvas = document.getElementsByClassName("ol-unselectable");
        //   var imgData = canvas[0].toDataURL("image/png");
        canvas[0].toBlob(function (blob) {
            saveAs(blob, 'map.' + imageType.replace('image/', ''));
        }, imageType);

        var layer = me.olMapModel.overlayLayers['wasa_subdivisions'];
        var map = me.olMapModel.map;
        document.body.style.cursor = 'progress';
        map.renderSync();
        var dims = {
            a0: [1189, 841],
            a1: [841, 594],
            a2: [594, 420],
            a3: [420, 297],
            a4: [297, 210],
            a5: [210, 148],
        };
        var loading = 0;
        var loaded = 0;
        var format = 'a3';
        var viewResolution = me.olMapModel.map.getView().getResolution();
        //  alert(viewResolution);
        me.olMapModel.view.setZoom(me.olMapModel.view.getZoom() + 1);
        var resolution = 75;
        var dim = dims[format];
        var width = Math.round((dim[0] * resolution) / 25.4);
        var height = Math.round((dim[1] * resolution) / 25.4);
        const size = /** @type {ol.Size} */ (map.getSize());
        const extent = map.getView().calculateExtent(size);
        // var layer = me.olMapModel.overlayLayers['wasa_subdivisions'];
        var source = layer.getSource();
        var tileLoadStart = function () {
            ++loading;
        };
        var tileLoadEnd = function () {
            ++loaded;
            if (loading === loaded) {
                var canvas = this;
                window.setTimeout(function () {
                    loading = 0;
                    loaded = 0;
                    var imageType = 'image/jpeg';
                    var data = canvas.toDataURL('image/png');
                    canvas.toBlob(function (blob) {
                        saveAs(blob, 'map.' + imageType.replace('image/', ''));
                    }, imageType);
                    source.un('tileloadstart', tileLoadStart);
                    source.un('tileloadend', tileLoadEnd, canvas);
                    source.un('tileloaderror', tileLoadEnd, canvas);
                    map.setSize(size);
                    map.getView().fit(extent, size);
                    map.updateSize();
                    map.renderSync();
                    document.body.style.cursor = 'auto';
                }, 100);
            }
        };

        map.once('postcompose', function (event) {
            source.on('tileloadstart', tileLoadStart);
            source.on('tileloadend', tileLoadEnd, event.context.canvas);
            source.on('tileloaderror', tileLoadEnd, event.context.canvas);
        });

        map.setSize([width, height]);
        map.getView().fit(extent, /** @type {ol.Size} */ (map.getSize()));
        map.updateSize();
        map.renderSync();

    };
    me.printOlMap = function (map_title, layer) {
        var map = me.olMapModel.map;
        document.body.style.cursor = 'progress';
        var dims = {
            a0: [1189, 841],
            a1: [841, 594],
            a2: [594, 420],
            a3: [420, 297],
            a4: [297, 210],
            a5: [210, 148],
        };
        var loading = 0;
        var loaded = 0;
        var format = 'a3';
        var viewResolution = me.olMapModel.map.getView().getResolution();
        //  alert(viewResolution);
        me.olMapModel.view.setZoom(me.olMapModel.view.getZoom() + 1);
        var resolution = 75;
        var dim = dims[format];
        var width = Math.round((dim[0] * resolution) / 25.4);
        var height = Math.round((dim[1] * resolution) / 25.4);

        const size = /** @type {ol.Size} */ (map.getSize());
        const extent = map.getView().calculateExtent(size);
        // var layer = me.olMapModel.overlayLayers['wasa_subdivisions'];
        var source = layer.getSource();
        // var tileLoadStart = function () {
        //     ++loading;
        // };
        // var tileLoadEnd = function () {
        //     ++loaded;
        //     if (loading === loaded) {
        //         var canvas = this;
        //         window.setTimeout(function () {
        //             loading = 0;
        //             loaded = 0;
        //             var data = canvas.toDataURL('image/png');
        //             var pdf = new jsPDF('landscape', undefined, format);
        //             pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
        //             me.printMap(map_title, pdf);
        //             // pdf.save('map.pdf');
        //             source.un('tileloadstart', tileLoadStart);
        //             source.un('tileloadend', tileLoadEnd, canvas);
        //             source.un('tileloaderror', tileLoadEnd, canvas);
        //             map.setSize(size);
        //             map.getView().fit(extent, size);
        //             map.renderSync();
        //             document.body.style.cursor = 'auto';
        //         }, 1000);
        //     }
        // };

        map.once('postcompose', function (event) {
            var canvas = event.context.canvas;
            Ext.MessageBox.show({
                title: 'Please wait. . .',
                msg: '...',
                progressText: 'Initializing...',
                width: 300,
                progress: true,
                closable: false,
                wait: true,
                waitConfig: {interval: 200}
            });
            window.setTimeout(function () {
                Ext.MessageBox.hide();
                var data = canvas.toDataURL('image/png');
                var pdf = new jsPDF('landscape', undefined, format);
                pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
                me.printMap(map_title, pdf);
                // pdf.save('map.pdf');
                // source.un('tileloadstart', tileLoadStart);
                // source.un('tileloadend', tileLoadEnd, canvas);
                // source.un('tileloaderror', tileLoadEnd, canvas);
                map.setSize(size);
                map.getView().fit(extent, size);
                map.renderSync();
                document.body.style.cursor = 'auto';
            }, 5000);
            // source.on('tileloadstart', tileLoadStart);
            // source.on('tileloadend', tileLoadEnd, event.context.canvas);
            // source.on('tileloaderror', tileLoadEnd, event.context.canvas);
        });
        map.setSize([width, height]);
        map.getView().fit(extent, /** @type {ol.Size} */ (map.getSize()));
        map.renderSync();
        // var scaleResolution = scale /
        //     ol.proj.getPointResolution(map.getView().getProjection(), resolution / 25.4, map.getView().getCenter());
        // var newSize = [width, height];
        // me.olMapModel.map.setSize(newSize);
        // map.getView().setResolution(scaleResolution);

        // Set print size
        // scaleLine.setDpi(resolution);
        // map.getTargetElement().style.width = width + 'px';
        // map.getTargetElement().style.height = height + 'px';
        // map.updateSize();
        // me.olMapModel.map.setSize(newSize);
        // //  map.getView().setResolution(scaleResolution);
        // //rendercomplete,postrender
        //    me.olMapModel.map.getView().fit(extent);
        //    me.olMapModel.map.setSize(newSize);
        //    map.getView().animate({
        //        zoom: map.getView().getZoom()+3,
        //        duration: 250
        //    });
        // exportOptions.width = width;
        // exportOptions.height = height;
        // domtoimage.toJpeg(me.olMapModel.map.getViewport(), exportOptions)
        //     .then(function (dataUrl) {
        //         var pdf = new jsPDF('landscape', undefined, format);
        //         pdf.addImage(dataUrl, 'JPEG', 0, 0, dim[0], dim[1]);
        //         pdf.save('map.pdf');
        //         me.olMapModel.setSize(orgSize);
        //         me.olMapModel.getView().fit(extent, {size: orgSize});
        //         // Reset original map size
        //         //scaleLine.setDpi();
        //         map.getTargetElement().style.width = '';
        //         map.getTargetElement().style.height = '';
        //         map.updateSize();
        //         map.getView().setResolution(viewResolution);
        //         exportButton.disabled = false;
        //         document.body.style.cursor = 'auto';
        //     });

    }
    me.printGeoserverMap = function () {
        var specs = {
            "layout": "A4 portrait",
            "srs": "EPSG:3857",
            "units": "degrees",
            "dpi": 150,
            "mapTitle": "test",
            "layers": [
                {
                    "baseURL": "http://116.58.43.35:9012/geoserver/cite/wms",
                    "opacity": 1.0,
                    "singleTile": false,
                    "type": "WMS",
                    "layers": ["cite:wasa_towns"],
                    "format": "image/png"
                }
            ],
            "pages": [
                {
                    "center": [84.2, 28.2],
                    "scale": 2000000
                }
            ]
        };
        //  var json = JSON.stringify(specs);
        var json = encodeURI(JSON.stringify(specs));
        var url = 'http://116.58.43.35:9012/geoserver/pdf/print.pdf?spec=' + json;
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, true);
        xhttp.send();
        xhttp.onreadystatechange = function () {
            alert("working");
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("demo").innerHTML =
                    this.responseText;
            }
        };

    }
};