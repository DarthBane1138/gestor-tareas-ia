import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import UserTasksPage from './UserTasksPage.jsx'
import CreateTaskPage from './CreateTaskPage.jsx'
import CreateUserPage from './CreateUserPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/users/create" element={<CreateUserPage />} />
        <Route path="/users/:userId/tasks" element={<UserTasksPage />} />
        <Route path="/users/:userId/tasks/create" element={<CreateTaskPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
