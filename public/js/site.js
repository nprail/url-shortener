$(document).ready(function () {
    // click on button submit
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
                minlength: 4
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
                    minlength: 4
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
        var isvalid = $("#form").valid();
        if (isvalid) {
            var formData = $('#form').serializeObject()

            $.ajax({
                url: '/app/api/links/shorten', // url where to submit the request
                type: 'POST', // type of action POST || GET
                dataType: 'json', // data type
                data: JSON.stringify(formData), // post data || get data
                processData: 'application/json',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                success: function (result) {
                    console.log(result);
                    $('#form').hide();
                    $('.success').show();

                    $('.shorturl').text(result._id);
                    var shortURLhref = $('a.shorturl-link').attr('href');
                    $('a.shorturl-link').attr('href', shortURLhref + result._id);
                },
                error: function (xhr, resp, text) {
                    console.log(xhr, resp, text);
                }
            })
        }
    });
});
