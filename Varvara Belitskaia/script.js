var todoModule = (function() {
  // add-task-block elements
  var newTask = document.getElementById('add-task');
  var newDeadline = document.getElementById('add-deadline');
  var addButton = document.getElementById('add-button');

  // tasks-block elements
  var todoList = document.getElementById('todo-list');
  var completedList = document.getElementById('completed-list');
  var tasksList = document.getElementsByTagName('li');

  function loadToDoList() {
    todoList.innerHTML = window.localStorage.getItem('todo');
    completedList.innerHTML = window.localStorage.getItem('completed');
    for (var i = 0; i < tasksList.length; i++) {
      tasksList[i].classList.remove('hidden');
    }
  }

  function updateLocalStorage() {
    window.localStorage.setItem('todo', todoList.innerHTML);
    window.localStorage.setItem('completed', completedList.innerHTML);
  }

  function addTask() {
    if (newTask.value.trim() !== '') {
      var task = document.createElement('li');
      task.appendChild(document.createTextNode(newTask.value));
      task.setAttribute('class', 'todo');
      // add deadline (unneccesary option)
      var deadline = document.createElement('span');
      deadline.setAttribute('class', 'deadline');
      if (newDeadline.valueAsDate !== null) {
        deadline.appendChild(
          document.createTextNode(newDeadline.valueAsDate.toDateString())
        );
      } else {
        deadline.appendChild(document.createTextNode(''));
      }
      task.appendChild(deadline);
      newDeadline.value = null;
      todoList.appendChild(task);
      // add delete button
      var deleteButton = document.createElement('span');
      deleteButton.setAttribute('class', 'delete-button');
      deleteButton.appendChild(document.createTextNode('\u2715'));
      task.appendChild(deleteButton);
      // delete task by clicking x button
      deleteButton.addEventListener('click', function(event) {
        event.stopPropagation();
        this.parentNode.parentNode.removeChild(task);
        updateLocalStorage();
      });
      // mark task as completed/incompleted by clicking
      task.addEventListener('click', function(event) {
        if (task.className === 'todo') {
          task.setAttribute('class', 'completed');
          completedList.appendChild(task);
        } else {
          task.setAttribute('class', 'todo');
          todoList.appendChild(task);
        }
        updateLocalStorage();
      });
      newTask.value = '';
    } else {
      newTask.value = '';
    }
    updateLocalStorage();
    // check deadline filter
    filterListByDeadline();
  }

  function setupEventListeners() {
    // delete task by clicking x button
    var deleteButtons = document.getElementsByClassName('delete-button');
    for (var i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener('click', function(event) {
        event.stopPropagation();
        this.parentNode.parentNode.removeChild(this.parentNode);
        updateLocalStorage();
      });
    }
    // add task by clicking 'Add' button
    addButton.addEventListener('click', addTask);
    // add task by pressing 'Enter' key
    newTask.addEventListener('keyup', function(event) {
      if (event.keyCode === 13) {
        addButton.click();
      }
    });
    // mark task as completed/incompleted by clicking
    for (var i = 0; i < tasksList.length; i++) {
      tasksList[i].addEventListener('click', function(event) {
        if (this.className === 'todo') {
          this.setAttribute('class', 'completed');
          completedList.appendChild(this);
        } else {
          this.setAttribute('class', 'todo');
          todoList.appendChild(this);
        }
        updateLocalStorage();
      });
    }
    // filter tasks by completed/incompleted
    var filterByCompleteness = document.getElementById('filter-completed');
    filterByCompleteness.addEventListener('change', filterListByCompleteness);
    //filter tasks by deadline: tomorrow/next week
    var filterByDeadline = document.getElementById('filter-deadline');
    filterByDeadline.addEventListener('change', filterListByDeadline);
  }

  function filterListByCompleteness() {
    var filter = document.getElementById('filter-completed');
    if (filter.value === 'Tasks to do') {
      document.getElementById('completed-list').classList.add('hidden');
      document.getElementById('todo-list').classList.remove('hidden');
    } else if (filter.value === 'Completed tasks') {
      document.getElementById('todo-list').classList.add('hidden');
      document.getElementById('completed-list').classList.remove('hidden');
    } else {
      document.getElementById('todo-list').classList.remove('hidden');
      document.getElementById('completed-list').classList.remove('hidden');
    }
  }

  function filterListByDeadline() {
    var filter = document.getElementById('filter-deadline');
    var deadlineList = document.getElementsByClassName('deadline');

    var today = new Date();
    var tomorrow = new Date();
    var nextWeekMonday = new Date();
    var nextWeekSunday = new Date();

    // calculating dates for tomorrow, next week Monday and next week Sunday
    tomorrow.setDate(today.getDate() + 1);
    nextWeekMonday.setDate(
      today.getDate() +
        ((8 - today.getDay()) % 7) +
        (today.getDay() === 1 ? 7 : 0)
    );
    nextWeekSunday.setDate(today.getDate() + ((14 - today.getDay()) % 7) + 7);

    // set time to zeros so we can compare dates
    tomorrow.setHours(0, 0, 0, 0);
    nextWeekMonday.setHours(0, 0, 0, 0);
    nextWeekSunday.setHours(0, 0, 0, 0);

    for (var i = 0; i < deadlineList.length; i++) {
      var deadline = new Date(deadlineList[i].innerText);
      if (filter.value === 'Tomorrow') {
        deadline.getTime() === tomorrow.getTime()
          ? deadlineList[i].parentNode.classList.remove('hidden')
          : deadlineList[i].parentNode.classList.add('hidden');
      } else if (filter.value === 'Next week') {
        deadline.getTime() >= nextWeekMonday.getTime() &&
        deadline.getTime() <= nextWeekSunday.getTime()
          ? deadlineList[i].parentNode.classList.remove('hidden')
          : deadlineList[i].parentNode.classList.add('hidden');
      } else {
        deadlineList[i].parentNode.classList.remove('hidden');
      }
    }
  }

  return {
    init: function() {
      loadToDoList();
      setupEventListeners();
    }
  };
}());

todoModule.init();
