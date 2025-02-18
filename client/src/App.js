import React, { useState, useEffect } from "react";
import AddLLMForm from "./components/AddLLMForm";
import FilterBar from "./components/FilterBar";
import LLMList from "./components/LLMList";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL = "http://localhost:8000";

function App() {
  const [llms, setLlms] = useState([]);
  const [companyFilter, setCompanyFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/llms`)
      .then((res) => res.json())
      .then((data) => setLlms(data))
      .catch((err) => console.error("Errore nel recupero degli LLM:", err));
  }, []);

  const addLLM = (newLLM) => {
    fetch(`${API_BASE_URL}/llm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLLM),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.llm) setLlms([...llms, data.llm]);
      })
      .catch((err) => console.error("Errore nell'aggiunta LLM:", err));
  };

  const addRandomLLM = () => {
    fetch(`${API_BASE_URL}/llm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.llm) setLlms([...llms, data.llm]);
      })
      .catch((err) => console.error("Errore nell'aggiunta LLM:", err));
  };

  const filteredLLMs = llms.filter(
    (llm) =>
      (companyFilter ? llm.company.toLowerCase().includes(companyFilter) : true) &&
      (categoryFilter ? llm.category.toLowerCase().includes(categoryFilter) : true)
  );

  return (
    <div className="container mt-4">
      <h1 className="text-primary text-center">Gestione LLM</h1>

      <div className="card p-4 shadow-lg mb-4">
        <AddLLMForm onAddLLM={addLLM} onAddRandom={addRandomLLM} />
      </div>

      <div className="card p-4 shadow-lg mb-4">
        <FilterBar
          companyFilter={companyFilter}
          setCompanyFilter={setCompanyFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
      </div>

      <div className="card p-4 shadow-lg">
        <LLMList llms={filteredLLMs} />
      </div>
    </div>
  );
}

export default App;
