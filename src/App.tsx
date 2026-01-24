import { useEffect, useState, useRef } from "react";
import "./App.css";
import Timer from "./assets/components/Timer";

function App() {
  // State for theme (dark or light)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // State for current input text
  const [currentTask, newTask] = useState("");

  // State for deadline toggle and value
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadlineValue, setDeadlineValue] = useState("");

  // State for all tasks
  const [allTasks, addedTask] = useState<
    { text: string; completed: boolean; time: Date; deadline?: Date }[]
  >([]);

  // Track if this is the first render
  const isFirstRender = useRef(true);

  // Add a new task to the list
  function addtask() {
    if (currentTask.trim() === "") return;
    const newTaskObj: {
      text: string;
      completed: boolean;
      time: Date;
      deadline?: Date;
    } = {
      text: currentTask,
      completed: false,
      time: new Date(),
    };

    // Add deadline only if user chose to set one
    if (hasDeadline && deadlineValue) {
      newTaskObj.deadline = new Date(deadlineValue);
    }

    addedTask([...allTasks, newTaskObj]);
    newTask("");
    setHasDeadline(false);
    setDeadlineValue("");
  }

  // Delete a task by index
  function deletetask(taskIndex: number) {
    addedTask(allTasks.filter((task, i) => i !== taskIndex));
  }

  const toggle = (index: number) => {
    addedTask(
      allTasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  useEffect(() => {
    const saved = localStorage.getItem("index");
    if (saved) {
      const parsed = JSON.parse(saved);
      const tasksWithDates = parsed.map((task: any) => ({
        ...task,
        time: new Date(task.time), // Convert string back to Date
        deadline: task.deadline ? new Date(task.deadline) : undefined, // Convert deadline if exists
      }));
      addedTask(tasksWithDates);
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // Mark that first render is done
      return; // Skip saving on first render
    }
    localStorage.setItem("index", JSON.stringify(allTasks));
  }, [allTasks]);

  return (
    <div className={`app ${isDarkMode ? "dark" : "light"}`}>
      <div className="header">
        <button
          className="theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label="Toggle theme"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
        <h1>All Tasks</h1>
        <p className="task-count">
          {allTasks.length} {allTasks.length === 1 ? "task" : "tasks"}
        </p>
      </div>

      <div className="input-section">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a new task..."
          value={currentTask}
          onChange={(e) => newTask(e.target.value)}
        />

        <div className="deadline-section">
          <label>
            <input
              type="checkbox"
              checked={hasDeadline}
              onChange={(e) => setHasDeadline(e.target.checked)}
            />
            Set deadline
          </label>
          {hasDeadline && (
            <input
              type="datetime-local"
              className="deadline-input"
              value={deadlineValue}
              onChange={(e) => setDeadlineValue(e.target.value)}
            />
          )}
        </div>

        <button className="btn btn-primary" type="button" onClick={addtask}>
          Add
        </button>
      </div>

      {allTasks.length > 0 && (
        <div className="tasks-grid">
          {allTasks.map((task, index) => (
            <div
              key={index}
              className={`task-card ${task.completed ? "completed" : ""}`}
            >
              <div className="task-header">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggle(index)}
                />
                <span className="task-time">
                  {task.time.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="close"
                  onClick={() => deletetask(index)}
                ></button>
              </div>
              <div className="task-content">
                <p className="task-text">{task.text}</p>
                {task.deadline && (
                  <div className="task-deadline">
                    <Timer
                      deadline={task.deadline}
                      isCompleted={task.completed}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {allTasks.length === 0 && (
        <p className="empty-message">No tasks yet. Add one to get started!</p>
      )}
    </div>
  );
}

export default App;
