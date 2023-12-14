import React, { useEffect, useState } from 'react';
import './ListOfNames.css';

function ListOfNames() {
  // State variables to store names, selected category, loading status, and error messages
  const [names, setNames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('InternationalGirlNames');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeError, setLikeError] = useState('');
  const userData = JSON.parse(localStorage.getItem('userData')); // Get user data from local storage


  useEffect(() => {
    async function fetchNames() {
      setError(null); // Clear any previous errors
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate loading delay

        // Fetch names based on the selected category
        const response = await fetch(`http://localhost:5000/${selectedCategory}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNames(data); // Set the fetched names in state
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to load names. Please try again later.");
      } finally {
        setIsLoading(false); // Set loading status to false when done
      }
    }

    fetchNames();
  }, [selectedCategory]); // Run this effect when the selected category changes

  // Function to handle liking a name
  const handleLike = async (name) => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    console.log("User ID for like request:", userData.id);

    try {
      const response = await fetch('http://localhost:5000/likeName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userData.id, name: name }), 
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok) {
        console.log("Name liked successfully:", data);
      } else {
        setLikeError(data.message || 'Failed to like name');
      }
    } catch (error) {
      console.error('Error liking name:', error);
      setLikeError('Error liking name');
    }
  };

  // Function to handle category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setIsLoading(true); 
  };

  return (
    <div className="container">
      <div className="heading">
        <h2>List of Names</h2>
        <select className="select" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="BoyNames">Boy Names</option>
          <option value="GirlNames">Girl Names</option>
          <option value="InternationalBoyNames">International Boy Names</option>
          <option value="InternationalGirlNames">International Girl Names</option>
          <option value="UnisexNames">Unisex Names</option>
        </select>
      </div>
      {likeError && <p className="error">{likeError}</p>}
      <div className="list-container">
        {isLoading ? (
          <p className="loader">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <ul className="list">
            {names.map((nameItem) => (
              <li key={nameItem._id} className="list-item">
                <span>{nameItem.name}</span>
                <button onClick={() => handleLike(nameItem.name)} className="button-like">Like</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ListOfNames;
