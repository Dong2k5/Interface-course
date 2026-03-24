import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import News from '../views/News.vue'
import Login from '../views/Login.vue'
import EditPetView from '../views/EditPetView.vue'
import EditNewsView from '../views/EditNewsView.vue'
import PetDetails from '../views/PetDetails.vue'
import AdminAdoptionView from '../views/AdminAdoptionView.vue'
import { useAuth } from '../composables/useAuth'

const routes = [
    { path: '/', name: 'Home', component: Home },       // default route
    { path: '/home', name: 'HomeAlt', component: Home },
    { path: '/about', name: 'About', component: About },
    { path: '/news', name: 'News', component: News },
    { path: '/login', name: 'Login', component: Login },
    { path: '/edit/:id', name: 'EditPet', component: EditPetView, props: true },
    { path: '/news/edit/:id', name: 'EditNews', component: EditNewsView, props: true },
    { path: '/admin/adoptions', name: 'AdminAdoptionsView', component: AdminAdoptionView },
    { path: '/pet/:id', name: 'PetDetails', component: PetDetails }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

// Route guard to protect admin/member routes
router.beforeEach((to, from, next) => {
    const { isAdmin } = useAuth()

    const adminRoutes = ['EditPet', 'EditNews', 'AdminAdoptionsView']

    if (adminRoutes.includes(to.name) && !isAdmin()) {
        alert("Admins only.")
        return next('/login')
    }

    next()
})

export default router