import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Typography, Button } from '@material-tailwind/react';
import { MinusCircleIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import { format } from 'date-fns';
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import authHeader from '../../services/auth-header';

export function Transaksi() {

  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState(''); 
  const { user } = useSelector((state) => state.auth);
  const isKasir = user?.usename === 'kasir';

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/order');
        setOrderData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrderData();
  }, []);

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this order?');
    if (!confirmDelete) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user && user.accessToken) {
        if (user.username === 'admin') {
          await axios.delete(`http://localhost:8080/api/order/${orderId}`, { headers: authHeader() });
          setMessage('Successfully deleted order');
          setOrderData(orderData.filter((order) => order.id !== orderId));

        } else {
          alert('You dont have permission to delete this order');
        }
      } else {
        alert('Token is invalid')
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-4 mb-4 flex flex-col gap-10">
      <div className="basis-1/2 hover:basis-1/2">
        <Link to="/form/formTransaksi">
          <Button>Tambah Data</Button>
        </Link>
      </div>
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-5 p-4">
          <Typography variant="h6" color="white">
            Rekap Transaksi
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {['Id', 'Tanggal', 'Customer', 'Jml Item', 'Total', 'Aksi'].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderData.map((order, index) => (
                <tr key={order.id}>
                  {/* <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.productCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.total.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl ml-2"
                    onClick={() => handleDelete(order.id)}
                    disabled={isKasir}
                  >
                    <MinusCircleIcon strokeWidth={2} className="h-5 w-5" />
                  </button>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Transaksi;
