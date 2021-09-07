import React from 'react'

const Header = () => {
  return (
    <header>
      <img src={require("../assets/full-ogo.jpg")} className="logo" alt="" />
      <img src={require("../assets/logo-rifa.jpg")} className="logo" alt="" />
      {/* <h1> Rifa navideña Miles Christi </h1> */}
    </header>
  )
}

export default Header