class ViewActivitiesMap {
    constructor() {
        this.view = new ol.View({
            center: [74.3436, 31.5497],
            zoom: 7,
            projection: ol.proj.get('EPSG:4326')
        });
        const googleMapsLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
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
        this.addControls();

    }

    addControls() {
        // Create and add control instances
        const zoomControl = new ol.control.Zoom(); // Zoom control
        const scaleLineControl = new ol.control.ScaleLine(); // Scale Line control
        const fullScreenControl = new ol.control.FullScreen(); // Full Screen control

        // Add controls to the map
        this.map.addControl(zoomControl);
        this.map.addControl(scaleLineControl);
        this.map.addControl(fullScreenControl);

    }

    addDataToMap = function (me, activityData) {
        let map = me.map;
        let redPinStyle = new ol.style.Style({
            image: new ol.style.Icon({
                src: 'http://maps.google.com/mapfiles/kml/paddle/A.png',  // Specify the path to your red pin icon image
                anchor: [0.5, 1],  // Adjust the anchor point if needed
                scale: 0.5  // Adjust the scale factor if needed
            })
        });
        let markers = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: redPinStyle
        });
        activityData.forEach(function (activity) {
            let marker = new ol.Feature({
                geometry: new ol.geom.Point([activity.latitude, activity.longitude]),
            });
            marker.setId(activity.id);
            markers.getSource().addFeature(marker);
        });

        map.addLayer(markers);
        let markersExtent = markers.getSource().getExtent();
        map.getView().fit(markersExtent, {padding: [50, 50, 50, 50]});
        // Event listener for marker click
        map.on('click', function (evt) {
            let feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });
            if (feature) {
                let activity = activityData.find(function (activity) {
                    return activity.id === feature.getId();
                });
                me.showAttributesInPanel(activity)
                me.getPhotosFromDB(activity.id)
                // alert(activity.id)

            } else {

            }
        });

    }
    showAttributesInPanel = function (data) {
        let me = this;
        // Get a reference to the 'attributes' div
        let attributesDiv = document.getElementById('attributes');
        let html = '<ul class="attributes-list">';
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let formattedKey = key.toUpperCase().replace(/_/g, ' ');
                html += '<li><strong>' + formattedKey + ':</strong> ' + data[key] + '</li>';
            }
        }
        html += '</ul>';
        attributesDiv.innerHTML = html;
    }
    format_column_name = function () {

    }
    getPhotosFromDB = function (activityId) {
        let me = this;
        fetch('/pac/get_act_photos?activity_id=' + activityId)
            .then(response => response.json())
            .then(data => {
                // Handle the response from the backend and display the images
                me.displayImages(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    displayImages = function (data) {
        let photosContainer = document.getElementById('photos');
        photosContainer.innerHTML = ''; // Clear the container
        if (data.length > 0) {
            data.forEach(function (photo) {
                let img = document.createElement('img');
                img.src = photo.image_url;
                img.classList.add('photo-image');
                photosContainer.appendChild(img);

            });
        } else {
            photosContainer.innerHTML = 'No photos available.';
        }
    }

}


