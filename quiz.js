// Get indices from URL
const urlParams = new URLSearchParams(window.location.search);
const courseIndex = urlParams.get('courseIndex');
const quizIndex = urlParams.get('quizIndex');

// Get courses from localStorage
let courses = JSON.parse(localStorage.getItem('courses')) || [];

// Check if course and quiz exist
if (!courses[courseIndex] || !courses[courseIndex].quizzes[quizIndex]) {
  alert('Quiz not found!');
  window.location.href = 'index.html';
}

// Grab the specific quiz object
const quiz = courses[courseIndex].quizzes[quizIndex];

// DOM Elements
const quizTitle = document.getElementById('quiz-title');
const questionContainer = document.getElementById('question-container');
const submitQuizBtn = document.getElementById('submit-quiz-btn');
const restartQuizBtn = document.getElementById('restart-quiz-btn');
const backBtn = document.getElementById('back-btn');

// NEW: Export button
const exportQuizBtn = document.getElementById('export-quiz-btn');

// Set quiz title
quizTitle.textContent = quiz.name;

// Functions
function displayQuestions() {
  questionContainer.innerHTML = '';
  quiz.questions.forEach((q, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.id = `question${index}`;

    const questionText = document.createElement('p');
    questionText.textContent = `${index + 1}. ${q.question}`;
    questionDiv.appendChild(questionText);

    q.options.forEach((option) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `question${index}`;
      input.value = option;
      label.appendChild(input);
      label.appendChild(document.createTextNode(option));
      questionDiv.appendChild(label);
    });

    questionContainer.appendChild(questionDiv);
  });
}

function handleQuizSubmission() {
  let score = 0;
  
  quiz.questions.forEach((q, index) => {
    const selectedOption = document.querySelector(
      `input[name="question${index}"]:checked`
    );
    const questionDiv = document.querySelector(`#question${index}`);
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback';

    if (selectedOption && selectedOption.value === q.answer) {
      score++;
      feedbackDiv.textContent = 'Correct!';
      feedbackDiv.classList.add('correct');
    } else {
      feedbackDiv.textContent = `Incorrect. ${q.explanation}`;
      feedbackDiv.classList.add('incorrect');
    }

    questionDiv.appendChild(feedbackDiv);
  });

  const resultDiv = document.createElement('div');
  resultDiv.className = 'result';
  resultDiv.textContent = `Your score is ${score} out of ${quiz.questions.length}`;
  document.body.appendChild(resultDiv);

  restartQuizBtn.style.display = 'block'; // Show restart quiz button
  submitQuizBtn.disabled = true; // Disable submit button
}

// NEW: Export only this quiz data
function exportSingleQuiz() {
  // Convert the specific quiz object to JSON
  const quizData = JSON.stringify(quiz, null, 2);

  // Create a blob
  const fileContent = new Blob([quizData], { type: 'application/json' });

  // Create a temporary link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(fileContent);

  // Name the file based on quiz name (replace spaces with underscores)
  const safeFileName = quiz.name.replace(/\s+/g, '_');
  link.download = `${safeFileName}.json`;

  // Trigger the download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// Event Listener for Submit Button
submitQuizBtn.addEventListener('click', handleQuizSubmission);

// Event Listener for Restart Button
restartQuizBtn.addEventListener('click', () => {
  window.location.reload();
});

// Event Listener for Back Button
backBtn.addEventListener('click', () => {
  window.location.href = `course.html?index=${courseIndex}`;
});

// Event Listener for Export Button
exportQuizBtn.addEventListener('click', exportSingleQuiz);

// Initialize the page
displayQuestions();
