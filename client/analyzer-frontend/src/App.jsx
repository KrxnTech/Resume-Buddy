import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { AnalysisProvider } from "./context/AnalysisContext";
import AuthModal from "./components/AuthModal";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AnalysisProvider>
            <AppRoutes />
            <AuthModal />
          </AnalysisProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
