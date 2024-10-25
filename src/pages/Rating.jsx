import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Rating = () => {
  const [ratedMovies, setRating] = useState([]); // State to store the rated movies
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error handling state
  const [movieDetails, setMovieDetails] = useState([]); // State to store movie details
  const [notification, setNotification] = useState(null); // Notification state

  // Function to fetch rated movies from localStorage
  const getRating = async () => {
    try {
      const storedRating = JSON.parse(localStorage.getItem("ratedMovies")) || [];
      if (storedRating.length > 0) {
        setRating(storedRating);

        // Fetch movie details by ID
        const movieDetailsPromises = storedRating.map(async (movie) => {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MmIyZDQ3MTUzOWYzMjljMGZiOTdjMGQ2MDk5MWZhNyIsIm5iZiI6MTcyODM1ODA4NC40NTY0NjQsInN1YiI6IjY3MDQ4MzllMWI5NmI4ZWY0YzY5YjY0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XVlj_feH8ZSSppSBQ-J7vEV1ttT93JV1dymFLN1EkXY",
              },
            }
          );
          return await response.json();
        });

        const details = await Promise.all(movieDetailsPromises);
        setMovieDetails(details);
      } else {
        throw new Error("No movies have been rated yet.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to submit a movie rating
  const submitRating = async (movieId, ratingValue) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/rating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MmIyZDQ3MTUzOWYzMjljMGZiOTdjMGQ2MDk5MWZhNyIsIm5iZiI6MTcyODM1ODA4NC40NTY0NjQsInN1YiI6IjY3MDQ4MzllMWI5NmI4ZWY0YzY5YjY0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XVlj_feH8ZSSppSBQ-J7vEV1ttT93JV1dymFLN1EkXY",
          },
          body: JSON.stringify({ value: ratingValue }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit rating.");
      }
      showNotification("Rating submitted successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to cancel a movie rating
  const cancelRating = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/rating`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MmIyZDQ3MTUzOWYzMjljMGZiOTdjMGQ2MDk5MWZhNyIsIm5iZiI6MTcyODM1ODA4NC40NTY0NjQsInN1YiI6IjY3MDQ4MzllMWI5NmI4ZWY0YzY5YjY0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XVlj_feH8ZSSppSBQ-J7vEV1ttT93JV1dymFLN1EkXY",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel rating.");
      }

      // Update the local state and localStorage after canceling the rating
      const updatedRatings = ratedMovies.filter((movie) => movie.id !== movieId);
      setRating(updatedRatings);
      localStorage.setItem("ratedMovies", JSON.stringify(updatedRatings));

      showNotification("Rating canceled successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to show a notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Dismiss the notification after 3 seconds
  };

  useEffect(() => {
    getRating(); // Fetch data when the component loads
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-2xl text-red-500 mt-10">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rose-200 dark:bg-slate-700 p-6">
      <h1 className="text-3xl font-bold mb-6 text-pink-500 dark:text-black">Movies You've Rated</h1>
      {ratedMovies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
          {ratedMovies.map((movie, index) => (
            <div
              key={movie.id}
              className="bg-rose-300 dark:bg-gray-500 rounded-lg shadow-lg p-4 max-w-xs flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              {movieDetails[index]?.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movieDetails[index].poster_path}`}
                  alt={movie.title}
                  className="rounded-lg mb-4"
                />
              ) : (
                <div className="w-32 h-48 bg-gray-300 rounded-lg mb-4"></div>
              )}
              <h2 className="text-xl font-bold mt-4 text-center">{movieDetails[index]?.title}</h2>
              <p className="text-gray-800 mt-2">Your Rating: {movie.rating} Stars</p>
              <Link
                to={`/detail/${movie.id}`}
                className="mt-4 px-6 py-2 bg-red-400 dark:bg-zinc-400 text-white font-semibold rounded-lg transition-all hover:bg-red-600 dark:hover:bg-zinc-600"
                onClick={() => showNotification(`Navigating to ${movieDetails[index]?.title}`)}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl">You haven't rated any movies yet.</p>
      )}
    </div>
  );
};
