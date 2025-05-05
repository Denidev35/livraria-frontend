/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";
import NewBookModal from "../components/NewBookModal";
import EditBookModal from "../components/EditBookModal";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  price: number;
  stock: number;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editBookId, setEditBookId] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch (err) {
      toast.error("Erro ao buscar livros");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este livro?")) return;
    try {
      await api.delete(`/books/${id}`);
      toast.success("Livro excluído com sucesso");
      fetchBooks();
    } catch {
      toast.error("Erro ao excluir livro");
    }
  };

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Livros</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Novo Livro
        </button>
      </div>

      <input
        type="text"
        placeholder="Pesquisar por título ou autor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full max-w-md"
      />

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Título</th>
            <th className="border px-4 py-2">Autor</th>
            <th className="border px-4 py-2">ISBN</th>
            <th className="border px-4 py-2">Preço</th>
            <th className="border px-4 py-2">Estoque</th>
            <th className="border px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.id} className="text-center">
              <td className="border px-4 py-2">{book.title}</td>
              <td className="border px-4 py-2">{book.author}</td>
              <td className="border px-4 py-2">{book.isbn}</td>
              <td className="border px-4 py-2">R$ {book.price.toFixed(2)}</td>
              <td className="border px-4 py-2">{book.stock}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => setEditBookId(book.id)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="text-red-600 hover:underline"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <NewBookModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchBooks}
        />
      )}

      {editBookId && (
        <EditBookModal
          bookId={editBookId}
          onClose={() => setEditBookId(null)}
          onSuccess={fetchBooks}
        />
      )}
    </div>
  );
}
