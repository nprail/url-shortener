$(document).ready(function () {
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    var formValidation = {
        rules: {
            custom: {
                required: false,
                minlength: 2
            },
            url: {
                required: true,
                url: true
            }
        }
    }

    $("#custom").change(function () {
        var formData = $('#form').serializeObject()
        $('.custom-link').text(formData.custom);

        $("#form").validate({
            rules: {
                custom: {
                    required: false,
                    minlength: 2
                }
            }
        });
    });

    $("#url").change(function () {
        $("#form").validate(formValidation);
    });

    $("#options").click(function () {
        if ($('.customize-link').is(":visible")) {
            $('.customize-link').hide();
        } else {
            $('.customize-link').show();
        }
    });

    $('#submit').on('click', function () {
        $("#form").validate(formValidation);
        var isvalid = $("#form").valid();
        if (isvalid) {
            var formData = $('#form').serializeObject();

            return $.ajax({
                url: '/d/api/links/shorten',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(formData),
                processData: 'application/json',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                success: function (result) {
                    $('#form').hide();
                    $('.success').show();

                    $('.shorturl').text(result._id);
                    var shortURLhref = $('a.shorturl-link').attr('href');
                    $('a.shorturl-link').attr('href', shortURLhref + result._id);
                },
                error: function (xhr, resp, text) {
                    $('.error-alert').show();
                    $('.error-text').text(text);
                }
            })
        }
    });
});
