import { createContext } from "react";

const AppContext = createContext({
    currentNav: null,
    showPopup: true,
    isHamburgerMenuOpen: true,
});

export default AppContext;
