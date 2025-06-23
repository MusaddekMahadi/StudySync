"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TimeSection() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentTask, setCurrentTask] = useState<string>("")
  const intervalRef = useRef<NodeJS.Timeout>()
  const startTimeRef = useRef<number>(0)

  // Load timer state from localStorage
  useEffect(() => {
    const savedTimer = localStorage.getItem("studyTimer")
    if (savedTimer) {
      const { seconds, isRunning, startTime, task } = JSON.parse(savedTimer)
      setTimerSeconds(seconds)
      setCurrentTask(task || "")

      if (isRunning && startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setTimerSeconds(seconds + elapsed)
        setIsTimerRunning(true)
        startTimeRef.current = startTime
      }
    }
  }, [])

  // Save timer state to localStorage
  useEffect(() => {
    const timerState = {
      seconds: timerSeconds,
      isRunning: isTimerRunning,
      startTime: startTimeRef.current,
      task: currentTask,
    }
    localStorage.setItem("studyTimer", JSON.stringify(timerState))
  }, [timerSeconds, isTimerRunning, currentTask])

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Timer logic with persistence
  useEffect(() => {
    if (isTimerRunning) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now() - timerSeconds * 1000
      }

      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setTimerSeconds(elapsed)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isTimerRunning])

  // Listen for timer events from task management
  useEffect(() => {
    const handleTimerStart = (event: CustomEvent) => {
      setCurrentTask(event.detail.taskName)
      setIsTimerRunning(true)
      startTimeRef.current = Date.now() - timerSeconds * 1000
    }

    const handleTimerStop = () => {
      setIsTimerRunning(false)
      setCurrentTask("")
      startTimeRef.current = 0
    }

    window.addEventListener("startTimer", handleTimerStart as EventListener)
    window.addEventListener("stopTimer", handleTimerStop)

    return () => {
      window.removeEventListener("startTimer", handleTimerStart as EventListener)
      window.removeEventListener("stopTimer", handleTimerStop)
    }
  }, [timerSeconds])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatCurrentTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleTimerToggle = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false)
      setCurrentTask("")
      startTimeRef.current = 0
    } else {
      setIsTimerRunning(true)
      setCurrentTask("Manual Timer")
      startTimeRef.current = Date.now() - timerSeconds * 1000
    }
  }

  const handleTimerReset = () => {
    setTimerSeconds(0)
    setIsTimerRunning(false)
    setCurrentTask("")
    startTimeRef.current = 0
  }

  return (
    <section className="mb-8" aria-labelledby="time-section-heading">
      <h2 id="time-section-heading" className="sr-only">
        Time and Timer Section
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Current Time Display */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Current Time</h3>
          </div>
          <div className="text-center">
            <time
              className="text-3xl md:text-4xl font-mono font-bold text-gray-800 dark:text-white mb-2 block"
              dateTime={currentTime.toISOString()}
            >
              {formatCurrentTime(currentTime)}
            </time>
            <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{formatDate(currentTime)}</div>
          </div>
        </div>

        {/* Study Timer */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-3 h-3 rounded-full transition-colors ${
                isTimerRunning ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
              aria-hidden="true"
            />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Study Timer</h3>
          </div>
          <div className="text-center mb-4">
            <div
              className="text-3xl md:text-4xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-4"
              role="timer"
              aria-live="polite"
              aria-atomic="true"
            >
              {formatTime(timerSeconds)}
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button
                onClick={handleTimerToggle}
                className={`${
                  isTimerRunning
                    ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                    : "bg-green-500 hover:bg-green-600 focus:ring-green-500"
                } text-white transition-colors focus:ring-2 focus:ring-offset-2`}
                aria-label={isTimerRunning ? "Pause timer" : "Start timer"}
              >
                {isTimerRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isTimerRunning ? "Pause" : "Start"}
              </Button>
              <Button
                onClick={handleTimerReset}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Reset timer"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Currently Working On */}
      <div
        className={`transition-all duration-300 ${
          currentTask ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2 pointer-events-none"
        }`}
        aria-live="polite"
      >
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg p-4 text-center">
          <p className="text-lg font-medium">
            Currently working on: <span className="font-bold">{currentTask}</span>
          </p>
        </div>
      </div>

      {!currentTask && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          <p>No active task - Start a timer to begin tracking your study session</p>
        </div>
      )}
    </section>
  )
}
