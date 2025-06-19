import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RoleRoute = ({ children, allowedRoles }) => {
    const { user } = useSelector((state) => state.auth)
    const path = window.location.pathname
    // Extract the first part of the path after the first slash
    const firstPath = path.split('/')[1]
    // Extract the second part for nested routes like 'participant/view-challenge'
    const secondPath = path.split('/')[2]

    console.log('RoleRoute - Current path:', path)
    console.log('RoleRoute - First path:', firstPath)
    console.log('RoleRoute - Second path:', secondPath)
    console.log('RoleRoute - User:', user)
    console.log('RoleRoute - Allowed roles:', allowedRoles)

    // If not logged in, redirect to login
    if (!user) {
        console.log('RoleRoute - No user found, redirecting to login')
        return <Navigate to="/login" />
    }

    // If allowedRoles is specified, check if user's role is allowed
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.log('RoleRoute - User role not allowed for this route')
        return <Navigate to={`/${user.role}-dashboard`} />
    }

    // Check user role from the user object
    const isCoordinator = user.role === 'coordinator'
    const isParticipant = user.role === 'participant'

    console.log('RoleRoute - User role:', user.role)
    console.log('RoleRoute - Is coordinator:', isCoordinator)
    console.log('RoleRoute - Is participant:', isParticipant)

    // Special handling for dashboard paths
    if (firstPath === 'participant-dashboard' && isParticipant) {
        console.log('RoleRoute - Participant accessing their dashboard')
        return children
    }
    if (firstPath === 'coordinator-dashboard' && isCoordinator) {
        console.log('RoleRoute - Coordinator accessing their dashboard')
        return children
    }

    // Special handling for create challenge path
    if (firstPath === 'create-challenge' && isCoordinator) {
        console.log('RoleRoute - Coordinator accessing create challenge')
        return children
    }

    // If logged in as participant
    if (isParticipant) {
        // Allow access to participant dashboard and related pages
        const allowedPaths = ['dashboard', 'view-challenge', 'leaderboard', 'leaderboard-all']
        
        // Check if it's a participant route (starts with 'participant/')
        if (firstPath === 'participant' && allowedPaths.includes(secondPath)) {
            console.log('RoleRoute - Participant accessing allowed participant page')
            return children
        }
        
        // Check direct paths
        if (allowedPaths.includes(firstPath)) {
            console.log('RoleRoute - Participant accessing allowed page')
            return children
        }
        
        // Redirect to participant dashboard for other pages
        console.log('RoleRoute - Participant accessing restricted page, redirecting to dashboard')
        return <Navigate to="/participant-dashboard" />
    }

    // If logged in as coordinator
    if (isCoordinator) {
        // Allow access to coordinator pages
        const allowedPaths = ['coordinator-dashboard', 'create-challenge', 'enroll-participant', 'upload-resource', 'view-challenge', 'challenge-detail', 'add-achievement']
        if (allowedPaths.includes(firstPath)) {
            console.log('RoleRoute - Coordinator accessing allowed page')
            return children
        }
        // Redirect to coordinator dashboard for other pages
        console.log('RoleRoute - Coordinator accessing restricted page, redirecting to dashboard')
        return <Navigate to="/coordinator-dashboard" />
    }

    // If role is not recognized, redirect to login
    console.log('RoleRoute - Unknown role, redirecting to login')
    return <Navigate to="/login" />
}

export default RoleRoute