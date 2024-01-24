class ViewActivitiesMap {
    selectionLayer = null;

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
                googleMapsLayer,

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
                geometry: new ol.geom.Point([activity.longitude, activity.latitude]),
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
                me.addSelectedFeatureToLayer(activity)
                // alert(activity.id)

            } else {

            }
        });
        me.addSelectionLayerToMap(map)
        me.showDataInAttributeTable(markers, activityData);
    }
    showAttributesInPanel = function (data) {
        let me = this;
        // Get a reference to the 'attributes' div
        let attributesDiv = document.getElementById('attributes');
        let table = "<table class=\"table table-bordered\">\n" +
            "  <tbody>"
        for (let k in data) {
            let formattedKey = k.toUpperCase().replace(/_/g, ' ');
            formattedKey = formattedKey.replace('ACTIVITY', ' ');
            if (k === "district__district_name") {
                formattedKey = "District Name"
            }
            if (k === "created_by__username") {
                formattedKey = "Uploaded By"
            }

            table += " <tr>\n" +
                "      <th scope=\"row\">" + formattedKey + "</th>\n" +
                "      <td>" + data[k] + "</td>"
        }
        table += "</tbody>\n" +
            "</table>"
        attributesDiv.innerHTML = table;
        // let html = '<ul class="attributes-list">';
        // for (let key in data) {
        //     if (data.hasOwnProperty(key)) {
        //         let formattedKey = key.toUpperCase().replace(/_/g, ' ');
        //         html += '<li><strong>' + formattedKey + ':</strong> ' + data[key] + '</li>';
        //     }
        // }
        // html += '</ul>';
        // attributesDiv.innerHTML = html;
    }
    addSelectionLayerToMap = function (map) {
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
    addSelectedFeatureToLayer = function (obj) {
        let me = this;
        let selectedMarker = new ol.Feature({
            geometry: new ol.geom.Point([obj.longitude, obj.latitude]),
        });
        selectedMarker.setId(obj.id);
        me.selectionLayer.getSource().clear();
        me.selectionLayer.getSource().addFeature(selectedMarker);
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
    showDataInAttributeTable = function (markers, data) {
        let me = this;
        let table = $('#attr_table').DataTable({
            data: data,
            columns: [
                {data: 'id'},
                {data: 'district__district_name'},
                {data: 'activity_name'},
                {data: 'activity_address'},
                {data: 'created_at'},
            ],
            scrollY: '40vh', // Adjust the height as needed
            scrollCollapse: true,
            order: [[0, 'desc']],
            pageLength: 100,
        });
        $('#attr_table tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
            // $(this).toggleClass('selected');
            // Get data of the clicked row
            var rowData = table.row(this).data();
            // Log the data to the console (you can do something else with it)
            me.addSelectedFeatureToLayer(rowData)
            me.map.getView().animate({
                center: [rowData.longitude, rowData.latitude],
                zoom: 18, // Adjust the zoom level as needed
            });
            me.showAttributesInPanel(rowData);
            me.getPhotosFromDB(rowData.id);

        });

        // $('#button').click(function () {
        //     table.row('.selected').remove().draw(false);
        // });
    }
}


