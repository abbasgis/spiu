(function ($) {
    $(document).ready(function () {
        $(function () {
            // document.getElementsByName('_addanother')[0].style.display = 'none'
            let selectField = $('#id_report_title');
            let water_fields = ['sample_type', 'sampling_point', 'treatment_facility', 'treatment_facility_type',
                'process_generating_wastewater', 'discharge', 'sampling_date', 'sample_receiving_date', 'sample_id_no',
                'sample_received_from', 'sample_received_by', 'discharge_value', 'discharge_unit', 'capacity_of_wwtp',
                'capacity_unit'];
            let noise_fields = ['sampling_source', 'fuel_type', 'emission_control_system'];
            let wwtp_fields = ['sample_taken_stage']
            let air_fields = ['emission_control_system']

            function toggleFieldsVisibility(value) {
                for (let i in water_fields) {
                    let f_name = '.field-' + water_fields[i];
                    let field = $(f_name)
                    if (value === 'Air' || value === 'Noise') {
                        field.hide();
                        // field.val('Not Available')
                    } else {
                        field.show();
                    }
                }
                for (let i in noise_fields) {
                    let f_name = '.field-' + noise_fields[i];
                    let field = $(f_name)
                    if (value === 'Noise') {
                        field.hide();
                    } else {
                        field.show();
                    }
                }
                for (let i in wwtp_fields) {
                    let f_name = '.field-' + wwtp_fields[i];
                    let field = $(f_name)
                    if (value === 'WWTP') {
                        field.show();
                    } else {
                        field.hide();
                    }
                }
                for (let i in air_fields) {
                    let f_name = '.field-' + air_fields[i];
                    let field = $(f_name)
                    if (value === 'Air') {
                        field.show();
                    } else {
                        field.hide();
                    }
                }
            }

            // show/hide on load based on existing value of selectField
            toggleFieldsVisibility(selectField.val());

            // show/hide on change
            selectField.change(function () {
                toggleFieldsVisibility($(this).val());
            });
        });
    });

})(django.jQuery);