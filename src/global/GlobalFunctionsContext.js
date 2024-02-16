import React, { useContext, createContext } from "react";
import { useDispatch } from "react-redux";
import { setLoading, setMessageModalBody, setMessageModalShow } from "../Slices.js";
// Context oluşturuluyor
const GlobalFunctionsContext = createContext(null);

// Fonksiyonları sağlayan bileşen
export const GlobalFunctionsProvider = ({ children }) => {
  const dispatch = useDispatch();

  const showMessage = (body) => {
    dispatch(setMessageModalBody(body));
    dispatch(setMessageModalShow(true));    
  };

  const showLoadPanel = () => 
  {
    dispatch(setLoading(true));
  }

  const hideLoadPanel = () => 
  {
    dispatch(setLoading(false));
  }

  // Sağlanacak fonksiyonlar
  const value = {
    showMessage,
    showLoadPanel,
    hideLoadPanel
  };

  return (
    <GlobalFunctionsContext.Provider value={value}>
      {children}
    </GlobalFunctionsContext.Provider>
  );
};

// Hook olarak kullanım için
export const useGlobalFunctions = () => {
  const context = useContext(GlobalFunctionsContext);
  if (!context) {
    throw new Error("useGlobalFunctions must be used within a GlobalFunctionsProvider");
  }
  return context;
};
