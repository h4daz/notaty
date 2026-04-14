document.addEventListener("DOMContentLoaded", () => {

  // DOM ELEMENTS
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabSections = document.querySelectorAll('.tab-section');
  const noteForm = document.getElementById('note-form');
  const todoForm = document.getElementById('todo-form');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskInputsContainer = document.getElementById('task-inputs');
  const notesList = document.getElementById('notes-list');
  const todosList = document.getElementById('todos-list');
  const toast = document.getElementById('toast');

  // TAB SWITCHING
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabSections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  // ADD TASK ROW
  addTaskBtn.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'task-input-row';
    row.innerHTML = `
      <input type="text" class="task-input" placeholder="Ny oppgave..." />
      <button type="button" class="btn-remove-task">✕</button>
    `;
    taskInputsContainer.appendChild(row);
  });

  // REMOVE TASK ROW
  taskInputsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remove-task')) {
      e.target.parentElement.remove();
    }
  });

  // TOAST
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  // LOCAL STORAGE SAVE
  function saveData(key, item) {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    data.push(item);
    localStorage.setItem(key, JSON.stringify(data));
    renderAll();
  }

  // DELETE ITEM
  function deleteItem(key, index) {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    data.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(data));

    showToast("Slettet!");
    renderAll();
  }

  // RENDER EVERYTHING
  function renderAll() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');

    // NOTES
    notesList.innerHTML = notes.length
      ? notes.map((n, index) => `
        <div class="card">
          <div class="card-header">
            <h3>${n.title}</h3>
            <button class="btn-delete" onclick="window.deleteItem('notes', ${index})">🗑️</button>
          </div>
          <p>${n.content}</p>
        </div>
      `).join('')
      : '<p class="empty-state">Ingen notater ennå.</p>';

    // TODOS
    todosList.innerHTML = todos.length
      ? todos.map((t, index) => `
        <div class="card">
          <div class="card-header">
            <h3>${t.title}</h3>
            <button class="btn-delete" onclick="window.deleteItem('todos', ${index})">🗑️</button>
          </div>
          <ul style="padding-left: 20px;">
            ${t.tasks.map(task => `<li>${task}</li>`).join('')}
          </ul>
        </div>
      `).join('')
      : '<p class="empty-state">Ingen lister ennå.</p>';
  }

  // FORMS

  noteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    saveData('notes', {
      title: document.getElementById('note-title').value,
      content: document.getElementById('note-content').value
    });

    noteForm.reset();
    showToast("Notat lagret!");
  });

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const tasks = Array.from(document.querySelectorAll('.task-input'))
      .map(i => i.value.trim())
      .filter(v => v);

    if (tasks.length === 0) {
      alert("Legg til minst én oppgave!");
      return;
    }

    saveData('todos', {
      title: document.getElementById('todo-title').value,
      tasks
    });

    todoForm.reset();

    taskInputsContainer.innerHTML = `
      <div class="task-input-row">
        <input type="text" class="task-input" placeholder="Oppgave..." />
        <button type="button" class="btn-remove-task">✕</button>
      </div>
    `;

    showToast("Liste lagret!");
  });

  // expose delete function globally (needed for onclick)
  window.deleteItem = deleteItem;

  // INIT
  renderAll();

});