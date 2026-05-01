// context/AuthContext.js
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Simulasi login — bisa diganti dengan API call nyata
  const login = (email, password) => {
    if (!email || !email.includes("@")) {
      return { ok: false, field: "email", msg: "Email tidak valid" };
    }
    if (!password || password.length < 6) {
      return {
        ok: false,
        field: "password",
        msg: "Password minimal 6 karakter",
      };
    }
    const username = email.split("@")[0];
    setUser({ email, username });
    return { ok: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
