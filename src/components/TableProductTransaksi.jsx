import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

import { useSelector } from 'react-redux';

const TableProductTransaksi = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(1);
  const [quantities, setQuantities] = useState({}); // Menggunakan objek untuk menyimpan quantity
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const { user } = useSelector((state) => state.auth);
 
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

  const handleAddToCart = async (event, productId) => {
    event.preventDefault();
    try {
      const productToAdd = data.find((item) => item.id === productId);
      const quantityToAdd = quantities[productId] || 1; // Mengambil nilai quantity dari objek quantities menggunakan ID produk
      await axios.post('http://localhost:8080/api/cart', {
        productId: productToAdd.id,
        quantity: quantityToAdd,
      });
      setSuccessMessage('Produk berhasil ditambahkan ke keranjang');
      setShouldRefresh(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuantityChange = (event, productId) => {
    const newQuantities = { ...quantities }; // Membuat salinan objek quantities
    newQuantities[productId] = parseInt(event.target.value); // Mengubah nilai quantity pada ID produk yang sesuai
    setQuantities(newQuantities); // Memperbarui state quantities
  };

  useEffect(() => {
    if (shouldRefresh) {
      window.location.reload();
    }
  }, [shouldRefresh]);

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
              No
            </th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
              Name
            </th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
              Kategori
            </th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
              Harga
            </th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
              Qty
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{count + index}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.category.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {item.price.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <form onSubmit={(event) => handleAddToCart(event, item.id)}>
                  <input className="mr-5 px-1 py-1 border border-gray-300 rounded-md"
                    type="number"
                    style={{ width: '60px' }}
                    min="1"
                    value={quantities[item.id] || ''} // Mengambil nilai quantity dari objek quantities menggunakan ID produk
                    onChange={(event) => handleQuantityChange(event, item.id)} // Memanggil fungsi handleQuantityChange dengan ID produk yang sesuai
                  />
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl ml-2 " type="submit" >
                    <ShoppingCartIcon strokeWidth={2} className="h-5 w-5" />
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {successMessage && <div className="text-green-500">{successMessage}</div>}
    </div>
  );
};

export default TableProductTransaksi;

