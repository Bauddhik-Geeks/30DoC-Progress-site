var submitForm = document.getElementById('submit_form');
var userName = document.getElementById('user-name');
var userEmail = document.getElementById('user-email');
var Track1 = document.getElementById('progress-complete-1');
var Track2 = document.getElementById('progress-complete-2');
var count1 = document.getElementById('count1');
var count2 = document.getElementById('count2');

submitForm.onclick = function(e) {
    e.preventDefault();
    var rocket = document.getElementById('rocket');
    var inputEmail = document.getElementById('input_email');

    if (inputEmail.value == '') {
        /* alert('Please enter your email address'); */
    } else {
        /* alert('Great'); */

        if (!rocket.classList.contains('rocketlaunch')) {
            rocket.classList.add('rocketlaunch');
            rocket.style.opacity = '1';
            rocket.style.visibility = 'visible';

            setTimeout(function() {
                rocket.style.opacity = '0';
                rocket.style.visibility = 'hidden';
                console.log(inputEmail.value);

                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: inputEmail.value
                    }),
                };
                fetch('https://bit-bauddhik-geeks.herokuapp.com/find-Data', options)
                    .then(data => {
                        if (!data.ok) {
                            throw Error(data.status);
                        }
                        return data.json();
                    }).then(update => {
                        //console.log(update);
                        if (update['email'] == inputEmail.value) {
                            document.getElementById('details-show').style.display = 'block';
                            userName.innerText = update['name'];
                            userEmail.innerText = update['email'];
                            let calcu1 = Math.round((update['track1'] / 6) * 100) + 5;
                            let calcu2 = Math.round((update['track2'] / 6) * 100) + 5;
                            let i = 2;
                            let j = 2;

                            var trackAnimation1 = setInterval(function() {
                                if (i < calcu1) {
                                    Track1.style.width = i + '%';
                                    i++;
                                } else {
                                    clearInterval(trackAnimation1);
                                }
                            }, 10);

                            var trackAnimation2 = setInterval(function() {
                                if (j < calcu2) {
                                    Track2.style.width = j + '%';
                                    j++;
                                } else {
                                    clearInterval(trackAnimation2);
                                }
                            }, 10);

                            count1.innerText = update['track1'] + '/6 Quest Completed 🎉🎉';
                            count2.innerText = update['track2'] + '/6 Quest Completed 🎉🎉';
                        } else {
                            alert('Email not found');
                        }
                    }).catch(e => {
                        console.log(e);
                    });
            }, 1000);
            setTimeout(function() {

                rocket.classList.remove('rocketlaunch');
            }, 1500);
        } else {
            /* alert('Please select'); */
        }
    }
}