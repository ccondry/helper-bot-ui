const routes = [{
  // catch-all to redirect to home view if no route matched
  path: '*',
  redirect: '/'
}, {
  // the home page
  name: 'Home',
  path: '/',
  component: () => import(`../views/home.vue`)
}, {
  // the admin panel
  name: 'Admin',
  path: '/admin',
  component: () => import(`../views/admin.vue`)
}, {
  // bot-specific page
  name: 'Bot',
  path: '/bot/:id',
  component: () => import(`../views/bot.vue`)
}, {
  // room-specific page
  name: 'Room',
  path: '/room/:id',
  component: () => import(`../views/room.vue`)
}]
export default routes