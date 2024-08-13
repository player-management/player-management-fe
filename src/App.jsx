import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
import List from "./pages/List";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem("authToken")
  );

  useEffect(() => {
    // Listen to storage changes (in case you want to handle multiple tabs)
    const handleStorageChange = () => {
      setIsAuthenticated(!!sessionStorage.getItem("authToken"));
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/list"
          element={isAuthenticated ? <List /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
