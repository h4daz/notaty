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

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabSections.forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  addTaskBtn.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'task-input-row';
    row.innerHTML = `
      <input type="text" class="task-input" placeholder="Ny oppgave..." />
      <button type="button" class="btn-remove-task">✕</button>
    `;
    taskInputsContainer.appendChild(row);
  });

  taskInputsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remove-task')) {
      e.target.parentElement.remove();
    }
  });

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  function saveData(key, item) {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    data.push(item);
    localStorage.setItem(key, JSON.stringify(data));
    renderAll();
  }

  function deleteItem(key, index) {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    data.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(data));
    showToast("Slettet!");
    renderAll();
  }

  // ✏️ NEW: replaces the card with an editable form
  function editNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const note = notes[index];
    const card = notesList.querySelectorAll('.card')[index];

    card.innerHTML = `
      <div class="card-header">
        <input type="text" class="edit-title-input" value="${note.title}" />
      </div>
      <textarea class="edit-content-input">${note.content}</textarea>
      <div class="edit-actions">
        <button class="btn-save-edit" onclick="window.saveEdit(${index})">💾 Lagre</button>
        <button class="btn-cancel-edit" onclick="window.renderAll()">Avbryt</button>
      </div>
    `;
  }

  // ✏️ NEW: saves the edited note back to localStorage
  function saveEdit(index) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const card = notesList.querySelectorAll('.card')[index];

    notes[index].title   = card.querySelector('.edit-title-input').value.trim();
    notes[index].content = card.querySelector('.edit-content-input').value.trim();

    localStorage.setItem('notes', JSON.stringify(notes));
    showToast("Notat oppdatert!");
    renderAll();
  }

  function renderAll() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');

    // UPDATED: added edit button next to delete
    notesList.innerHTML = notes.length
      ? notes.map((n, index) => `
          <div class="card">
            <div class="card-header">
              <h3>${n.title}</h3>
              <div class="card-actions">
                <button class="btn-edit" onclick="window.editNote(${index})">edit</button>
                <button class="btn-delete" onclick="window.deleteItem('notes', ${index})">x</button>
              </div>
            </div>
            <p>${n.content}</p>
          </div>
        `).join('')
      : '<p class="empty-state">Ingen notater ennå.</p>';

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

  window.deleteItem = deleteItem;
  window.editNote   = editNote;
  window.saveEdit   = saveEdit;
  window.renderAll  = renderAll;

  renderAll();
});