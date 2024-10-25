import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Film = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Tambahkan state loading
  const [error, setError] = useState(null);

  const ambilFilm = async () => {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/trending/movie/day",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmM2IzMDA2ZjFlYmNiYzExYjc5MWRmN2VkNjMyMDEwYyIsIm5iZiI6MTcyODQ2MzkxNS4xNTg5MzMsInN1YiI6IjY3MDQ5OTlkNGIwYzViOWQ3MTY5YmIwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MZ-LZp6TzK413Wfo34ea6hI5xXq3jpbWLMnDKLdRgRg",
          },
        }
      );
      setData(response.data.results);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Set loading ke false setelah data selesai diambil
    }
  };

  useEffect(() => {
    ambilFilm();
  }, []);

  return (
    <div className="min-h-screen bg-rose-200 dark:bg-slate-700 p-8">
      {error && (
        <p className="text-red-500 font-bold">Error fetching data: {error}</p>
      )}

      {/* Tampilkan loading jika sedang mengambil data */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="loading loading-infinity loading-lg"></div>
        </div>
      ) : (
        <>
          <div className="">
            <h1 className="font-bold text-pink-500 dark:text-black text-center text-4xl">TRENDING FILM</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
            {data?.map((item, index) => (
              <div
                className="card bg-rose-300 dark:bg-gray-500 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl"
                key={index}
              >
                <figure className="relative">
                  <img
                    className="w-full h-86 object-cover rounded-t-xl"
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title}
                  />
                </figure>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 mt-2 line-clamp-3">
                    {item.overview}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-800">
                      Release: {item.release_date}
                    </span>
                    <button className="btn bg-red-400 dark:bg-zinc-400 text-white px-4 py-2 rounded-lg hover:bg-red-600 dark:hover:bg-zinc-600 transition-colors duration-300">
                      <Link to={`/detail/${item.id}`}>Details</Link>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Film;
