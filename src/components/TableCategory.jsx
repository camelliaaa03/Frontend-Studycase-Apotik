import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PencilSquareIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import authHeader from '../services/auth-header';
import { Input } from '@material-tailwind/react';

const TableCategory = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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

  const filterData = (data, searchTerm) => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Lakukan filter pada data produk berdasarkan searchTerm
  const filteredData = filterData(data, searchTerm);

  const handleEdit = async (id) => {
    try {

      const user = JSON.parse(localStorage.getItem("user"));

      if (user && user.accessToken) {
        if (user.username === 'admin') {
          const response = await axios.get(`http://localhost:8080/api/categories/${id}`);
          const category = response.data;
          navigate('/form/editCategory', { state: { category } });
        } else {
          alert('You dont have permission to edit this category');
        }
      } else {
        alert('Token is invalid');
      }
    } catch (error) {
      console.log(`Failed to fetch category data by id ${id}: ${error.message}`);
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
          setMessage('Category deleted successfully');
          setData((prevData) => prevData.filter((item) => item.id !== id));
        } else {
          alert('You dont have permission to delete this category');
        }
      } else {
        alert('Token is invalid, please try again');
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
          placeholder="Cari kategori"
        />
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">Id Kategori</th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">Nama</th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl ml-2"
                  ripple={true}
                  onClick={() => handleEdit(item.id)}
                >
                  <PencilSquareIcon strokeWidth={2} className="h-5 w-5 flex items-center" />
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl ml-2"
                  ripple={true}
                  onClick={() => handleDelete(item.id)}
                >
                  <MinusCircleIcon strokeWidth={2} className="h-5 w-5 flex items-center" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableCategory;
