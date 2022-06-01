var MapExtVM = function () {
    var me = this;
    var navbar = document.getElementById("mainNavBar");
    me.olMap = null;
    me.mapComponent = null;
    me.olMapModel = new OLMapModel('map', me, null);
    me.olMapModel.initialize();
    me.toolbarModel = new ExtToolbarModel(me, me.olMapModel);
    me.statusbarModel = new ExtStatusbarModel(me.olMapModel);
    me.adminHierarchy = new AdminHierarchy(me.olMapModel);
    me.btnRemove = null;
    var navBarHtmlText = navbar.outerHTML;// me.olMapModel.stripHtml(navbar);
    me.initialize = function () {
        me.setViewPanel();
        // me.adminHierarchy.getAdminHierarchyTree();
        // me.olMapModel.extGridVM.getSurveyDetailFromDB("tbl_lgs_survey", null, null, null, null);
        // me.olMapModel.extGridVM.populateattribuesGrid([], null);

    };
    me.getMapPanel = function () {
        me.olMap = me.olMapModel.getMap();
        me.mapComponent = Ext.create('GeoExt.component.Map', {
            map: me.olMap
        });
        me.mapPanel = Ext.create('Ext.panel.Panel', {
            id: 'map-panel',
            region: 'center',
            layout: 'fit',
            padding: '5 0 0 0',
            stateful: true,
            stateId: 'map-panel',
            // title: 'Map Panel',
            items: [me.mapComponent],
            tbar: me.toolbarModel.getToolbar(),
            bbar: me.statusbarModel.getStatusbar()
        });
        return me.mapPanel;
    };
    me.getViewportHeight = function () {
        var width = Ext.getBody().getViewSize().width;
        var height = Ext.getBody().getViewSize().height;
        // var navbar_height = Ext.get("base_nav").getViewSize().height;
        // var header_height = (Ext.get("header") ? Ext.get("header").getViewSize().height : 0);
        // var footer_heght = (Ext.get("footer") ? Ext.get("footer").getViewSize().height : 0);
        // var rem_height = height - (navbar_height + header_height + footer_heght) + 10;
        return height;
    }
    me.setViewPanel = function (viewportItems) {
        var mapPanel = me.getMapPanel();
        me.olMap = me.olMapModel.getMap();
        var treePanel = me.getTreePanel(me.olMap);
        var eastPanelItems = me.getEastPanelItems(me.olMap);
        var renderTo = Ext.get('extviewport');
        // var height = me.getViewportHeight();
        Ext.create('Ext.Viewport', {
            layout: 'border',
            items: [
                {
                    xtype: 'panel',
                    region: 'north',
                    height: 50,
                    html: navBarHtmlText,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: []
                },
                mapPanel,
                {
                    xtype: 'panel',
                    region: 'west',
                    title: 'Layers',
                    resizable: true,
                    width: 310,
                    collapsible: true,
                    collapsed: true,
                    layout: 'fit',
                    items: [
                        // Ext.create('Ext.TabPanel', {
                        //     layout: 'fit',
                        //     items: [
                        //         {
                        //             title: 'Layers',
                        //             items: treePanel
                        //         },
                        //         {
                        //             title: 'Search',
                        //             layout: {
                        //                 type: 'vbox',
                        //                 align: 'stretch'
                        //             },
                        //             items: eastPanelItems
                        //         }
                        //     ]
                        // })
                        treePanel

                    ]
                },
                {
                    xtype: 'panel',
                    region: 'east',
                    id: 'pnlEast',
                    title: 'Filter Layer',
                    resizable: true,
                    width: 300,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    collapsible: true,
                    collapsed: true,
                    items: eastPanelItems
                },
                {
                    xtype: 'panel',
                    region: 'south',
                    title: 'Attribute Table',
                    id: "mainSouthRegionId",
                    height: 200,
                    layout: 'fit',
                    // layout: {
                    //     type: 'vbox',
                    //     align: 'stretch'
                    // },
                    collapsible: true,
                    resizable: true,
                    collapsed: true,
                    items: []
                }
            ]
        })
        ;


    };
    me.getTreePanel = function (map) {
        var treeStore = Ext.create('GeoExt.data.store.LayersTree', {
            layerGroup: map.getLayerGroup(),
        });
        var treePanel = Ext.create('Ext.tree.Panel', {
            // title: 'Table of Content',
            id: 'pnlLayers',
            store: treeStore,
            border: false,
            rootVisible: false,
            hideHeaders: true,
            lines: true,
            flex: 1,
            viewConfig: {
                plugins: {ptype: 'treeviewdragdrop'}
            },
            columns: {
                header: false,
                items: [
                    {
                        xtype: 'treecolumn',
                        dataIndex: 'text',
                        flex: 1,
                        plugins: [
                            {
                                ptype: 'basic_tree_column_legend'
                            }
                        ]
                    }
                ]
            },
            listeners: {
                // render: function () {
                //     Ext.getBody().on("contextmenu", Ext.emptyFn, null, {preventDefault: true});
                // },
                checkchange: function (record, checked, eOpts) {
                    var isLeaf = record.isLeaf();
                    var isExpanded = record.get('expanded');
                    if (isLeaf) {
                        var isChecked = record.get('checked');
                        record.set('checked', !isChecked);
                    } else {
                        if (!isExpanded) {
                            record.expand();
                        } else {
                            record.collapse();
                        }

                    }
                },
                itemclick: function (panel, record, item, index, event) {
                    var isLeaf = record.isLeaf();
                    var isExpanded = record.get('expanded');
                    if (isLeaf) {
                        var isChecked = record.get('checked');
                        record.set('checked', !isChecked);
                    } else {
                        if (!isExpanded) {
                            record.expand();
                        } else {
                            record.collapse();
                        }

                    }
                },
                itemcontextmenu: function (grid, record, item, index, event) {
                    // x = event.browserEvent.clientX;
                    // y = event.browserEvent.clientY;
                    // treeMenu.showAt([x, y]);
                    var treeMenu = me.olMapModel.getLayersTreeMenu(grid, record, item, index, event);
                    treeMenu.showAt(event.getXY());
                    event.stopEvent();
                }
            },
        });
        return treePanel;
    };
    me.getEastPanelItems = function (map) {
        var items = [];
        var store_tehsil = Ext.create('Ext.data.Store', {
            fields: ['code', 'name'],
            data: [{"name": "Ahmad Pur East", "code": "012", "district_code": "03"},
                {"name": "Ahmad Pur Sial", "code": "053", "district_code": "12"},
                {"name": "Ali Pur", "code": "096", "district_code": "23"},
                {"name": "Arifwala", "code": "109", "district_code": "27"},
                {"name": "Aroop Town", "code": "041", "district_code": "09"},
                {"name": "Attock", "code": "001", "district_code": "01"},
                {"name": "Aziz Bhati Town", "code": "075", "district_code": "17"},
                {"name": "Bahawalnagar", "code": "007", "district_code": "02"},
                {"name": "Bahawalpur City", "code": "013", "district_code": "03"},
                {"name": "Bahawalpur Saddar", "code": "014", "district_code": "03"},
                {"name": "Bhakkar", "code": "018", "district_code": "04"},
                {"name": "Bhalwal", "code": "128", "district_code": "32"},
                {"name": "Bhowana", "code": "028", "district_code": "06"},
                {"name": "Bosan town", "code": "093", "district_code": "22"},
                {"name": "Burewala", "code": "146", "district_code": "36"},
                {"name": "Chak Jhumra", "code": "033", "district_code": "08"},
                {"name": "Chakwal", "code": "022", "district_code": "05"},
                {"name": "Chichawatni", "code": "126", "district_code": "31"},
                {"name": "Chiniot", "code": "026", "district_code": "06"},
                {"name": "Chistian", "code": "008", "district_code": "02"},
                {"name": "Choa Saidan Shah", "code": "023", "district_code": "05"},
                {"name": "Choubara", "code": "077", "district_code": "18"},
                {"name": "Chunian", "code": "059", "district_code": "14"},
                {"name": "Darya Khan", "code": "019", "district_code": "04"},
                {"name": "Daska", "code": "139", "district_code": "34"},
                {"name": "Data Ganj Baksh Town", "code": "072", "district_code": "17"},
                {"name": "Depalpur", "code": "107", "district_code": "26"},
                {"name": "Dera Ghazi Khan", "code": "029", "district_code": "07"},
                {"name": "Dina", "code": "054", "district_code": "13"},
                {"name": "Dunyapur", "code": "080", "district_code": "19"},
                {"name": "Fateh jang", "code": "002", "district_code": "01"},
                {"name": "Ferozwala", "code": "134", "district_code": "33"},
                {"name": "Fortabbas", "code": "009", "district_code": "02"},
                {"name": "Gojra", "code": "143", "district_code": "35"},
                {"name": "Gujar Khan", "code": "125", "district_code": "30"},
                {"name": "Gujrat", "code": "046", "district_code": "10"},
                {"name": "Gulberg Town", "code": "074", "district_code": "17"},
                {"name": "Hafizabad", "code": "049", "district_code": "11"},
                {"name": "Haroonabad", "code": "010", "district_code": "02"},
                {"name": "Hasilpur", "code": "015", "district_code": "03"},
                {"name": "Hassanabdal", "code": "003", "district_code": "01"},
                {"name": "Hazro", "code": "004", "district_code": "01"},
                {"name": "Iqbal Town Fsd.", "code": "031", "district_code": "08"},
                {"name": "Iqbal Town Lahore", "code": "068", "district_code": "17"},
                {"name": "Isa Khel", "code": "086", "district_code": "21"},
                {"name": "Jahanian", "code": "064", "district_code": "15"},
                {"name": "Jalal Pur Pir Wala", "code": "094", "district_code": "22"},
                {"name": "Jampur", "code": "115", "district_code": "29"},
                {"name": "Jand", "code": "005", "district_code": "01"},
                {"name": "Jaranwala", "code": "035", "district_code": "08"},
                {"name": "Jatoi", "code": "097", "district_code": "23"},
                {"name": "Jhang", "code": "051", "district_code": "12"},
                {"name": "Jhelum", "code": "055", "district_code": "13"},
                {"name": "Jinnah Town", "code": "032", "district_code": "08"},
                {"name": "Kabirwala", "code": "062", "district_code": "15"},
                {"name": "Kahror Pakka", "code": "081", "district_code": "19"},
                {"name": "Kahuta", "code": "122", "district_code": "30"},
                {"name": "Kallar Kahar", "code": "025", "district_code": "05"},
                {"name": "Kallar Syedan Town", "code": "120", "district_code": "30"},
                {"name": "Kalur Kot", "code": "020", "district_code": "04"},
                {"name": "Kamalia", "code": "144", "district_code": "35"},
                {"name": "Kamoke", "code": "045", "district_code": "09"},
                {"name": "Karor Lal Eisan", "code": "078", "district_code": "18"},
                {"name": "Kasur", "code": "058", "district_code": "14"},
                {"name": "Khairpur Tamewali", "code": "016", "district_code": "03"},
                {"name": "Khanewal", "code": "061", "district_code": "15"},
                {"name": "Khanpur", "code": "111", "district_code": "28"},
                {"name": "Kharian", "code": "047", "district_code": "10"},
                {"name": "Khiali Shahpur Town", "code": "042", "district_code": "09"},
                {"name": "Khushab", "code": "065", "district_code": "16"},
                {"name": "Kot Addu", "code": "098", "district_code": "23"},
                {"name": "Kot Moman", "code": "129", "district_code": "32"},
                {"name": "Kotli Sattian", "code": "124", "district_code": "30"},
                {"name": "Lallian", "code": "027", "district_code": "06"},
                {"name": "Layyah", "code": "079", "district_code": "18"},
                {"name": "Liaqatpur", "code": "112", "district_code": "28"},
                {"name": "Lodhran", "code": "082", "district_code": "19"},
                {"name": "Lyallpur Town", "code": "038", "district_code": "08"},
                {"name": "Madina Town", "code": "037", "district_code": "08"},
                {"name": "Mailsi", "code": "147", "district_code": "36"},
                {"name": "Makhdoompur Rashid", "code": "089", "district_code": "22"},
                {"name": "Malakwal", "code": "084", "district_code": "20"},
                {"name": "Mandi Bahauddin", "code": "083", "district_code": "20"},
                {"name": "Mankera", "code": "021", "district_code": "04"},
                {"name": "Mian Channu", "code": "063", "district_code": "15"},
                {"name": "Mianwali", "code": "088", "district_code": "21"},
                {"name": "Minchanabad", "code": "011", "district_code": "02"},
                {"name": "Mosa Pak Town", "code": "090", "district_code": "22"},
                {"name": "Muridke", "code": "135", "district_code": "33"},
                {"name": "Murree", "code": "123", "district_code": "30"},
                {"name": "Muzaffargarh", "code": "099", "district_code": "23"},
                {"name": "Nandipur Town", "code": "039", "district_code": "09"},
                {"name": "Nankana Sahib", "code": "100", "district_code": "24"},
                {"name": "Narowal", "code": "103", "district_code": "25"},
                {"name": "Nishter Town", "code": "076", "district_code": "17"},
                {"name": "Noorpur Thal", "code": "067", "district_code": "16"},
                {"name": "Nowshera Virkan", "code": "044", "district_code": "09"},
                {"name": "Okara", "code": "106", "district_code": "26"},
                {"name": "P.D. Khan", "code": "056", "district_code": "13"},
                {"name": "Pakpattan", "code": "110", "district_code": "27"},
                {"name": "Pasrur", "code": "140", "district_code": "34"},
                {"name": "Pattoki", "code": "060", "district_code": "14"},
                {"name": "Phalia", "code": "085", "district_code": "20"},
                {"name": "Pindi Bhattian", "code": "050", "district_code": "11"},
                {"name": "Pindi Gheb", "code": "006", "district_code": "01"},
                {"name": "Piplan", "code": "087", "district_code": "21"},
                {"name": "Potohar Town", "code": "118", "district_code": "30"},
                {"name": "Qila Dedar Singh Town", "code": "040", "district_code": "09"},
                {"name": "Quaidabad", "code": "066", "district_code": "16"},
                {"name": "Rahim Yar Khan", "code": "113", "district_code": "28"},
                {"name": "Rajanpur", "code": "116", "district_code": "29"},
                {"name": "Ravi Town", "code": "070", "district_code": "17"},
                {"name": "Rawal Town", "code": "119", "district_code": "30"},
                {"name": "Renala khurd", "code": "108", "district_code": "26"},
                {"name": "Rojhan", "code": "117", "district_code": "29"},
                {"name": "Sadiqabad", "code": "114", "district_code": "28"},
                {"name": "Safdarabad", "code": "138", "district_code": "33"},
                {"name": "Sahiwal", "code": "127", "district_code": "31"},
                {"name": "Sahiwal Sgd.", "code": "130", "district_code": "32"},
                {"name": "Sambrial", "code": "141", "district_code": "34"},
                {"name": "Sammundri", "code": "034", "district_code": "08"},
                {"name": "Samnabad Town", "code": "071", "district_code": "17"},
                {"name": "Sangla Hill", "code": "101", "district_code": "24"},
                {"name": "Sarai Alamgir", "code": "048", "district_code": "10"},
                {"name": "Sargodha", "code": "131", "district_code": "32"},
                {"name": "Shah Rukn-e-Alam Town", "code": "092", "district_code": "22"},
                {"name": "Shahkot", "code": "102", "district_code": "24"},
                {"name": "Shahpur", "code": "132", "district_code": "32"},
                {"name": "Shakargarh", "code": "105", "district_code": "25"},
                {"name": "Shalimar Town", "code": "069", "district_code": "17"},
                {"name": "Sharaqpur", "code": "136", "district_code": "33"},
                {"name": "Sheikhupura", "code": "137", "district_code": "33"},
                {"name": "Sher Shah Town", "code": "091", "district_code": "22"},
                {"name": "Shorkot", "code": "052", "district_code": "12"},
                {"name": "Shujabad Town", "code": "095", "district_code": "22"},
                {"name": "Sialkot", "code": "142", "district_code": "34"},
                {"name": "Sillanwali", "code": "133", "district_code": "32"},
                {"name": "Sohawa", "code": "057", "district_code": "13"},
                {"name": "T.T. Singh", "code": "145", "district_code": "35"},
                {"name": "Talagang", "code": "024", "district_code": "05"},
                {"name": "Tandlianwala", "code": "036", "district_code": "08"},
                {"name": "Taunsa Sharif", "code": "030", "district_code": "07"},
                {"name": "Taxila", "code": "121", "district_code": "30"},
                {"name": "Vehari", "code": "148", "district_code": "36"},
                {"name": "Wahga Town", "code": "073", "district_code": "17"},
                {"name": "Wazirabad Town", "code": "043", "district_code": "09"},
                {"name": "Yazman", "code": "017", "district_code": "03"},
                {"name": "Zafarwal", "code": "104", "district_code": "25"}]
        });
        var store_division = Ext.create('Ext.data.Store', {
            fields: ['code', 'name'],
            data: [{"name": "Bahawalpur  ", "code": "01"},
                {"name": "Dera Ghazi Khan ", "code": "02"},
                {"name": "Faisalabad ", "code": "03"},
                {"name": "Gujranwala", "code": "04"},
                {"name": "Lahore", "code": "05"},
                {"name": "Multan", "code": "06"},
                {"name": "Rawalpindi  ", "code": "07"},
                {"name": "Sahiwal ", "code": "08"},
                {"name": "Sargodha ", "code": "09"}]
        });
        var store_district = Ext.create('Ext.data.Store', {
            fields: ['code', 'name', 'division_code'],
            data: [{"name": "Attock ", "code": "01", "division_code": "07"},
                {"name": "Bahawalnagar ", "code": "02", "division_code": "01"},
                {"name": "Bahawalpur ", "code": "03", "division_code": "01"},
                {"name": "Bhakkar", "code": "04", "division_code": "09"},
                {"name": "Chakwal", "code": "05", "division_code": "07"},
                {"name": "Chiniot", "code": "06", "division_code": "03"},
                {"name": "Dera Ghazi Khan", "code": "07", "division_code": "02"},
                {"name": "Faisalabad", "code": "08", "division_code": "03"},
                {"name": "Gujranwala", "code": "09", "division_code": "04"},
                {"name": "Gujrat", "code": "10", "division_code": "04"},
                {"name": "Hafizabad", "code": "11", "division_code": "04"},
                {"name": "Jhang", "code": "12", "division_code": "03"},
                {"name": "Jhelum", "code": "13", "division_code": "07"},
                {"name": "Kasur", "code": "14", "division_code": "05"},
                {"name": "Khanewal", "code": "15", "division_code": "06"},
                {"name": "Khushab", "code": "16", "division_code": "09"},
                {"name": "Lahore", "code": "17", "division_code": "05"},
                {"name": "Layyah", "code": "18", "division_code": "02"},
                {"name": "Lodhran", "code": "19", "division_code": "06"},
                {"name": "Mandi Bahauddin", "code": "20", "division_code": "04"},
                {"name": "Mianwali", "code": "21", "division_code": "09"},
                {"name": "Multan", "code": "22", "division_code": "06"},
                {"name": "Muzaffargarh", "code": "23", "division_code": "02"},
                {"name": "Nankana Sahib", "code": "24", "division_code": "05"},
                {"name": "Narowal", "code": "25", "division_code": "04"},
                {"name": "Okara  ", "code": "26", "division_code": "08"},
                {"name": "Pakpattan  ", "code": "27", "division_code": "08"},
                {"name": "Rahim Yar Khan", "code": "28", "division_code": "01"},
                {"name": "Rajanpur", "code": "29", "division_code": "02"},
                {"name": "Rawalpindi", "code": "30", "division_code": "07"},
                {"name": "Sahiwal", "code": "31", "division_code": "08"},
                {"name": "Sargodha", "code": "32", "division_code": "09"},
                {"name": "Sheikhupura", "code": "33", "division_code": "05"},
                {"name": "Sialkot", "code": "34", "division_code": "04"},
                {"name": "Toba Tek Singh", "code": "35", "division_code": "03"},
                {"name": "Vehari", "code": "36", "division_code": "06"}]
        });

// Create the combo box, attached to the states data store

        var cmb_division = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'Division',
            id: 'cmb_division',
            typeAhead: true,
            anyMatch: true,
            minChars: 2,
            emptyText: 'Choose Division',
            store: store_division,
            margin: '10 10 10 10',
            queryMode: 'local',
            // editable: false,
            displayField: 'name',
            valueField: 'code',
            listeners: {
                select: function (combo, records, eOpts) {
                    var cmb_district = Ext.getCmp('cmb_district');
                    cmb_district.clearValue();
                    var cmb_tehsil = Ext.getCmp('cmb_tehsil');
                    cmb_tehsil.clearValue();
                    var selectedDivisionId = records.data.code;
                    me.olMapModel.extGridVM.getFeatureGeomFromDB('tbl_divisions', 'division_code', selectedDivisionId);
                    var districtStore = cmb_district.getStore();
                    districtStore.clearFilter();
                    store_tehsil.clearFilter();
                    districtStore.each(function (storeItem) {
                        if (storeItem.data.division_code === selectedDivisionId) {
                            cmb_district.store.filter("division_code", selectedDivisionId);
                        }
                    });
                }
            }
        });
        items.push(cmb_division);
        var cmb_district = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'District',
            id: 'cmb_district',
            emptyText: 'Choose District',
            store: store_district,
            margin: '10 10 10 10',
            queryMode: 'local',
            // editable: false,
            displayField: 'name',
            valueField: 'code',
            listeners: {
                select: function (combo, records, eOpts) {
                    var fId = records.data.code;
                    me.olMapModel.extGridVM.getFeatureGeomFromDB('tbl_districts', 'district_code', fId);
                    store_tehsil.clearFilter();
                    store_tehsil.each(function (storeItem) {
                        if (storeItem.data.district_code === fId) {
                            store_tehsil.filter("district_code", fId);
                        }
                    });
                    var cmb_tehsil = Ext.getCmp('cmb_tehsil');
                    cmb_tehsil.clearValue();
                }
            }
        });
        items.push(cmb_district);
        var cmb_tehsil = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'Tehsil',
            id: 'cmb_tehsil',
            emptyText: 'Choose Tehsil',
            store: store_tehsil,
            margin: '20 10 10 10',
            editable: false,
            displayField: 'name',
            valueField: 'abbr',
            listeners: {
                select: function (combo, records, eOpts) {
                    var fId = records.data.code;
                    me.olMapModel.extGridVM.getFeatureGeomFromDB('tbl_tehsils', 'tehsil_code', fId);

                }
            }
        });
        items.push(cmb_tehsil);
        var btn = Ext.create('Ext.Button', {
            text: 'Get Detail',
            // disabled:true,
            margin: '10 10 10 10',
            handler: function () {
                var town_code = Ext.getCmp('cmb_town').getValue();
                var district_id = Ext.getCmp('cmb_district').getValue();
                var layerName = Ext.getCmp('cmb_layer').getValue();
                if (layerName) {
                    // me.olMapModel.extGridVM.getAttributeDetail(town_code, district_id);
                    me.olMapModel.extGridVM.getAttributeTableFromDB(layerName, town_code, district_id);
                    // Get existing parameters collection
                    var lyr = me.olMapModel.getVectorLayerByName(layerName);
                    if (lyr) {
                        var districtStore = cmb_district.getStore();
                        if (town_code != null && district_id == null) {
                            var rows = districtStore.getData().getRange();
                            district_id = '';
                            for (var i = 0; i < rows.length; i++) {
                                var row = rows[i].data;
                                district_id = district_id + row.code + ','
                            }
                            district_id = district_id.slice(0, -1)

                        }
                        var params = lyr.getSource().getParams();
                        params.CQL_FILTER = "subdivision_code IN (" + district_id + ")";
                        if (district_id) {
                            lyr.getSource().updateParams(params);
                        }

                    }
                } else {
                    Ext.Msg.alert('Message', 'Please Choose Any Layer');
                }

            }
        });
        // items.push(btn);
        return items;
    };
    me.reportWin = null;
    me.createPhotoCountReportWindow = function () {
        var photoReportWin = Ext.getCmp("photoReportWin");
        if (photoReportWin) {
            photoReportWin.destroy();
        }
        var form = me.createPhotoCountReportForm();
        me.reportWin = Ext.create('Ext.window.Window', {
            id: 'photoReportWin',
            title: 'Photo Count Report',
            //   layout:'fit',
            // width: 500,
            // height: 500,
            closeAction: 'destroy',
            preventBodyReset: true,
            // maximizable: true,
            constrainHeader: true,
            collapsible: true,
            plain: true,
            items: form
            // items: [
            //     {
            //     xtype: 'datefield',
            //     label: 'Start date',
            //     width: 90,
            //     value: new Date(),
            //     name: 'report_from_date',
            //     // maxValue: new Date(),
            //     id: 'report_start_date',
            //     tooltip: "Start Date",
            //     format: 'd/m/Y',
            //     allowBlank: false,
            //
            //     listeners: {
            //         select: function (field, value, eOpts) {
            //             Ext.getCmp('report_end_date').setMinValue(value)
            //         }
            //     },
            //
            //     // fieldLabel: 'Start Date'
            // },
            //     {
            //         xtype: 'datefield',
            //         label: 'End date',
            //         value: new Date(),
            //         id: 'report_end_date',
            //         width: 90,
            //         tooltip: "End Date",
            //         format: 'd/m/Y',
            //         allowBlank: false,
            //         listeners: {
            //             select: function (field, value, eOpts) {
            //                 Ext.getCmp('report_start_date').setMaxValue(value)
            //             }
            //         },
            //     }
            // ]
        });
        me.reportWin.show();
    }
    me.createPhotoCountReportForm = function () {
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 5,
            width: 350,
            url: '/report_photo_count_xls/',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            // The fields
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'datefield',
                    fieldLabel: 'Report From Date',
                    width: 90,
                    value: new Date(),
                    name: 'report_from_date',
                    // maxValue: new Date(),
                    id: 'report_start_date',
                    tooltip: "Start Date",
                    format: 'd/m/Y',
                    allowBlank: false,
                    listeners: {
                        select: function (field, value, eOpts) {
                            Ext.getCmp('report_end_date').setMinValue(value)
                        }
                    },

                    // fieldLabel: 'Start Date'
                },
                {
                    xtype: 'datefield',
                    fieldLabel: 'Report To Date',
                    value: new Date(),
                    id: 'report_end_date',
                    name: 'report_end_date',
                    width: 90,
                    tooltip: "End Date",
                    format: 'd/m/Y',
                    allowBlank: false,
                    listeners: {
                        select: function (field, value, eOpts) {
                            Ext.getCmp('report_start_date').setMaxValue(value)
                        }
                    },
                }
            ],

            // Reset and Submit buttons
            buttons: [{
                text: 'Reset',
                handler: function () {
                    this.up('form').getForm().reset();
                }
            }, {
                text: 'Download Report',
                // formBind: true, //only enabled once the form is valid
                // disabled: true,
                handler: function () {
                    var from_date = Ext.getCmp('report_start_date').getValue();
                    var fm = from_date.getMonth() + 1;
                    from_date = from_date.getDate() + '-' + fm + '-' + from_date.getFullYear();
                    var to_date = Ext.getCmp('report_end_date').getValue();
                    var tm = to_date.getMonth() + 1;
                    to_date = to_date.getDate() + '-' + tm + '-' + to_date.getFullYear();
                    var url = '/report_photo_count_xls/?report_from_date=' + from_date + '&report_end_date=' + to_date;
                    // window.location.href = url;
                    if (me.reportWin) {
                        me.reportWin.destroy();
                    }
                    var win = window.open(url, '_blank');
                    win.focus();
                    // var form = this.up('form').getForm();
                    // if (form.isValid()) {
                    //     form.submit({
                    //         method: 'GET',
                    //         success: function (conn, response, options, eOpts) {
                    //             if (me.reportWin) {
                    //                 me.reportWin.destroy();
                    //             }
                    //         },
                    //         failure: function (conn, response, options, eOpts) {
                    //             if (me.reportWin) {
                    //                 me.reportWin.destroy();
                    //             }
                    //         }
                    //     });
                    // }
                    //

                }
            }],

        });
        return form;
    }
};

var ExtToolbarModel = function (mapExtVM, olMapModel) {
    var me = this;
    me.olMapModel = olMapModel;
    me.mapExtVM = mapExtVM;
    me.toolbar = [];
    me.getToolbar = function () {
        // if (me.toolbar.length)
        me.setNavigationToolbar();
        return me.toolbar;
    }

    me.setNavigationToolbar = function () {
        //Add New Layer button
        // var addNewLayerModel = new ExtAddNewLayerModel(me.olMapModel);
        // me.toolbar.push(addNewLayerModel.initialize());

        //Add Full Extent Button
        var btnFullExtent = Ext.create('Ext.Button', {
            // tooltip: 'Full Extent',
            icon: '/static/assets/img/icons/ZoomFullExtent.png',
            tooltip: "Zoom to max extent",
            // iconCls: 'fa fa-lg fa-globe',
            toggleGroup: 'navigation',
            handler: function () {
                // alert('You clicked the button!');
                me.olMapModel.setFullExtent();
                document.getElementById("map-panel").style.cursor = "default";
            }
        });
        me.toolbar.push(btnFullExtent);

        var btnZoomToRectangle = Ext.create('Ext.Button', {
            tooltip: "Zoom to Rectangle",
            icon: '/static/assets/img/icons/icon_zoomrect.gif',
            enableToggle: true,
            toggleGroup: 'navigation',
            toggleHandler: function (btn, state) {
                if (state == true) {
                    me.zoomRectInteraction = me.olMapModel.zoomToRectangle();
                    document.getElementById("map-panel").style.cursor = "zoom-in";
                } else {
                    me.olMapModel.removeInteraction(me.zoomRectInteraction)
                    document.getElementById("map-panel").style.cursor = "default";
                }
            }
        })
        me.toolbar.push(btnZoomToRectangle);

        var btnZoomIn = Ext.create('Ext.Button', {
            iconCls: 'fa fa-lg fa-search-plus',
            icon: '/static/assets/img/icons/icon_zoomin.gif',
            tooltip: "Zoom In",
            toggleGroup: 'navigation',
            handler: function () {
                // alert('You clicked the button!');
                me.olMapModel.zoomIn();
                document.getElementById("map-panel").style.cursor = "default";
            }
        });
        me.toolbar.push(btnZoomIn);

        var btnZoomOut = Ext.create('Ext.Button', {
            iconCls: 'fa fa-lg fa-search-minus',
            toggleGroup: 'navigation',
            icon: '/static/assets/img/icons/icon_zoomout.gif',
            tooltip: "Zoom Out",
            handler: function () {
                // alert('You clicked the button!');
                me.olMapModel.zoomOut();
                document.getElementById("map-panel").style.cursor = "default";
            }
        });
        me.toolbar.push(btnZoomOut);

        var btnPan = Ext.create('Ext.Button', {
            // text: "nav",
            icon: '/static/assets/img/icons/icon_pan.gif',
            tooltip: 'Pan',
            enableToggle: true,
            toggleGroup: 'navigation',
            toggleHandler: function (btn, state) {
                if (state == true) {
                    me.panInteraction = me.olMapModel.pan();
                    document.getElementById("map-panel").style.cursor = "grab";
                } else {
                    me.olMapModel.removeInteraction(me.panInteraction);
                    document.getElementById("map-panel").style.cursor = "default";
                }
            }
        });
        me.toolbar.push(btnPan);
        var btnIdentifier = Ext.create('Ext.Button', {
            // text: "nav",
            icon: '/static/assets/img/icons/icon_information.png',
            tooltip: 'Identify',
            enableToggle: true,
            toggleGroup: 'navigation',
            toggleHandler: function (btn, state) {
                if (state == true) {
                    me.selectInteraction = me.olMapModel.identifier();
                    document.getElementById("map-panel").style.cursor = "help";
                } else {
                    ol.Observable.unByKey(me.selectInteraction);
                    document.getElementById("map-panel").style.cursor = "default";
                    // me.olMapModel.removeInteraction(me.selectInteraction);
                }
            }
        });
        me.toolbar.push(btnIdentifier);
        var btnZoom2PerviousExtent = Ext.create('Ext.Button', {
            iconCls: 'fa fa-lg fa-arrow-left',
            tooltip: 'Zoom to pervious extent',
            icon: '/static/assets/img/icons/arrow_left.png',
            toggleGroup: 'navigation',
            disabled: true,
            handler: function () {
                // alert('You clicked the button!');
                document.getElementById("map-panel").style.cursor = "default";
                me.olMapModel.zoom2PreviousExtent();
            }
        });
        //    me.toolbar.push(btnZoom2PerviousExtent);

        var btnZoom2NextExtent = Ext.create('Ext.Button', {
            iconCls: 'fa fa-lg fa-arrow-right',
            tooltip: "Zoom to next extent",
            icon: '/static/assets/img/icons/arrow_right.png',
            toggleGroup: 'navigation',
            disabled: true,
            handler: function () {
                // alert('You clicked the button!');
                me.olMapModel.zoom2NextExtent();
                document.getElementById("map-panel").style.cursor = "default";
            }
        });

        //    me.toolbar.push(btnZoom2NextExtent);
        //    me.toolbar.push('-');
        var btnCurrentLocation = Ext.create('Ext.Button', {
            icon: '/static/assets/img/icons/current_location.png',
            tooltip: "Current Location",
            id: "btn-currentLocation",
            handler: function () {
                me.findMyCurrentLocation();
                document.getElementById("map-panel").style.cursor = "default";
            }

        });
        // if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // me.toolbar.push(btnCurrentLocation);
        // me.toolbar.push('-');
        // }
        var btnLengthMeasure = Ext.create('Ext.Button', {
            // text: "nav",
            icon: '/static/assets/img/icons/ruler.png',
            tooltip: 'Length Measurement',
            enableToggle: true,
            toggleGroup: 'navigation',
            toggleHandler: function (btn, state) {
                if (state == true) {
                    me.drawInteraction = me.olMapModel.measurement('length');
                } else {
                    me.olMapModel.removeInteraction(me.drawInteraction);
                }
            }
        });
        me.toolbar.push(btnLengthMeasure);

        var btnAreaMeasure = Ext.create('Ext.Button', {
            // text: "nav",
            icon: '/static/assets/img/icons/ruler_square.png',
            tooltip: 'Area Measurement',
            enableToggle: true,
            toggleGroup: 'navigation',
            toggleHandler: function (btn, state) {
                if (state == true) {
                    me.drawInteraction = me.olMapModel.measurement('area');
                } else {
                    me.olMapModel.removeInteraction(me.drawInteraction);
                }
            }
        });
        me.toolbar.push(btnAreaMeasure);
        me.toolbar.push('-');
        // var btnSelectFeature = Ext.create('Ext.Button', {
        //     //     text: "Select Measurement Feature",
        //     icon: '/static/assets/img/icons/propertyDetail.png',
        //     tooltip: "Select Measurement Feature",
        //     enableToggle: true,
        //     toggleGroup: 'navigation',
        //     toggleHandler: function (btn, state) {
        //         if (state == true) {
        //             me.btnRemove.setVisible(true);
        //             me.selectFeature = me.olMapModel.selectFeature();
        //             document.getElementById("map-panel").style.cursor = "default";
        //         } else {
        //             me.btnRemove.setVisible(false);
        //             me.olMapModel.removeInteraction(me.selectFeature);
        //             document.getElementById("map-panel").style.cursor = "default";
        //         }
        //     }
        //
        // });
        // me.toolbar.push(btnSelectFeature);
        // me.toolbar.push('-');
        // me.btnRemove = Ext.create('Ext.Button', {
        //     //     text: "Clear Selection",
        //     icon: '/static/assets/img/icons/delete.png',
        //     tooltip: "Remove Feature",
        //     hidden: true,
        //     handler: function () {
        //         var src = me.olMapModel.specialLayers["measurement"].getSource();
        //         if (me.olMapModel.selectInteraction) {
        //             me.olMapModel.selectInteraction.getFeatures().forEach(function (feature) {
        //                 src.removeFeature(feature);
        //                 me.olMapModel.selectInteraction.getFeatures().clear();
        //             });
        //             // src.removeFeature(me.olMapModel.selectedFeature);
        //         }
        //
        //     }
        // });
        // me.toolbar.push(me.btnRemove);
        // me.toolbar.push('-');
        var btnClear = Ext.create('Ext.Button', {
            //     text: "Clear Selection",
            icon: '/static/assets/img/icons/Clear.png',
            tooltip: "Clear Selection",
            handler: function () {
                me.olMapModel.clearSelection();
                document.getElementById("map-panel").style.cursor = "default";
                var layers = me.olMapModel.overlayLayers;
                for (var key in layers) {
                    var layer = layers[key];
                    var params = layer.getSource().getParams();
                    params.CQL_FILTER = null;
                    layer.getSource().updateParams(params);
                }
                me.olMapModel.refreshMap();
                var tblPnl = Ext.getCmp('mainSouthRegionId');
                if (me.olMapModel.extGridVM.attributeGrid) {
                    me.olMapModel.extGridVM.attributeGrid.getStore().removeAll();
                    tblPnl.collapse();
                }
                // var lyr = me.olMapModel.getVectorLayerByName(layerName);
                // if (lyr) {
                //     var params = lyr.getSource().getParams();
                //     params.CQL_FILTER = "subdivision_code=" + district_id;
                //     params.CQL_FILTER = null;
                //     lyr.getSource().updateParams(params);
                // }
            }
        });
        me.toolbar.push(btnClear);
        me.toolbar.push('-');
        var btnLocation = Ext.create('Ext.Button', {
            icon: '/static/assets/img/icons/location.png',
            tooltip: "Search Site for New Poultry Farm",
            text: "<b style='font-size: medium'>Search Site for Construction of a New Poultry Farm</b>",
            id: "btn-location",
            handler: function () {
                me.showGoToLatLongWindow();
            }

        });
        me.toolbar.push(btnLocation);
        me.toolbar.push('-');
        var searchStore = new Ext.data.Store({
            autoLoad: true,
            id: 'searchStore',
            storeId: 'searchStore',
            fields: ['index', 'address_line1']
        });
        var searchField = {
            xtype: 'combo',
            id: 'cmbSearchStore',
            // fieldLabel: 'Search',
            valueField: 'index',
            displayField: 'address_line1',
            store: searchStore,
            typeAhead: true,
            width: 300,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Select Place...',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                select: function (combo, records) {
                    var val = combo.getValue();
                    var data = Ext.getCmp('cmbSearchStore').getStore().getData().items;
                    var geom = data[val].data.geometry.coordinates
                    var iconFeature = me.addMarkerToMapByLatLong(geom[0], geom[1]);

                },
                keypress: function (el, e, eOpts) {
                    var val = el.getValue();
                    me.getSearchResult(val)
                },
                specialkey: function (el, e) {
                    if (e.keyCode === e.ENTER) {
                        var val = Ext.getCmp('cmbSearchStore').getValue();

                    }
                }
            },
            // xtype: 'textfield',
            // name: 'field1',
            // emptyText: 'search address',
            triggers:
                {
                    search: {
                        cls: 'x-form-search-trigger',
                        handler: function (field, trigger, e) {
                            var searchText = field.getValue();
                            me.getSearchResult(searchText);

                        },

                    }
                }
        };
        // me.toolbar.push(searchField);

        // var btnPrint = Ext.create('Ext.Button', {
        //     //     text: "Clear Selection",
        //     icon: '/static/assets/img/icons/print.png',
        //     tooltip: "Print Map",
        //     id: "export-pdf",
        //     handler: function () {
        //         me.printVM = new ExtPrintVM(me.mapExtVM.mapComponent, me.olMapModel);
        //         me.printVM.showPrintWindow();
        //     }
        //
        // });
        // me.toolbar.push(btnPrint);
        // me.toolbar.push('->');
        me.getSearchResult = function (searchText) {
            var requestOptions = {
                method: 'GET',
            };
            fetch("https://api.geoapify.com/v1/geocode/autocomplete?text=" + searchText + "&apiKey=a21a0fdaee834d02a9e6ed9e61e3a8d9", requestOptions)
                .then(response => response.json())
                .then(result => me.parseSearchResult(result.features))
                .catch(error => console.log('error', error));
        }
        me.parseSearchResult = function (result) {
            var data = [];
            for (var i = 0; i < result.length; i++) {
                var prop = result[i].properties
                var obj = {
                    "address_line1": prop.address_line1,
                    "index": i,
                    "geometry": result[i].geometry
                };
                data.push(obj)
            }
            var store = Ext.getCmp('cmbSearchStore').getStore();
            store.removeAll();
            store.data.clear();
            store.loadData(data, true);
            // store.loadData(data,true)
        };
        me.enableDisableExtentButton = function () {
            if (me.olMapModel.getSizeOfNextExtent() > 0) {
                btnZoom2NextExtent.setDisabled(false);
            } else {
                btnZoom2NextExtent.setDisabled(true);
            }
            if (me.olMapModel.getSizeOfPreviousExtent() > 0) {
                btnZoom2PerviousExtent.setDisabled(false);
            } else {
                btnZoom2PerviousExtent.setDisabled(true);
            }
        }
        me.olMapModel.getView().on('change:resolution', function () {
            me.enableDisableExtentButton();
        });
        me.olMapModel.getView().on('change:center', function () {
            me.enableDisableExtentButton();
        });

    }

    me.showGoToLatLongWindow = function () {
        var me = this;
        var extWin = Ext.getCmp("goTo");
        if (extWin) {
            extWin.destroy();
        }
        var win = Ext.create('Ext.window.Window', {
                id: 'goTo',
                title: 'Search Site for New Poultry Farm',
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
                    Ext.create('Ext.form.Panel', {
                        width: 300,
                        bodyPadding: 10,
                        items: [
                            {
                                xtype: 'numberfield',
                                anchor: '100%',
                                name: 'bottles',
                                id: 'fd-lat',
                                fieldLabel: 'Latitude',
                                decimalPrecision: 6,
                                emptyText: '31.5118868',
                                value: 31.5118868,
                                minValue: 0
                            },
                            {
                                xtype: 'numberfield',
                                anchor: '100%',
                                id: 'fd-long',
                                name: 'bottles',
                                fieldLabel: 'Longitude',
                                decimalPrecision: 6,
                                emptyText: '74.3333826',
                                value: 74.3333826,
                                minValue: 0
                            },
                            {
                                xtype: 'label',
                                style: {
                                    color: 'red',
                                    align: 'justify'
                                },
                                html: 'Disclaimer: Please, avoid selection of new site on public land or natural resources (Rivers, Canals, Mountains, Forests, Mining Area etc). For further detail, please visit <a target="_blank" href="/disclaimer/">Disclaimer Page</a>'
                            },
                        ],
                        buttons: [{
                            text: 'Go',
                            handler: function () {
                                var lat = Ext.getCmp('fd-lat').getValue();
                                var long = Ext.getCmp('fd-long').getValue();
                                var iconFeature = me.addMarkerToMapByLatLong(long, lat);
                                me.createBufferAroundPoint(iconFeature, 1000)
                            }
                        }]
                    })
                ]
            })
        ;
        win.show();
    };
    me.addMarkerToMapByLatLong = function (long, lat) {
        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'))
        });
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                src: "http://cdn.mapmarker.io/api/v1/pin?text=P&size=50&hoffset=1"
            }))
        });
        iconFeature.setStyle(iconStyle);
        var vectorSource = me.olMapModel.specialLayers["goToLocationLayer"].getSource();
        vectorSource.clear();
        vectorSource.addFeature(iconFeature);
        var extent = vectorSource.getExtent();
        me.olMapModel.map.getView().fit(extent, me.olMapModel.map.getSize());
        return iconFeature;
    }
    me.createBufferAroundPoint = function (pointFeature, radius) {
        var coord = pointFeature.getGeometry().getCoordinates();
        var bufferPopulationCircle = new ol.geom.Circle(coord, radius, 'XY');
        var circleFeature = new ol.Feature(bufferPopulationCircle);
        var bufferPoultryFarmCircle = new ol.geom.Circle(coord, 500, 'XY');
        var bufferPoultryFarmFeature = new ol.Feature(bufferPoultryFarmCircle);
        var vectorSource = me.olMapModel.specialLayers["bufferPopulationLayer"].getSource();
        vectorSource.clear();
        vectorSource.addFeature(circleFeature);
        vectorSource.addFeature(bufferPoultryFarmFeature);
        var extent = vectorSource.getExtent();
        me.olMapModel.map.getView().fit(extent, me.olMapModel.map.getSize());
        var lat = Ext.getCmp('fd-lat').getValue();
        var long = Ext.getCmp('fd-long').getValue();
        me.getPopulationCount(lat, long, radius);
    }
    me.getPopulationCount = function (lat, long, buffer_radious) {
        Ext.MessageBox.wait("Fetching data...", "Please wait");
        var url = "/gis/get_population_count/?lat=" + lat + "&long=" + long + "&r=" + buffer_radious;
        var requestName = "population_count";
        var requestData = JSON.stringify({
            'LAYER': 'population_count'
        });
        var requestManager = new RequestManager();
        requestManager.sendAJAXRequest(url, requestName, requestData, null, me.parsePopulationCountResponse, me.requestErrorHandler, me)
    };
    me.getPopulationCountByTaskId = function (task_id, pf_count) {
        Ext.MessageBox.wait("Fetching data...", "Please wait");
        var url = "/gis/get_population_count_by_taskid/?task_id=" + task_id + "&pf_count=" + pf_count;
        var requestName = "get_population_count_by_taskid";
        var requestData = JSON.stringify({
            'LAYER': 'get_population_count_by_taskid'
        });
        var requestManager = new RequestManager();
        requestManager.sendAJAXRequest(url, requestName, requestData, null, me.parsePopulationCountResponse, me.requestErrorHandler, me)
    };
    me.parsePopulationCountResponse = function (requestdata, result, etc, context) {
        Ext.MessageBox.hide();
        requestdata = JSON.parse(requestdata);
        var layerName = requestdata['LAYER'];
        var response = JSON.parse(result.responseText);
        if (response.code === 200) {
            if (response.is_in_punjab === true) {
                var data = response.data;
                if (data.status_code === 200) {
                    var pf_count = response.pf_count;
                    var pop_count = 0;
                    if (data.total_population) {
                        pop_count = data.total_population
                    }
                    if (response.is_in_rivers === false) {
                        me.showPFSuitAbility(pop_count, pf_count)
                    } else {
                        alert("Marked location is in rivers, please select some other location")
                    }


                } else {
                    alert(data.error_message)
                }
            }else{
                alert("Marked Location is out of Punjab Boundary");
            }
        }

    };
    me.requestErrorHandler = function (err) {
        alert("Error in request  = " + err)
    };
    me.showPFSuitAbility = function (pop_count, pf_count) {
        var me = this;
        var txt_result = 'On the basis of above values Site is not suitable for new poultry farm'
        var result_color = "red";
        if (pf_count === 0 && pop_count < 500) {
            txt_result = 'On the basis of above values Site is suitable for new poultry farm'
            result_color = "green"
        }
        var extWin = Ext.getCmp("pfWin");
        if (extWin) {
            extWin.destroy();
        }
        var win = Ext.create('Ext.window.Window', {
            id: 'pfWin',
            title: 'Poultry Farm Suitability',
            layout: 'fit',
            width: 420,
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
                Ext.create('Ext.form.Panel', {
                    width: 300,
                    bodyPadding: 10,
                    items: [{
                        xtype: 'label',
                        html: 'For new Poultry Farm suitability, only two aspects has been considered,<br> <br> (i) There would be no poultry farm within buffer of 1 km from the selected location <br> (ii) Population count within 500 meter from the suggested location not greater than 500. <br><br> Your values at the marked location are ..<br><br>'
                    },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Population Count',
                            name: 'theField',
                            value: parseInt(pop_count)
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Poultry Farm Count',
                            name: 'theField',
                            value: parseInt(pf_count)
                        },
                        {
                            xtype: 'label',
                            text: txt_result,
                            id: 'lbl_result'
                        },
                        {
                            xtype: 'label',
                            margin: '40 40 40 40',
                            text: ''
                        },
                        {
                            xtype: 'label',
                            text: 'Disclaimer: This tool is just for visualization, errors and omissions can be expected, so for checking of suitability site please visit office'
                        },
                    ],

                })
            ]
            // html: '<p>Population Count:<h1>' + parseInt(pop_count) + '</h1></p><h3>Poultry Farms Count:' + pf_count + '</h3>'
        });
        win.show();
        Ext.getCmp("lbl_result").setStyle({"color": result_color});
    };
    me.findMyCurrentLocation = function () {
        var geolocation = me.olMapModel.geolocation;
        me.olMapModel.geolocation.setTracking(true);
        geolocation.on('change', function () {
            var ac = geolocation.getAccuracy() + ' [m]';
        });
        geolocation.on('error', function (error) {
            // var info = document.getElementById('info');
            // info.innerHTML = error.message;
            // info.style.display = '';
        });
        var accuracyFeature = new ol.Feature();
        geolocation.on('change:accuracyGeometry', function () {
            accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
        });

        var positionFeature = new ol.Feature();
        positionFeature.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({
                    color: '#3399CC'
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 2
                })
            })
        }));

        geolocation.on('change:position', function () {
            var coordMin = geolocation.getPosition();
            var coordMax = geolocation.getPosition();
            if (coordMax.length > 0) {
                var extent = [coordMin[0], coordMin[1], coordMax[0], coordMax[1]];
                me.olMapModel.map.getView().fit(extent, me.olMapModel.map.getSize());
            }
            var coordinates = geolocation.getPosition();
            positionFeature.setGeometry(coordinates ?
                new ol.geom.Point(coordinates) : null);
        });
        var vectorSource = me.olMapModel.specialLayers["currentLocationLayer"].getSource();
        vectorSource.clear();
        vectorSource.addFeature(accuracyFeature);
        vectorSource.addFeature(positionFeature);
        var coord = geolocation.getPosition();
        if (coord && coord.length > 0) {
            var extent = [coord[0], coord[1], coord[0], coord[1]];
            me.olMapModel.map.getView().fit(extent, me.olMapModel.map.getSize());
        }
        // me.olMapModel.map.getView().setCenter(geolocation.getPosition());
        // var extent = vectorSource.getExtent();
        // if (isFinite(extent[0])) {
        //     me.olMapModel.map.getView().fit(extent, me.olMapModel.map.getSize());
        // }
    }

}

var ExtStatusbarModel = function (olMapModel) {
    var me = this;
    // me.setText = function (text){
    //     me.setStatusbar()
    // }
    me.getStatusbar = function () {
        if (!me.statusbar) me.setStatusbar();
        return me.statusbar
    }
    me.setStatusbar = function () {
        var map = olMapModel.getMap();
        var scalesStore = Ext.create('Ext.data.Store', {
            fields: ['scale'],
            data: [
                {"scale": "1000"},
                {"scale": "10000"},
                {"scale": "100000"},
                {"scale": "1000000"},
                {"scale": "10000000"},
                {"scale": "100000000"}
            ]
        });
        me.statusbar = Ext.create('Ext.ux.StatusBar', {
            statusAlign: 'right',
            items: [
                '-',
                {
                    id: 'lblLevel',
                    xtype: 'label',
                    align: 'left',
                    autoWidth: false,
                    text: ''
                },
                {xtype: 'tbspacer', width: 50},
                '-',
                {
                    id: 'lblLevelName',
                    xtype: 'label',
                    align: 'left',
                    autoWidth: false,
                    text: ''
                },
                {xtype: 'tbspacer', width: 50},
                '-',
                {
                    id: 'lblCount',
                    xtype: 'label',
                    align: 'right',
                    autoWidth: false,
                    text: ''
                },
                {xtype: 'tbfill'},

                Ext.create('Ext.form.ComboBox', {
                    //   fieldLabel: 'Scale',
                    store: scalesStore,
                    editable: true,
                    emptyText: 'Select Scale to Zoom',
                    id: 'scaleCombo',
                    queryMode: 'local',
                    displayField: 'scale',
                    valueField: 'scale',
                    listeners: {
                        select: function (combo, records) {
                            var scaleVal = combo.getValue();
                            scaleVal = parseInt(scaleVal);
                            var units = map.getView().getProjection().getUnits();
                            var dpi = 25.4 / 0.28;
                            var mpu = ol.proj.METERS_PER_UNIT[units];
                            var resolution = scaleVal / (mpu * 39.37 * dpi);
                            var zoom = map.getView().getZoomForResolution(resolution);
                            map.getView().setZoom(zoom);

                        },
                        specialkey: function (el, e) {
                            if (e.keyCode === e.ENTER) {
                                var scaleVal = Ext.getrCmp('scaleCombo').getValue();
                                // map.zoomToScale(scaleVal);
                            }
                        }
                    }
                }),

                '-',
                '<div id="mouse-position" class="custom-mouse-position"></div>',
                {
                    text: '',
                    xtype: 'label',
                    width: 5
                },

                {
                    id: 'mouse-position12',
                    text: 'A Button',
                    xtype: 'label',
                },


            ]
        })
    }
}


