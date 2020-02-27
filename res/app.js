window.onload = letsBegin;

function letsBegin() {
    const container = document.querySelector('#container');
    const name = localStorage.getItem('printful_quizz_name');
    const logo = document.getElementById('logo');
    const developerMode = false;
    let currentQuestionsSlidePositionGlobal = 0;
    
    // Sets beginning template
    let html = `
        <div class="name-slide hidden-slide">
            <h3>Welcome to</h3>
            <h1>Printful Front-End Task</h1>
            <input type="text" name="name-input" id="name-input" placeholder="Type your name">
            <div class="button inactive name-btn">My name is ...</div>
        </div>
    `;
    
    container.innerHTML = html;
    logo.addEventListener('click', () => {
        letsBegin();
    });

    setTimeout(() => {
        if (developerMode === true) {
            allAnswersGlobal = {29543: {quizz: "169", answer: "309744200", title: "Eight"},
            58186: {quizz: "169", answer: "1874097505", title: "Eight"},
            86721: {quizz: "169", answer: "16491553743", title: "12"},
            149197: {quizz: "169", answer: "44999309833", title: "16"},
            215738: {quizz: "169", answer: "230209877627", title: "17"}};
            launchSlideFour('169');
        } else if (name && name.length > 0) {
            launchSlideTwoFetch('Welcome back', name);
            console.log('Welcome back,', name);
        } else {
            launchSlideOne();
        }        
    }, 10);
}

// Async function that will handle all potential network requests
const sendFetchRequest = async (method, url, data, head) => {
    const res = await fetch(url, {
        method: method,
        body: data,
        headers: {}
    });
    return res.json();
};

/////////////////////////////////////
//    SLIDE ONE –-- USER'S NAME    //
/////////////////////////////////////

function launchSlideOne() {
    const currentSlide = document.querySelector('.name-slide');
    const button = document.querySelector('.button');
    const input = document.getElementById('name-input');
    let timeout = null;

    // The current slide slides in from the right
    currentSlide.classList.replace('hidden-slide', 'slide-in');

    // Automatically focuses on the input field 500ms after loading the page
    setTimeout(() => {
        input.focus(); 
    }, 500);

    // Waits for user to finish typing before activating the button
    input.addEventListener('keyup', (e) => {
        clearTimeout(timeout);
        
        if (cleanUpName(input.value).length > 0) {
            timeout = setTimeout(function () {
                button.classList.replace('inactive', 'active');
                button.innerHTML = `My name is ${cleanUpName(input.value)}!`
            }, 600);
        };
    });

    // Listens to ENTER getting pressed after entering their name
    currentSlide.addEventListener('keyup', (e) => {
        if (e.keyCode == 13 && input.value.length > 0) {
            currentSlide.classList.replace('slide-in', 'slide-out')
            if (cleanUpName(input.value).length > 0) {
                button.classList.add('button-waiting');
                launchSlideTwoFetch('Hello', cleanUpName(input.value));
            } else {
                button.classList.replace('active', 'inactive');
            }
         } else {
            input.focus();
         } 
    })

    // Listens to a click on the 'my name is...' button 
    button.addEventListener('click', () => {
        if (button.classList.contains('inactive')) {
            input.focus();
        } else {
            if (cleanUpName(input.value).length > 0) {
                button.classList.add('button-waiting');
                launchSlideTwoFetch('Hello', cleanUpName(input.value));
            } else {
                button.classList.replace('active', 'inactive');
                input.focus();
            }
        }
    })
}

// Cleans up the name string a bit, allows only Latin based alphabet characters and numbers
function cleanUpName(name) {
    name = name.replace(/[^A-Z0-9À-ǿ' ]/gi, '')
    return name.charAt(0).toUpperCase() + name.substring(1);
}

// Launches Slide Two when the Quizz fetch request is ready
function launchSlideTwoFetch(message, name) {
    sendFetchRequest('GET', 'https://printful.com/test-quiz.php?action=quizzes')
        .then(resData => launchSlideTwo(message, name, resData))
        .catch(err => catchFetchError(err));
}

/////////////////////////////////////
//      SLIDE TWO –-- QUIZZES      //
/////////////////////////////////////

function launchSlideTwo(message, name, quizzes) {
    const container = document.querySelector('#container');
    const newDiv = document.createElement('div');

    // Save name to local storage
    localStorage.setItem('printful_quizz_name', name);

    // Wait for the previous slide to disappear, then delete it & create a new slide
    setTimeout(() => {
        container.innerHTML = '';
        container.appendChild(newDiv);
        newDiv.classList.add('test-slide', 'hidden-slide');
        
        // HTML template for Slide Two without quizz buttons
        newDiv.innerHTML = `
            <h1>${message}, <span id="name-span">${name}</span>!</h1>
            <h4>Choose your quizz</h4>
            <div class="tests"></div>
            <div class="button inactive test-btn">Start!</div>
            <div class="notabene">Not ${name}? Click here!</div>`;

        // Wait for the old slide to disappear in the DOM, then slide the new one in
        setTimeout(() => {
            newDiv.classList.replace('hidden-slide', 'slide-in');
            populateQuizzes(quizzes);
        }, 100);

        setTimeout(() => {
            const namespan = document.getElementById('name-span');
            const notabene = document.querySelector('.notabene');
            let tests = document.getElementsByClassName('test');

            // User can change the name in the title by clicking on it
            namespan.addEventListener('click', () => {
                localStorage.setItem('printful_quizz_name', '');
                letsBegin();
            });
            notabene.addEventListener('click', () => {
                localStorage.setItem('printful_quizz_name', '');
                letsBegin();
            });

            // Wait for the test buttons to appear, then add hover animations
            for (test of tests) {
                test.classList.add('test-loaded');
            }
        }, 2000);
    }, 300);

    function populateQuizzes(data) {
        const tests = document.querySelector('.tests');
        const quizzes = data;
        let delay = 1;
        tests.innerHTML = '';

        // Template for every quizz button received via AJAX
        for (quizz of quizzes) {
            tests.insertAdjacentHTML('beforeend', `
                <div class="test id-${quizz.id}" id=${quizz.id} style="animation-delay: ${delay}s;">
                    <p class="test-name">${quizz.title}</p>
                </div>
            `);
            delay += 0.5;
        }

        // Makes it possible to select any clicked quizz button
        setTimeout(() => {
            let allTests = document.getElementsByClassName('test-name');

            for (test of allTests) {
                test.addEventListener('click', () => selectThisButton(event, 'test'));
            }
        }, 100);
    }
}

// Selects a test and/or answer for both QUIZZES and ANSWERS slides
function selectThisButton(event, slideName) {
    // slideName is expected to be either 'test' for quizzes slide or 'answer' for questions slide
    let btnName = `.${slideName}-btn`;
    let currentSlideName = `.${slideName}-slide`;
    const proceedBtn = document.querySelector(btnName);
    const currentSlide = document.querySelector(currentSlideName);
    let allButtons = document.getElementsByClassName(slideName);
    let selectedId = '';

    // Clear any previous selections first
    clearSelected();

    // Selects/Unselects buttons. Launches SlideThree if necessary
    for (button of allButtons) {
        if (button !== event.target.parentElement) {
            button.classList.add('unselected');
        } else {
            // Select the button
            button.classList.add('selected');
            proceedBtn.classList.replace('inactive', 'active');
            selectedId = button.id;

            // Prepare to launch the next slide with quizz data
            if (proceedBtn.classList.contains('test-btn')) {
                proceedBtn.addEventListener('mouseup', () => {
                currentSlide.classList.replace('slide-in', 'slide-out');
                launchSlideThree(selectedId);
                console.log(selectedId)
                });
            }
        }
    }
}

// Finds all 'selected' and 'unselected' classes and removes them for QUIZZES view & ANSWERS view
function clearSelected() {
    let allUnselectedButtons = document.getElementsByClassName('unselected');
    let allSelectedButtons = document.getElementsByClassName('selected');

    for (button of allUnselectedButtons) {
        button.classList.remove('unselected');
    }
    for (button of allSelectedButtons) {
        button.classList.remove('selected');
    }
}


/////////////////////////////////////
//     SLIDE THREE –-- ANSWERS     //
/////////////////////////////////////

function launchSlideThree(quizzId) {
    const container = document.querySelector('#container');
    const newDiv = document.createElement('div');
    let urlQuestions = `https://printful.com/test-quiz.php?action=questions&quizId=` + quizzId;

    // Creates the main Slide Three div
    setTimeout(() => {
        container.innerHTML = '';
        container.appendChild(newDiv);
        newDiv.classList.add('answer-slide');
        
        // Sends XHR and populates the slide with questions
        setTimeout(() => {
            sendFetchRequest('GET', urlQuestions)
                .then(resData => populateQuestions(resData, quizzId))
                .catch(err => catchFetchError(err));
        }, 100);        
    }, 10);

}

function populateQuestions(questions, quizzId) {
    const container = document.querySelector('#container');
    const answerSlide = document.querySelector('.answer-slide');
    const previousCountainer = container.innerHTML;
    
    setTimeout(() => {
        let newSlideWidth = questions.length * 100;

        // Sets the required width for the whole questions' slide (100vw per question)
        answerSlide.style.width = newSlideWidth + 'vw';

        answerSlide.innerHTML = '';
        container.insertAdjacentHTML('beforeend', `
            <div class="progress-container">
                <div class="progress"></div>
            </div>
        `);

        const progress = document.querySelector('.progress');
        setTimeout(() => {
            progress.classList.add('0', questions.length);
        }, 100);

        // Populates the slide with all the quizz questions and answers
        for (let i = 0; i < questions.length; i++) {
            let question = questions[i];
            let nextIndex = i + 1 ;
            // Creates unique IDs for the Next question buttons
            let nextId = (nextIndex < questions.length) ? (questions[nextIndex].id) : 'results';
            
            // Question HTML template without the answers (populated later)
            answerSlide.insertAdjacentHTML('beforeend', `
                <div id="question.id" class="one-question">
                    <h3>Question No. ${nextIndex} / ${questions.length}</h3>
                    <h2>${question.title}</h2>
                    <div class="answers progress-not-used" id="${question.id}"></div>
                    <div class="button ${nextId} inactive answer-btn">Next!</div>
                </div>
            `)

            // Gives logic to the Next buttons under the answers
            let questionButton = document.getElementsByClassName(nextId)[0];
            if (i < questions.length - 1) {
                questionButton.addEventListener('mouseup', () => {
                    if (questionButton.classList.contains('active')) {
                        moveView(event, quizzId)
                    } else {
                        console.log('button didn`t move', event.target.classList)
                    }
                });
            } else {
                questionButton.addEventListener('mouseup', () => {
                    launchSlideFour(quizzId);
                });
                questionButton.innerHTML = "That's it! See the results!";
            }
        }

        let questionOneId = questions[0].id;
        let urlFirstAnswers = `https://printful.com/test-quiz.php?action=answers&quizId=${quizzId}&questionId=${questionOneId}`;

        // Populates the first question in a quizz with answers (next questions will be done so by moveView function)
        sendFetchRequest('GET', urlFirstAnswers)
            .then(resData => populateThisQuestionWithAnswers(resData, questionOneId, quizzId))
            .catch(err => catchFetchError(err));
    }, 200);
}

let allAnswersGlobal = {};

// Sets up a template and logic to populate every question with answers for SLIDE THREE (one question at a time)
function populateThisQuestionWithAnswers(answers, questionId, quizzId) {
    let delay = 1;
    let answersDiv = document.getElementById(questionId);

    // HTML Answers Template
    for (answer of answers) {
        answersDiv.insertAdjacentHTML('beforeend', `
            <div class="answer id-${quizzId}" id="${answer.id}" style="animation-delay: ${(delay % 2 === 0) ? delay / 12 : delay / 8}s;">
                <p class="answer-name">${answer.title}</p>
            </div>
        `)
        delay += 1;
    }

    // Adds event listeners to each answer and let's them be selected, moves progress bar if so
    let answerItems = document.getElementsByClassName('answer');

    for (item of answerItems) {
        item.addEventListener('click', (event) => {
            if (event.target.classList.contains('answer-name')) {
                // POPULATES THE RESULTS OBJECT WITH ANSWERS (last one selected per question)!
                let thisAnswer = { quizz: quizzId, answer: event.target.parentElement.id, title: event.target.innerHTML};
                allAnswersGlobal[questionId] = thisAnswer;

                selectThisButton(event, 'answer');
                moveProgressBar(event);
                console.log(allAnswersGlobal);
            }
        });
    }
}

let currentQuestionsSlidePositionGlobal = 0;

// Moves the Questions Slide one Question at a time for SLIDE THREE & populates the next answers
function moveView(event, quizzId) {
    const answerSlide = document.querySelector('.answer-slide');
    const nextId = event.target.classList[1];
    let urlAnswers = `https://printful.com/test-quiz.php?action=answers&quizId=${quizzId}&questionId=${nextId}`;

    // Receives the questions slide current translate position from a global variable. Creates a new one
    currentQuestionsSlidePositionGlobal = currentQuestionsSlidePositionGlobal - 100;
    let newPosition = currentQuestionsSlidePositionGlobal + 'vw';

    // Fetch request to get answers for the incoming question
    sendFetchRequest('GET', urlAnswers)
        .then(resData => populateThisQuestionWithAnswers(resData, nextId, quizzId))
        .catch(err => catchFetchError(err));

    // Slides to the next question, removes 'answer-btn' class from previous 'Next' button
    answerSlide.style.transform = `translateX(${newPosition})`;
    event.target.classList.remove('answer-btn');
}

function moveProgressBar(event) {
    const progress = document.querySelector('.progress');
    const currentProgress = progress.classList[1]; 
    const progressIncrement = 100 / Number(progress.classList[2]); 
    let newProgressWidth = Number(currentProgress) + Number(progressIncrement);

    // Moves the progress bar if but first checks if it hasn't already moved on this question by checking for a class
    if (event.target.parentElement.parentElement.classList.contains('progress-not-used')) {
        setTimeout(() => {
            progress.classList.replace(currentProgress, newProgressWidth)
            progress.style.width = newProgressWidth + 'vw';
        }, 100);
        event.target.parentElement.parentElement.classList.remove('progress-not-used')
    }
}

/////////////////////////////////////
// SLIDE FOUR --- Show the RESULTS //
/////////////////////////////////////

function launchSlideFour(quizzId) {
    const container = document.querySelector('#container');
    const newDiv = document.createElement('div');
    const name = localStorage.getItem('printful_quizz_name');
    // const initiallAllAnswersLength = allAnswersGlobal
    

    for (answer in allAnswersGlobal) {
        let answerKey = answer;
        let answerId = allAnswersGlobal[answerKey]['answer'];
        let urlResults = `https://printful.com/test-quiz.php?action=submit&quizId=${quizzId}&answers[]=${answerId}`;
        
        sendFetchRequest('GET', urlResults)
            .then(resData => allAnswersGlobal[answerKey]['result'] = resData)
            .catch(err => catchFetchError(err));
    }

    setTimeout(() => {
        container.innerHTML = '';
        container.appendChild(newDiv);
        newDiv.classList.add('test-slide', 'hidden-slide');

        newDiv.innerHTML = `
            <h1>Thanks, <span id="name-span">${name}</span>!</h1,>
            <h4>Below are all of your answers! Hover to see if they are correct!</h4>
            <div class="answer-results"></div>
            <div class="button results-btn">Try another quizz!</div>`;

        setTimeout(() => {
            let answersDiv = document.querySelector('.answer-results');
            newDiv.classList.replace('hidden-slide', 'slide-in');
            let correctOrWrong = '';
            let delay = 1;

            setTimeout(() => {
                let tryAgainButton = document.getElementsByClassName('results-btn')[0];
                let allCorrectAnswers = document.getElementsByClassName('correct');

                for (answer in allAnswersGlobal) {
                    let answerKey = answer;
                    if (allAnswersGlobal[answerKey]['result']['correct'] == 1) {
                        correctOrWrong = 'correct';
                    } else {
                        correctOrWrong = 'wrong';
                    }
                    answersDiv.insertAdjacentHTML('beforeend', `
                        <div class="result ${correctOrWrong}" style="animation-delay: ${delay}s;">
                            <p class="results-answer">${allAnswersGlobal[answerKey]['title']}</p>
                        </div>
                    `)
                    delay += 0.3;
                }

                tryAgainButton.addEventListener('click', letsBegin);

                answersDiv.insertAdjacentHTML('beforeend', `
                <p class="result-p">You responded correctly to <span class="result-span">${allCorrectAnswers.length}
                   out of ${Object.keys(allAnswersGlobal).length}</span> questions.<p>
                `)

            }, 500);    

        }, 200);
    }, 200);
}

// Show user friendly error if fetch malfunctions
function catchFetchError(err) {
    const container = document.querySelector('#container');

    container.innerHTML = `
    <h3>Ooops! Something went wrong with the network connection...
    <br>(${err})
    <br><br><a href="javascript:location.reload();">Reload?</a></h3>`
    console.error('Error:', err);
}


