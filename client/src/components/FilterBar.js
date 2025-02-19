import React from "react";

const FilterBar = ({ companyFilter, setCompanyFilter, categoryFilter, setCategoryFilter }) => {
  return (
    <div>
      <h2>Filtri</h2>
      <input type="text" placeholder="Filtra per company" value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} />
      <input type="text" placeholder="Filtra per categoria" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
    </div>
  );
};

export default FilterBar;