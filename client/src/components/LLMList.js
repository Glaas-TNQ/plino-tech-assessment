/* import React from "react";
import { Table } from "react-bootstrap";

const LLMList = ({ llms }) => {
  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead className="table-primary">
        <tr>
          <th>Company</th>
          <th>Category</th>
          <th>Release Date</th>
          <th>Model Name</th>
          <th>Parameters (M)</th>
        </tr>
      </thead>
      <tbody>
        {llms.map((llm, index) => (
          <tr key={index}>
            <td>{llm.company}</td>
            <td>{llm.category}</td>
            <td>{llm.release_date}</td>
            <td>{llm.model_name}</td>
            <td>{llm.num_million_parameters}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default LLMList;
 */



import React from "react";
import { Table } from "react-bootstrap";

const LLMList = ({ llms, onSort, sortConfig }) => {
 
  const getSortIcon = (key) => {
    if (!sortConfig || !sortConfig.key) return ""; // 🔥 Evita errori se sortConfig è undefined
  
    return sortConfig.key === key ? (sortConfig.direction === "asc" ? " ▲" : " ▼") : "";
  };
  
  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead className="table-primary">
        <tr>
          <th>Company</th>
          <th>Category</th>
          <th onClick={() => onSort("release_date")} style={{ cursor: "pointer" }}>
            Release Date {getSortIcon("release_date")}
          </th>
          <th onClick={() => onSort("model_name")} style={{ cursor: "pointer" }}>
            Model Name {getSortIcon("model_name")}
          </th>
          <th onClick={() => onSort("num_million_parameters")} style={{ cursor: "pointer" }}>
            Parameters (M) {getSortIcon("num_million_parameters")}
          </th>
        </tr>
      </thead>
      <tbody>
        {llms.map((llm, index) => (
          <tr key={index}>
            <td>{llm.company}</td>
            <td>{llm.category}</td>
            <td>{llm.release_date}</td>
            <td>{llm.model_name}</td>
            <td>{llm.num_million_parameters}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default LLMList;