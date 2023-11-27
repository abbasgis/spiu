$(document).ready(function () {
    const geolocationMap = new GeolocationMap();
    let combinedArray = [];

    function readURL(input) {
        combinedArray = [...combinedArray, ...input.files];
        input.files = createFileList(combinedArray);
        // Clear the selected files array
        $('#image-preview-container').empty(); // Clear previous previews
        if (combinedArray.length > 0) {
            for (let i = 0; i < combinedArray.length; i++) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    let previewItem = $('<div>').addClass('preview-item');
                    let img = $('<img>').attr('src', e.target.result).addClass('preview-image');
                    let removeBtn = $('<button>').text('Remove').addClass('btn btn-sm btn-danger remove-btn');
                    // Add click event to remove button
                    removeBtn.click(function () {
                        $(this).parent().remove();
                        combinedArray.splice(combinedArray.indexOf(combinedArray[i]), 1);
                        input.files = createFileList(combinedArray);
                    });

                    // Center the remove button under the image using flexbox
                    let container = $('<div>').addClass('preview-container-item');
                    container.append(img).append(removeBtn);
                    previewItem.append(container);
                    $('#image-preview-container').append(previewItem);
                    // selectedFiles.push(input.files[i]);
                };
                reader.readAsDataURL(combinedArray[i]);
            }
        }
    }

    function createFileList(filesArray) {
        let dataTransfer = new DataTransfer();
        filesArray.forEach(function (file) {
            dataTransfer.items.add(file);
        });
        return dataTransfer.files;
    }

    // File input change event
    $('#id_images').change(function () {
        readURL(this);
    });

    // Add more images button
    // $('#add-more-images').click(function () {
    //     let input = $('#id_images');
    //     // Append the new input to the form
    //     $('#id_images').after(input);
    // });
})

class GeolocationMap {
    isLocationUpdated = false

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
        this.addLocationLayerToMap(this.map)

    }

    setupEventListeners() {
        let me = this;
        // $('#track').on('change', () => {
        //     this.geolocation.setTracking($('#track').prop('checked'));
        // });
        me.map.on('click', function (event) {
            // Get the clicked coordinate
            let clickedCoord = event.coordinate;
            me.addSelectedFeatureToLayer(clickedCoord[0], clickedCoord[1])
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
        let me = this;
        const position = this.geolocation.getPosition();
        if (position) {
            this.view.setCenter(position);
            this.view.setZoom(14); // You can adjust the zoom level as needed
            if (!me.isLocationUpdated) {
                $('#id_latitude').val(position[1]);
                $('#id_longitude').val(position[0]);
            }
            // me.addSelectedFeatureToLayer(position[0], position[1])
        }
    }

    addLocationLayerToMap = function (map) {
        let me = this;
        me.selectionLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png',  // Specify the path to your red pin icon image
                    anchor: [0.5, 1],  // Adjust the anchor point if needed
                    scale: 0.5,  // Adjust the scale factor if needed
                    className: 'animated-icon'
                })

            }),
        })
        map.addLayer(me.selectionLayer);
    }
    addSelectedFeatureToLayer = function (longitude, latitude) {
        let me = this;
        let selectedMarker = new ol.Feature({
            geometry: new ol.geom.Point([longitude, latitude]),
        });
        // selectedMarker.setId(obj.id);
        me.selectionLayer.getSource().clear();
        me.selectionLayer.getSource().addFeature(selectedMarker);
        $('#id_latitude').val(latitude);
        $('#id_longitude').val(longitude);
        me.isLocationUpdated = true;
    }

}


