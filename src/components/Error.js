import React from "react";
import '../App.css'
const Error = ({errorMesssage}) => {
  return(
    <div className="error-card"> 
      <p className="error-message">{errorMesssage}</p>
    </div>
  )
}

export default Error