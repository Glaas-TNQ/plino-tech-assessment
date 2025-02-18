/* import React, { useState, useEffect } from "react";
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
      .then((data) => {
        console.log("Dati ricevuti dal backend:", data);
        setLlms(data);
      })
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

export default App; */

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
      .then((data) => {
        console.log("Dati ricevuti dal backend:", data);
        setLlms(data);
      })
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

/*   const filteredLLMs = llms.filter(
    (llm) =>
      (companyFilter ? llm.company.toLowerCase().includes(companyFilter.toLowerCase()) : true) &&
      (categoryFilter ? llm.category.toLowerCase().includes(categoryFilter.toLowerCase()) : true)
  );
 */

  const filteredLLMs = llms
  .filter((llm) =>
    (companyFilter ? llm.company.toLowerCase().includes(companyFilter.toLowerCase()) : true) &&
    (categoryFilter ? llm.category.toLowerCase().includes(categoryFilter.toLowerCase()) : true)
  )
  .sort((a, b) => {
    const companyA = a.company.toLowerCase();
    const companyB = b.company.toLowerCase();
    const categoryA = a.category.toLowerCase();
    const categoryB = b.category.toLowerCase();
    const filterCompany = companyFilter.toLowerCase();
    const filterCategory = categoryFilter.toLowerCase();

    // Calcola il punteggio di similarità per la company
    const scoreA = companyA.startsWith(filterCompany) ? 2 : companyA.includes(filterCompany) ? 1 : 0;
    const scoreB = companyB.startsWith(filterCompany) ? 2 : companyB.includes(filterCompany) ? 1 : 0;

    // Calcola il punteggio di similarità per la category
    const categoryScoreA = categoryA.startsWith(filterCategory) ? 2 : categoryA.includes(filterCategory) ? 1 : 0;
    const categoryScoreB = categoryB.startsWith(filterCategory) ? 2 : categoryB.includes(filterCategory) ? 1 : 0;

    // Ordina prima per company, poi per categoria
    return scoreB - scoreA || categoryScoreB - categoryScoreA;
  });

  return (
    <div className="container-fluid p-3">
      <h1 className="text-primary text-center mb-4">Gestione LLM</h1>

      {/* Sezione aggiunta LLM */}
      <div className="row g-3">
        <div className="col-lg-8 col-md-12">
          <AddLLMForm onAddLLM={addLLM} onAddRandom={addRandomLLM} />
        </div>
      </div>

      {/* Sezione Filtri */}
      <div className="row mt-4">
        <div className="col-md-12">
          <FilterBar companyFilter={companyFilter} setCompanyFilter={setCompanyFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />
        </div>
      </div>

      {/* Sezione Lista LLM */}
      <div className="row mt-4">
        <div className="col-12">
          <LLMList llms={filteredLLMs} />
        </div>
      </div>
    </div>
  );
}

export default App;

