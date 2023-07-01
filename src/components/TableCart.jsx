import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { MinusCircleIcon } from "@heroicons/react/24/outline";

const TableCart = ({ resetCart }) => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(1);
  const [productDataList, setProductDataList] = useState([]);
  const [subtotals, setSubtotals] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/cart');
        const sortedData = response.data.sort((b, a) => new Date(b.createdAt) - new Date(a.createdAt));
        setData(sortedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProductDataList = async () => {
      try {
        const promises = data.map((item) => axios.get(`http://localhost:8080/api/products/${item.productId}`));
        const responses = await Promise.all(promises);
        const productDataList = responses.map((response) => response.data);
        setProductDataList(productDataList);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductDataList();
  }, [data]);

  useEffect(() => {
    const calculateSubtotals = () => {
      const subtotals = data.map((item, index) => {
        const productData = productDataList[index] || {};
        return item.quantity * productData.harga;
      });
      setSubtotals(subtotals);
    };
    calculateSubtotals();
  }, [data, productDataList]);

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/${productId}`);
      const response = await axios.get('http://localhost:8080/api/cart');
      const sortedData = response.data.sort(
        (b, a) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setData(sortedData);
      resetCart(); // Panggil fungsi resetCart untuk mengosongkan data cart di komponen induk
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
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
              Qty
            </th>
            <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
              Sub Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => {
            const productData = productDataList[index] || {};
            const subtotal = subtotals[index] || 0;
            return (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{count + index}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{productData.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{productData.price}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{subtotal}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl ml-2"
                    onClick={() => handleDelete(item.id)}
                  >
                    <MinusCircleIcon strokeWidth={2} className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableCart;
