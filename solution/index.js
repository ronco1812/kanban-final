function createListElement(text) {
  const element = document.createElement('li')
  element.classList.add('task')
  element.innerText = text
//   for (let listener in eventListeners) {
//     element.addEventListener(listener, eventListeners[listener])
//   }
  return element
}
function addButtonHandler(event) {
  const input = event.path[1].children[2].value
  if (!input) {
    alert('please enter a task, do not enter an empty one')
  } else {
    const taskEle = createListElement(input)
    event.path[1].children[1].append(taskEle)
  }
}
