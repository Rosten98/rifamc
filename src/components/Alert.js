import React from "react";
import '../App.css'
const Alert = ({alertMessage}) => {
  return(
    <div className="alert-card"> 
      <p className="alert-message">{alertMessage}</p>
    </div>
  )
}

export default Alert