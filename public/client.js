document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos HTML
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

    async function getNewQuestion() {
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
        questionTextElement.textContent = currentQuestion.text;
        feedbackElement.textContent = '';
        userAnswerElement.value = '';
        
        // Esconder todos os contentores primeiro
        fillInBlankContainer.style.display = 'none';
        multipleChoiceContainer.style.display = 'none';
        constructSentenceContainer.style.display = 'none';
        
        // Limpar contentores antigos
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
                    wordSpan.textContent = word;
                    sentenceArea.appendChild(wordSpan);
                    button.disabled = true; // Desativar botão depois de clicado
                });
                wordBank.appendChild(button);
            });
        }
    }
    
    function checkAnswer(userAnswer) {
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
        const words = Array.from(sentenceArea.children).map(span => span.textContent);
        const constructedSentence = words.join(' ');
        checkAnswer(constructedSentence);
    });

    resetSentenceButton.addEventListener('click', () => {
        sentenceArea.innerHTML = ''; // Limpar a frase construída
        Array.from(wordBank.children).forEach(button => button.disabled = false); // Reativar todos os botões
    });

    getNewQuestion();
});