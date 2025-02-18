/* import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";

const AddLLMForm = ({ onAddLLM, onAddRandom }) => {
  const [newLLM, setNewLLM] = useState({
    company: "",
    category: "",
    release_date: "",
    model_name: "",
    num_million_parameters: "",
  });

  const handleChange = (e) => {
    setNewLLM({ ...newLLM, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddLLM(newLLM);
    setNewLLM({
      company: "",
      category: "",
      release_date: "",
      model_name: "",
      num_million_parameters: "",
    });
  };


   return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Company"
            name="company"
            value={newLLM.company}
            onChange={handleChange}
          />
        </Col>
        <Col>
          <Form.Control
            type="text"
            placeholder="Category"
            name="category"
            value={newLLM.category}
            onChange={handleChange}
          />
        </Col>
        <Col>
          <Form.Control
            type="date"
            name="release_date"
            value={newLLM.release_date}
            onChange={handleChange}
          />
        </Col>
        <Col>
          <Form.Control
            type="text"
            placeholder="Model Name"
            name="model_name"
            value={newLLM.model_name}
            onChange={handleChange}
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            placeholder="Parameters (millions)"
            name="num_million_parameters"
            value={newLLM.num_million_parameters}
            onChange={handleChange}
          />
        </Col>
        <Col>
          <Button variant="success" type="submit">
            Aggiungi LLM
          </Button>
        </Col>
      </Row>
      <Button variant="info" onClick={onAddRandom}>
        Aggiungi LLM Random
      </Button>
    </Form>
  );
}; 

export default AddLLMForm;
 */

import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

const AddLLMForm = ({ onAddLLM, onAddRandom }) => {
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [modelName, setModelName] = useState("");
  const [parameters, setParameters] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (company && category && releaseDate && modelName && parameters) {
      onAddLLM({ company, category, release_date: releaseDate, model_name: modelName, num_million_parameters: parseInt(parameters) });
      setCompany("");
      setCategory("");
      setReleaseDate("");
      setModelName("");
      setParameters("");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex justify-content-center align-items-center mt-4">
      <h3 className="text-secondary">Aggiungi un LLM</h3>
      <div className="row g-2">
        <div className="col-md-4">
          <Form.Control type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} required />
        </div>
        <div className="col-md-4">
          <Form.Control type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div className="col-md-4">
          <Form.Control type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required />
        </div>
        <div className="col-md-6">
          <Form.Control type="text" placeholder="Model Name" value={modelName} onChange={(e) => setModelName(e.target.value)} required />
        </div>
        <div className="col-md-6">
          <Form.Control type="number" placeholder="Parameters (millions)" value={parameters} onChange={(e) => setParameters(e.target.value)} required />
        </div>
      </div>
      <div className="d-flex flex-column flex-md-row gap-2 mt-3">
        <Button type="submit" variant="success" className="w-100">Aggiungi LLM</Button>
        <Button variant="primary" className="w-100" onClick={onAddRandom}>Aggiungi LLM Random</Button>
      </div>
    </Form>
  );
};

export default AddLLMForm;
