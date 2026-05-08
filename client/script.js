document.addEventListener("DOMContentLoaded", () => {

  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabSections = document.querySelectorAll('.tab-section');
  const noteForm = document.getElementById('note-form');
  const todoForm = document.getElementById('todo-form');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskInputsContainer = document.getElementById('task-inputs');
  const notesList = document.getElementById('notes-list');
  const todosList = document.getElementById('todos-list');
  const toast = document.getElementById('toast');

  // legg til editing-label i begge forms
  const noteEditLabel = document.createElement('p');
  noteEditLabel.className = 'editing-label';
  noteEditLabel.textContent = ' EDIT Redigerer notat';
  noteForm.prepend(noteEditLabel);

  const todoEditLabel = document.createElement('p');
  todoEditLabel.className = 'editing-label';
  todoEditLabel.textContent = ' EDIT Redigerer liste';
  todoForm.prepend(todoEditLabel);

  // holder styr på om vi redigerer
  let editingNote = null; // index eller null
  let editingTodo = null;

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
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // SAVE (ny)
  function saveData(key, item) {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    data.push(item);
    localStorage.setItem(key, JSON.stringify(data));
    renderAll();
  }

  // UPDATE (rediger eksisterende)
  function updateData(key, index, item) {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    data[index] = item;
    localStorage.setItem(key, JSON.stringify(data));
    renderAll();
  }

  // DELETE
  function deleteItem(key, index) {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    data.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(data));
    showToast("Slettet!");
    renderAll();
  }

  // EDIT NOTE — fyller inn skjemaet med eksisterende data
  function editNote(index) {
    // string hvis ikke bruker har lagret noe enda, så fallback til tom array
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const n = notes[index];
    document.getElementById('note-title').value = n.title;
    document.getElementById('note-content').value = n.content;
    editingNote = index;
    noteForm.classList.add('editing');  
    // scroll til skjemaet
    noteForm.scrollIntoView({ behavior: 'smooth' });
  }

  // EDIT TODO — fyller inn skjemaet med eksisterende data
  function editTodo(index) {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const t = todos[index];
    document.getElementById('todo-title').value = t.title;

    // bytt til todos-tab
    tabBtns.forEach(b => b.classList.remove('active'));
    tabSections.forEach(s => s.classList.remove('active'));
    document.querySelector('[data-tab="todos"]').classList.add('active');
    document.getElementById('tab-todos').classList.add('active');

    // fyll inn oppgavene
    taskInputsContainer.innerHTML = t.tasks.map(task => `
      <div class="task-input-row">
        <input type="text" class="task-input" placeholder="Oppgave..." value="${task}" />
        <button type="button" class="btn-remove-task">✕</button>
      </div>
    `).join('');

    editingTodo = index;
    todoForm.classList.add('editing');
    todoForm.scrollIntoView({ behavior: 'smooth' });
  }

  // RENDER
  function renderAll() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');

    notesList.innerHTML = notes.length
      ? notes.map((n, index) => `
        <div class="card item-card">
          <div class="card-header">
            <h3 class="item-title">${n.title}</h3>
            <div>
              <button class="btn-edit" onclick="window.editNote(${index})">EDIT</button>
              <button class="btn-delete" onclick="window.deleteItem('notes', ${index})">X</button>
            </div>
          </div>
          <p class="note-content">${n.content}</p>
        </div>
      `).join('')
      : '<p class="empty-state">Ingen notater ennå.</p>';

    todosList.innerHTML = todos.length
      ? todos.map((t, index) => `
        <div class="card item-card">
          <div class="card-header">
            <h3 class="item-title">${t.title}</h3>
            <div>
              <button class="btn-edit" onclick="window.editTodo(${index})">EDIT</button>
              <button class="btn-delete" onclick="window.deleteItem('todos', ${index})">X</button>
            </div>
          </div>
          <ul style="padding-left: 20px;">
            ${t.tasks.map(task => `<li>${task}</li>`).join('')}
          </ul>
        </div>
      `).join('')
      : '<p class="empty-state">Ingen todo-lister ennå.</p>';
  }

  // NOTE FORM SUBMIT
  noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const item = {
      title: document.getElementById('note-title').value,
      content: document.getElementById('note-content').value
    };

    if (editingNote !== null) {
      updateData('notes', editingNote, item);
      editingNote = null;
      noteForm.classList.remove('editing');
      showToast("Notat oppdatert!");
    } else {
      saveData('notes', item);
      showToast("Notat lagret!");
    }
    noteForm.reset();
  });

  // TODO FORM SUBMIT
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tasks = Array.from(document.querySelectorAll('.task-input'))
      .map(i => i.value.trim())
      .filter(v => v);

    if (tasks.length === 0) {
      alert("Legg til minst én oppgave!");
      return;
    }

    const item = {
      title: document.getElementById('todo-title').value,
      tasks
    };

    if (editingTodo !== null) {
      updateData('todos', editingTodo, item);
      editingTodo = null;
      todoForm.classList.remove('editing');
      showToast("Liste oppdatert!");
    } else {
      saveData('todos', item);
      showToast("Liste lagret!");
    }

    todoForm.reset();
    taskInputsContainer.innerHTML = `
      <div class="task-input-row">
        <input type="text" class="task-input" placeholder="Oppgave..." />
        <button type="button" class="btn-remove-task">✕</button>
      </div>
    `;
  });

  window.deleteItem = deleteItem;
  window.editNote = editNote;
  window.editTodo = editTodo;

  renderAll();
});