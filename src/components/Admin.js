import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { db } from "../firebase";
import Header from "./Header";

const Admin = () => {
  const [participants, setParticipants] = useState([]);
  const [csvParticipants, setCsvParticipants] = useState([])
  const [order, setOrder] = useState("contacto");
  const [participantsComp, setParticipantsComp] = useState([]);

  const participantsByContact = participants.map((participant) => {
    const numbersComp = participant.selectedNumbers.map((number) => (
      <li key={number}>{number + "||"}</li>
    ));
    return (
      <tr key={participant.date}>
        <td>{participant.date}</td>
        <td>{participant.firstName}</td>
        <td>{participant.lastName}</td>
        <td>{participant.phone}</td>
        <td>{participant.localPhone}</td>
        <td>{participant.mail}</td>
        <td>{participant.group}</td>
        <td>{participant.paymentType}</td>
        <td>{participant.ticketNumber}</td>
        <td>{participant.payValue}</td>
        <td>
          <ul>{numbersComp}</ul>
        </td>
        <td>
          <a
            href={participant.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="verBtn">Ver imagen</button>
          </a>
        </td>
      </tr>
    );
  })

  const participantsByTicket = participants.map((participant) => {
    let helper = participant.selectedNumbers.map((number) => {
      return (
        <tr key={number}>
          <td>{participant.date}</td>
          <td>{participant.firstName}</td>
          <td>{participant.lastName}</td>
          <td>{participant.phone}</td>
          <td>{participant.localPhone}</td>
          <td>{participant.mail}</td>
          <td>{participant.group}</td>
          <td>{participant.paymentType}</td>
          <td>{participant.ticketNumber}</td>
          <td>{participant.payValue}</td>
          <td>{number}</td>
          <td>
            <a
              href={participant.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="verBtn">Ver imagen</button>
            </a>
          </td>
        </tr>
      );
    });
    return helper;
  })

  const onRadioChange = (event) => {
    const orderType = event.target.value;
    if (orderType === "contacto"){
      setCsvParticipants(participants)
      setParticipantsComp(participantsByContact);
    }
    else if (orderType === "boleto"){
      const newParticipants = participants.map(item => {
        let helper = item.selectedNumbers.map(number => {
          return {
            date:  item.date,
            firstName:  item.firstName,
            lastName:  item.lastName,
            group:  item.group,
            numberSelected:  number,
            phone:  item.phone,
            localPhone:  item.localPhone,
            mail:  item.mail,
            payValue:  item.payValue,
            paymentType:  item.paymentType,
            paymentNumber:  item.ticketNumber,
            paymentImage:  item.imageUrl,
          }
        })
        return helper
      })
      console.log(newParticipants.flat())
      setCsvParticipants(newParticipants.flat())
      setParticipantsComp(participantsByTicket);
    }
    setOrder(event.target.value);
  };

  useEffect(() => {
    db.collection("contacts")
      .orderBy("date", "asc")
      .get()
      .then((querySnapshot) => {
        let docs = [];
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data().number, doc.data().selected);
          docs.push({
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            phone: doc.data().phone,
            localPhone: doc.data().localPhone,
            mail: doc.data().mail,
            imageUrl: doc.data().imageAsUrl,
            date: doc.data().date,
            group: doc.data().group,
            selectedNumbers: doc.data().selectedNumbers,
            paymentType: doc.data().paymentType,
            ticketNumber: doc.data().ticketNumber,
            payValue: doc.data().payValue,
          });
        });
        setParticipants(docs);
        setCsvParticipants(docs)
        setParticipantsComp(
          docs.map((participant) => {
            const numbersComp = participant.selectedNumbers.map((number) => (
              <li key={number}>{number + ", "}</li>
            ));
            return (
              <tr key={participant.date}>
                <td>{participant.date}</td>
                <td>{participant.firstName}</td>
                <td>{participant.lastName}</td>
                <td>{participant.phone}</td>
                <td>{participant.localPhone}</td>
                <td>{participant.mail}</td>
                <td>{participant.group}</td>
                <td>{participant.paymentType}</td>
                <td>{participant.ticketNumber}</td>
                <td>{participant.payValue}</td>
                <td>
                  <ul>{numbersComp}</ul>
                </td>
                <td>
                  <a
                    href={participant.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="verBtn">Ver imagen</button>
                  </a>
                </td>
              </tr>
            );
          })
        );
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, []);

  return (
    <div className="page">
      <main>
        <Header />
        <section>
          <h3>Participantes registrados</h3>
          {participants.length > 0 && (
            <div>
              <CSVLink
                data={csvParticipants}
                filename={"participantes_rifamc.csv"}
                className="excel"
              >
                Descargar información en excel
              </CSVLink>
              <br />
              <label>Filtrar</label>
              <div className="controls">
                <label>
                  <input
                    type="radio"
                    value="contacto"
                    name="filter"
                    checked={order === "contacto"}
                    onChange={(event) => onRadioChange(event)}
                  />{" "}
                  Por contacto
                </label>
                <br />
                <label>
                  <input
                    type="radio"
                    value="boleto"
                    name="filter"
                    checked={order === "boleto"}
                    onChange={(event) => onRadioChange(event)}
                  />{" "}
                  Por boleto
                </label>
              </div>
            </div>
          )}

          <br />
          <div className="admin">
            <table>
              <thead>
                <tr>
                  <th>Fecha de registro</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Celular</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Grupo</th>
                  <th>Tipo de pago</th>
                  <th>Folio de ticket</th>
                  <th>Pago</th>
                  <th>Números elegidos</th>
                  <th>Comprobante de pago</th>
                </tr>
              </thead>
              <tbody>{participantsComp}</tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
