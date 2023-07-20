import { Card, CardHeader, CardBody, Typography, Button  } from '@material-tailwind/react';
import {useNavigate } from 'react-router-dom';
import React from 'react';
import TableProduct from "../../components/TableProduct";
import { useSelector } from "react-redux";

export function DaftarObat () {

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isKasir = user?.username === "kasir";
 
   const handleTambahData = () => {
    if (isKasir) {
      // Pengguna kasir tidak diizinkan mengakses halaman "Tambah Data"
      alert('Anda tidak diizinkan mengakses halaman ini.');
    } else {
      // Alihkan ke halaman "Tambah Data"
      navigate('/form/produk');
    }
  };

  return (
    <div className="mt-4 mb-4 flex flex-col gap-10">
      <div className="basis-1/2 hover:basis-1/2">
        <Button disabled={isKasir} onClick={handleTambahData}>Tambah Data</Button>
      </div>
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-5 p-4">
          <Typography variant="h6" color="white">
            Data Produk
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <TableProduct/>
        </CardBody>
      </Card>
    </div>
  );
}
export default DaftarObat;
