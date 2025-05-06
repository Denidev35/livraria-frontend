import { useEffect, useState } from "react";
import { api } from "../services/api";
import NewSaleModal from "../components/NewSaleModal";

interface Sale {
  id: string;
  date: string;
  quantity: number;
  total: number;
  book: {
    title: string;
  };
  user: {
    name: string;
  };
}

const ITEMS_PER_PAGE = 10; // Quantidade de itens por página

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchSales = async () => {
    try {
      const res = await api.get("/sales");
      setSales(res.data);
    } catch (err) {
      console.error("Erro ao buscar vendas", err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    const sortedSales = [...sales].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const filtered = sortedSales.filter((sale) => {
      const matchesSearch =
        sale.book.title.toLowerCase().includes(search.toLowerCase()) ||
        sale.user.name.toLowerCase().includes(search.toLowerCase());

      const saleDate = new Date(sale.date).toISOString().split("T")[0];
      const afterStartDate = startDate ? saleDate >= startDate : true;
      const beforeEndDate = endDate ? saleDate <= endDate : true;

      return matchesSearch && afterStartDate && beforeEndDate;
    });

    setFilteredSales(filtered);
  }, [search, startDate, endDate, sales]);

  // Paginação: obter os itens para a página atual
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Número total de páginas
  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);

  return (
    <div>
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Vendas</h1>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setShowNewSaleModal(true)}
          >
            Nova Venda
          </button>
        </div>

        {/* Filtros responsivos */}
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <input
            type="text"
            placeholder="Pesquisar por livro ou vendedor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded flex-1 min-w-[200px]"
          />

          <div className="flex flex-col min-w-[150px]">
            <label className="text-sm text-gray-600 mb-1">De</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col min-w-[150px]">
            <label className="text-sm text-gray-600 mb-1">Até</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <button
            onClick={() => {
              setSearch("");
              setStartDate("");
              setEndDate("");
            }}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition min-w-[150px]"
          >
            Limpar Filtros
          </button>
        </div>

        {/* Tabela */}
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Data</th>
              <th className="border px-4 py-2">Livro</th>
              <th className="border px-4 py-2">Vendedor</th>
              <th className="border px-4 py-2">Quantidade</th>
              <th className="border px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSales.map((sale) => (
              <tr key={sale.id} className="text-center">
                <td className="border px-4 py-2">
                  {new Date(sale.date).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">{sale.book.title}</td>
                <td className="border px-4 py-2">{sale.user.name}</td>
                <td className="border px-4 py-2">{sale.quantity}</td>
                <td className="border px-4 py-2">R$ {sale.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

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

      {showNewSaleModal && (
        <NewSaleModal
          onClose={() => setShowNewSaleModal(false)}
          onSuccess={fetchSales}
        />
      )}
    </div>
  );
}
