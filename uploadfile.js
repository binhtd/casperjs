/**
 * Created by binhtd on 30/08/2016.
 */
// testscript.js
var webpage = require('webpage'),
    system = require('system'),
    fname;

if (system.args.length !== 2) {
    console.log('Usage: uploadtest.js filename');
    phantom.exit(1);
} else {
    fname = system.args[1];
    var page = webpage.create();

    page.onConsoleMessage = function(msg) {
        console.log(msg);
    };

    page.open("https://encodable.com/uploaddemo/", function (status) {
        console.log("Page opened, ready to upload file.  Status is", status);
        page.uploadFile('input[name=uploadname1]', fname);
        page.evaluate(function () {
            document.forms[0].submit();
        });
        window.setTimeout(function () {
            phantom.exit();
        }, 3000);
    });
}

$(document).ready(function () {

    // File upload handler to show the progress-bar, name of the file being
    // uploaded and
    // calls the validation method or error dialog box depending on the results
    $('#fileupload').fileupload({
            maxNumberOfFiles: 1,
            url: $('#fileUploadUrl').val(),
            dataType: 'json',

            add: function (e, data) {
                var uploadFile = data.files[0];
                $('#submit-btn').attr('disabled', true);

                if (!GLOBAL_SUPPORTED_FILENAMES_REGEX.test(uploadFile.name)) {
                    var ext = uploadFile.name.match(/\.[^\.]+$/);
                    data.files.pop();
                    // Displays File Extenstion Error modal window
                    $('#fileExtError').modal('show');
                    $('#terms').hide();
                } else {
                    $('#file_upload_status').fadeIn();
                    data.submit();
                    $('#fileupload').focus();
                }
            },
            submit: function (e, data) {
                $('#file-status-table').hide();
                $('#upload-file-name').html('');
                $('#progress .progress-bar').css('width', 0).html('').removeClass('progress-bar-success progress-bar-danger');
                $('#upload-valid').html('');

                $.each
                (
                    data.files, function (index, file) {
                        $('#upload-file-name').html(file.name);
                    }
                );
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10) + '%';
                $('#progress .progress-bar').css('width', progress).html(progress);
            },
            done: function (e, data) {
                if (data.result.error == null) {
                    afterUploadSuccessful(data);
                    $('#file-status-table').fadeIn();
                    $('#file-status-table').html('Please wait...');
                    $('#progress .progress-bar').addClass('progress-bar-success');
                }
                else {
                    if (data.result.message_code === null) {
                        data.result.message_code = 'transfer-failed';
                    }
                    $('#file-status-table').fadeIn();
                    $('#file-status-table').html(data.result.error);
                    $('#upload-valid').html('Error');
                    $('#progress .progress-bar').addClass('progress-bar-danger');
                    try {
                        ga('send', 'event', 'FILE_UPLOAD', 'FAILURE', window.google_analytics_unique_id + "|" + data.result.error);
                    } catch (err) {
                        console.log(err);
                    }

                }
            }
        }
    );

    // Enable browse button only on selecting the company that provided the file
    $('select[name=file-provider]').change(function () {
        if (this.selectedIndex >= 0) {

            $('#fileupload').removeAttr('disabled');
            $('.fileUploadDiv').removeClass('custom-disabled');
        }
    });
    // Display the name of uploaded file inside textbox
    $('#fileupload').change(function () {
        var filename = $(this).val().split('\\').pop();
        $('#uploadFile').val(filename);
    });
});


function afterUploadSuccessful() {
    $('#file-status-table').hide();

    $.ajax
    (
        {
            beforeSend: function () {
                $('#upload-valid').html('Validation Started ..');
            },
            cache: false,
            dataType: 'json',
            type: 'GET',
            url: $('#fileUploadUrlAfterSuccess').val(),
            success: function (data) {
                if (data.error === null && data.data !== false) {
                    $('#upload-valid').text('Uploaded');
                    $('#file-status-table').html(data.data).fadeIn();
                    afterUploadIsValidated(data.has_solar);
                    try {
                        ga('send', 'event', 'FILE_UPLOAD', 'SUCCESS', window.google_analytics_unique_id);
                    } catch (err) {
                        console.log(err);
                    }
                }
                else {
                    $('#progress .progress-bar').removeClass('progress-bar-success')
                        .addClass('progress-bar-danger');
                    if (data.error === null) {
                        data.error = "File format is not appropriate for this portal. Please try again using a valid file or go back and create an estimated Power Profile.";
                    }
                    if (data.message_code === null) {
                        data.message_code = 'validation-error-unknown';
                    }
                    $('#upload-valid').text('Error');
                    $('#file-status-table').html(data.error).fadeIn();
                    $('#terms').hide();
                    try {
                        ga('send', 'event', 'FILE_UPLOAD', 'FAILURE', window.google_analytics_unique_id + "|" + data.error);
                    } catch (err) {
                        console.log(err);
                    }
                }
            },
            error: function (data, textStatus) {
                $('#upload-valid').text('Error');
                $('#file-status-table').html(GLOBAL_UPLOAD_ERROR_MESSAGE).fadeIn();
                try {
                    ga('send', 'event', 'FILE_UPLOAD', 'FAILURE', window.google_analytics_unique_id + "|" + GLOBAL_UPLOAD_ERROR_MESSAGE);
                } catch (err) {
                    console.log(err);
                }
            }
        }
    );
}


this.evaluate(function(){
    var action = 'upload.php'
    var html = '<form action="'+action+'" method="post" enctype="multipart/form-data">'
    html += '<input type="file" name="files[]" multiple="multiple">'
    html += '<button type="submit">Submit</button>'
    html += '</form>'
    document.write(html)
})

this.fill('form',{
    'files[]': 'MyUsageData_06-05-2016.csv'
}, true)