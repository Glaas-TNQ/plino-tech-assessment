import React from "react";
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
