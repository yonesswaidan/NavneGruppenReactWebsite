import React, { useEffect, useState } from 'react';
import './LikedNames.css';  

function LikedNames() {
  // State variables for storing liked names, selected list, loading status, and error
  const [names, setNames] = useState([]);
  const [selectedList, setSelectedList] = useState('likedNames');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Get user data from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));

  // Function to remove a liked name
  const handleRemove = async (name) => {
    try {
        const response = await fetch(`http://localhost:5000/removeName/${userData.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, listType: selectedList }), 
        });

        if (response.ok) {
            // Remove the name from the list of liked names
            setNames(names.filter(n => n !== name));
        } else {
            const data = await response.json();
            console.error("Remove error:", data.message);
        }
    } catch (error) {
        console.error("Error removing name:", error);
    }
  };

  // Fetch liked names when the component mounts or the selected list changes
  useEffect(() => {
    async function fetchNames() {
      setIsLoading(true);
      setError(null);

      try {
        const endpoint = selectedList === 'likedNames' ? 'likedNames' : 'matchedNames';
        const response = await fetch(`http://localhost:5000/${endpoint}/${userData.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNames(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to load names. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchNames();
  }, [selectedList, userData.id]);

  // Handle the selection of liked or matched names list
  const handleListChange = (event) => {
    setSelectedList(event.target.value);
  };

  return (
    <div className="container">
      <div className="heading">
        <h2>{selectedList === 'likedNames' ? 'Liked Names' : 'Matched Names'}</h2>
        <select className="select" value={selectedList} onChange={handleListChange}>
          <option value="likedNames">Liked Names</option>
          <option value="matchedNames">Matched Names</option>
        </select>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="list-container">
        {isLoading ? (
          <p className="loader">Loading...</p>
        ) : (
          <ul className="list">
          {names.map((name, index) => (
              <li key={index} className="list-item">
                  <span className="name">{name}</span>
                  <button onClick={() => handleRemove(name)} className="button-like">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default LikedNames;
