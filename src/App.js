import React, { useState } from "react";
import { db } from "./firebase";

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");

  const validateName = (event) => {
    setName(event.target.value);
    console.log(name);
  };

  const validatePhone = (event) => {
    setPhone(event.target.value);
    console.log(phone);
  };

  const validateMail = (event) => {
    setMail(event.target.value);
    console.log(mail);
  };

  const handleSubmit = (event) => {
    event.preventDefault()
    db.collection('contacts').add({
      name,
      phone,
      mail
    })
    .then(() => {
      alert("Data added successfully")
    })
    .catch((error) => {
      alert(error.message)  
    })
  }

  return (
    <div>
      <h1> Rifa navideña Miles Christi </h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre completo:
          <br />
          <input
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => validateName(e)}
          />
        </label>
        <br />
        <label>
          Celular o fijo:
          <br />
          <input
            placeholder="3320202020"
            value={phone}
            onChange={(e) => validatePhone(e)}
          />
        </label>
        <br />
        <label>
          Correo electrónico:
          <br />
          <input
            placeholder="nombre@mail.com"
            value={mail}
            onChange={(e) => validateMail(e)}
          />
        </label>
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default App;
