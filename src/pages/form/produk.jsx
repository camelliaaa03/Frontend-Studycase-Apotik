import React, {useState, useEffect} from 'react';
import {Card, CardBody, Typography, Button} from '@material-tailwind/react';
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import UserService from "../../services/user.service";
import EventBus from "../../common/EventBus";
import authHeader from "../../services/auth-header";

export function Produk () {

  const [formData, setFormData] = useState ({
    id: '',
    name: '',
    categoryId: '',
    price: '',
    description : '',
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
      // alert("Required Admin Role!")
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
      setFormData(state.product);
    }

    fetchCategories();
  }, [location]);

    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const headers = authHeader();
        
        if (isKasir) {
          navigate('../../dashboard/daftarObat');
        } else {
          if (user.accessToken) {
            if (user.username === 'admin') {
              if (formData.id) {
                await axios.put(`http://localhost:8080/api/products/${formData.id}`, formData, { headers: authHeader() });
                console.log('Produk berhasil diperbarui');
              } else {
                await axios.post('http://localhost:8080/api/products', formData, { headers: authHeader() });
                console.log('Produk berhasil ditambahkan');
              }
              alert('Produk berhasil disimpan!');
              navigate('../../dashboard/daftarObat');
            } else {
              alert('Anda tidak memiliki izin untuk menambahkan produk');
            }
          } else {
            alert('Token tidak tersedia. Silahkan Login');
          }
        }
      } catch (error) {
        console.error(error);
      }
    };


  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      categoryId: selectedCategoryId,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'categoryId') {
      setFormData((prevState) => ({
        ...prevState,
        categoryId: value,
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleCancel = () => {
    setFormData({
      id: '',
      name: '',
      categoryId: '',
      harga: '',
      stok: '',
      expired: ''
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
          <form onSubmit={handleSubmit}>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Kategori
              </label>
              <select
                className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="category"
                name="category"
                value={formData.categoryId}
                onChange={handleCategoryChange}
              >
                <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Harga
              </label>
              <input
                className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="price"
                name="price"
                type="number"
                placeholder="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" htmlFor="expired">
                Tanggal Kadaluarsa
              </label>
              <input
                className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="expired"
                name="expired"
                type="date"
                placeholder="Tanggal Kadaluarsa"
                value={formData.expired}
                onChange={handleInputChange}
              />
            </div>
            <div class="mb-4">
              <label  class="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Deskripsi
              </label>
              <input
                className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="description"
                name="description"
                type="number"
                placeholder="Deskripsi"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex justify-center gap-4 grid-cols-2 basis-1/2 hover:basis-1/2">
              <div>
                <Button
                  type="button"
                  color="gray"
                  ripple="light"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
              <div>
                <Button type="submit">Simpan</Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
