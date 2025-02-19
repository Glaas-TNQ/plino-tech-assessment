import React, { useState, useEffect } from "react";
import AddLLMForm from "./components/AddLLMForm";
import FilterBar from "./components/FilterBar";
import LLMList from "./components/LLMList";
import { Toaster } from 'sonner';
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL = "http://localhost:8000";

function App() {
  const [llms, setLlms] = useState([]);
  const [companyFilter, setCompanyFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    let ignore = false; // ✅ Variabile per ignorare il secondo render in StrictMode

    fetch(`${API_BASE_URL}/llms`)
    .then((res) => res.json())
    .then((data) => {
      if (!ignore) {  // 🔥 Ignora il secondo render
        console.log("Dati ricevuti dal backend:", data);
        setLlms(data);
      }
    })
    .catch((err) => console.error("Errore nel recupero degli LLM:", err));

  return () => {
    ignore = true; // 🛑 Blocca il secondo fetch su StrictMode
  };
}, []);


  const addLLM = async (newLLM) => {
    try {
      const response = await fetch(`${API_BASE_URL}/llm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLLM),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: true, message: data.detail || "Errore sconosciuto." }; // ✅ Messaggio di errore
      }

      setLlms([...llms, data.llm]);
      return { error: false, message: "LLM aggiunto con successo!" }; // ✅ Messaggio di successo
    } catch (err) {
      console.error("Errore nell'aggiunta LLM:", err);
      return { error: true, message: "Errore di rete o server." };
    }
  };

  const addRandomLLM = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/llm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { error: true, message: data.detail || "Errore sconosciuto." };
      }
  
      setLlms([...llms, data.llm]);
      return { error: false, message: "LLM casuale aggiunto con successo!" };
    } catch (err) {
      console.error("Errore nell'aggiunta LLM Random:", err);
      return { error: true, message: "Errore di rete o server." };
    }
  };
  
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedLLMs = [...llms]
    .filter((llm) =>
      (companyFilter ? llm.company.toLowerCase().includes(companyFilter.toLowerCase()) : true) &&
      (categoryFilter ? llm.category.toLowerCase().includes(categoryFilter.toLowerCase()) : true)
    )
    .sort((a, b) => {
      if (sortConfig.key) {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        if (sortConfig.key === "release_date") {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        } else if (sortConfig.key === "num_million_parameters") {
          valueA = parseInt(valueA);
          valueB = parseInt(valueB);
        } else {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });

  return (
    <div className="container-fluid p-3">
      <h1 className="text-primary text-center mb-4">Gestione LLM</h1>

      <div className="row g-3">
        <div className="col-lg-8 col-md-12 mx-auto">
          <Toaster richColors position="bottom-center" />
          <AddLLMForm onAddLLM={addLLM} onAddRandom={addRandomLLM} />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <FilterBar
            companyFilter={companyFilter}
            setCompanyFilter={setCompanyFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <LLMList llms={sortedLLMs} onSort={handleSort} sortConfig={sortConfig} />
        </div>
      </div>
    </div>
  );
}

export default App;