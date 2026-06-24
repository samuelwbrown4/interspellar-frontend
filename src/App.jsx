import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import SignIn from './pages/SignIn'
import Puzzle from './pages/Puzzle'


function App() {

  const [userId, setUserId] = useState(localStorage.getItem('user'))

  useEffect(() => {
    if (userId === null) {
      localStorage.removeItem('user')
      return
    }
    localStorage.setItem('user', userId)
  }, [userId])

  return (
    <MantineProvider>
      <Notifications/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignIn setUserId={setUserId} />} />
          <Route path='/puzzle' element={<Puzzle setUserId={setUserId} userId={userId}/>} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
