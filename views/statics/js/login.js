$(document).ready(() => {
    $('#phoneNumberLogin').click(() => {
        $('#phoneNumberLogin').hide();
        $('#staffIdDiv').hide();
        $('#staffId').attr('disabled', true); // disable input

        $('#staffIdLogin').show();
        $('#phoneNumberDiv').show();
        $('#phoneNumber').removeAttr('disabled');
    });

    $('#staffIdLogin').click(() => {
        $('#staffIdLogin').hide();
        $('#phoneNumberDiv').hide()
        $('#phoneNumber').attr('disabled', true);

        $('#phoneNumberLogin').show();
        $('#staffIdDiv').show()
        $('#staffId').removeAttr('disabled');
    });

    $('#login').click((e) => {
        e.preventDefault();

        // activate spinner
        $('#spinner').css('opacity', '1');

        const url = 'http://localhost:8000/login';

        const data = {};

        if ($('#staffId').is("[disabled]")) {
            if ($('#phoneNumber').val().length === 0) {
                return Functions.displayMessage('Please input your phone number', 'fail');
            }
            data.phoneNumber = $('#phoneNumber').val();
        } else if ($('#phoneNumber').is("[disabled]")) {
            if ($('#staffId').val().length === 0) {
                return Functions.displayMessage('Please input your VLA staff ID', 'fail');
            }
            data.staffId = $('#staffId').val();
        }

        const dataToServer = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }

        fetch(url, dataToServer)
            .then(res => res.json())
            .then((res) => {
                return Functions.displayMessage(res.message, res.status);
            });
    });
});
