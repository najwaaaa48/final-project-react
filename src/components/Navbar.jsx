import {
  AppWindow,
  ChartNoAxesCombined,
  Clapperboard,
  FolderHeart,
  StarHalf,
} from "lucide-react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ThemeContext from "./context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { toogleTheme } from "../store/action/themeAction";
import axios from "axios";

export const NavbarComponent = () => {
  const [cari, setCari] = useSearchParams();
  const cariFilm = cari.get("cariFilm");
  const [hasilCari, setHasilCari] = useState([]); // State untuk hasil pencarian
  const [getTheme, setTheme] = useContext(ThemeContext);
  const root = window.document.documentElement;

  const theme = useSelector((state) => state.theme.theme);
  const dispatchRedux = useDispatch();

  const handleTheme = () => {
    if (getTheme === "light") {
      setTheme("dark");
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      setTheme("light");
      root.classList.remove("light");
      root.classList.add("dark");
    }
  };

  const ubahCari = useCallback(
    async (input) => {
      setCari({ cariFilm: input }); // Update query parameter di URL

      if (input) {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie?query=${input}&page=1`,
            {
              headers: {
                Accept: "application/json",
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmM2IzMDA2ZjFlYmNiYzExYjc5MWRmN2VkNjMyMDEwYyIsIm5iZiI6MTcyOTQ5MTczNy4wNDg3MDYsInN1YiI6IjY3MDQ5OTlkNGIwYzViOWQ3MTY5YmIwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6EotfUV1ySjkB1xi5aK34gHxJceSha-SblHBOCHfq1o", // Ganti dengan kunci API Anda
              },
            }
          );
          setHasilCari(response.data.results); // Set hasil pencarian ke state
        } catch (error) {
          console.error("Error fetching search results:", error);
          setHasilCari([]); // Kosongkan hasil jika ada error
        }
      } else {
        setHasilCari([]); // Kosongkan hasil jika input kosong
      }
    },
    [setCari]
  );

  useEffect(() => {
    if (cariFilm) {
      ubahCari(cariFilm);
    }
  }, [cariFilm, ubahCari]);

  return (
    <div>
      <div className="navbar bg-red-300 dark:bg-black">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle dark:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li tabIndex={0}>
              <a className="justify-between">
                <Link to="/category">Category </Link>
                <AppWindow />
              </a>
              <ul className="p-2 bg-base-100">
                <li>
                  <Link to="/category">Movies</Link>
                </li>
              </ul>
            </li>
            <li>
              <a className="justify-between">
                <Link to="/rating">Rating </Link>
                <StarHalf />
              </a>
            </li>
          </ul>
        </div>
        <div className="flex-1 dark:text-white">
          <a className="btn btn-ghost text-xl">NajwaMovie</a>
        </div>
        <div className="hidden lg:flex font-semibold dark:text-white">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">
                <Clapperboard />
                Movie
              </Link>
            </li>
            <li>
              <Link to="/trending">
                <ChartNoAxesCombined />
                Trending
              </Link>
            </li>
            <li>
              <Link to="/favorite">
                <FolderHeart />
                Favorite
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control relative">
            <label className="input input-bordered flex items-center bg-red-200 text-black dark:bg-gray-700 dark:text-white">
              <input
                type="text"
                placeholder="Search"
                className="grow"
                value={cariFilm || ""} // Menampilkan kata kunci pencarian saat ini
                onChange={(input) => ubahCari(input.target.value)} // Panggil fungsi ubahCari saat input berubah
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70 dark:text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            {/* Menampilkan hasil pencarian */}
            {hasilCari.length > 0 && (
              <ul className="absolute top-12 bg-white dark:bg-gray-800 w-full mt-2 rounded-lg shadow-lg z-10 dark:text-white">
                {hasilCari.map((film) => (
                  <li
                    key={film.id}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white"
                  >
                    <Link to={`/detail/${film.id}`}>{film.title}</Link>{" "}
                    {/* Link ke halaman film */}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <label className="grid cursor-pointer place-items-center">
            <input
              type="checkbox"
              value="synthwave"
              className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
              onChange={() => handleTheme()}
              onClick={() => dispatchRedux(toogleTheme())}
              checked={getTheme === "dark" ? false : true}
            />
            <svg
              className="stroke-base-100 fill-base-100 col-start-1 row-start-1"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <svg
              className="stroke-base-100 fill-base-100 col-start-2 row-start-1"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </label>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  src="https://i.pinimg.com/736x/6a/05/ff/6a05ff1a0c96ed3ae0d994617864a310.jpg"
                  alt=""
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
