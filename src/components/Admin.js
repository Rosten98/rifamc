import React from 'react'
import Header from './Header'

const Admin = () => {
  return (
    <div className="page">
      <main>
        <Header/>
        <section>
          <h3>Participantes registrados</h3>
          <div className="admin">
            <table>
              <thead>
                <tr>
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
                  <td>Jill</td>
                  <td>Smith</td>
                  <td>5050505050</td>
                  <td>5050505050</td>
                  <td>correoalgolargo@mail.com</td>
                  <td>Tota pulchra</td>
                  <td>Transferencia</td>
                  <td>1234567890</td>
                  <td>$123</td>
                  <td><ul><li>1</li><li>2</li></ul></td>
                  <td><button className="verBtn">Ver imagen</button></td>
                </tr>
                <tr>
                  <td>Jill</td>
                  <td>Smith</td>
                  <td>5050505050</td>
                  <td>5050505050</td>
                  <td>correoalgolargo@mail.com</td>
                  <td>Tota pulchra</td>
                  <td>Transferencia</td>
                  <td>1234567890</td>
                  <td>$123</td>
                  <td><ul><li>1</li><li>2</li></ul></td>
                  <td><button className="verBtn">Ver imagen</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Admin