import { ref } from 'vue'

const STORAGE_KEY = 'news'

export function useNews() {
    const defaultNews = [
        { id: 1, title: 'Adoption Event', content: 'Join our adoption drive...', category: 'Event', date: '2025-11-01' },
        { id: 2, title: 'Pet Care Tips', content: 'Learn how to care for...', category: 'Tips', date: '2025-11-05' },
        { id: 3, title: 'New Arrivals', content: 'We have new pets available...', category: 'Announcement', date: '2025-11-10' },
        { id: 4, title: 'Volunteer Opportunities', content: 'Help us care for animals...', category: 'Volunteer', date: '2025-11-15' },
        { id: 5, title: 'Fundraising Gala', content: 'Support our mission...', category: 'Event', date: '2025-11-20' }
    ]

    const loadNews = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw ? JSON.parse(raw) : defaultNews
        } catch (e) {
            console.error('Failed to parse news from localStorage', e)
            return defaultNews
        }
    }

    const news = ref(loadNews())

    const saveNews = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(news.value))

    // CREATE
    const addNews = (item) => {
        const newItem = { ...item, id: Date.now() }
        news.value.push(newItem)
        saveNews()
        return newItem
    }

    // READ
    const findNewsById = (id) => news.value.find(n => Number(n.id) === Number(id))

    // UPDATE
    const updateNews = (updated) => {
        const idx = news.value.findIndex(n => Number(n.id) === Number(updated.id))
        if (idx !== -1) {
            news.value[idx] = { ...updated }
            saveNews()
            return true
        }
        return false
    }

    // DELETE
    const deleteNews = (id) => {
        const before = news.value.length
        news.value = news.value.filter(n => Number(n.id) !== Number(id))
        if (news.value.length !== before) {
            saveNews()
            return true
        }
        return false
    }

    return {
        news,
        addNews,
        findNewsById,
        updateNews,
        deleteNews,
        saveNews
    }
}