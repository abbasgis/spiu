$(document).ready(function () {
    const geolocationMap = new GeolocationMap();
});

class GeolocationMap {
    constructor() {
        this.view = new ol.View({
            center: [0, 0],
            zoom: 2,
            projection: ol.proj.get('EPSG:4326')
        });
        const googleMapsLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                projection: 'EPSG:3857',
                maxZoom: 19
            })
        });
        this.map = new ol.Map({
            layers: [
                googleMapsLayer
            ],
            target: 'map',
            view: this.view,
        });

        this.geolocation = new ol.Geolocation({
            trackingOptions: {
                enableHighAccuracy: true,
            },
            projection: this.view.getProjection(),
        });
        this.geolocation.setTracking(true);
        this.setupEventListeners();
    }

    setupEventListeners() {
        $('#track').on('change', () => {
            this.geolocation.setTracking($('#track').prop('checked'));
        });

        this.geolocation.on('change', () => {
            this.zoomToUserLocation()
            // $('#accuracy').text(this.geolocation.getAccuracy() + ' [m]');
            // $('#altitude').text(this.geolocation.getAltitude() + ' [m]');
            // $('#altitudeAccuracy').text(this.geolocation.getAltitudeAccuracy() + ' [m]');
            // $('#heading').text(this.geolocation.getHeading() + ' [rad]');
            // $('#speed').text(this.geolocation.getSpeed() + ' [m/s]');
        });

        this.geolocation.on('error', (error) => {
            const info = $('#info');
            info.html(error.message);
            info.show();
        });

        const accuracyFeature = new ol.Feature();
        this.geolocation.on('change:accuracyGeometry', () => {
            accuracyFeature.setGeometry(this.geolocation.getAccuracyGeometry());
        });

        const positionFeature = new ol.Feature();
        positionFeature.setStyle(
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({
                        color: '#3399CC',
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 2,
                    }),
                }),
            })
        );

        this.geolocation.on('change:position', () => {
            const coordinates = this.geolocation.getPosition();
            positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
            this.zoomToUserLocation()
        });

        new ol.layer.Vector({
            map: this.map,
            source: new ol.source.Vector({
                features: [accuracyFeature, positionFeature],
            }),
        });
    }

    zoomToUserLocation() {
        const position = this.geolocation.getPosition();
        if (position) {
            this.view.setCenter(position);
            this.view.setZoom(14); // You can adjust the zoom level as needed
            $('#id_latitude').val(position[1]);
            $('#id_longitude').val(position[0]);
        }
    }
}


