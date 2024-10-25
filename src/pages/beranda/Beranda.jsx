import axios from "axios";
import { ChartColumnDecreasing, Film, Star } from "lucide-react";
import React, { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import BerandaView from "./BerandaView";

// Initial state for the reducer
const initialState = {
  data: [],
  film: null,
  error: null,
};

// Reducer function to handle state transitions
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, data: action.payload, error: null };
    case "SET_FILM":
      return { ...state, film: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const Beranda = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data, film, error } = state;

  const theme = useSelector((state) => state.theme.theme);
  const dispatchRedux = useDispatch();
  console.log(theme);

  const getRandomItem = () => {
    if (data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      return data[randomIndex];
    }
    return null;
  };

  const ambilFilm = async () => {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
        {
          headers: {
            Accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmM2IzMDA2ZjFlYmNiYzExYjc5MWRmN2VkNjMyMDEwYyIsIm5iZiI6MTcyOTQ5MTczNy4wNDg3MDYsInN1YiI6IjY3MDQ5OTlkNGIwYzViOWQ3MTY5YmIwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6EotfUV1ySjkB1xi5aK34gHxJceSha-SblHBOCHfq1o", // Replace with your actual API key
          },
        }
      );
      // Dispatch actions to update data and film
      dispatch({ type: "SET_DATA", payload: response.data.results });
      dispatch({ type: "SET_FILM", payload: getRandomItem(response.data.results) });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  useEffect(() => {
    ambilFilm();
  }, []);

  useEffect(() => {
    dispatch({ type: "SET_FILM", payload: getRandomItem() });
    console.log(data);
    console.log(film);
  }, [data]);

  return (
    <>
    <BerandaView
    film={film}
    data={data}
    error={error}
  />
    </>
  );
};
