//website setup:
setSectionsContent()

//global var:
let selectedTask = ''

//local storage functions:
function addToLocalStorage(key, input) {
  const localStorageTaskObj = JSON.parse(localStorage.getItem('tasks'))
  localStorageTaskObj[key].unshift(input)
  localStorage.setItem('tasks', JSON.stringify(localStorageTaskObj))
}

function updateLocalStorage(key, indexOfCurrentValue, updatedValue) {
  const localStorageTaskObj = JSON.parse(localStorage.getItem('tasks'))
  const section = localStorageTaskObj[key]
  if (!updatedValue) {
    section.splice(indexOfCurrentValue, 1)
  } else {
    section.splice(indexOfCurrentValue, 1, updatedValue)
  }
  localStorage.setItem('tasks', JSON.stringify(localStorageTaskObj))
}

/**
 * event handlers functions
 */
//adds the task to list on click
function addButtonHandler(event) {
  const relevantSection = event.path[1]
  const input = relevantSection.children[2].value
  if (!input) {
    alert('sorry... please enter your task')
  } else {
    const taskElm = createListElement(input)
    relevantSection.children[1].insertBefore(
      taskElm,
      relevantSection.children[1].children[0]
    ) //appends the new element to the top
    const key = relevantSection.attributes[0].value
    addToLocalStorage(key, input)
  }
}

//makes the content editable on double click, then adds blur event
function doubleClickHandler(event) {
  const target = event.target
  if (target.localName !== 'li') {
    return
  }
  target.setAttribute('contenteditable', true)
  target.focus()

  target.addEventListener('blur', updateTaskHandler)
}

//makes the text uneditable and updates the local storage
function updateTaskHandler(event) {
  const liElm = event.target
  liElm.removeAttribute('contenteditable')
  const key = event.path[2].attributes[0].value
  const liElmNodeList = document.getElementById(key).querySelectorAll('li')
  const liElmArr = Array.from(liElmNodeList)
  const indexOfOldText = liElmArr.indexOf(liElm)
  const updatedText = liElm.innerText
  liElm.innerHTML = updatedText
  updateLocalStorage(key, indexOfOldText, updatedText)
}

function setSectionsContent() {
  const sectionsNodeList = document.querySelectorAll('section')
  const localStorageTaskObj = JSON.parse(localStorage.getItem('tasks'))
  if (localStorage.getItem('tasks')) {
    for (let section of sectionsNodeList) {
      const sectionId = section.attributes[0].value
      const ulElm = section.children[1]
      for (let i = 0; i < localStorageTaskObj[sectionId].length; i++) {
        ulElm.append(createListElement(localStorageTaskObj[sectionId][i]))
      }
    }
  } else {
    //first time the page is loaded
    localStorage.setItem(
      'tasks',
      JSON.stringify({
        todo: [],
        'in-progress': [],
        done: [],
      })
    )
  }
}

function createListElement(text) {
  const element = document.createElement('li')
  element.classList.add('task')
  element.innerText = text
  return element
}
const moveTask = (section) => {
  const key = section.parentElement.attributes[0].value
  const removeKey = selectedTask.parentElement.parentElement.attributes[0].value
  const selectedTaskText = selectedTask.innerText
  const newTaskElem = createListElement(selectedTaskText)
  section.prepend(newTaskElem)
  selectedTask.parentElement.removeChild(selectedTask)
  addToLocalStorage(key, selectedTaskText)
  updateLocalStorage(removeKey, selectedTaskText)
  selectedTask = null
}
function moveBetweenLists({ altKey, key }) {
  if (selectedTask) {
    if (altKey && key == 1) {
      const toDoList = document.querySelector('.to-do-tasks')
      moveTask(toDoList)
    }
    if (altKey && key == 2) {
      const toDoList = document.querySelector('.in-progress-tasks')
      moveTask(toDoList)
    }
    if (altKey && key == 3) {
      const toDoList = document.querySelector('.done-tasks')
      moveTask(toDoList)
    }
  }
}
function hoverHandler({ target }) {
  if (target.classList.contains('task')) {
    selectedTask = target
    document.addEventListener('keydown', moveBetweenLists)
  }
}
function taskFilter(event) {
  const query = event.target.value
  hideListItem(query)
}
function hideListItem(queryString) {
  const sectionsNodeList = document.querySelectorAll('section')
  for (let section of sectionsNodeList) {
    for (let listEle of section.children[1].children) {
      if (!notExsits(queryString, listEle.innerText)) {
        listEle.classList.add('hidden-task')
      } else {
        listEle.classList.remove('hidden-task')
      }
    }
  }
}
function notExsits(queryString, containingString) {
  const lowerCase = queryString.toLowerCase()
  const lowerCaseContain = containingString.toLowerCase()
  return lowerCaseContain.includes(lowerCase)
}
