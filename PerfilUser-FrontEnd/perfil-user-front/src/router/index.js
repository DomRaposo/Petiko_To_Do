import { createRouter, createWebHistory } from 'vue-router';

const LoginView = () => import('@/views/LoginView.vue');
const DashboardView = () => import('@/views/DashboardView.vue');
const TasksView = () => import('@/views/TasksView.vue');
const RegisterView = () => import('@/views/RegisterView.vue');
const UsersView = () => import('@/views/UsersView.vue');

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView },
  { path: '/tasks', name: 'Tasks', component: TasksView },
  { path: '/users', name: 'Users', component: UsersView },
  { path: '/', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem('token');

  if (authRequired && !token) {
    return next('/login');
  }
  next();
});

export default router; 