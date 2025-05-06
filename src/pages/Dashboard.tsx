/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

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
  const [todaySalesCount, setTodaySalesCount] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [topBooks, setTopBooks] = useState<
    { title: string; quantity: number }[]
  >([]);
  const [salesByDate, setSalesByDate] = useState<
    { date: string; total: number }[]
  >([]);

  useEffect(() => {
    api.get("/sales").then((res) => {
      const data: Sale[] = res.data;

      const today = new Date().toISOString().split("T")[0];
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Vendas e receita de hoje
      const todaySales = data.filter((sale) => sale.date.startsWith(today));
      setTodaySalesCount(todaySales.length);
      setTodayRevenue(todaySales.reduce((acc, sale) => acc + sale.total, 0));

      // Arrecadação mensal
      const monthTotal = data
        .filter((sale) => {
          const saleDate = new Date(sale.date);
          return (
            saleDate.getMonth() === currentMonth &&
            saleDate.getFullYear() === currentYear
          );
        })
        .reduce((acc, sale) => acc + sale.total, 0);
      setMonthlyRevenue(monthTotal);

      // Top 5 livros mais vendidos
      const bookSales: Record<string, { title: string; quantity: number }> = {};
      data.forEach((sale) => {
        if (!bookSales[sale.book.id]) {
          bookSales[sale.book.id] = { title: sale.book.title, quantity: 0 };
        }
        bookSales[sale.book.id].quantity += sale.quantity;
      });
      const topBooksData = Object.values(bookSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
      setTopBooks(topBooksData);

      // Gráfico: Vendas por dia
      const salesPerDay: Record<string, number> = {};
      data.forEach((sale) => {
        const day = sale.date.split("T")[0];
        salesPerDay[day] = (salesPerDay[day] || 0) + sale.total;
      });
      const dateData = Object.entries(salesPerDay)
        .filter(([_, total]) => total > 0)
        .map(([date, total]) => ({ date, total }));
      setSalesByDate(dateData);
    });
  }, []);

  const formatCurrency = (value: number) =>
    `R$ ${value.toFixed(2).replace(".", ",")}`;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">Vendas de Hoje</h2>
          <p className="text-2xl font-bold">{todaySalesCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">Arrecadação de Hoje</h2>
          <p className="text-2xl font-bold">{formatCurrency(todayRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">Livro Mais Vendido</h2>
          <p className="text-lg font-semibold">
            {topBooks.length > 0 ? topBooks[0].title : "Nenhum"}
          </p>
        </div>
      </div>

      {/* Alteração: Troca dos cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card de Arrecadação do Mês */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">Arrecadação do Mês</h2>
          <p className="text-2xl font-bold mt-2">
            {formatCurrency(monthlyRevenue)}
          </p>
        </div>

        {/* Card de Top 5 Livros Mais Vendidos */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">Top 5 Livros Mais Vendidos</h2>
          <ul className="space-y-1 mt-2">
            {topBooks.map((book, idx) => (
              <li key={idx} className="text-base font-medium">
                {book.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Gráfico de Vendas por Dia */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-bold mb-4">Arrecadação por Dia</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesByDate}>
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                format(new Date(date), "dd/MM", { locale: ptBR })
              }
            />
            <YAxis tickFormatter={(value) => `R$ ${value.toFixed(2)}`} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label: string) =>
                `Data: ${format(new Date(label), "dd/MM/yyyy", {
                  locale: ptBR,
                })}`
              }
            />
            <Bar dataKey="total" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
