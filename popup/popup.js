let tasks = []

// Update time element
function updateTime() {
  chrome.storage.local.get(["timer", "timeOption"], (res) => {
    console.log(res.timer)
    const time = document.getElementById("time")
    const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0")
    let seconds = "00"
    if (res.timer % 60 !== 0) seconds = `${60 - res.timer % 60}`.padStart(2, "0")
    time.textContent = `${minutes}:${seconds}`
  })
}
// update time as soon as open
updateTime()
setInterval(updateTime, 1000)

// Start or Pause timer
const startTimerBtn = document.getElementById("start-timer-btn")
startTimerBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    chrome.storage.local.set({
      isRunning: !res.isRunning
    }, () => {
      startTimerBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer"
    })
  })
})


// Reset timer
const resetTimerBtn = document.getElementById("reset-timer-btn")
resetTimerBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
    isRunning: false
  }, () => {
    startTimerBtn.textContent = "Start Timer"
  })
})

const addTaskBtn = document.getElementById("add-task-btn")
addTaskBtn.addEventListener("click", () => addTask())

// Get tasks from storage and render them
chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ?? []
  renderTasks()
})

// save tasks to storage
function saveTasks() {
  chrome.storage.sync.set({
    tasks,
  })
}

// render a task
function renderTask(taskNum) {
  const taskRow = document.createElement("div")

  const text = document.createElement("input")
  text.type = "text"
  text.placeholder = "Enter a task..."
  text.value = tasks[taskNum]
  text.className = "task-input"
  text.addEventListener("change", () => {
    tasks[taskNum] = text.value
    saveTasks()
  })

  const deleteBtn = document.createElement("input")
  deleteBtn.type = "button"
  deleteBtn.value = "x"
  deleteBtn.className = "task-delete"
  deleteBtn.addEventListener("click", () => deleteTask(taskNum))

  taskRow.append(text)
  taskRow.append(deleteBtn)

  const taskContainer = document.getElementById("task-container")
  taskContainer.appendChild(taskRow)
}

// add a new task
function addTask() {
  const taskNum = tasks.length
  tasks.push("")
  renderTask(taskNum)
  saveTasks()
}

// Delete task
function deleteTask(taskNum) {
  tasks.splice(taskNum, 1)
  renderTasks()
  saveTasks()
}

// Render all tasks
function renderTasks() {
  const taskContainer = document.getElementById("task-container")
  taskContainer.textContent = ""
  tasks.forEach((taskText, taskNum) => {
    renderTask(taskNum)
  })
}