import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from "@material-tailwind/react";
import authHeader from '../services/auth-header';

const TableCategory = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const isKasir = user?.username === 'kasir';

  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:8080/api/categories');
        setData(result.data.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/categories/${id}`);
      const category = response.data;

      navigate('/form/editCategory', { state: { category } });
    } catch (error) {
      console.log(`Gagal mengambil data kategori dengan id ${id}: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) {
      return;
    }
  
    try {
      const user = JSON.parse(localStorage.getItem("user"));
  
      if (user && user.accessToken) {
        if (user.username === 'admin') {
          await axios.delete(`http://localhost:8080/api/categories/${id}`, { headers: authHeader() });
          setMessage('Data kategori berhasil dihapus.');
          setData((prevData) => prevData.filter((item) => item.id !== id));
        } else {
          alert('Anda tidak memiliki izin untuk menghapus kategori');
        }
      } else {
        alert('Token tidak tersedia. Silakan login untuk melanjutkan.');
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">ID</th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">Name</th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md mr-2"
                  ripple={true}
                  onClick={() => handleEdit(item.id)}
                  disabled={isKasir}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md"
                  ripple={true}
                  onClick={() => handleDelete(item.id)}
                  disabled={isKasir}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableCategory;
