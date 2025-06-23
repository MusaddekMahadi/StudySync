"use client"

import { BookOpen, Moon, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./ThemeProvider"

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="text-center mb-8" role="banner">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1" />

        <div className="flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">StudySync</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              Organize Your Study, Boost Your Focus
            </p>
          </div>
        </div>

        <div className="flex-1 flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="User profile"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
