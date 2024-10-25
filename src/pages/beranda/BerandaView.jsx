import React from "react";
import { ChartColumnDecreasing, Film, Star } from "lucide-react"; // Import your icons
import { Link } from "react-router-dom";

const BerandaView = ({ film, data, error }) => {
  return (
    <div className="bg-rose-200 dark:bg-slate-700">
      <div className="carousel w-full h-screen relative">
        <div id="slide1" className="carousel-item relative w-full">
          {film ? (
            <>
              <img
                src={`https://image.tmdb.org/t/p/original/${film.backdrop_path}`}
                className="w-full h-full object-cover"
                alt={film.title}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white p-10 max-w-lg">
                  <h1 className="text-4xl font-bold mb-4">{film.title}</h1>
                  <p className="text-lg mb-6">{film.overview}</p>
                  <p className="mb-6 flex justify-center gap-9">
                    <ChartColumnDecreasing /> {film.popularity} <Film />{" "}
                    {film.genre_ids?.join(", ")} <Star /> {film.vote_average}
                  </p>
                  <button className="btn bg-red-400 dark:bg-zinc-400 text-white rounded-lg px-6 py-2">
                    <Link to={`/detail/${film.id}`}>View</Link>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-screen">
              <span className="loading loading-infinity loading-lg"></span>
            </div>
          )}
        </div>
      </div>
      <div className="min-h-screen bg-rose-200 dark:bg-slate-700 p-8">
        {error && (
          <p className="text-red-500 font-bold">Error fetching data: {error}</p>
        )}
        <div className="">
          <h1 className="font-bold text-pink-500 dark:text-black text-3xl">UPCOMING MOVIES</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
          {data.map((item) => (
            <div
              className="card bg-rose-300 dark:bg-gray-500 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl"
              key={item.id}
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
                <p className="text-gray-800 mt-2 line-clamp-3">
                  {item.overview}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-900 flex justify-center gap-2">
                    <Star color="#ffdd00" /> {item.vote_average}
                  </span>
                  <button className="btn bg-red-400 dark:bg-zinc-400 text-white px-4 py-2 rounded-lg hover:bg-red-600 dark:hover:bg-zinc-600 transition-colors duration-300">
                    <Link to={`/detail/${item.id}`}>Details</Link>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BerandaView;
