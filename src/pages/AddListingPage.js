import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    image: null,
    region_id: '',
  });

  const [newAgents, setNewAgents] = useState(agents || []);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsResponse, regionsResponse, citiesResponse] = await Promise.all([
          axios.get('https://api.real-estate-manager.redberryinternship.ge/api/agents', {
            headers: {
              'accept': 'application/json',
              'Authorization': 'Bearer 9d0ddfbb-cb6e-4617-b2f0-8480f96d7b37',
            },
          }),
          axios.get('https://api.real-estate-manager.redberryinternship.ge/api/regions', {
            headers: { 'accept': 'application/json' },
          }),
          axios.get('https://api.real-estate-manager.redberryinternship.ge/api/cities', {
            headers: { 'accept': 'application/json' },
          }),
        ]);

        setNewAgents(agentsResponse.data);
        setRegions(regionsResponse.data);
        setCities(citiesResponse.data);
      } catch (error) {
        console.error('error while fetching data:', error);
      }
    };

    fetchData();
  }, [agents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'region_id') {
      const filtered = cities.filter((city) => city.region_id === Number(value));
      setFilteredCities(filtered);
      setFormData((prev) => ({ ...prev, city_id: '' }));
    }

    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post('https://api.real-estate-manager.redberryinternship.ge/api/real-estates', formDataToSend, {
        headers: {
          'Authorization': 'Bearer 9d0ddfbb-cb6e-4617-b2f0-8480f96d7b37',
          'Content-Type': 'multipart/form-data',
        },
      });

      addCard({ ...formData, id: response.data.id });
      navigate('/');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      alert(`Error while adding: ${error.response ? error.response.data.message : error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
    <h2>ლისტინგის დამატება</h2>
    <form onSubmit={handleSubmit}>
      <p>გარიგების ტიპი</p>
      <div className={styles.form}>
        <label>
          <input
            type="radio"
            name="is_rental"
            value="0"
            checked={formData.is_rental === '0'}
            onChange={() => setFormData({ ...formData, is_rental: '0' })}
          />
          იყიდება
        </label>
        <label>
          <input
            type="radio"
            name="is_rental"
            value="1"
            checked={formData.is_rental === '1'}
            onChange={() => setFormData({ ...formData, is_rental: '1' })}
          />
          ქირავდება
        </label>
      </div>
  
      <p>მდებარეობა</p>
      <div className={styles.inputPair}>
        <input
          className={styles.input}
          type="text"
          name="address"
          placeholder="მისამართი"
          value={formData.address}
          onChange={handleChange}
        />
        <input
          className={styles.input}
          type="text"
          name="zip_code"
          placeholder="საფოსტო ინდექსი"
          value={formData.zip_code}
          onChange={handleChange}
        />
      </div>
  
      <div className={styles.inputPair}>
        <select
          name="region_id"
          value={formData.region_id}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="">რეგიონი</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
        <select
          name="city_id"
          value={formData.city_id}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="">ქალაქი</option>
          {filteredCities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
  
      <div className={styles.inputPair}>
        <input
          className={styles.input}
          type="number"
          name="price"
          placeholder="ფასი"
          value={formData.price}
          onChange={handleChange}
        />
        <input
          className={styles.input}
          type="number"
          name="area"
          placeholder="ფართობი"
          value={formData.area}
          onChange={handleChange}
        />
      </div>
  
      <div className={styles.inputPair}>
        <input
          className={styles.input}
          type="number"
          name="bedrooms"
          placeholder="საძინებლების რაოდენობა"
          value={formData.bedrooms}
          onChange={handleChange}
        />
     
      </div>
      <textarea
          name="description"
          placeholder="აღწერა"
          value={formData.description}
          onChange={handleChange}
          className={styles.textarea}
        ></textarea>
      
      <div className={styles.inputPair}>
        <input
          type="file"
          name="image"
          placeholder="ატვირთეთ ფოტო"
          onChange={handleChange}
        />
      </div>
  
      <div className={styles.inputPair}>
        <select
          name="agent_id"
          value={formData.agent_id}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="">აგენტი</option>
          {newAgents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name} {agent.surname}
            </option>
          ))}
        </select>
      </div>

      <Link className={styles.BtnBack} to='/'  disabled={loading}>
       <div>გაუქმება</div>
      </Link>

      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'ლისტინგის დამატება'}
      </button>
    </form>
  </div>
  
  );
}

export default AddListingPage;
