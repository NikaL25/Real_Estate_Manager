import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AddAgentPage.module.css'

function AddAgentPage({ addAgent }) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    avatar: null, 
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setFormData({
        ...formData,
        avatar: files[0], 
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.surname || !formData.email || !formData.phone || !formData.avatar) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('surname', formData.surname);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('avatar', formData.avatar); 

    try {
      const response = await axios.post('https://api.real-estate-manager.redberryinternship.ge/api/agents', formDataToSend, {
        headers: {
          'Authorization': 'Bearer 9d0ddfbb-cb6e-4617-b2f0-8480f96d7b37',
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('აგენტი დაემატა:', response.data);
      addAgent({ ...formData, id: response.data.id });
      navigate('/'); 
    } catch (error) {
      console.error('error while adding agent:', error.response ? error.response.data : error.message);
      alert(`შეცდომა აგენტის დამატებისას: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      
      <p>აგენტის დამატება</p>
    
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="სახელი"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="surname"
          placeholder="გვარი"
          value={formData.surname}
          onChange={handleChange}
        />
        </div>
      
        <div className={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="ელ-ფოსტა"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="ტელეფონის ნომერი"
          value={formData.phone}
          onChange={handleChange}
        />
           </div>

           
        <input
        className={styles.img}
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
        />
        <button className={styles.Btn} type="submit">დაამატე აგენტი</button>
        </form>
    </div>
  );
}

export default AddAgentPage;
