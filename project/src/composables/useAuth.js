// Creating an admin user for testing purposes
if (!localStorage.getItem('user')) {
    localStorage.setItem('user', JSON.stringify({
        username: "admin",
        password: "admin123",
        role: "admin"
    }))
}
// For authentication store
import { ref } from 'vue'

const STORAGE_KEY = 'user'

export function useAuth() {
    const user = ref(loadUser())

    function loadUser() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw ? JSON.parse(raw) : null
        } catch {
            return null
        }
    }

    function saveUser() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
    }

    function register(username, password) {
        // Default role when registering = "member"
        user.value = {
            username,
            password,
            role: 'member'
        }
        saveUser()
        return true
    }

    function login(username, password) {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return false

        const stored = JSON.parse(raw)

        if (stored.username === username && stored.password === password) {
            user.value = stored
            return true
        }
        return false
    }

    function logout() {
        user.value = null
        localStorage.removeItem(STORAGE_KEY)
    }

    const isLoggedIn = () => user.value !== null
    const isAdmin = () => user.value?.role === 'admin'
    const isMember = () => user.value?.role === 'member'

    return {
        user,
        register,
        login,
        logout,
        isLoggedIn,
        isAdmin,
        isMember
    }
}