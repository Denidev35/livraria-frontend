import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10 h-16">
      <h1 className="text-xl font-bold text-green-700">📚 Livraria</h1>

      <div className="flex items-center gap-4">
        {user && (
          <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
            {initials}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
