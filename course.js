// Get course index from URL
const urlParams = new URLSearchParams(window.location.search);
const courseIndex = urlParams.get('index');

// Get courses from localStorage
let courses = JSON.parse(localStorage.getItem('courses')) || [];

// Check if course exists
if (!courses[courseIndex]) {
  alert('Course not found!');
  window.location.href = 'index.html';
}

// DOM Elements
const courseTitle = document.getElementById('course-title');
const quizContainer = document.getElementById('quiz-container');
const addQuizBtn = document.getElementById('add-quiz-btn');
const quizModal = document.getElementById('quiz-modal');
const closeBtn = document.querySelector('.close-button');
const createQuizBtn = document.getElementById('create-quiz-btn');
const quizNameInput = document.getElementById('quiz-name');
const quizDataInput = document.getElementById('quiz-data');
const backBtn = document.getElementById('back-btn');

// Set course title
courseTitle.textContent = courses[courseIndex].name;

// Functions
function displayQuizzes() {
  quizContainer.innerHTML = '';
  const quizzes = courses[courseIndex].quizzes;
  quizzes.forEach((quiz, index) => {
    const quizCard = document.createElement('div');
    quizCard.className = 'quiz-card';

    const quizTitle = document.createElement('h3');
    quizTitle.textContent = quiz.name;
    quizCard.appendChild(quizTitle);

    // Checkbox for reviewed status
    const checkboxLabel = document.createElement('label');
    checkboxLabel.className = 'checkbox-label';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = quiz.reviewed || false;

    // Update the visual state of the quiz card based on the reviewed status
    if (checkbox.checked) {
      quizCard.classList.add('reviewed');
    } else {
      quizCard.classList.remove('reviewed');
    }

    checkbox.addEventListener('change', () => {
      quizzes[index].reviewed = checkbox.checked;
      courses[courseIndex].quizzes = quizzes;
      localStorage.setItem('courses', JSON.stringify(courses));

      // Update the visual state
      if (checkbox.checked) {
        quizCard.classList.add('reviewed');
      } else {
        quizCard.classList.remove('reviewed');
      }
    });

    const checkmarkSpan = document.createElement('span');
    checkmarkSpan.className = 'checkmark';

    checkboxLabel.appendChild(checkbox);
    checkboxLabel.appendChild(checkmarkSpan);
    quizCard.appendChild(checkboxLabel);

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering the card click event
      deleteQuiz(index);
    });
    quizCard.appendChild(deleteBtn);

    quizCard.addEventListener('click', (event) => {
      // Prevent navigating to quiz if checkbox or delete button is clicked
      if (
        event.target !== checkbox &&
        event.target !== deleteBtn &&
        !deleteBtn.contains(event.target) &&
        !checkboxLabel.contains(event.target)
      ) {
        window.location.href = `quiz.html?courseIndex=${courseIndex}&quizIndex=${index}`;
      }
    });
    quizContainer.appendChild(quizCard);
  });
}

function deleteQuiz(index) {
  if (confirm('Are you sure you want to delete this quiz?')) {
    courses[courseIndex].quizzes.splice(index, 1);
    localStorage.setItem('courses', JSON.stringify(courses));
    displayQuizzes();
  }
}

// Event Listeners
addQuizBtn.addEventListener('click', () => {
  quizModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  quizModal.style.display = 'none';
});

createQuizBtn.addEventListener('click', () => {
  const quizName = quizNameInput.value.trim();
  const quizData = quizDataInput.value.trim();
  if (quizName && quizData) {
    const questions = parseQuizData(quizData);
    courses[courseIndex].quizzes.push({ name: quizName, questions, reviewed: false });
    localStorage.setItem('courses', JSON.stringify(courses));
    displayQuizzes();
    quizModal.style.display = 'none';
    quizNameInput.value = '';
    quizDataInput.value = '';
  }
});

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
  if (event.target == quizModal) {
    quizModal.style.display = 'none';
  }
});

// Parse quiz data from input
function parseQuizData(data) {
  const lines = data.split('\n');
  const questions = [];
  let currentQuestion = null;
  lines.forEach(line => {
    if (line.startsWith('Q:')) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = { question: line.slice(2).trim(), options: [], answer: null, explanation: '' };
    } else if (line.startsWith('A:')) {
      currentQuestion.answer = line.slice(2).trim();
    } else if (line.startsWith('E:')) {
      currentQuestion.explanation = line.slice(2).trim();
    } else if (line.startsWith('-')) {
      currentQuestion.options.push(line.slice(1).trim());
    }
  });
  if (currentQuestion) {
    questions.push(currentQuestion);
  }
  return questions;
}

// Event Listener for Back Button
backBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Initialize the app
displayQuizzes();
