// script for 公主，请起床！应用

// Utility: get today's date string (YYYYMMDD)
function getDateKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

// Predefined task templates for each plan category
const taskTemplates = {
  weight: [
    '喝8杯水',
    '运动30分钟',
    '吃三餐均衡',
    '步行10000步',
    '睡眠7小时'
  ],
  beauty: [
    '早晨做皮肤护理',
    '晚上做皮肤护理',
    '抹防晒霜',
    '敷面膜',
    '护理头发'
  ],
  growth: [
    '阅读30分钟',
    '写日记10分钟',
    '冥想15分钟',
    '学习一个新单词',
    '练习一项新技能30分钟'
  ]
};

// Elements
const planSection = document.querySelector('.plan-section');
const taskSection = document.getElementById('task-section');
const planOptions = document.querySelectorAll('.plan-options input');
const startPlanBtn = document.getElementById('start-plan');
const taskListElem = document.getElementById('task-list');
const progressBar = document.getElementById('progress-bar');
const addTaskBtn = document.getElementById('add-task-btn');
const newDayBtn = document.getElementById('new-day-btn');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');
const saveTaskBtn = document.getElementById('save-task');
const newTaskTextInput = document.getElementById('new-task-text');
const customPlanInput = document.getElementById('custom-plan-input');
const addCustomPlanBtn = document.getElementById('add-custom-plan');
const customPlanNameInput = document.getElementById('custom-plan-name');

// State variables
let tasks = [];
let selectedPlans = [];
let customPlans = [];

// Load tasks from localStorage on initialization
function loadTasks() {
  const key = getDateKey();
  const stored = localStorage.getItem('princessTasks_' + key);
  if (stored) {
    tasks = JSON.parse(stored);
    selectedPlans = JSON.parse(localStorage.getItem('princessPlans_' + key) || '[]');
    customPlans = JSON.parse(localStorage.getItem('princessCustomPlans_' + key) || '[]');
    showTaskSection();
    renderTasks();
    updateProgress();
  }
}

// Save tasks to localStorage
function saveTasks() {
  const key = getDateKey();
  localStorage.setItem('princessTasks_' + key, JSON.stringify(tasks));
  localStorage.setItem('princessPlans_' + key, JSON.stringify(selectedPlans));
  localStorage.setItem('princessCustomPlans_' + key, JSON.stringify(customPlans));
}

// Generate tasks based on selected plans
function generateTasks() {
  const generated = [];
  selectedPlans.forEach(plan => {
    if (taskTemplates[plan]) {
      // pick first 3 tasks for each plan
      const list = taskTemplates[plan].slice(0, 3);
      list.forEach(item => generated.push(item));
    }
  });
  // handle custom plans
  customPlans.forEach(name => {
    generated.push(`练习${name}30分钟`);
  });
  // remove duplicates
  const unique = [...new Set(generated)];
  // Map into tasks array with id and completed flag
  tasks = unique.map(text => ({ id: Date.now() + Math.random().toString(36).substr(2, 9), text, completed: false }));
  saveTasks();
  renderTasks();
  updateProgress();
}

// Render tasks to DOM
function renderTasks() {
  taskListElem.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (task.completed) li.classList.add('completed');
    // Use FontAwesome icons depending on completion state
    const icon = document.createElement('i');
    icon.classList.add('fa-solid');
    icon.classList.add(task.completed ? 'fa-circle-check' : 'fa-circle');
    li.appendChild(icon);
    const span = document.createElement('span');
    span.textContent = task.text;
    li.appendChild(span);
    // Attach click event to toggle completion
    li.addEventListener('click', () => toggleTaskCompletion(task.id));
    taskListElem.appendChild(li);
  });
}

// Toggle completion for a task
function toggleTaskCompletion(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
  updateProgress();
}

// Update progress bar
function updateProgress() {
  if (tasks.length === 0) {
    progressBar.style.width = '0%';
    return;
  }
  const completedCount = tasks.filter(t => t.completed).length;
  const percent = (completedCount / tasks.length) * 100;
  progressBar.style.width = percent + '%';
}

// Show plan section and hide task section
function showPlanSection() {
  planSection.style.display = 'block';
  taskSection.style.display = 'none';
}

// Show task section and hide plan section
function showTaskSection() {
  planSection.style.display = 'none';
  taskSection.style.display = 'flex';
}

// Reset for new day
function resetForNewDay() {
  tasks = [];
  selectedPlans = [];
  customPlans = [];
  // Remove stored tasks for this date
  const key = getDateKey();
  localStorage.removeItem('princessTasks_' + key);
  localStorage.removeItem('princessPlans_' + key);
  localStorage.removeItem('princessCustomPlans_' + key);
  showPlanSection();
}

// Event listeners
startPlanBtn.addEventListener('click', () => {
  // gather selected plan values
  selectedPlans = Array.from(planOptions)
    .filter(opt => opt.checked && opt.value !== 'custom')
    .map(opt => opt.value);
  if (selectedPlans.length === 0 && customPlans.length === 0) {
    alert('请选择至少一个目标或添加自定义目标哦！');
    return;
  }
  showTaskSection();
  generateTasks();
});

addTaskBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
  newTaskTextInput.value = '';
  newTaskTextInput.focus();
});

closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

saveTaskBtn.addEventListener('click', () => {
  const text = newTaskTextInput.value.trim();
  if (text) {
    tasks.push({ id: Date.now() + Math.random().toString(36).substr(2, 9), text, completed: false });
    saveTasks();
    renderTasks();
    updateProgress();
    modal.style.display = 'none';
  }
});

// Clicking outside modal content closes it
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// New day button
newDayBtn.addEventListener('click', () => {
  if (confirm('确定要开始新的一天吗？当前进度将会重置。')) {
    resetForNewDay();
  }
});

// Show or hide custom plan input when selecting custom plan checkbox
planOptions.forEach(opt => {
  opt.addEventListener('change', () => {
    if (opt.value === 'custom') {
      customPlanInput.classList.toggle('hidden', !opt.checked);
    }
  });
});

// Add custom plan button
addCustomPlanBtn.addEventListener('click', () => {
  const name = customPlanNameInput.value.trim();
  if (name) {
    customPlans.push(name);
    // Clear input
    customPlanNameInput.value = '';
    alert(`已添加自定义目标：${name}`);
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
});