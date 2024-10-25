import { Heart, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const DetailFilm = () => {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [notification, setNotification] = useState(null); // Notification state

  const getFilm = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmM2IzMDA2ZjFlYmNiYzExYjc5MWRmN2VkNjMyMDEwYyIsIm5iZiI6MTcyODQ2MzkxNS4xNTg5MzMsInN1YiI6IjY3MDQ5OTlkNGIwYzViOWQ3MTY5YmIwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MZ-LZp6TzK413Wfo34ea6hI5xXq3jpbWLMnDKLdRgRg",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch movie data.");
      }

      const data = await response.json();
      setFilm(data);

      // Fetch video data
      const videoResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmM2IzMDA2ZjFlYmNiYzExYjc5MWRmN2VkNjMyMDEwYyIsIm5iZiI6MTcyODQ2MzkxNS4xNTg5MzMsInN1YiI6IjY3MDQ5OTlkNGIwYzViOWQ3MTY5YmIwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MZ-LZp6TzK413Wfo34ea6hI5xXq3jpbWLMnDKLdRgRg",
          },
        }
      );

      if (!videoResponse.ok) {
        throw new Error("Failed to fetch video data.");
      }

      const videoData = await videoResponse.json();

      // Set video if available
      if (videoData.results && videoData.results.length > 0) {
        const trailer = videoData.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setVideo(trailer || null);
      } else {
        setVideo(null);
      }

      // Check if movie is already in favorites
      const favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];
      const isFav = favoriteMovies.some((fav) => fav.id === data.id);
      setIsFavorite(isFav);

      // Check if movie has been rated
      const ratedMovies = JSON.parse(localStorage.getItem("ratedMovies")) || [];
      const currentRating = ratedMovies.find((mov) => mov.id === data.id);
      if (currentRating) {
        setRating(currentRating.rating);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to show a notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Dismiss the notification after 3 seconds
  };

  // Function to handle rating change
  const handleRatingChange = (newRating) => {
    setRating(newRating);

    // Save rating to localStorage
    let ratedMovies = JSON.parse(localStorage.getItem("ratedMovies")) || [];
    const movieIndex = ratedMovies.findIndex((mov) => mov.id === film.id);

    if (movieIndex >= 0) {
      // Update existing rating
      ratedMovies[movieIndex].rating = newRating;
    } else {
      // Add new rating
      ratedMovies.push({ id: film.id, rating: newRating });
    }

    localStorage.setItem("ratedMovies", JSON.stringify(ratedMovies));
    showNotification(`You rated this movie: ${newRating} Stars`);
  };

  const toggleFavorite = () => {
    let favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      favoriteMovies = favoriteMovies.filter((fav) => fav.id !== film.id);
      showNotification("Removed from favorites");
    } else {
      favoriteMovies.push(film);
      showNotification("Added to favorites");
    }

    localStorage.setItem("favorites", JSON.stringify(favoriteMovies));
    setIsFavorite(!isFavorite);
  };

  const handleStarClick = (value) => {
    setRating(value);
    handleRatingChange(value);
  };

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  useEffect(() => {
    getFilm();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-2xl text-gray-300 mt-10">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-200 dark:bg-slate-700 p-8">
      {notification && (
        <div className="fixed top-4 right-4 bg-stone-400 text-white px-4 py-2 rounded shadow-lg">
          {notification}
        </div>
      )}

      {film ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative group">
            <img
              src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
              alt={film.title}
              className="object-cover rounded-xl shadow-md transform transition duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
              {film.title}
            </h2>
            <p className="text-gray-700 text-lg mb-6">{film.overview}</p>
            <p className="text-black mb-4">
              <strong>Release Date:</strong> {film.release_date}
            </p>
            <p className="text-black mb-4">
              <strong>Popularity:</strong> {film.popularity}
            </p>
            <p className="flex items-center text-lg mb-4">
              <strong>Rating:</strong>
              <span className="ml-2 text-yellow-500 font-semibold">
                {film.vote_average} / 10
              </span>
            </p>
            <div className="mt-6 py-3">
              <p className="text-xl font-bold mb-4">Rate this Movie</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <Star
                    key={star}
                    size={32}
                    color={(hoverRating || rating) >= star ? "#FFD700" : "#696969"}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    className="cursor-pointer"
                  />
                ))}
              </div>
            </div>
            {rating && (
              <p className="mt-2 py-3 text-gray-600">
                You rated this movie: {rating} Stars
              </p>
            )}

            <button
              className={`flex items-center gap-2 px-3 py-3 rounded-lg text-white font-semibold transition-all shadow-lg transform hover:scale-105 w-fit ${
                isFavorite
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              onClick={toggleFavorite}
            >
              <span className="flex-shrink-0">
                <Heart color="#FFFFFF" />
              </span>
              <span>
                {isFavorite ? "Remove from Favorite" : "Add to Favorite"}
              </span>
            </button>

            {video ? (
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4">Watch Trailer</h3>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    width="50%"
                    height="200"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            ) : (
              <p className="text-lg text-gray-600 mt-6">
                Trailer not available.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-xl">Movie not found.</p>
      )}
    </div>
  );
};
