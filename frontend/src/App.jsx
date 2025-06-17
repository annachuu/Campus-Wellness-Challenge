import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Header
import Header from './components/Header'


// Pages
import Homepage from './pages/B_Homepage'
import Login from './pages/B_Login'
import Logout from './pages/B_Logout'
import Register from './pages/P_Register'
import CoordinatorRegister from './pages/C_Register'
import CoordinatorDashboard from './pages/C_Dashboard'
import ParticipantDashboard from './pages/P_Dashboard'
import ViewChallenge from './pages/C_ViewChallenge'
import P_ViewChallenge from './pages/P_ViewChallenge'
import PickRole from './pages/B_PickRole'
import CreateChallenge from './pages/C_CreateChallenge'
import Leaderboard from './pages/B_Leaderboard'
import UploadResource from './pages/C_UploadResource'
import EnrollParticipant from './pages/C_Enroll.jsx'
import C_ChallengeDetail from './pages/C_ChallengeDetail'
import C_AddAchievement from './pages/C_AddAchievement.jsx'
import Forum from './pages/B_Forum'

// Logged in users
import PrivateRoute from './components/PrivateRoute'
import './styles/pages.css'

// Fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Routes
import RoleRoute from './components/RoleRoute'

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Homepage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/coordinator-register' element={<CoordinatorRegister />} />
            <Route path='/pick-role' element={<PickRole />} />

            {/* Protected Routes */}
            <Route path='/logout' element={<PrivateRoute />}>
              <Route path='/logout' element={<Logout />} />
            </Route>

            <Route path='/coordinator-dashboard' element={
              <RoleRoute allowedRoles={['coordinator']}>
                <CoordinatorDashboard />
              </RoleRoute>
            } />

            <Route path='/create-challenge' element={
              <RoleRoute allowedRoles={['coordinator']}>
                <CreateChallenge />
              </RoleRoute>
            } />

            <Route path='/participant-dashboard' element={
              <RoleRoute allowedRoles={['participant']}>
                <ParticipantDashboard />
              </RoleRoute>
            } />

            <Route path='/view-challenge' element={
              <RoleRoute allowedRoles={['coordinator']}>
                <ViewChallenge />
              </RoleRoute>
            } />

            <Route path='/participant/view-challenge' element={
              <RoleRoute allowedRoles={['participant']}>
                <P_ViewChallenge />
              </RoleRoute>
            } />

            <Route path='/enroll-participant' element={<PrivateRoute />}>
              <Route path='/enroll-participant' element={<EnrollParticipant />} />
            </Route>

            <Route path='/leaderboard' element={<Leaderboard />} />

            <Route path='/upload-resource' element={<PrivateRoute />}>
              <Route path='/upload-resource' element={<UploadResource />} />
            </Route>

            <Route path='/register-participant' element={
              <RoleRoute>
                <Register />
              </RoleRoute>
            } />

            <Route path='/enroll-participant' element={
              <RoleRoute allowedRoles={['coordinator']}>
                <EnrollParticipant />
              </RoleRoute>
            } />

            {/* <Route path='/leaderboard' element={
              <RoleRoute allowedRoles={['coordinator', 'participant']}>
                <Leaderboard />
              </RoleRoute>
            } /> */}

            <Route path='/upload-resource' element={
              <RoleRoute allowedRoles={['coordinator']}>
                <UploadResource />
              </RoleRoute>
            } />

            <Route path='/challenge-detail' element={
              <RoleRoute allowedRoles={['coordinator']}>
                <C_ChallengeDetail />
              </RoleRoute>
            } />

            <Route path='/add-achievement' element={
              <RoleRoute allowedRoles={['coordinator']}>
                <C_AddAchievement />
              </RoleRoute>
            } />

            <Route path='/forum' element={
              <RoleRoute allowedRoles={['participant', 'coordinator']}>
                <Forum />
              </RoleRoute>
            }
              
            />

          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App 