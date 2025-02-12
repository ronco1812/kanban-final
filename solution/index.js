//website setup:
setSectionsContent()

//global var:
let selectedTask = ''
const Url = 'https://json-bins.herokuapp.com/bin/614ae6794021ac0e6c080c5b'

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
      const lengthId = localStorageTaskObj[sectionId].length
      for (let i = 0; i < lengthId; i++) {
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
async function saveDataFromAPI() {
  document.getElementById('saveData').innerText = 'loading'
  const { tasks } = localStorage
  const response = await fetch(Url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tasks }),
  })
  document.getElementById('saveData').innerText = 'Save'
  return response.json()
}
// async function loadDataFromAPI() {
//   document.getElementById('loadData').innerText = 'loading'
//   const tasksList = document.querySelectorAll('li')
//   for (let task of tasksList) {
//     task.remove()
//   }
//   let response = await fetch(Url, {
//     method: 'GET',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//   })
// if(!response.ok){
//   alert("something went wrong")
//   document.getElementById("loadData").innerText = "Load"
//   return
// }
// let task = await response.json()
// tasks = task.tasks
// localStorage.setItem("tasks", JSON.stringify(tasks))
// document.getElementById('loadData').innerText = 'Load'

// }
async function loadDataFromAPI() {
  document.getElementById('loadData').innerText = 'loading'
  try {
    const response = await getResponseAsJson(Url)
    document.getElementById('loadData').innerText = 'Load'
    const tasksObjectFromApi = JSON.parse(response.tasks)
    localStorage.setItem('tasks', JSON.stringify(tasksObjectFromApi))
    const tasksList = document.querySelectorAll('li')
    for (let task of tasksList) {
      task.remove()
    }
    setSectionsContent()
  } catch {
    document.getElementById('loadData').innerText = 'Load'
    console.log('An error ocurred, so sorry!')
  }
}
async function getResponseAsJson(URL) {
  const response = await fetch(URL);
  const jsonResponse = await response.json();
  return jsonResponse;
}
function darkMode(){
  var element = document.getElementById("main-div");
  var button = document.getElementById("darkMode");
  var button2 = document.getElementById("brightMode");
  button.classList.add("hidden-task")
  button2.classList.remove("hidden-task")
  element.classList.remove("main-div")
  element.classList.add("dark");
  

}
function brightMode(){
  var element = document.getElementById("main-div");
  var button = document.getElementById("darkMode");
  var button2 = document.getElementById("brightMode");
  button2.classList.add("hidden-task")
  button.classList.remove("hidden-task")
  element.classList.remove("dark")
  element.classList.add("main-div");

}