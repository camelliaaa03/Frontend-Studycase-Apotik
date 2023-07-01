import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import React from 'react';
import TableCategory from "../../components/TableCategory";
import { useSelector } from "react-redux";

export function Kategori() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isKasir = user?.username === "kasir";
    
  const handleTambahData = () => {
    if (isKasir) {
      // Pengguna kasir tidak diizinkan mengakses halaman "Tambah Data"
      alert('Anda tidak diizinkan mengakses halaman ini.');
    } else {
      // Alihkan ke halaman "Tambah Data"
      navigate('/form/addCategory');
    }
  };

  return (
    <div className="mt-8 mb-8 flex flex-col gap-12">
      <div class="basis-1/2 hover:basis-1/2">
        <Button disabled={isKasir} onClick={handleTambahData}>Tambah Data</Button>
      </div>
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-5 p-4">
          <Typography variant="h6" color="white">
            Kategori Produk
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <TableCategory/>
        </CardBody>
      </Card>
    </div>
  );
}

export default Kategori;
