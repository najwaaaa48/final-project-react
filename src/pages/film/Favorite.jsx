import { Eye, HeartOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data
    const favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(favoriteMovies);
    setLoading(false); // Set loading to false after fetching data
  }, []);

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  if (loading) {
    // Show a loading spinner while loading is true
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-200 dark:bg-slate-700 p-8">
      <h1 className="text-4xl font-bold text-pink-500 dark:text-black mb-8">Your Favorites</h1>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="relative bg-white shadow-md rounded-lg flex flex-col items-center"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${fav.poster_path}`}
                alt={fav.title}
                className="object-cover rounded-md shadow-lg"
              />
              <Link
                to={`/detail/${fav.id}`}
                className="absolute mt-3 p-1 right-0 mx-4 text-white rounded-lg shadow-md hover:bg-blue-400 transition duration-300 flex items-center justify-center gap-2"
              >
                <Eye />
              </Link>
              <button
                onClick={() => removeFavorite(fav.id)}
                className="absolute mt-3 bottom-0 p-1 right-0 mx-3 my-3 text-white rounded-lg shadow-md hover:bg-red-400 transition duration-300 flex items-center justify-center gap-2"
              >
                <HeartOff />
              </button>
              
              {/* <h3 className="text-xl font-semibold mt-4 text-center">
                {fav.title}
              </h3>
              <p className="text-black text-center mt-2">
                Rating: {fav.vote_average}
              </p> */}
              {/* <div className="mb-4 flex justify-center gap-6">
                <strong>{fav.title}</strong>
              </div> */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl">No favorite movies yet.</p>
      )}
    </div>
  );
};
