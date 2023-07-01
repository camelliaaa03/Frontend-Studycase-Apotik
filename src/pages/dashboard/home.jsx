import React from "react";
import { Link,  } from "react-router-dom";
import { StatisticsCard } from "@/widgets/cards";
import { ShieldCheckIcon, PlusCircleIcon, FolderPlusIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";

export function Home() {

  const { user } = useSelector(state => state.auth);

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        <Link to="/form/formTransaksi">
          <div className="basis-1/2 hover:basis-1/2">
            <StatisticsCard
              color="blue"
              icon={<ShieldCheckIcon className="w-6 h-6 text-white" />}
              title="Transaksi"
              value="Pembelian"
            />
          </div>
        </Link>
        {!user || user.username === "admin" ? (
          <>
            <Link to="/form/produk">
              <div className="basis-1/2 hover:basis-1/2">
                <StatisticsCard
                  color="pink"
                  icon={<PlusCircleIcon className="w-6 h-6 text-white" />}
                  title="Tambah Data"
                  value="Obat"
                />
              </div>
            </Link>
            <Link to="/form/addCategory">
              <div className="basis-1/2 hover:basis-1/2">
                <StatisticsCard
                  color="green"
                  icon={<FolderPlusIcon className="w-6 h-6 text-white" />}
                  title="Tambah Data"
                  value="Kategori"
                />
              </div>
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );

}

export default Home;
