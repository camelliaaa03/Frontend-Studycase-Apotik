import React, { useState, useEffect } from 'react';
  import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Input,
    Button,
  } from '@material-tailwind/react';
  import TableProductTransaksi from '@/components/TableProductTransaksi';
  import TableCart from '@/components/TableCart';
  
  import axios from 'axios';
  
  export function FormTransaksi() {
    const [data, setData] = useState([]);
    const [productDataList, setProductDataList] = useState([]);
    const [subtotals, setSubtotals] = useState([]);
    const [totalSubtotal, setTotalSubtotal] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [customerName, setCustomerName] = useState('');
  
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({});
  
    const handleAdd = (productId) => {
      const selected = data.find((item) => item.id === productId);
      setSelectedProduct(selected);
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/cart');
          const sortedData = response.data.sort(
            (b, a) => new Date(b.createdAt) - new Date(a.createdAt)
          );
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
          const promises = data.map((item) =>
            axios.get(`http://localhost:8080/api/products/${item.productId}`)
          );
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
          let tot = item.quantity * productData.harga;
          return tot;
        });
        setSubtotals(subtotals);
      };
      calculateSubtotals();
    }, [data, productDataList]);
  
    useEffect(() => {
      const calculateTotalSubtotal = () => {
        const total = subtotals.reduce((total, subtotal) => total + subtotal, 0);
        setTotalSubtotal(total);
      };
      calculateTotalSubtotal();
    }, [subtotals]);
  
    useEffect(() => {
      const calculateProductCount = () => {
        const count = data.length;
        setProductCount(count);
      };
      calculateProductCount();
    }, [data]);
  
    useEffect(() => {
      if (shouldRefresh) {
        window.location.reload();
      }
    }, [shouldRefresh]);
  
    const handleSave = async () => {
      try {
        const cartItems = data.map((item, index) => {
          const productData = productDataList[index] || {};
          return {
            productId: item.productId,
            quantity: item.quantity,
            total: item.quantity * productData.harga,
          };
        });
  
        const orderData = {
          cartItems,
          productCount,
          total: totalSubtotal,
          customerName,
        };
  
        await axios.post('http://localhost:8080/api/order', orderData);
  
        // Reset cart after saving
        setData([]);
        setProductDataList([]);
        setSubtotals([]);
        setTotalSubtotal(0);
        setProductCount(0);
        setCustomerName('');
        setShouldRefresh(true);
  
        // Delete cart items after successful order
        const deletePromises = data.map((item) =>
          axios.delete(`http://localhost:8080/api/cart/`)
        );
        await Promise.all(deletePromises);
  
        // Reset cart data
        resetCart();
      } catch (error) {
        console.error(error);
      }
    };
  
    const resetCart = () => {
      setData([]);
      setProductDataList([]);
      setSubtotals([]);
      setProductCount(0);
    };

    return (
      <div>
        <div className="mt-12 mb-8 flex flex-col gap-12">
          <Card>
            <CardHeader variant="gradient" color="blue" className="mb-5 p-4">
              <Typography variant="h6" color="white">
                Data Produk
              </Typography>
            </CardHeader>
            <CardBody className="overflow-y-auto h-64 px-0 pt-0 pb-2">
              <TableProductTransaksi
                selectedProduct={selectedProduct}
                handleAdd={handleAdd}
              />
            </CardBody>
          </Card>
        </div>
        <div className="mt-12 mb-8 flex flex-nowrap gap-6">
          <Card className="mr-10">
            <CardHeader variant="gradient" color="blue" className="mb-5 p-4">
              <Typography variant="h6" color="white">
                Detail Order
              </Typography>
            </CardHeader>
            <CardBody className="overflow-y-auto h-64 px-0 pt-0 pb-2">
              <TableCart 
                resetCart={resetCart}
                data={data}
                productDataList={productDataList}
                subtotals={subtotals}
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody className="px-0 pt-0 pb-0 w-96">
              <CardHeader variant="gradient" color="blue" className="mb-5 p-4">
                <Typography variant="h6" color="white">
                  Invoice
                </Typography>
              </CardHeader>
            </CardBody>
            <CardBody className="pt-2 flex flex-col gap-4">
              <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="id">
                Total
              </label>
              <Input type="number" size="lg" value={totalSubtotal} />
  
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Nama Customer
                  </label>
                  <input
                    className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    id="name"
                    type="text"
                    placeholder="Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
              </form>
              <Button onClick={handleSave}>Save</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
  
  export default FormTransaksi;
  
