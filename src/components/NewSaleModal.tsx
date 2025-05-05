/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";

interface NewSaleModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface User {
  id: string;
  name: string;
}

interface Book {
  id: string;
  title: string;
  stock: number;
}

export default function NewSaleModal({
  onClose,
  onSuccess,
}: NewSaleModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));
    api.get("/books").then((res) => setBooks(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/sales", { userId, bookId, quantity });
      toast.success("Venda registrada com sucesso!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erro ao registrar venda");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20  flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Nova Venda</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione o usuário</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <select
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione o livro</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} (Estoque: {book.stock})
              </option>
            ))}
          </select>

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
            placeholder="Quantidade"
            className="w-full p-2 border rounded"
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Registrar Venda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
