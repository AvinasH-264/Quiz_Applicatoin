const nextButton = document.querySelector('.footer_section button');
const timeDisplay = document.querySelector('.time_counter');
const tryAgain = document.querySelector('.result_container button');
const startButton = document.querySelector('.quiz_configuration .start_button');
const configContainer = document.querySelector(".quiz_configuration");


let quizCategory = null;
let noOfQuestions = null;

let currentQuestion = null;
let currentQuestionNo = 1;
let numberOfCorrect = null;

const max = 24;
let timer = null;
const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;

document.querySelectorAll('.subject , .no_of_questions').forEach((option) => {
    option.addEventListener('click' , function() {
        option.parentNode.querySelector('.active').classList.remove('active');
        option.classList.add('active');
    })
})

startButton.addEventListener('click' , function() {
    numberOfCorrect = 0;
    currentQuestionNo = 1;

    quizCategory = configContainer.querySelector('.select_subject .subject.active').textContent;
    noOfQuestions = parseInt(configContainer.querySelector('.question_number .no_of_questions.active').textContent);

    document.querySelector('.quiz_configuration').style.display = 'none';
    document.querySelector('.quiz_questions').style.display = 'block';
    document.querySelector('.result_container').style.display = 'none';
    renderQuestion();
})


tryAgain.addEventListener('click' , function() {
    document.querySelector('.result_container').style.display = 'none';
    document.querySelector('.quiz_configuration').style.display = 'flex';
    document.querySelector('.quiz_questions').style.display = 'none';
})

const clearTimer = () => {
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    timeDisplay.textContent = `${currentTime}s`
}

const startTimer = () => {
    timer = setInterval(() => {
        currentTime--;
        timeDisplay.textContent = `${currentTime}s`

        if(currentTime <= 0) {
            clearInterval(timer);
            highlightCorrectAnswer();
        }
    } , 1000)
}

const highlightCorrectAnswer = () => {
    let correctAnswer = document.querySelectorAll('.answer_options .answer_option')[currentQuestion.correctAnswer];
    const span = document.createElement('span');
    span.innerHTML = `<i class="fa-regular fa-circle-check"></i>`
    correctAnswer.appendChild(span);
    correctAnswer.classList.add('correct');
    renderNoOfQuestion();
}

const renderNoOfQuestion = () => {
    nextButton.style.display = 'block';
    if(currentQuestionNo === noOfQuestions) {
        document.querySelector('.quiz_questions').style.display = 'none';
        document.querySelector('.result_container').style.display = 'block';
        document.querySelector('.result_container p').innerHTML = `You answered<b> ${numberOfCorrect}</b> out of <b>${noOfQuestions}</b> questions correctly. Great effort!`
    }
    else {
        currentQuestionNo++;
    }
    

}
const handleAnswer = (option , answerIndex) => {
    clearInterval(timer);
    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect ? 'correct' : 'incorrect');

    if(option.classList.contains('correct')) {
        const span = document.createElement('span');
        span.innerHTML = `<i class="fa-regular fa-circle-check"></i>`
        option.appendChild(span);
        nextButton.style.display = 'block';
        numberOfCorrect++;
        renderNoOfQuestion();
    } 

    else if(option.classList.contains('incorrect')) {
        const span = document.createElement('span');
        span.innerHTML = `<i class="fa-regular fa-circle-xmark"></i>`
        option.appendChild(span); 
        highlightCorrectAnswer();
    }

    document.querySelectorAll('.answer_option').forEach( (value) => {
        value.style.pointerEvents = 'none'
    });
}

const getRandomQuestion = () => {
    const categoryQuestions = questions.find((cat) => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || [];

    if(!categoryQuestions) return;

    let min = 0;
    let randomQuestion = categoryQuestions[Math.floor(Math.random() * (max - min + 1) + min)];
    return randomQuestion;
}

const renderQuestion = function() {
    clearTimer();
    startTimer();
    document.querySelector('.currentQuestionNo').textContent = currentQuestionNo;
    document.querySelector('.totalQuestions').textContent = noOfQuestions;
    nextButton.style.display = 'none';
    currentQuestion = getRandomQuestion();     
    document.querySelector('.question_and_answer .question').textContent = currentQuestion.question;
    let options = currentQuestion.options;

    let ul = document.querySelector('.answer_options');
    ul.textContent = "";

    options.forEach((value , index) => {
        const li = document.createElement('li');
        li.classList.add('answer_option');
        li.textContent = value;
        li.addEventListener('click' , () => handleAnswer(li, index));
        ul.appendChild(li);
    });
}

nextButton.addEventListener('click' , renderQuestion);