const Functions = {
    displayMessage: (message, status, inputElement=null) => {
        // deactivate spinner
        $('#spinner').css('opacity', '0');

        // display message
        if (status === 'fail') {
            $('#message').text(message).css({
                'background-color': 'rgb(220,80,80)',
                'opacity': '1'
            });
        } else if (status === 'error') {
            $('#message').text(message).css({
                'background-color': 'rgb(220,80,80)',
                'opacity': '1'
            });
        } else if (status === 'success') {
            $('#message').text(message).css({
                'background-color': 'rgb(80,220,80)',
                'opacity': '1'
            });

            // redirect
            return location.replace('http://localhost:8000/dashboard');
        }

        if (inputElement !== null) {
            // Clear input
            inputElement.val('');
        }

        setTimeout(() => {
            // Clear message off the screen
            $('#message').css('opacity', '0');
        }, 4000);
    }
};
