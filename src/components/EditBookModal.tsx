import { useState, useEffect } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";

interface EditBookModalProps {
  bookId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBookModal({
  bookId,
  onClose,
  onSuccess,
}: EditBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${bookId}`);
        const book = res.data;
        setTitle(book.title);
        setAuthor(book.author);
        setIsbn(book.isbn);
        setPrice(book.price);
        setStock(book.stock);
      } catch {
        toast.error("Erro ao carregar livro");
        onClose();
      }
    };
    fetchBook();
  }, [bookId, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/books/${bookId}`, { title, author, isbn, price, stock });
      toast.success("Livro atualizado com sucesso");
      onSuccess();
      onClose();
    } catch {
      toast.error("Erro ao atualizar livro");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Editar Livro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Autor</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ISBN</label>
            <input
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Preço</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Estoque</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full border px-4 py-2 rounded"
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
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
