import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AddListingPage.module.css';

function AddListingPage({ addCard, agents }) {
  const [formData, setFormData] = useState({
    price: '',
    zip_code: '',
    description: '',
    area: '',
    city_id: '',
    address: '',
    agent_id: '',
    bedrooms: '',
    is_rental: '0',
    image: null, // для загрузки изображения
    region_id: '', // добавляем поле для региона
  });
  
  const [newAgents, setNewAgents] = useState(agents || []);
  const [regions, setRegions] = useState([]); // состояние для списка регионов
  const navigate = useNavigate();

  // Получаем агентов
  useEffect(() => {
    if (!agents || agents.length === 0) {
      axios
        .get('https://api.real-estate-manager.redberryinternship.ge/api/agents', {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer 9d0ddfbb-cb6e-4617-b2f0-8480f96d7b37',
          },
        })
        .then((response) => {
          setNewAgents(response.data);
        })
        .catch((error) => {
          console.error('Ошибка при получении агентов:', error);
        });
    }
  }, [agents]);

  // Получаем регионы
  useEffect(() => {
    axios
      .get('https://api.real-estate-manager.redberryinternship.ge/api/regions', {
        headers: {
          'accept': 'application/json',
        },
      })
      .then((response) => {
        setRegions(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при получении регионов:', error);
      });
  }, []);

  // Обрабатываем изменения в полях
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setFormData({
        ...formData,
        image: e.target.files[0], // для файлов
      });
      console.log('Selected image:', e.target.files[0]); // Проверка выбранного файла
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка, что все поля заполнены
    if (!formData.price || !formData.zip_code || !formData.description || !formData.area || !formData.city_id || !formData.address || !formData.agent_id || !formData.bedrooms || !formData.image || !formData.region_id) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('price', formData.price);
    formDataToSend.append('zip_code', formData.zip_code);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('area', formData.area);
    formDataToSend.append('city_id', formData.city_id);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('agent_id', formData.agent_id);
    formDataToSend.append('bedrooms', formData.bedrooms);
    formDataToSend.append('is_rental', formData.is_rental);
    formDataToSend.append('image', formData.image); 
    formDataToSend.append('region_id', formData.region_id); 

    console.log('Form data to send:', formDataToSend); 

    try {
      const response = await axios.post('https://api.real-estate-manager.redberryinternship.ge/api/real-estates', formDataToSend, {
        headers: {
          'Authorization': 'Bearer 9d0ddfbb-cb6e-4617-b2f0-8480f96d7b37',
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('წარმატებულად დაემატა:', response.data);
      addCard({ ...formData, id: response.data.id });
      navigate('/');
    } catch (error) {
      console.error('შეცდომა:', error.response ? error.response.data : error.message);
      alert(`დაფიქსირდა შეცდომა დამატების დროს: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <div className={styles.container}>

      <h2>ლისტინგის დამატება</h2>

      <form onSubmit={handleSubmit}>
      <p>გარიგების ტიპი </p>
        <div className={styles.listingSelling}> 
        <label>
          <input
            type="radio"
            name="is_rental"
            value="1"
            checked={formData.is_rental === '1'}
            onChange={() => setFormData({ ...formData, is_rental: '1' })}
            className={styles.inputRent}
          />
       
       </label>
       ქირავდება
       <div className={styles.listingRent}>
      <label>
        <input 
     
          type="radio"
          name="is_rental"
          value="0"
          checked={formData.is_rental === '0'}
          onChange={() => setFormData({ ...formData, is_rental: '0' })}
        />
       
      </label>
      იყიდება
        </div>
      </div>  

   
      <p>მდებარეობა </p>
      <p>მისამართი</p>
      <div className={styles.listingTerritory}>  
         
      <label>
        <input
              className={styles.input}
              type="text"
              name="address"
              placeholder="მისამართი"
              value={formData.address}
              onChange={handleChange}
            />
        </label>
        
        <label> 
              <input 
                className={styles.input}
                type="number"
                name="area"
                placeholder="ფართობი (м²)"
                value={formData.area}
                onChange={handleChange}
              />
        </label>
    </div>


      <label> ფასი
        <input
          className={styles.input}
          type="number"
          name="price"
          placeholder="ფასი"
          value={formData.price}
          onChange={handleChange}
        />
        </label>
        <input
          className={styles.input}
          type="text"
          name="zip_code"
          placeholder="საფოსტო ინდექსი"
          value={formData.zip_code}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="აღწერა"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
       
        <input
          type="text"
          name="city_id"
          placeholder="ID ქალაქის"
          value={formData.city_id}
          onChange={handleChange}
        />
       
        <input
          type="number"
          name="bedrooms"
          placeholder="საძინებლები"
          value={formData.bedrooms}
          onChange={handleChange}
        />
        <select name="agent_id" value={formData.agent_id} onChange={handleChange}>
          <option value="">აგენტის არჩევა</option>
          {newAgents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name} {agent.surname}
            </option>
          ))}
        </select>

        {/* Добавляем селектор для выбора региона */}
        <select name="region_id" value={formData.region_id} onChange={handleChange}>
          <option value="">რეგიონის არჩევა</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          name="image"
          onChange={handleChange}
        />
 
        <button type="submit">დამატება</button>
      </form>
    </div>
  );
}

export default AddListingPage;
