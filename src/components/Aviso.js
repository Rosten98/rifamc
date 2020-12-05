import React from "react";
import Header from "./Header";

const Aviso = () => {
  return (
    <div className="page">
      <main>
        <Header/>
        <section>
          <h3>Aviso importante</h3>
          <p>El registro en línea está deshabilitado. Si aun no cuentas con boleto, por favor contacta a <b>Caludia Orozco</b> al siguiente número:</p>
          <a className="row call-cta" href="tel:3310770991">
            <i className="fas fa-phone"/> 
            <span>33 1077 0991</span>
          </a>
          <a className="row whatsapp-cta" href="https://api.whatsapp.com/send?phone=523310770991">
            <i className="fab fa-whatsapp"/>
            Enviar mensaje
          </a>
        </section>
      </main>
    </div>
  )
}

export default Aviso;
