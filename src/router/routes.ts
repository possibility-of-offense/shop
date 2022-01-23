import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/Pages/Index.vue") },
    ],
  },
  {
    path: "/log-in",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "Login",
        component: () => import("pages/Auth/Login.vue"),
      },
    ],
  },
  {
    path: "/sign-in",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "Signin",
        component: () => import("pages/Auth/Signin.vue"),
      },
    ],
  },
  {
    path: "/my-account",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "Account",
        component: () => import("pages/Auth/Account.vue"),
      },
    ],
  },
  {
    path: "/product/:id",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "SingleProduct",
        component: () => import("pages/Products/SingleProduct.vue"),
        props: true,
      },
    ],
  },
  {
    path: "/cart",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "Cart",
        component: () => import("pages/Pages/Cart.vue"),
        props: true,
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("src/pages/Pages/Error404.vue"),
  },
];

export default routes;
