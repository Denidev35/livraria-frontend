import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import Books from "./pages/Books";
import PrivateRoute from "./components/PrivateRoute";
import Sales from "./pages/Sales";
import Dashboard from "./pages/Dashboard";
import PageLayout from "./components/layout/PageLayout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PageLayout>
                  <Dashboard />
                </PageLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/books"
            element={
              <PrivateRoute>
                <PageLayout>
                  <Books />
                </PageLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                <PageLayout>
                  <Sales />
                </PageLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
