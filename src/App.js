import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './componets/navbar';

function App() {
  const CLIENT_ID = "5031801fa106432cac3c5c8a17934425";
  const REDIRECT_URI = 'http://localhost:3000/';
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  // Construct the login URL
  const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    const token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"))?.split("=")[1];
    if (token) {
      // Store the access token in localStorage
      window.localStorage.setItem("token", token);
      console.log("Access token:", token);
      setToken(token);
    }
  }, []);

  const logout = () => {
    // Clear the token from localStorage
    window.localStorage.removeItem("token");
    // Update state to reflect the logout
    setToken("");
  };

  const searchArtist = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          q: searchKey,
          type: "artist"
        }
      });
      console.log(data);
      setArtists(data.artists);
    } catch (error) {
      console.error("Error occurred during artist search:", error);
    }
  };

  const addToMyList = (artist) => {

    
    // Add logic to add the artist to "My List"
    console.log("Added to My List:", artist.name);
  };

  const renderArtistsTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Genres</th>
            <th >Add to my Playlist</th> {/* Add a column for the action button */}
          </tr>
        </thead>
        <tbody>
          {artists && artists.items.map(artist => (
            <tr key={artist.id}>
              <td><img src={artist.images[0]?.url} alt={artist.name} /></td>
              <td>{artist.name}</td>
              <td>{artist.genres.join(", ")}</td>
              <td><button onClick={() => addToMyList(artist)}>Add to My List</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="App">
      <header>
        <NavBar/>

    
        <h1>Spotify Jamming App</h1>
        {token ? (
          <div>
            <p>You are logged in.</p>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <a href={loginUrl}>Login to Spotify</a>
        )}

        {token ? (
          <form onSubmit={searchArtist}>
            <input type='text' value={searchKey} onChange={e => setSearchKey(e.target.value)} />
            <button type='submit'>Search</button>
          </form>
        ) : (
          <h2>Please Login</h2>
        )}

        {artists && renderArtistsTable()}
      </header>
    </div>
  );
}

export default App;
