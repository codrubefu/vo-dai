let countdownInterval;
let isRunning = false;
let roundTimeRemaining = 180; // Initial duration in seconds
let pauseTimePause = 120; // Initial duration in seconds
let round = 1;
let timeRemaining = 1;
let started = false;
let round1OutRed = 0;
let round1OutBlue = 0;
let lang =  'en';


// Function to get URL parameter
function setLangBaseOnParameter() {
    name = 'lang';
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    if(results !== null){
        let ulrLang = decodeURIComponent(results[1].replace(/\+/g, ' '));

        if(ulrLang !== null){
            localStorage.setItem('lang', ulrLang);
            location.replace(window.location.pathname);
        }
    }

}


// Save variables to local storage
function saveToLocalStorage() {
    localStorage.setItem('roundTimeRemaining', roundTimeRemaining);
    localStorage.setItem('pauseTimePause', pauseTimePause);
    localStorage.setItem('round', round);
    localStorage.setItem('lang', lang);
    setTimer();
}

// Load variables from local storage
function loadFromLocalStorage() {
    roundTimeRemaining = parseInt(localStorage.getItem('roundTimeRemaining'), 10) || 180;
    pauseTimePause = parseInt(localStorage.getItem('pauseTimePause'), 10) || 120;
    lang = localStorage.getItem('lang') || 'en';

    $('#roundTime').val(roundTimeRemaining);
    $('#pauseTime').val(pauseTimePause);

    setTimer();
}

function setTimer(){
    const minutes = String(Math.floor(roundTimeRemaining / 60)).padStart(2, '0');
    const seconds = String(roundTimeRemaining % 60).padStart(2, '0');
    timerElement = document.getElementById('timer');
    timerElement.textContent = `${minutes}:${seconds}`;
}

$(document).ready(function () {
    setLangBaseOnParameter();
    loadFromLocalStorage();
    const languageSelector = $("#languageSelect");

    // Set the default language to English
    applyTranslations(languageSelector.val());

    // Add event listener for language change
    languageSelector.on("change", function () {
        applyTranslations($(this).val());
    });

    languageSelector.val(lang);

    applyTranslations(lang);
});

// Function to apply translations
function applyTranslations(lang) {
    $(".restart").text(translations[lang].restart);
    $(".setting").text(translations[lang].settings);
    $("#configModalLabel").text(translations[lang].configPanel);
    $("label[for='roundTime']").text(translations[lang].roundTime);
    $("label[for='pauseTime']").text(translations[lang].pauseTime);
    $("#applyConfig").text(translations[lang].save);
    $("#configModal .btn-secondary").text(translations[lang].close);
    $("#logModalLabel").text(translations[lang].warning);
    $("#round").text(`${translations[lang].round}: 1`);
    $(".info span.out").text(translations[lang].exits);
    $(".info span.penalty").text(translations[lang].penalties);
    $(".out.add").text(translations[lang].add);
    $(".out.delete").text(translations[lang].remove);
    $(".penalty.add").text(translations[lang].add);
    $(".penalty.delete").text(translations[lang].remove);
    $("#scorR1Red").prev().text(translations[lang].scoreRound1);
    $("#scorR2Red").prev().text(translations[lang].scoreRound2);
    $("#scorR1Blue").prev().text(translations[lang].scoreRound1);
    $("#scorR2Blue").prev().text(translations[lang].scoreRound2);
    $(".ko").text(translations[lang].ko);
    $("#startStopButton").text(translations[lang].start);
}

$('#applyConfig').click( function() {

    roundTimeRemaining = parseInt($('#roundTime').val(), 10);
    pauseTimePause = parseInt($('#pauseTime').val(), 10);
    lang = $('#languageSelect').val();

    saveToLocalStorage();
});


function startCountdown() {

        let realRoundTimeRemaining = roundTimeRemaining - 1;
        let realPauseTimePause = pauseTimePause - 1;
        const timerElement = document.getElementById('timer');
        if(!started){
             timeRemaining = realRoundTimeRemaining;
        }
        if (round === 1) {
            $('#round').text(translations[lang].round + ': 1');
        }else{
            $('#round').text(translations[lang].round + ': 2');
        }

    countdownInterval = setInterval(() => {
        const minutes = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
        const seconds = String(timeRemaining % 60).padStart(2, '0');
        timerElement.textContent = `${minutes}:${seconds}`;
        if (timeRemaining <= 0) {
            if (round === 1) {
                timeRemaining = realPauseTimePause;
                isRunning = true;

                $('#round').text(translations[lang].timerPause );
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
                $('#round').text(translations[lang].round+' 2');
                timeRemaining = realRoundTimeRemaining;
                round = 2;
            }else{
                isRunning = false;
                clearInterval(countdownInterval);
                setLog(translations[lang].finishMessage);
            }
        } else {
            timeRemaining--;
        }
    }, 1000);
}

$('#startStopButton').click(function () {

    if (isRunning) {
        clearInterval(countdownInterval);
        $('#startStopButton').text(translations[lang].timerStart);
        $('.ko').show();
    } else {
        startCountdown();
        $('#startStopButton').text(translations[lang].timerPause);
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
            setLog(translations[lang].outMessage);
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
            setLog(translations[lang].penaltiesMessage);
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