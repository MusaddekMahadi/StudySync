"use client"

import { useState, useEffect } from "react"
import { Plus, Play, Pause, Clock, Trash2, Edit3, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface Task {
  id: string
  name: string
  expectedTime: number // in minutes
  actualTime: number // in seconds
  isCompleted: boolean
  progress: number // percentage
  isActive: boolean
  priority: "high" | "medium" | "low"
  createdAt: Date
}

type SortOption = "name" | "priority" | "progress" | "createdAt"
type FilterOption = "all" | "completed" | "pending" | "active"

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskName, setNewTaskName] = useState("")
  const [newTaskTime, setNewTaskTime] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium")
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("createdAt")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [showFilters, setShowFilters] = useState(false)

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("studyTasks")
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }))
      setTasks(parsedTasks)
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("studyTasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (newTaskName.trim() && newTaskTime) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: newTaskName.trim(),
        expectedTime: Number.parseInt(newTaskTime),
        actualTime: 0,
        isCompleted: false,
        progress: 0,
        isActive: false,
        priority: newTaskPriority,
        createdAt: new Date(),
      }
      setTasks([...tasks, newTask])
      setNewTaskName("")
      setNewTaskTime("")
      setNewTaskPriority("medium")
    }
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, isCompleted: !task.isCompleted, progress: !task.isCompleted ? 100 : task.progress }
          : task,
      ),
    )
  }

  const updateTaskProgress = (id: string, progress: number[]) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, progress: progress[0] } : task)))
  }

  const updateTaskName = (id: string, name: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, name } : task)))
    setEditingTask(null)
  }

  const startTaskTimer = (id: string) => {
    // Stop all other timers
    setTasks(tasks.map((task) => ({ ...task, isActive: false })))

    // Start this task's timer
    setTasks(tasks.map((task) => (task.id === id ? { ...task, isActive: true } : task)))

    const task = tasks.find((t) => t.id === id)
    if (task) {
      window.dispatchEvent(
        new CustomEvent("startTimer", {
          detail: { taskName: task.name },
        }),
      )
    }
  }

  const stopTaskTimer = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, isActive: false } : task)))
    window.dispatchEvent(new CustomEvent("stopTimer"))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
      case "low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
    }
  }

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "progress":
          return b.progress - a.progress
        case "createdAt":
          return b.createdAt.getTime() - a.createdAt.getTime()
        default:
          return 0
      }
    })
  }

  const filterTasks = (tasks: Task[]) => {
    switch (filterBy) {
      case "completed":
        return tasks.filter((task) => task.isCompleted)
      case "pending":
        return tasks.filter((task) => !task.isCompleted)
      case "active":
        return tasks.filter((task) => task.isActive)
      default:
        return tasks
    }
  }

  const filteredAndSortedTasks = sortTasks(filterTasks(tasks))

  return (
    <section className="mb-8" aria-labelledby="task-management-heading">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2
            id="task-management-heading"
            className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3"
          >
            <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            Task Management
          </h2>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              aria-expanded={showFilters}
              aria-controls="filter-controls"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Filter and Sort Controls */}
        {showFilters && (
          <div id="filter-controls" className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="sort-select"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Sort by
                </label>
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger id="sort-select" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="filter-select"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Filter by
                </label>
                <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
                  <SelectTrigger id="filter-select" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Add New Task */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Add New Task</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Task name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="col-span-1 sm:col-span-2 lg:col-span-1"
              aria-label="Task name"
            />
            <Input
              placeholder="Expected time (minutes)"
              type="number"
              value={newTaskTime}
              onChange={(e) => setNewTaskTime(e.target.value)}
              aria-label="Expected time in minutes"
            />
            <Select
              value={newTaskPriority}
              onValueChange={(value: "high" | "medium" | "low") => setNewTaskPriority(value)}
            >
              <SelectTrigger aria-label="Task priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={addTask}
              className="bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={!newTaskName.trim() || !newTaskTime}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>
                {filterBy === "all"
                  ? "No tasks yet. Add your first task to get started!"
                  : `No ${filterBy} tasks found.`}
              </p>
            </div>
          ) : (
            filteredAndSortedTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  task.isActive
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400"
                    : task.isCompleted
                      ? "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700"
                      : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      checked={task.isCompleted}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1"
                      aria-label={`Mark ${task.name} as ${task.isCompleted ? "incomplete" : "complete"}`}
                    />
                    <div className="flex-1 min-w-0">
                      {editingTask === task.id ? (
                        <Input
                          value={task.name}
                          onChange={(e) => updateTaskName(task.id, e.target.value)}
                          onBlur={() => setEditingTask(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") setEditingTask(null)
                            if (e.key === "Escape") setEditingTask(null)
                          }}
                          className="mb-2"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-2 mb-2">
                          <h4
                            className={`font-semibold text-lg ${
                              task.isCompleted
                                ? "line-through text-gray-500 dark:text-gray-400"
                                : "text-gray-800 dark:text-white"
                            }`}
                          >
                            {task.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingTask(task.id)}
                            className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Edit ${task.name}`}
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <span>Expected: {task.expectedTime} min</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:min-w-0 lg:w-auto">
                    <div className="flex flex-col gap-2 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">Progress:</span>
                        <div className="flex-1 min-w-[120px]">
                          <Slider
                            value={[task.progress]}
                            onValueChange={(value) => updateTaskProgress(task.id, value)}
                            max={100}
                            step={5}
                            className="w-full"
                            aria-label={`Progress for ${task.name}: ${task.progress}%`}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[3ch]">{task.progress}%</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => (task.isActive ? stopTaskTimer(task.id) : startTaskTimer(task.id))}
                        className={`${
                          task.isActive
                            ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                            : "bg-green-500 hover:bg-green-600 focus:ring-green-500"
                        } text-white focus:ring-2 focus:ring-offset-2`}
                        aria-label={`${task.isActive ? "Stop" : "Start"} timer for ${task.name}`}
                      >
                        {task.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteTask(task.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label={`Delete ${task.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {task.isActive && (
                  <div className="mt-3 p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                      ⏱️ Timer is running for this task
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Task Statistics */}
        {tasks.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Task Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{tasks.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Tasks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {tasks.filter((t) => t.isCompleted).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {tasks.filter((t) => !t.isCompleted).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(tasks.reduce((acc, task) => acc + task.progress, 0) / tasks.length) || 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Avg Progress</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
