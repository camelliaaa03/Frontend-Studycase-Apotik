import {
  ShieldCheckIcon,
  PlusCircleIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "blue",
    icon: ShieldCheckIcon,
    title: "Transaksi",
    value: "Pembelian",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "than last week",
    },
    path: "/form/formTransaksi"
  },
  {
    color: "pink",
    icon:   PlusCircleIcon,
    title: "Tambah Data ",
    value: "Obat",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "than last month",
    },
    path: "/form/produk"
  },
  {
    color: "green",
    icon: FolderPlusIcon,
    title: "Tambah Data",
    value: "Kategori",
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "than yesterday",
    },
    path: "/form/category"
  },
];

export default statisticsCardsData;
