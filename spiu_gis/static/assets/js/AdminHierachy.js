Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);

//we want to setup a model and store instead of using dataUrl

var AdminHierarchy = function (olMapModel) {
    var me = this;
    me.olMapModel = olMapModel;
    me.extGridVM = me.olMapModel.extGridVM;
    Ext.define('Task', {
        extend: 'Ext.data.TreeModel',
        fields: [
            {name: 'admin_name', type: 'string'},
            {name: 'parent_id', type: 'string'},
            {name: 'admin_level_name', type: 'string'},
            {name: 'id', type: 'int'}
        ]
    });
    me.lastFilterValue = "";
    me.getAdminHierarchyTree = function () {
        Ext.tip.QuickTipManager.init();
        me.store = Ext.create('Ext.data.TreeStore', {
            model: 'Task',
            proxy: {
                type: 'ajax',
                //the store will get the content from the .json file
                url: '/static/admin_tree.json'
            },
            folderSort: true
        });
        //Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a tree.TreePanel
        var tree = Ext.create('Ext.tree.Panel', {
                // title: 'Core Team Projects',
                // width: 500,
                // height: 300,
                // collapsible: true,
                // useArrows: true,
                id: 'grid_admin_tree',
                rootVisible: false,
                lines: true,
                store: me.store,
                plugins: 'gridfilters',
                listeners: {
                    itemdblclick: function (tree, record, index) {
                        me.getDetail(record);

                    }
                },
                // multiSelect: true,
                columns: [


                    {
                        xtype: 'treecolumn', //this is so we know which column will show the tree
                        text: 'Admin Level',
                        width: 280,
                        sortable: true,
                        dataIndex: 'admin_name',
                        filter: {
                            type: "string"
                        }

                    },
                    {
                        text: 'Info',
                        width: 20,
                        // locked: true,
                        // menuDisabled: true,
                        xtype: 'actioncolumn',
                        tooltip: 'Show Detail',
                        align: 'center',
                        icon: '/static/assets/img/icons/icon_information.png',
                        handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                            me.getDetail(record);
                        },
                    },

                    //     {
                    //     xtype: 'actioncolumn',
                    //     header: 'Zoom',
                    //     // dataIndex: 'id',
                    //     width: 20,
                    //     icon: '/static/assets/img/icons/icon_zoomin.gif',
                    //     handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                    //         Ext.Msg.alert('Editing' + (record.get('done') ? ' completed task' : ''), record.get('admin_name'));
                    //     },
                    //     // Only leaf level tasks may be edited
                    //     isDisabled: function (view, rowIdx, colIdx, item, record) {
                    //         return !record.data.leaf;
                    //     },
                    // },

                    //     {
                    //     text: 'Level',
                    //     width: 150,
                    //     dataIndex: 'admin_level_name',
                    //     sortable: true
                    // },
                ],
                dockedItems: [Ext.create('Ext.toolbar.Toolbar', {
                    dock: 'top',
                    items: [
                        // {
                        //     xtype: 'textfield',
                        //     width: 100,
                        //     emptyText: 'Search LG Name',
                        //     // fieldLabel: 'Name',
                        //     // labelAlign: 'right',
                        //     id: 'name',
                        //     listeners: {
                        //         change: function (field, value) {
                        //             me.filterAdminTreeGrid('admin_name', value);
                        //         }
                        //     },
                        // }, '-',
                        {
                            xtype: 'textfield',
                            // dock: 'top',
                            width: 100,
                            emptyText: 'Search',
                            enableKeyEvents: true,
                            triggers: {
                                clear: {
                                    cls: 'x-form-clear-trigger',
                                    handler: 'onClearTriggerClick',
                                    hidden: true,
                                    scope: 'this'
                                },
                                search: {
                                    cls: 'x-form-search-trigger',
                                    weight: 1,
                                    handler: 'onSearchTriggerClick',
                                    scope: 'this'
                                }
                            },
                            onClearTriggerClick: function () {
                                this.setValue();
                                me.store.clearFilter();
                                this.getTrigger('clear').hide();
                            },

                            onSearchTriggerClick: function () {
                                me.filterStore(this.getValue());
                            },

                            listeners: {
                                keyup: {
                                    fn: function (field, event, eOpts) {
                                        var value = field.getValue();

                                        // Only filter if they actually changed the field value.
                                        // Otherwise the view refreshes and scrolls to top.
                                        if (value == '') {
                                            field.getTrigger('clear').hide();
                                            me.filterStore(value);
                                            me.lastFilterValue = value;
                                        } else if (value && value !== me.lastFilterValue) {
                                            field.getTrigger('clear')[(value.length > 0) ? 'show' : 'hide']();
                                            me.filterStore(value);
                                            me.lastFilterValue = value;
                                        }
                                    },
                                    buffer: 300
                                },

                                render: function (field) {
                                    this.searchField = field;
                                },

                                scope: me
                            }
                        },
                        {

                            xtype: 'datefield',
                            label: 'Start date',
                            width: 90,
                            value: new Date(),
                            name: 'from_date',
                            // maxValue: new Date(),
                            id: 'start_date',
                            tooltip: "Start Date",
                            format: 'd/m/Y',
                            allowBlank: false,

                            listeners: {
                                select: function (field, value, eOpts) {
                                    Ext.getCmp('end_date').setMinValue(value)
                                }
                            },

                            // fieldLabel: 'Start Date'
                        },
                        {
                            xtype: 'datefield',
                            label: 'End date',
                            value: new Date(),
                            id: 'end_date',
                            width: 90,
                            tooltip: "End Date",
                            format: 'd/m/Y',
                            allowBlank: false,
                            listeners: {
                                select: function (field, value, eOpts) {
                                    Ext.getCmp('start_date').setMaxValue(value)
                                }
                            },
                        }, '-',
                        '-',
                    ]
                })]
            }
        );
        var tblPnl = Ext.getCmp('pnlEast');
        me.removeItemsFromPanel(tblPnl);
// tblPnl.expand();
        tblPnl.add(tree);


    };
    me.getDetail = function (record) {
        Ext.MessageBox.wait("Fetching data...", "Please wait");
        var lyr_name = record.get('name_from_table');
        var layer = me.olMapModel.getVectorLayerByName(lyr_name);
        me.olMapModel.getFeatureInfoFromGeoServer(null, layer, record.get('code_from_table'));
        var start_date = Ext.getCmp('start_date').getValue();
        start_date = me.convertDateFormat(start_date);
        var end_date = Ext.getCmp('end_date').getValue();
        end_date = me.convertDateFormat(end_date);
        me.extGridVM.populateattribuesGrid([], null);
        me.extGridVM.getSurveyDetailFromDB("tbl_lgs_survey", record.get('id'), start_date, end_date, null);
        // me.extGridVM.getAttributeTableFromDB("tbl_lgs_survey", record.get('id'));

    };
    me.convertDateFormat = function (d) {
        var fm = d.getMonth() + 1;
        d = d.getDate() + '-' + fm + '-' + d.getFullYear();
        return d;
    };
    me.filterAdminTreeGrid = function (property, value) {
        var grid = Ext.getCmp('grid_admin_tree');
        if (grid.store.filters) {
            grid.store.filters.each(function (item) {
                if (item.property === property) {
                    grid.store.removeFilter(item);
                }
            })
        }
        ;
        if (value) {

            var matcher = new RegExp(Ext.String.escapeRegex(value), "i");
            grid.store.addFilter({
                filterFn: function (record) {
                    return matcher.test(record.get(property));
                }
            });
            grid.store.filters.getAt(grid.store.filters.length - 1).property = property;
        }
    };
    me.removeItemsFromPanel = function (panel) {
        for (var i = 0; i < panel.items.items.length; i++) {
            panel.remove(panel.items.keys[i], true);
        }
        panel.updateLayout();
    };
    me.filterStore = function (value) {
        var me = this,
            store = me.store,
            searchString = value.toLowerCase(),
            filterFn = function (node) {
                var children = node.childNodes,
                    len = children && children.length,
                    visible = v.test(node.get('admin_name')),
                    i;

                // If the current node does NOT match the search condition
                // specified by the user...
                if (!visible) {

                    // Check to see if any of the child nodes of this node
                    // match the search condition.  If they do then we will
                    // mark the current node as visible as well.
                    for (i = 0; i < len; i++) {
                        if (children[i].isLeaf()) {
                            visible = children[i].get('visible');
                        } else {
                            visible = filterFn(children[i]);
                        }
                        if (visible) {
                            break;
                        }
                    }

                } else { // Current node matches the search condition...

                    // Force all of its child nodes to be visible as well so
                    // that the user is able to select an example to display.
                    for (i = 0; i < len; i++) {
                        children[i].set('visible', true);
                    }

                }

                return visible;
            },
            v;

        if (searchString.length < 1) {
            store.clearFilter();
        } else {
            v = new RegExp(searchString, 'i');
            store.getFilters().replaceAll({
                filterFn: filterFn
            });
        }
    };

    me.strMarkRedPlus = function (search, subject) {
        return subject.replace(
            new RegExp('(' + search + ')', "gi"), "<span style='color: red;'><b>$1</b></span>");
    };
}