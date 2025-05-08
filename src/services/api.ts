import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Criar instância do axios
export const api = axios.create({
  baseURL: "https://livraria-backend.onrender.com",
});

// Se o token estiver no localStorage, adiciona ao header Authorization
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Interceptador de requisição para verificar o token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Caso o erro seja 401 (token inválido ou expirado)
    if (response?.status === 401) {
      // Aqui, você pode usar o hook de logout (do AuthContext) para limpar o estado
      // E redirecionar o usuário para a página de login
      const { logout } = useAuth();
      const navigate = useNavigate();

      logout();  // Limpa o token e o estado de autenticação
      navigate("/login");  // Redireciona para a página de login

      return Promise.reject(error); // Propaga o erro após limpar a autenticação
    }

    return Promise.reject(error); // Outros erros são propagados normalmente
  }
);


