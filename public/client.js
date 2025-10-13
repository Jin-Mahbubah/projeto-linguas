document.addEventListener('DOMContentLoaded', () => {
    // Referências às novas "vistas" e ao botão de início
    const homeView = document.getElementById('home-view');
    const quizContainer = document.getElementById('quiz-container');
    const startButton = document.getElementById('start-button');

    // Referências aos elementos do quiz (como antes)
    const questionTextElement = document.getElementById('question-text');
    const fillInBlankContainer = document.getElementById('fill-in-blank-container');
    const userAnswerElement = document.getElementById('user-answer');
    const submitButton = document.getElementById('submit-button');
    const multipleChoiceContainer = document.getElementById('multiple-choice-container');
    const constructSentenceContainer = document.getElementById('construct-sentence-container');
    const sentenceArea = document.getElementById('sentence-area');
    const wordBank = document.getElementById('word-bank');
    const checkSentenceButton = document.getElementById('check-sentence-button');
    const resetSentenceButton = document.getElementById('reset-sentence-button');
    const feedbackElement = document.getElementById('feedback');

    let currentQuestion = null;

    // NOVO: Adicionar um evento ao botão "Iniciar Teste"
    startButton.addEventListener('click', () => {
        homeView.classList.add('hidden'); // Esconde a home page
        quizContainer.classList.remove('hidden'); // Mostra o quiz
        getNewQuestion(); // Busca a primeira pergunta
    });

    // Todo o resto do código do quiz permanece o mesmo...

    async function getNewQuestion() {
        // ... (código igual ao anterior)
        try {
            const response = await fetch('/api/question');
            currentQuestion = await response.json();
            displayQuestion();
        } catch (error) {
            questionTextElement.textContent = 'Erro ao carregar a pergunta.';
            console.error('Erro:', error);
        }
    }

    function displayQuestion() {
        // ... (código igual ao anterior)
        questionTextElement.textContent = currentQuestion.text;
        feedbackElement.textContent = '';
        userAnswerElement.value = '';
        
        fillInBlankContainer.style.display = 'none';
        multipleChoiceContainer.style.display = 'none';
        constructSentenceContainer.style.display = 'none';
        
        multipleChoiceContainer.innerHTML = '';
        sentenceArea.innerHTML = '';
        wordBank.innerHTML = '';

        if (currentQuestion.type === 'fill_in_blank') {
            fillInBlankContainer.style.display = 'block';
        } else if (currentQuestion.type === 'multiple_choice') {
            multipleChoiceContainer.style.display = 'block';
            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.addEventListener('click', () => checkAnswer(option));
                multipleChoiceContainer.appendChild(button);
            });
        } else if (currentQuestion.type === 'construct_sentence') {
            constructSentenceContainer.style.display = 'block';
            currentQuestion.words.forEach(word => {
                const button = document.createElement('button');
                button.textContent = word;
                button.addEventListener('click', () => {
                    const wordSpan = document.createElement('span');
                    wordSpan.textContent = word + ' ';
                    sentenceArea.appendChild(wordSpan);
                    button.disabled = true;
                });
                wordBank.appendChild(button);
            });
        }
    }
    
    function checkAnswer(userAnswer) {
        // ... (código igual ao anterior)
        const cleanedCorrectAnswer = currentQuestion.answer.trim().toLowerCase();
        const cleanedUserAnswer = userAnswer.trim().toLowerCase();

        if (cleanedUserAnswer === cleanedCorrectAnswer) {
            feedbackElement.textContent = 'Correto!';
            feedbackElement.className = 'correct';
            setTimeout(getNewQuestion, 1500);
        } else {
            feedbackElement.textContent = 'Incorreto, tente novamente.';
            feedbackElement.className = 'incorrect';
        }
    }

    submitButton.addEventListener('click', () => checkAnswer(userAnswerElement.value));
    
    checkSentenceButton.addEventListener('click', () => {
        const words = Array.from(sentenceArea.children).map(span => span.textContent.trim());
        const constructedSentence = words.join(' ');
        checkAnswer(constructedSentence);
    });

    resetSentenceButton.addEventListener('click', () => {
        sentenceArea.innerHTML = '';
        Array.from(wordBank.children).forEach(button => button.disabled = false);
    });

    // REMOVEMOS a chamada a getNewQuestion() daqui, porque agora ela é chamada quando se clica no botão "Iniciar"
});