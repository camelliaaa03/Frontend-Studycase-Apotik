import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

import { HomeIcon, TableCellsIcon, ChartPieIcon, ShieldCheckIcon, UserGroupIcon,  ArrowLeftOnRectangleIcon,} from "@heroicons/react/24/solid";
import { Home, DaftarObat, Kategori, Transaksi } from "@/pages/dashboard";
import { Produk, AddCategory, FormTransaksi, User, EditCategory, EditProduct } from "@/pages/form";

import { logout } from "./actions/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return <Navigate to="/auth/sign-in"/>;
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Home",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Daftar Produk",
        path: "/daftarObat",
        element: <DaftarObat />,
      },
      {
        icon: <ChartPieIcon {...icon} />,
        name: "Kategori Produk",
        path: "/kategori",
        element: <Kategori />,
      },
      {
        icon: <ShieldCheckIcon {...icon} />,
        name: "Transaksi",
        path: "/transaksi",
        element: <Transaksi />,
      },
    ],
  },

  {
    title: "Settings",
    layout: "dashboard",
    pages: [
      // {
      //   icon: <UserGroupIcon {...icon} />,
      //   name: "Manajemen User",
      //   path: "/managementUser",
      //   element: <Management />,
      // },
      {
        icon: <ArrowLeftOnRectangleIcon {...icon} />,
        name: "Logout",
        path: "/logout",
        element: <Logout />,
      },
    ],
  },

  {
    layout: "form",
    pages: [
      {
        path: "/produk",
        element: <Produk />
      },
      {
        path: "/addCategory",
        element: <AddCategory />
      },
      {
        path: "/formTransaksi",
        element: <FormTransaksi />
      },
      {
        path: "/user",
        element: <User />
      },
      {
        path: "/editCategory",
        element: <EditCategory />
      },
      {
        path: "/editProduct",
        element: <EditProduct />
      }
    ],
  },
];

export default routes;
