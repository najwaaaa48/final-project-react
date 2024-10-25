import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavbarComponent } from "./components/Navbar";
import { Beranda } from "./pages/beranda/Beranda";
import ThemeContext from "./components/context/ThemeContext";
import { useState } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import Footer from "./components/Footer";
import Film from "./pages/film/Film";
import { DetailFilm } from "./pages/detailfilm/DetailFilm";
import { Favorite } from "./pages/film/Favorite";
import { Rating } from "./pages/Rating";
import Category from "./pages/kategori/Category";

export default function App() {

  const theme = useState("light");

  return (
    <BrowserRouter>
    <ThemeContext.Provider value={theme}>
    <Provider store={store}>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/trending" element={<Film />} />
        <Route path="/detail/:id" element={<DetailFilm />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/rating" element={<Rating />} />
        <Route path="/category" element={<Category />} />
      </Routes>
      <Footer />
    </Provider>
    </ThemeContext.Provider>
    </BrowserRouter>
  );
}
