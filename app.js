// Initialize courses array from localStorage
let courses = JSON.parse(localStorage.getItem('courses')) || [];

// DOM Elements
const courseContainer = document.getElementById('course-container');
const addCourseBtn = document.getElementById('add-course-btn');
const courseModal = document.getElementById('course-modal');
const closeBtn = document.querySelector('.close-button');
const createCourseBtn = document.getElementById('create-course-btn');
const courseNameInput = document.getElementById('course-name');

// Functions
function displayCourses() {
  courseContainer.innerHTML = '';
  courses.forEach((course, index) => {
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card';

    const courseTitle = document.createElement('h3');
    courseTitle.textContent = course.name;
    courseCard.appendChild(courseTitle);

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering the card click event
      deleteCourse(index);
    });
    courseCard.appendChild(deleteBtn);

    courseCard.addEventListener('click', () => {
      window.location.href = `course.html?index=${index}`;
    });

    courseContainer.appendChild(courseCard);
  });
}

function deleteCourse(index) {
  if (confirm('Are you sure you want to delete this course?')) {
    courses.splice(index, 1);
    localStorage.setItem('courses', JSON.stringify(courses));
    displayCourses();
  }
}

// Event Listeners
addCourseBtn.addEventListener('click', () => {
  courseModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  courseModal.style.display = 'none';
});

createCourseBtn.addEventListener('click', () => {
  const courseName = courseNameInput.value.trim();
  if (courseName) {
    courses.push({ name: courseName, quizzes: [] });
    localStorage.setItem('courses', JSON.stringify(courses));
    displayCourses();
    courseModal.style.display = 'none';
    courseNameInput.value = '';
  }
});

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
  if (event.target == courseModal) {
    courseModal.style.display = 'none';
  }
});

// Initialize the app
displayCourses();
