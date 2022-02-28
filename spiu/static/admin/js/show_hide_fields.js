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
    });

})(django.jQuery);