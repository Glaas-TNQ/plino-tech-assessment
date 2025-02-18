import React, { useState } from "react";
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
