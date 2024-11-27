let countdownInterval;
let isRunning = false;
let roundTimeRemaining = 180; // Initial duration in seconds
let pauseTimePause = 120; // Initial duration in seconds
let round = 1;
let timeRemaining = 1;
let started = false;
let round1OutRed = 0;
let round1OutBlue = 0;



$('#applyConfig').click( function() {

    roundTimeRemaining = parseInt($('#roundTime').val(), 10);

    const minutes = String(Math.floor(roundTimeRemaining / 60)).padStart(2, '0');
    const seconds = String(roundTimeRemaining % 60).padStart(2, '0');
    timerElement = document.getElementById('timer');
    timerElement.textContent = `${minutes}:${seconds}`;

    pauseTimePause = parseInt($('#pauseTime').val(), 10);
    round = parseInt($('#roundCount').val(), 10);
    if (round === 1) {
        $('#round').text('Repriza 1');
    }else{
        $('#round').text('Repriza 2');
    }
});


function startCountdown() {

        let realRoundTimeRemaining = roundTimeRemaining - 1;
        let realPauseTimePause = pauseTimePause - 1;
        const timerElement = document.getElementById('timer');
        if(!started){
             timeRemaining = realRoundTimeRemaining;
        }
        if (round === 1) {
            $('#round').text('Repriza 1');
        }else{
            $('#round').text('Repriza 2');
        }

    countdownInterval = setInterval(() => {
        const minutes = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
        const seconds = String(timeRemaining % 60).padStart(2, '0');
        timerElement.textContent = `${minutes}:${seconds}`;
        if (timeRemaining <= 0) {
            if (round === 1) {
                timeRemaining = realPauseTimePause;
                isRunning = true;

                $('#round').text('Pauza');
                round = 0;

                let round1OutRedCount = parseFloat($('span.outInfo.Red').text());

                if (round1OutRedCount === 4) {
                    round1OutRed = 2;
                }

                if (round1OutRedCount === 3) {
                    round1OutRed = 1;
                }

                $('span.outInfo.Red').text(0);
                let round1OutBlueCount =   parseFloat($('span.outInfo.Blue').text());

                if (round1OutBlueCount === 4) {
                    round1OutBlue = 2;
                }

                if (round1OutBlueCount === 3) {
                    round1OutBlue = 1;
                }
                $('span.outInfo.Blue').text(0);
            } else if (round === 0) {
                $('#round').text('Repriza 2');
                timeRemaining = realRoundTimeRemaining;
                round = 2;
            }else{

                isRunning = false;
                clearInterval(countdownInterval);
            }
        } else {
            timeRemaining--;
        }
    }, 1000);
}

$('#startStopButton').click(function () {

    if (isRunning) {
        clearInterval(countdownInterval);
        $('#startStopButton').text('Start Timer');
        $('.ko').show();
    } else {
        startCountdown();
        $('#startStopButton').text('Pause Timer');
        $('.ko').hide();
    }
    started = true;
    isRunning = !isRunning;
});

$('button.ko').click(function () {
    $(this).closest('.player').find('.score').text('KO');
})

$(document).ready(function () {

    function calculate(click) {
        let color = 'Blue';
        if (click.hasClass('red')) {
            color = 'Red';
        }

        calculateTotalScore(color);
    }

    function calculateTotalScore(color) {
        let round1 = parseFloat($('#scorR1' + color).val()) || 0;
        let round2 = parseFloat($('#scorR2' + color).val()) || 0;
        let selector = $('.info.' + color);
        let outContainer = selector.find('span.outInfo');
        let penaltyInfo = selector.find('span.penaltyInfo ');

        let out = parseFloat(outContainer.text());
        let penalty = parseFloat(penaltyInfo.text());
        let outPenalty = 0;
        if (out === 5) {
            outPenalty = 3
        }
        if (out === 4) {
            outPenalty = 2
        }

        if (out === 3) {
            outPenalty = 1
        }

        if(color === 'Red') {
            outPenalty += round1OutRed;
        }

        if(color === 'Blue') {
            outPenalty += round1OutBlue;
        }

        $('#scor' + color).text(round1 + round2 - outPenalty - penalty );

    }


    // Update scorRed when scorClass input is edited
    $('.scorClass').on('input', function () {
        calculate($(this));
    });


    $('.info .out.add').click(function () {
        let outContainer = $(this).closest('.info').find('span.outInfo');
        let initial = parseFloat(outContainer.text());
        if (initial + 1 >= 5) {
            setLog('Sportivul are 5 iesiri');
            return;
        }
        outContainer.text(initial + 1);
        calculate($(this));
    });

    $('.info .out.delete').click(function () {
        let outContainer = $(this).closest('.info').find('span.outInfo');
        let initial = parseFloat(outContainer.text());

        if (initial > 0) {
            outContainer.text(initial - 1);
        }
        calculate($(this));
    });
    $('.info .penalty.add').click(function () {
        let outContainer = $(this).closest('.info').find('span.penaltyInfo');
        let initial = parseFloat(outContainer.text());
        let penaltyTotal = initial + 1;
        outContainer.text(penaltyTotal);
        calculate($(this));
        if(penaltyTotal >= 3){
            setLog('Sportivul are 3 penalizari');
        }
    });

    $('.info .penalty.delete').click(function () {
        let outContainer = $(this).closest('.info').find('span.penaltyInfo');
        let initial = parseFloat(outContainer.text());

        if (initial > 0) {
            outContainer.text(initial - 1);
        }
        calculate($(this));
    });

    $('.restart').click(function () {
        window.location.reload();
    });
});

function setLog(message){
    $('#alert').text(message);
    $('#logModal').modal('show');
}