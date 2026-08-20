import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosInstance } from "../utils/AxiosInstance";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      // Temporarily commented to avoid 401 errors during testing
      // const { data } = await AxiosInstance.get("/auth/me");

      // if (data.success) {
      //   setUser(data.user);
      // }
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    // fetchUser(); // Commented for now
  }, []);

  const value = {
    loading,
    setLoading,
    user,
    setUser,
    navigate,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;