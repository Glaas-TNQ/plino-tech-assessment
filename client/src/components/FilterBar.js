import React from "react";

const FilterBar = ({ companyFilter, setCompanyFilter, categoryFilter, setCategoryFilter }) => {
  return (
    <div>
      <h2>Filters</h2>
      <input type="text" placeholder="Filter by company" value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} />
      <input type="text" placeholder="Filter by category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
    </div>
  );
};

export default FilterBar;