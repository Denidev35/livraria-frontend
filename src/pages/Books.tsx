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

const ITEMS_PER_PAGE = 10; // Definir quantos itens por página

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editBookId, setEditBookId] = useState<string | null>(null);
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleDelete = async () => {
    if (!deleteBookId) return;
    try {
      await api.delete(`/books/${deleteBookId}`);
      toast.success("Livro excluído com sucesso");
      setShowDeleteModal(false);
      fetchBooks();
    } catch {
      toast.error("Erro ao excluir livro");
      setShowDeleteModal(false);
    }
  };

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author}`.toLowerCase().includes(search.toLowerCase())
  );

  // Função para paginar os livros
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Número total de páginas
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);

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
          {paginatedBooks.map((book) => (
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
                  onClick={() => {
                    setDeleteBookId(book.id);
                    setShowDeleteModal(true);
                  }}
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

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-md w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
            <p className="mb-4">Tem certeza que deseja excluir este livro?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paginação */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="flex items-center gap-2">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
