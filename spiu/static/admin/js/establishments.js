(function ($) {
    $(document).ready(function () {
        $('.selectpicker').selectpicker('refresh');
        $(function () {
            var selectField = $('#id_approval_operational_phase'),
                verified = $('.field-operational_phase_approval_date');

            function toggleVerified(value) {
                if (value === 'Yes' || value === 'Under Process') {
                    verified.show();
                } else {
                    verified.hide();
                }
            }

            // show/hide on load based on existing value of selectField
            toggleVerified(selectField.val());

            // show/hide on change
            selectField.change(function () {
                toggleVerified($(this).val());
            });
        });
        $(function () {
            var selectField = $('#id_approval_construction_phase'),
                verified = $('.field-construction_phase_approval_date');
            var operational_field = $('.field-approval_operational_phase');
            var operational_date = $('.field-operational_phase_approval_date');

            function toggleVerified(value) {
                if (value === 'Yes') {
                    verified.show();
                    operational_field.show();
                    operational_date.show();
                } else if (value === 'Under Process') {
                    verified.show();
                    operational_field.hide();
                    operational_date.hide();
                } else {
                    verified.hide();
                    operational_field.hide();
                    operational_date.hide();
                }
            }

            // show/hide on load based on existing value of selectField
            toggleVerified(selectField.val());

            // show/hide on change
            selectField.change(function () {
                toggleVerified($(this).val());
            });
        });
        $('#id_main_category').on('change', function (e) {
            var val = $('#id_main_category').val();
            if (val !== "") {
                var url = "/gis/get_categories_list/?main_category=" + val;
                $('#id_category').empty();
                $.ajax({
                    url: url,
                    success: function (data, status, xhr) {
                        $('#id_category').append('<option>Select One</option>');
                        data = JSON.parse(data);
                        if (data.length > 0) {
                            for (var key in data) {
                                var prop = data[key];
                                var txtOption = '<option value="' + prop.id + '"';
                                txtOption += '>' + prop.name + '</option>';
                                $('#id_category').append(txtOption);
                            }
                        }
                        $('.selectpicker').selectpicker('refresh');
                    },
                    error: function (xhr, status, error) {

                    }
                });
            }
        });
        $('#id_category').on('change', function (e) {
            var val = $('#id_category').val();
            if (val !== "") {
                var url = "/gis/get_category_detail/?category=" + val;
                $.ajax({
                    url: url,
                    success: function (data, status, xhr) {
                        data = JSON.parse(data);
                        if (data.length > 0) {
                            var label = data[0].capacity_unit;
                            $('#id_capacity')[0].labels[0].innerText = label;
                        }
                        $('.selectpicker').selectpicker('refresh');
                    },
                    error: function (xhr, status, error) {

                    }
                });
            }
        });
    });

})(django.jQuery);