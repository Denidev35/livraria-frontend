import { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Sale {
  id: string;
  date: string;
  quantity: number;
  total: number;
  book: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    name: string;
  };
}

export default function Dashboard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topBook, setTopBook] = useState("");
  const [topSellers, setTopSellers] = useState<
    { name: string; total: number }[]
  >([]);
  const [salesByDate, setSalesByDate] = useState<
    { date: string; total: number }[]
  >([]);

  useEffect(() => {
    api.get("/sales").then((res) => {
      const data: Sale[] = res.data;
      setSales(data);

      // Total de receita
      const revenue = data.reduce((acc, sale) => acc + sale.total, 0);
      setTotalRevenue(revenue);

      // Livro mais vendido
      const bookCount: Record<string, { title: string; quantity: number }> = {};
      data.forEach((sale) => {
        if (!bookCount[sale.book.id]) {
          bookCount[sale.book.id] = { title: sale.book.title, quantity: 0 };
        }
        bookCount[sale.book.id].quantity += sale.quantity;
      });
      const topBookData = Object.values(bookCount).sort(
        (a, b) => b.quantity - a.quantity
      )[0];
      setTopBook(topBookData?.title || "");

      // Vendas por vendedor
      const userTotals: Record<string, { name: string; total: number }> = {};
      data.forEach((sale) => {
        if (!userTotals[sale.user.id]) {
          userTotals[sale.user.id] = { name: sale.user.name, total: 0 };
        }
        userTotals[sale.user.id].total += sale.total;
      });
      const sortedUsers = Object.values(userTotals)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
      setTopSellers(sortedUsers);

      // Vendas por data (agrupado por dia)
      const salesPerDay: Record<string, number> = {};
      data.forEach((sale) => {
        const day = new Date(sale.date).toISOString().split("T")[0];
        salesPerDay[day] = (salesPerDay[day] || 0) + sale.total;
      });
      const dateData = Object.entries(salesPerDay).map(([date, total]) => ({
        date,
        total,
      }));
      setSalesByDate(dateData);
    });
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">Total de Vendas</h2>
          <p className="text-2xl font-bold">{sales.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">Total Arrecadado</h2>
          <p className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">Livro Mais Vendido</h2>
          <p className="text-lg font-semibold">{topBook || "Nenhum"}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-bold mb-2">Top 5 Vendedores</h2>
        <ul className="space-y-1">
          {topSellers.map((seller, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{seller.name}</span>
              <span>R$ {seller.total.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-bold mb-4">Vendas por Dia</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesByDate}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
