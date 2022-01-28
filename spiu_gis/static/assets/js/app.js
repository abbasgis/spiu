Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'GeoExt': '/static/external/geoext3-3.2.0/src',
        'Ext.ux': '/static/external/extjs-6.2.0/ux'
    }
});
Ext.require([
    'GeoExt.component.Map',
    'GeoExt.data.store.LayersTree',
    'Ext.ux.statusbar.StatusBar',
    'GeoExt.data.store.Features',
    'GeoExt.component.FeatureRenderer',
    'GeoExt.data.MapfishPrintProvider',
    'GeoExt.data.serializer.TileWMS',
    'GeoExt.data.serializer.Vector'
]);


/**
 * A plugin for Ext.grid.column.Column s that overwrites the internal cellTpl to
 * support legends.
 */
Ext.define('BasicTreeColumnLegends', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.basic_tree_column_legend',

    /**
     * @private
     */
    originalCellTpl: Ext.clone(Ext.tree.Column.prototype.cellTpl).join(''),

    /**
     * The Xtemplate strings that will be used instead of the plain {value}
     * when rendering
     */
    valueReplacementTpl: [
        '{value}',
        '<tpl if="this.hasLegend(values.record)"><br />',
        '<tpl for="lines">',
        '<img src="{parent.blankUrl}"',
        ' class="{parent.childCls} {parent.elbowCls}-img ',
        '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>"',
        ' role="presentation"/>',
        '</tpl>',
        '<img src="{blankUrl}" class="{childCls} x-tree-elbow-img">',
        '<img src="{blankUrl}" class="{childCls} x-tree-elbow-img">',
        '<img src="{blankUrl}" class="{childCls} x-tree-elbow-img">',
        '{[this.getLegendHtml(values.record)]}',
        '</tpl>'
    ],

    /**
     * The context for methods available in the template
     */
    valueReplacementContext: {
        hasLegend: function (rec) {
            var isChecked = rec.get('checked');
            var layer = rec.data;
            return isChecked && !(layer instanceof ol.layer.Group);
        },
        getLegendHtml: function (rec) {
            var layer = rec.data;
            var legendUrl = layer.get('legendUrl');
            if (!legendUrl) {
                legendUrl = 'https://geoext.github.io/geoext2/' +
                    'website-resources/img/GeoExt-logo.png';
                var fillColor = 'red';
                var stroke = 'yellow';
                var pointSize = 112;
                var strokeWidth = 2;
                return '';
                // return '<svg  width="150" height="40"><circle cx="75" cy="10" r="' + pointSize + '" stroke="' + stroke +
                //     '" stroke-width="' + strokeWidth + '" fill="' + fillColor + '" /> </svg>'
            } else {
                return '<img class="legend" src="' + legendUrl + '"  />';
            }

        }
    },

    init: function (column) {
        var me = this;
        if (!(column instanceof Ext.grid.column.Column)) {
            Ext.log.warn('Plugin shall only be applied to instances of' +
                ' Ext.grid.column.Column');
            return;
        }
        var valuePlaceHolderRegExp = /\{value\}/g;
        var replacementTpl = me.valueReplacementTpl.join('');
        var newCellTpl = me.originalCellTpl.replace(
            valuePlaceHolderRegExp, replacementTpl
        );

        column.cellTpl = [
            newCellTpl,
            me.valueReplacementContext
        ];
    }
});

Ext.onReady(function () {
  /*  (function () {
        var cors_api_host = 'cors-anywhere.herokuapp.com';
        var cors_api_url = 'https://' + cors_api_host + '/';
        var slice = [].slice;
        var origin = window.location.protocol + '//' + window.location.host;
        var open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
            var args = slice.call(arguments);
            var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
            if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
                targetOrigin[1] !== cors_api_host) {
                args[1] = cors_api_url + args[1];
            }
            return open.apply(this, args);
        };
    })();
*/

    // name: 'PMDFC-CORONA',
    // launch: function () {
    // proj4.defs("EPSG:32643", "+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs");
    Ext.tip.QuickTipManager.init();
    var layerExtVM = new MapExtVM();
    layerExtVM.initialize();
    $('.btnPhotoCountReport a').click(function (e) {
        e.preventDefault();
        layerExtVM.createPhotoCountReportWindow();
    });
    // }
});
