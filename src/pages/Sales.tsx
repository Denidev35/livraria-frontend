import { useEffect, useState } from "react";
import { api } from "../services/api";
import NewSaleModal from "../components/NewSaleModal"; // ajuste o caminho se necessário

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

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
    const filtered = sales.filter((sale) => {
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

        <div className="flex flex-wrap gap-4 items-end mb-4">
          <input
            type="text"
            placeholder="Pesquisar por livro ou vendedor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full sm:w-1/3"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded w-full sm:w-1/4"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded w-full sm:w-1/4"
          />
          <button
            onClick={() => {
              setSearch("");
              setStartDate("");
              setEndDate("");
            }}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Limpar Filtros
          </button>
        </div>

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
            {filteredSales.map((sale) => (
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
