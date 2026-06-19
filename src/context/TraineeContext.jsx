'use client'

import { createContext, useContext, useState } from 'react'

const TraineeContext = createContext()

export function TraineeProvider({ children }) {
  const [application, setApplication] = useState(null)
  const [courses, setCourses] = useState([])
  const [progress, setProgress] = useState(null)

  return (
    <TraineeContext.Provider value={{ 
      application, setApplication, 
      courses, setCourses, 
      progress, setProgress 
    }}>
      {children}
    </TraineeContext.Provider>
  )
}

export function useTrainee() {
  return useContext(TraineeContext)
}
