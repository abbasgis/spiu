(function ($) {
    $(document).ready(function () {
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
    });

})(django.jQuery);