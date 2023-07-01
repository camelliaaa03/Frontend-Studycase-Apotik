import React, { useState, useEffect } from 'react';
import { Card, CardBody, Typography, Button } from '@material-tailwind/react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import authHeader from '../../services/auth-header';
import UserService from "../../services/user.service";
import EventBus from "../../common/EventBus";

export function AddCategory() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
  });

  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const isKasir = user?.username === 'kasir';

  const [content, setContent] = useState("");

  useEffect(() => {
    if (isKasir) {
      navigate('../../dashboard/kategori');
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
    const { category } = location.state || {};
    setFormData({
      id: category ? category.id : '',
      name: category ? category.name : '',
    });
  }, [location.state]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { id, name } = formData;
  
      if (isKasir) {
        navigate('../../dashboard/kategori');
      } else {
        if (user.accessToken) {
          // Pengecekan peran pengguna
          if (user.username === 'admin') {
            await axios.post('http://localhost:8080/api/categories', { name }, { headers: authHeader() });
            alert('Kategori baru berhasil ditambahkan');
            navigate('../../dashboard/kategori');
          } else {
            // Handle jika pengguna bukan admin
            alert('Anda tidak memiliki izin untuk menambahkan kategori.');
          }
        } else {
          // Handle jika token tidak tersedia
          alert('Token tidak tersedia. Silakan login untuk melanjutkan.');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleCancel = () => {
    setFormData({ id: '', name: '' });
    navigate('../../dashboard/kategori');
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
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name || (location.state && location.state.category && location.state.category.name) || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-center gap-4 grid-cols-2 basis-1/2 hover:basis-1/2">
              <div>
                <Button type="button" color="gray" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
              <div>
                <Button type="submit" ripple>
                  Save
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AddCategory;
