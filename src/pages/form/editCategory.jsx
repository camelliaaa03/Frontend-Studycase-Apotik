import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {Card, CardBody, Typography, Button} from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import authHeader from '../../services/auth-header';
import UserService from "../../services/user.service";
import EventBus from "../../common/EventBus";


const EditCategory = () => {
  const [category, setCategory] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const isKasir = user?.username === 'kasir';

  const [content, setContent] = useState('');

  useEffect(() => {
    if (isKasir) {
      navigate('/dashboard/kategori');
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

  if (!location.state || !location.state.category) {
    console.log('Data kategori tidak tersedia.');
    return null; // Tampilkan atau lakukan penanganan lain sesuai kebutuhan
  }
  
  const { category: initialCategory } = location.state;

  useState(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {

      if (isKasir) {
        navigate('../../dashboard/kategori');
      } else {
        if (user.accessToken) {
          if (user.username === 'admin') {
            await axios.put(`http://localhost:8080/api/categories/${category.id}`, category, { headers: authHeader()});
            alert('Kategori baru berhasil diupdate');
            navigate('../../dashboard/kategori'); 
          } else {
            alert('Anda tidak memiliki izin untuk update Kategori');
          }
        } else {
          alert('Token tidak tersedia. Silahkan Login untuk melanjutkan');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleCancel = () => {
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
          <form onSubmit={handleFormSubmit}>
                        
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
              >Name
            </label>
            <input
              className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              value={category.name || ''}
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
              <Button type="submit" ripple>Save</Button>
            </div>
           </div>
          </form>
          </CardBody>
          </Card>
          </div>
    );
};

export default EditCategory;
