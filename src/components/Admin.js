import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Header from "./Header";

const Admin = () => {
  const [participants, setParticipants] = useState([]);

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
            payValue: doc.data().payValue
          });
        });
        setParticipants(docs);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, []);

  console.log(participants)
  
  const participantsComp = participants.map(participant => {
    const numbersComp = participant.selectedNumbers.map(number => <li>{number}</li>)
    return (
      <tr>
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
          <ul>
            {numbersComp}
          </ul>
        </td>
        <td><a href={participant.imageUrl} target="_blank" rel="noopener noreferrer"><button className="verBtn">Ver imagen</button></a></td>
      </tr>
    )
  })

  return (
    <div className="page">
      <main>
        <Header />
        <section>
          <h3>Participantes registrados</h3>
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
                  <th>Folio de venta</th>
                  <th>Pago</th>
                  <th>Números elegidos</th>
                  <th>Comprobante de pago</th>
                </tr>
              </thead>
              <tbody>
                {participantsComp}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
