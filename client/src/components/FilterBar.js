import React from "react";

const FilterBar = ({ companyFilter, setCompanyFilter, categoryFilter, setCategoryFilter }) => {
  return (
    <div>
      <h2>Filters</h2>
      <input type="text" placeholder="Filter  company" value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} />
      <input type="text" placeholder="Filter category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
    </div>
  );
};

export default FilterBar;