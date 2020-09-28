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
                  <th>N° comprobante</th>
                  <th>Pago</th>
                  <th>Números elegidos</th>
                  <th>Comprobante de pago</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>01/02/2020</td>
                  <td>Jill</td>
                  <td>Smith</td>
                  <td>5050505050</td>
                  <td>5050505050</td>
                  <td>correoalgolargo@mail.com</td>
                  <td>Tota pulchra</td>
                  <td>Transferencia</td>
                  <td>1234567890</td>
                  <td>$123</td>
                  <td>
                    <ul>
                      <li>1</li>
                      <li>2</li>
                    </ul>
                  </td>
                  <td>
                    <button className="verBtn">Ver imagen</button>
                  </td>
                </tr>
                <tr>
                  <td>01/02/2020</td>
                  <td>Jill</td>
                  <td>Smith</td>
                  <td>5050505050</td>
                  <td>5050505050</td>
                  <td>correoalgolargo@mail.com</td>
                  <td>Tota pulchra</td>
                  <td>Transferencia</td>
                  <td>1234567890</td>
                  <td>$123</td>
                  <td>
                    <ul>
                      <li>1</li>
                      <li>2</li>
                    </ul>
                  </td>
                  <td>
                    <button className="verBtn">Ver imagen</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
