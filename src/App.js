import React, { useState } from "react";
import { db, storage } from "./firebase";

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");
  const allInputs = {imgUrl: ''}
  const [imageAsFile, setImageAsFile] = useState('')
  const [imageAsUrl, setImageAsUrl] = useState(allInputs)

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

  console.log(imageAsFile)
  const handleImageAsFile = (e) => {
    const image = e.target.files[0]
    setImageAsFile(imageFile => (image))
  }


  const handleSubmit = (event) => {
    event.preventDefault()
    if(imageAsFile === '' ) {
      console.error(`not an image, the image file is a ${typeof(imageAsFile)}`)
    }

    const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(imageAsFile)

    uploadTask.on('state_changed', 
    (snapShot) => {
      //takes a snap shot of the process as it is happening
      console.log(snapShot)
    }, (err) => {
      //catches the errors
      console.log(err)
    }, () => {
      // gets the functions from storage refences the image storage in firebase by the children
      // gets the download url then sets the image from firebase as the value for the imgUrl key:
      storage.ref('images').child(imageAsFile.name).getDownloadURL()
       .then(fireBaseUrl => {
         setImageAsUrl(prevObject => ({...prevObject, imgUrl: fireBaseUrl}))
       })
    })
    console.log(imageAsUrl)

    db.collection('contacts').add({
      name,
      phone,
      mail,
      imageAsUrl
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
        <label>
          Sube la imagen de tu pago
          <br/>
          <input type="file" onChange={handleImageAsFile}/>
        </label>
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default App;
