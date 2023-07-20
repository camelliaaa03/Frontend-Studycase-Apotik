import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { PencilSquareIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { Input } from '@material-tailwind/react';
import authHeader from '../services/auth-header';

const TableProduct = () => {

  const { user } = useSelector((state) => state.auth);
  const isKasir = user?.username === 'kasir';

  const [data, setData] = useState([]); 
  const [count, setCount] = useState(1); 
  const [message, setMessage] = useState(''); 
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  //mengambil data kategori dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        const sortedData = response.data.sort((b, a) => new Date(b.createdAt) - new Date(a.createdAt));
        setData(sortedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const filterData = (data, searchTerm) => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || // Filter berdasarkan nama produk
        item.category.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter berdasarkan nama kategori
    );
  };

  // Lakukan filter pada data produk berdasarkan searchTerm
  const filteredData = filterData(data, searchTerm);

    const handleEdit = async (id) => {
      try{

        const user = JSON.parse(localStorage.getItem("user"));

        if (user && user.accessToken) {
          if (user.username === 'admin') {
            const response = await axios.get(`http://localhost:8080/api/products/${id}`);
            const product = response.data; 
            navigate('/form/editProduct', { state : { product }});
          } else {
            alert('You dont have permission to edit this product');
          }
        } else {
          alert('Token is invalid')
        }
      } catch (error) {
        console.log(`Failed to fetch product data by id ${id}: ${error.message}`);
      }
    };

    const handleDelete = async (id) => {
      const confirmDelete = window.confirm('Are you sure you want to delete this product?');
      if (!confirmDelete) {
        return;
      }
    
      try {
        const user = JSON.parse(localStorage.getItem("user"));
    
        if (user && user.accessToken) {
          if (user.username === 'admin') {
            await axios.delete(`http://localhost:8080/api/products/${id}`, { headers: authHeader() });
            setMessage('Product deleted successfully');
            setData((prevData) => prevData.filter((item) => item.id !== id));
          } else {
            alert('You dont have permission to delete this product');
          }
        } else {
          alert('Token is invalid, please login to continue');
        }
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div>
      <div className="ml-5 mr-auto md:mr-4 md:w-56">
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Cari produk atau kategori"
      />
      </div>
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
              No
            </th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
              Nama
            </th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
              Harga
            </th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
              Expired
            </th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
              Kategori
            </th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
              Deskripsi
            </th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
              Aksi
            </th>
            
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.map((item, index) => (
            <tr key={item.id}>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{count + index}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {item.price.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                  })}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                {format(new Date(item.expired), 'dd/MM/yyyy')}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{item.category.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 break-words">{item.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl ml-2" onClick={() => handleEdit(item.id)} ><PencilSquareIcon strokeWidth={2} className="h-5 w-5 flex items-center" /></button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl ml-2" onClick={() => handleDelete(item.id)} ><MinusCircleIcon strokeWidth={2} className="h-5 w-5 flex items-center" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableProduct;
