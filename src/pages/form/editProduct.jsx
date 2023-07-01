import React, { useState, useEffect } from 'react';
import { Card, CardBody, Typography, Button } from '@material-tailwind/react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserService from "../../services/user.service";
import EventBus from "../../common/EventBus";
import authHeader from '../../services/auth-header';

const EditProduct = () => {

  const [product, setProduct] = useState({
    id: '',
    name: '',
    categoryId: '',
    harga: '',
    stok: '',
    expired: '',
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const isKasir = user?.username === 'kasir';

  const [content, setContent] = useState('');

  useEffect(() => {
    if (isKasir) {
      navigate('../../dashboard/daftarObat');
    } else {
      UserService.getAdminBoard()
        .then(
          (response) => {
            setContent(response.data);
          },
          (error) => {
            const _content =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();

            setContent(_content);

            if (error.response && error.response.status === 401) {
              EventBus.dispatch('logout');
            }
          }
        )
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isKasir, navigate]);

  useEffect(() => {
    if (user?.username !== 'admin') {
      navigate('/dashboard/daftarObat'); // Ganti dengan path halaman yang ingin Anda arahkan jika pengguna bukan admin
    }
  }, [user, navigate]);


  if (!location.state || !location.state.product) {
    console.log('Data Produk tidak tersedia');
    return null;
  }

  const { product: initialProduct } = location.state;

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const { state } = location;
    if (state && state.product) {
      setProduct(state.product);
    }

    fetchCategories();
  }, [location]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {

      if (isKasir) {
        navigate('../../dashboard/daftarObat');
      } else {
        if (user && user.accessToken){
          if (user.username === 'admin') {
            await axios.put(`http://localhost:8080/api/products/${product.id}`, product, {headers: authHeader() });
            console.log('Produk berhasil diperbarui');
            navigate('../../dashboard/daftarObat');
          } else {
            // Handle jika pengguna bukan admin
            alert('Anda tidak memiliki izin untuk menambahkan kategori.');
          }
        } else {
          alert('Token tidak tersedia. Silakan login untuk melanjutkan.');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    setProduct((prevState) => ({
      ...prevState,
      categoryId: selectedCategoryId,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setProduct({
      id: '',
      name: '',
      categoryId: '',
      harga: '',
      expired: '',
      description: '',
    });
    navigate('../../dashboard/daftarObat');
  };

  return (
    <div className="mt-6 mb-8 flex flex-col gap-12">
      <Card>
        <CardBody>
          <Typography variant="h5" color="gray" className="mt-1 font-normal">
            Lengkapi Data
          </Typography>
          <br />
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Nama
              </label>
              <input
                className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                value={product.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Kategori
              </label>
              <select
                  className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  id="category"
                  name="categoryId" // Ubah properti name menjadi "categoryId"
                  value={product.categoryId || ''}
                  onChange={handleCategoryChange}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
            </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Harga
              </label>
              <input
                className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="price"
                name="price"
                type="number"
                placeholder="Harga"
                value={product.price || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expired">
                Tanggal Kadaluarsa
              </label>
              <input
                className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="expired"
                name="expired"
                placeholder="Tanggal Kadaluarsa"
                type="date"
                value={product.expired || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Deskripsi
              </label>
              <input
                className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="description"
                name="description"
                type="text"
                placeholder="Deskripsi"
                value={product.description || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-center gap-4 grid-cols-2 basis-1/2 hover:basis-1/2">
              <div>
                <Button type="button" color="gray" ripple="light" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
              <div>
                <Button type="submit">Save</Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditProduct;
