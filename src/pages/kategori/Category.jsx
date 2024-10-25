import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]); // State for movies
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ambilFilmKategori = async () => {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/genre/movie/list",
        {
          headers: {
            Accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MmIyZDQ3MTUzOWYzMjljMGZiOTdjMGQ2MDk5MWZhNyIsIm5iZiI6MTcyODM1ODA4NC40NTY0NjQsInN1YiI6IjY3MDQ4MzllMWI5NmI4ZWY0YzY5YjY0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XVlj_feH8ZSSppSBQ-J7vEV1ttT93JV1dymFLN1EkXY",
          },
        }
      );

      if (response.status === 200) {
        setCategories(response.data.genres);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const ambilFilmByCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${categoryId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MmIyZDQ3MTUzOWYzMjljMGZiOTdjMGQ2MDk5MWZhNyIsIm5iZiI6MTcyODM1ODA4NC40NTY0NjQsInN1YiI6IjY3MDQ4MzllMWI5NmI4ZWY0YzY5YjY0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XVlj_feH8ZSSppSBQ-J7vEV1ttT93JV1dymFLN1EkXY",
          },
        }
      );

      if (response.status === 200) {
        setMovies(response.data.results);
      } else {
        throw new Error("Failed to fetch movies");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilFilmKategori();
  }, []);

  // Handle category button click to fetch movies
  const handleCategoryClick = (categoryId) => {
    ambilFilmByCategory(categoryId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-rose-200 dark:bg-slate-700">
      <h2 className="text-3xl font-bold mb-6 text-pink-500 dark:text-black text-center">Movie Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)} // Fetch movies for the selected category
            className="bg-red-400 dark:bg-zinc-400 text-white px-2 py-4 rounded-lg shadow-md hover:bg-red-600 dark:hover:bg-zinc-600 transition duration-300 transform hover:scale-105"
          >
            {category.name}
          </button>
        ))}
      </div>

      <h2 className="text-3xl font-bold mb-6 text-pink-500 dark:text-black text-center">Movies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-rose-300 dark:bg-gray-500 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-86 object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{movie.title}</h3>
              <p className="text-gray-800">{movie.release_date}</p>
              <div className="mt-4">
                <Link to={`/detail/${movie.id}`}>
                  <button className="btn bg-red-400 dark:bg-zinc-400 text-white px-4 py-2 rounded-lg hover:bg-red-600 dark:hover:bg-zinc-600 transition-colors duration-300">
                    Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
