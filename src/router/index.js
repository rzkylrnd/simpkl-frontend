import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
    meta: { guest: true },
  },
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { auth: true },
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("../views/DashboardView.vue"),
      },
      {
        path: "users",
        name: "Users",
        component: () => import("../views/UserView.vue"),
      },
      {
        path: "sekolah",
        name: "Sekolah",
        component: () => import("../views/SekolahView.vue"),
      },
      {
        path: "tempat-pkl",
        name: "TempatPkl",
        component: () => import("../views/TempatPklView.vue"),
      },
      {
        path: "siswa",
        name: "Siswa",
        component: () => import("../views/SiswaView.vue"),
      },
      {
        path: "penempatan",
        name: "Penempatan",
        component: () => import("../views/PenempatanView.vue"),
      },
      {
        path: "presensi",
        name: "Presensi",
        component: () => import("../views/PresensiView.vue"),
      },
      {
        path: "jam-presensi",
        name: "JamPresensi",
        component: () => import("../views/JamPresensiView.vue"),
      },
      {
        path: "jurnal",
        name: "Jurnal",
        component: () => import("../views/JurnalView.vue"),
      },
      {
        path: "laporan",
        name: "Laporan",
        component: () => import("../views/LaporanView.vue"),
      },
      {
        path: "penilaian",
        name: "Penilaian",
        component: () => import("../views/PenilaianView.vue"),
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("../views/ProfileView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.auth && !authStore.isLoggedIn) next("/login");
  else if (to.meta.guest && authStore.isLoggedIn) next("/");
  else next();
});

export default router;
