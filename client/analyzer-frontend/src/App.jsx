import { BrowserRouter } from "react-router-dom";
import { AnalysisProvider } from "./context/AnalysisContext";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AnalysisProvider>
        <AppRoutes />
      </AnalysisProvider>
    </BrowserRouter>
  );
}

export default App;
