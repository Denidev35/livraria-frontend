/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

interface NewSaleModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface Book {
  id: string;
  title: string;
  stock: number;
  author: string;
}

export default function NewSaleModal({
  onClose,
  onSuccess,
}: NewSaleModalProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookId, setBookId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { user } = useAuth();

  const userId = user?.id;

  useEffect(() => {
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendedor
            </label>
            <input
              value={user?.name}
              required
              className="w-full p-2 border rounded bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="book-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Livro
            </label>
            <select
              id="book-select"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione o livro</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} - {book.author}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantidade
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              placeholder="Quantidade"
              className="w-full p-2 border rounded"
              required
            />
          </div>

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
