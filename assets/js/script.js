$(document).ready(function () {
    $('.only-numbers').on('input', function () {
        let value = $(this).val();
        let sanitizedValue = value.replace(/[^0-9.]/g, '');

        // Ensure only one decimal point is allowed
        let parts = sanitizedValue.split('.');
        if (parts.length > 2) {
            sanitizedValue = parts[0] + '.' + parts.slice(1).join('');
        }

        $(this).val(sanitizedValue);
    });

    $('.form-control:not(.green-inp)').prop('readonly', true);
});