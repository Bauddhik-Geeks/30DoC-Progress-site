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
    var rocketOverlay = document.getElementById('rocket-overlay');
    var inputEmail = document.getElementById('input_email');

    if (inputEmail.value == '') {
        alert('Please enter your email address');
    } else {
        var emailCheck = ValidateEmail(inputEmail.value);
        if (emailCheck == true) {
            if (!rocket.classList.contains('rocketlaunch')) {
                rocket.classList.add('rocketlaunch');
                rocketOverlay.style.opacity = '1';
                rocketOverlay.style.visibility = 'visible';

                setTimeout(function() {
                    rocketOverlay.style.opacity = '0';
                    rocketOverlay.style.visibility = 'hidden';

                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: inputEmail.value
                        }),
                    };
                    fetch('https://gecrajkot.herokuapp.com/find-Data', options)
                        .then(data => {
                            if (!data.ok) {
                                if (data.status == 400) {
                                    alert('Data not found! Please check your email again');
                                }
                                throw Error(data.status);

                            }
                            return data.json();
                        }).then(update => {
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
                                        if (update['track1'] == 6) {
                                            var colors = ["#8b5642", "#6a696b"];

                                            let i = 0;

                                            function frame1() {
                                                confetti({
                                                    particleCount: 2,
                                                    angle: 60,
                                                    spread: 55,
                                                    origin: { x: 0 },
                                                    colors: colors,
                                                });
                                                confetti({
                                                    particleCount: 2,
                                                    angle: 120,
                                                    spread: 55,
                                                    origin: { x: 1 },
                                                    colors: colors,
                                                });

                                                if (Date.now() < Date.now() + 15000) {
                                                    if (i < 30) {
                                                        requestAnimationFrame(frame1);
                                                        i++;
                                                    }
                                                }
                                            }
                                            frame1();
                                        }
                                    }
                                }, 10);

                                var trackAnimation2 = setInterval(function() {
                                    if (j < calcu2) {
                                        Track2.style.width = j + '%';
                                        j++;
                                    } else {
                                        clearInterval(trackAnimation2);
                                        if (update['track2'] == 6) {
                                            var colors = ["#8b5642", "#6a696b"];

                                            let i = 0;

                                            function frame2() {
                                                confetti({
                                                    particleCount: 2,
                                                    angle: 60,
                                                    spread: 55,
                                                    origin: { x: 0 },
                                                    colors: colors,
                                                });
                                                confetti({
                                                    particleCount: 2,
                                                    angle: 120,
                                                    spread: 55,
                                                    origin: { x: 1 },
                                                    colors: colors,
                                                });

                                                if (Date.now() < Date.now() + 15000) {
                                                    if (i < 30) {
                                                        requestAnimationFrame(frame2);
                                                        i++;
                                                    }
                                                }
                                            }
                                            frame2();
                                        }
                                    }
                                }, 10);

                                count1.innerText = update['track1'] + '/6 Quest Completed 🎉🎉';
                                count2.innerText = update['track2'] + '/6 Quest Completed 🎉🎉';
                            } else {
                                alert('Email not found');
                            }
                        }).catch(e => {
                        });
                }, 1000);
                setTimeout(function() {
                    rocket.classList.remove('rocketlaunch');
                }, 1500);
            } else {
            }
        } else {
            alert('You have entered an invalid email address!');
        }
    }
}

function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true);
    }
    return (false);
}

var prevButton1 = document.getElementsByClassName('lead_prev')[0];
var prevButton2 = document.getElementsByClassName('lead_prev')[1];
var nextButton1 = document.getElementsByClassName('lead_next')[0];
var nextButton2 = document.getElementsByClassName('lead_next')[1];
var leadRecCount = document.getElementById('lead_rec_num');
var leadList1 = document.getElementsByClassName('lead_list')[0];
var leadList2 = document.getElementsByClassName('lead_list')[1];



var leaderBoard;

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
};
fetch('https://gecrajkot.herokuapp.com//getAll', options)
    .then(data => {
        if (!data.ok) {
            throw Error(data.status);
        }
        return data.json();
    }).then(update => {

        document.getElementById('loader').style.opacity = '0';
        document.getElementById('loader').style.visibility = 'hidden';
        //console.log(update);
        leaderBoard = update;

        var pagination = 10;
        var paginationCount = 0;
        var buttonClick = 0;


        prevButton1.onclick = function() {
            let pageShow;
            if (buttonClick == 1) {
                pageShow = paginationCount - 10;
                if (paginationCount > 0) {
                    paginationCount -= (pagination + 10);
                }
            } else {
                pageShow = paginationCount;
                if (paginationCount > 0) {
                    paginationCount -= pagination;
                }
            }

            let countStart = 0;

            let funValue = paginationLoop(paginationCount, pageShow, countStart);
            countStart = funValue[2];

            if (countStart == 1) {
                leadList1.innerHTML = funValue[0];
                leadRecCount.innerHTML = (paginationCount + 1) + ' - ' + (funValue[1] + 1);
            }
            buttonClick = 0;
        }

        nextButton1.onclick = function() {
            let pageShow;
            if (buttonClick == 0) {
                pageShow = paginationCount + 10;
                if (paginationCount < leaderBoard['data'].length) {
                    paginationCount += (pagination + 10);
                }
            } else {
                pageShow = paginationCount;
                if (paginationCount < leaderBoard['data'].length) {
                    paginationCount += pagination;
                }
            }

            let countStart = 0;

            let funValue = paginationLoop(pageShow, paginationCount, countStart);
            countStart = funValue[2];

            if (countStart == 1) {
                leadList1.innerHTML = funValue[0];
                leadRecCount.innerHTML = (pageShow + 1) + ' - ' + (funValue[1] + 1);
            }
            buttonClick = 1;
        }

        function paginationLoop(num1, num2, num3) {

            let pageInsight;
            pageInsight = '';
            let lastCountValue;
            for (let i = num1; i < num2; i++) {
                if (i < leaderBoard['data'].length) {
                    num3 = 1;
                    pageInsight += '<li><div>' + leaderBoard['data'][i]['name'] + '</div><div class="lead_quest">' + leaderBoard['data'][i]['totalQuest'] + ' Quest Completed 🎉🎊' + '</div>' + '</li>';
                    lastCountValue = i;
                }
            }
            return [pageInsight, lastCountValue, num3];
        }

        var trigger1 = 0;

        if (trigger1 == 0) {
            let pageShow = paginationCount;
            if (paginationCount < leaderBoard['data'].length) {
                paginationCount += pagination;
            }
            let countStart = 0;

            let funValue = paginationLoop(pageShow, paginationCount, countStart);
            countStart = funValue[2];

            if (countStart == 1) {
                leadList1.innerHTML = funValue[0];
                leadRecCount.innerHTML = (pageShow + 1) + ' - ' + (funValue[1] + 1);
            }
            buttonClick = 1;

            trigger1 = 1;
        }

        var leaderBoard2 = [];
        var arrayCheck = 0;
        for (var i in leaderBoard['data']) {
            if (leaderBoard['data'][i]['totalQuest'] == 12) {
                leaderBoard2[arrayCheck] = leaderBoard['data'][i]['name'];
                arrayCheck++;
            }
        }

        /*** Completed ***/
        var paginationCount2 = 0;
        var buttonClick2 = 0;

        //console.log(leaderBoard2);

        prevButton2.onclick = function() {
            let pageShow;
            if (buttonClick2 == 1) {
                pageShow = paginationCount2 - 10;
                if (paginationCount2 > 0) {
                    paginationCount2 -= (pagination + 10);
                }
            } else {
                pageShow = paginationCount2;
                if (paginationCount2 > 0) {
                    paginationCount2 -= pagination;
                }
            }

            let countStart = 0;

            let funValue = paginationLoop2(paginationCount2, pageShow, countStart);
            countStart = funValue[2];

            if (countStart == 1) {
                leadList2.innerHTML = funValue[0];
                leadRecCount.innerHTML = (paginationCount2 + 1) + ' - ' + (funValue[1] + 1);
            }
            buttonClick2 = 0;
        }

        nextButton2.onclick = function() {
            let pageShow;
            if (buttonClick2 == 0) {
                pageShow = paginationCount2 + 10;
                if (paginationCount2 < leaderBoard2.length) {
                    paginationCount2 += (pagination + 10);
                }
            } else {
                pageShow = paginationCount2;
                if (paginationCount2 < leaderBoard2.length) {
                    paginationCount2 += pagination;
                }
            }

            let countStart = 0;

            let funValue = paginationLoop2(pageShow, paginationCount2, countStart);
            countStart = funValue[2];

            if (countStart == 1) {
                leadList2.innerHTML = funValue[0];
                leadRecCount.innerHTML = (pageShow + 1) + ' - ' + (funValue[1] + 1);
            }
            buttonClick2 = 1;
        }

        var trigger2 = 0;

        if (trigger2 == 0) {
            let pageShow = paginationCount2;
            if (paginationCount2 < leaderBoard2.length) {
                paginationCount2 += pagination;
            }

            let countStart = 0;

            let funValue = paginationLoop2(pageShow, paginationCount2, countStart);
            countStart = funValue[2];

            if (countStart == 1) {
                leadList2.innerHTML = funValue[0];
                leadRecCount.innerHTML = (pageShow + 1) + ' - ' + (funValue[1] + 1);
            }
            buttonClick2 = 1;
            trigger2 = 1;
        }

        window.addEventListener('load', function() {

        }, false);

        function paginationLoop2(num1, num2, num3) {

            let pageInsight;
            pageInsight = '';
            let lastCountValue;
            for (let i = num1; i < num2; i++) {
                if (i < leaderBoard2.length) {
                    num3 = 1;
                    pageInsight += '<li><div>' + leaderBoard2[i] + '</div><div class="lead_quest">' + '12 Quest Completed 🎉🎊' + '</div>' + '</li>';
                    lastCountValue = i;
                }
            }
            return [pageInsight, lastCountValue, num3];
        }

    }).catch(e => {
        console.log(e);
    });






/* window.onload = function() {

    let pageShow = paginationCount2;
    if (paginationCount2 < leaderBoard2.length) {
        paginationCount2 += pagination;
    }

    let countStart = 0;

    let funValue = paginationLoop2(pageShow, paginationCount2, countStart);
    countStart = funValue[2];

    if (countStart == 1) {
        leadList2.innerHTML = funValue[0];
        leadRecCount.innerHTML = (pageShow + 1) + ' - ' + (funValue[1] + 1);
    }
    buttonClick2 = 1;
} */






var leadActive = document.querySelectorAll('.lead_stat');
var leadShow = document.querySelectorAll('.lead_show');

/* for (let i = 0; i < leadActive.length; i++) {
    leadActive[i].onclick = function() {
        let j = 0;
        while (j < leadActive.length) {
            leadActive[j].className = 'lead_stat';
            leadShow[j].className = 'lead_show';
            j++;
        }
        leadActive[i].className = 'lead_stat lead_active';
        leadShow[i].className = 'lead_show lead_active';
    }
} */

$("#active_class_1").click(function() {
    $("#lead_show_2").hide();
    $("#lead_show_1").fadeIn();
    $('#active_class_1').addClass('lead_active');
    $('#active_class_2').removeClass('lead_active');
    /* $(".lead_show").show(); */
});

$("#active_class_2").click(function() {
    $("#lead_show_1").hide();
    $("#lead_show_2").fadeIn();
    $('#active_class_2').addClass('lead_active');
    $('#active_class_1').removeClass('lead_active');
    /* $(".lead_show").show(); */
});