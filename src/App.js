import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      const decoded = jwtDecode(savedToken);
      setUser({ email: decoded.sub, name: decoded.name || "Usuario" });
    }
  }, []);

  const handleLogin = async (credentialResponse) => {
    const credential = credentialResponse.credential;
    const decodedGoogle = jwtDecode(credential);
    console.log("🔓 Usuario de Google:", decodedGoogle);

    try {
      const res = await axios.post('/api/auth/google', { token: credential });
      console.log("✅ Backend respondió:", res.data);

      setUser({ email: res.data.email, name: res.data.name });

      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("❌ Error al conectar con backend:", error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  if (!user) {
    return (
      <GoogleOAuthProvider clientId="103330230199-t3oaosrqbmc3lcq65rgjmpgddr690l81.apps.googleusercontent.com">
        <div style={{ padding: 20 }}>
          <h1>Login con Google</h1>
          <GoogleLogin
            onSuccess={handleLogin}
            onError={() => console.log("❌ Error en el login con Google")}
          />
        </div>
      </GoogleOAuthProvider>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Bienvenido {user.name}</h2>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default App;
