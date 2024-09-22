import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddListingPage from './pages/AddListingPage'; 
import AddAgentPage from './pages/AddAgentPage'; 
import DetailPage from './pages/DetailPage';
import axios from 'axios';
import styles from './pages/HomePage.module.css';
<script src='https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous'></script>


function App() {
  const [realEstates, setRealEstates] = useState([]);
  const [cities, setCities] = useState([]);
  const [agents, setAgents] = useState([]); 

  
  useEffect(() => {
    axios
      .get('https://api.real-estate-manager.redberryinternship.ge/api/real-estates', {
        headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer 9d0ddfbb-cb6e-4617-b2f0-8480f96d7b37',
        },
      })
      .then((response) => {
        setRealEstates(response.data);
      })
      .catch((error) => {
        console.error('Error fetching real estates:', error);
      });
  }, []);

  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem('realEstates')) || [];
    if (savedCards.length > 0) {
      setRealEstates(savedCards);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('realEstates', JSON.stringify(realEstates));
  }, [realEstates]);

  useEffect(() => {
    axios
      .get('https://api.real-estate-manager.redberryinternship.ge/api/cities', {
        headers: {
          'accept': 'application/json',
        },
      })
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error('Error fetching cities:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get('https://api.real-estate-manager.redberryinternship.ge/api/agents', {
        headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer 9d0ddfbb-cb6e-4617-b2f0-8480f96d7b37',
        },
      })
      .then((response) => {
        setAgents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching agents:', error);
      });
  }, []);

  const addCard = (newCard) => {
    const updatedRealEstates = [...realEstates, newCard];
    setRealEstates(updatedRealEstates);
    localStorage.setItem('realEstates', JSON.stringify(updatedRealEstates));
  };

  const addAgent = (newAgent) => {
    const updatedAgents = [...agents, newAgent];
    setAgents(updatedAgents);
    localStorage.setItem('agents', JSON.stringify(updatedAgents));
  };

  const removeCard = (id) => {
    const updatedRealEstates = realEstates.filter((estate) => estate.id !== id);
    setRealEstates(updatedRealEstates);
    localStorage.setItem('realEstates', JSON.stringify(updatedRealEstates));
};

  return (
    <div className={styles.logo}>
    <div className={styles.homeLogo}>
      <img   />
    </div>
    <div className={styles.line}></div>
    <div className={styles.homeContainer}>
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomePage realEstates={realEstates} cities={cities} />}
        />
        <Route
          path="/add-listing"
          element={<AddListingPage addCard={addCard} agents={agents} />}
        />
        <Route
          path="/add-agent"
          element={<AddAgentPage addAgent={addAgent} />} />
      <Route
        path="/details/:id"
        element={<DetailPage realEstates={realEstates} agents={agents} removeCard={removeCard} />}
      />  
      </Routes>
    </Router>
    </div>
    </div>
  );
}

export default App;
