import Header from "./components/Header"
import TimeSection from "./components/TimeSection"
import TaskManagement from "./components/TaskManagement"
import StudyMaterials from "./components/StudyMaterials"
import { ThemeProvider } from "./components/ThemeProvider"

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Header />
          <TimeSection />
          <TaskManagement />
          <StudyMaterials />
        </div>
      </div>
    </ThemeProvider>
  )
}
