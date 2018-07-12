$(document).ready(() => {
    $('#register').click((e) => {
        e.preventDefault();

        // activate spinner
        $('#spinner').css('opacity', '1');

        const url = 'https://vla-training.herokuapp.com/dashboard';

        const data = {};

        if ($('#attendanceCode').val().length === 0) {
            return Functions.displayMessage('Please input the attendance code you recieved', 'fail');
        }

        data.attendanceCode = $('#attendanceCode').val();

        const dataToServer = {
            method: 'PUT',
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
                return Functions.displayMessage(res.message, res.status, $('#attendanceCode'));
            });
    });

    $('#logout').click(() => {
        const url = 'https://vla-training.herokuapp.com/logout';

        const dataToServer = {
            method: 'POST',
            credentials: 'include'
        }

        fetch(url, dataToServer)
            .then(res => res.json())
            .then((res) => {
                if (res.status === 'success') {
                    return location.replace('https://vla-training.herokuapp.com/login');
                }
            });
    });
});
