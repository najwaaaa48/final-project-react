import { TOOGLE_THEME } from "../action/themeAction";

const nilaiDefault = {
    theme: "dark,",
  };
  
  const themeReducer = (state = nilaiDefault, action) => {
    switch (action.type) {
      case TOOGLE_THEME:
        return {
          ...state,
          theme: state.theme === "light" ? "dark" : "light",
        };
        default:
          return state;
    }
  };
  
  export default themeReducer;
  