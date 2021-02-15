import React from 'react'
import { db } from '../firebase'

const InitDB = () => {
  
  const init = () => {
    for(let i = 1; i <= 1000; i++) {
      db.collection("numbers").doc(`${i}`).set({
        number: i,
        selected: false
      })
      .then(function() {
        console.log("Document successfully written!");
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
    }
  }

  return <button onClick={() => init()}>Init DB</button>
}

export default InitDB