import React, { useEffect, useState } from "react";
import { db, storage } from "./firebase";
import imageCompression from 'browser-image-compression';

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");
  const [imageAsFile, setImageAsFile] = useState('')
  const [imageAsUrl, setImageAsUrl] = useState('')
  const [uploadState, setUploadState] = useState(0)

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

  const resetForm = () => {
    setName("")
    setMail("")
    setPhone("")
    setImageAsFile("")
    setImageAsUrl("")
    setUploadState(0)
    const imageInput = document.getElementById('payImg')
    imageInput.value = null
  }

  const handleImageAsFile = async (e) => {
    const image = e.target.files[0]
    const newImgName = phone + generateImageId()
    const imageFile = new File([image], newImgName, {type: image.type})

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
      console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
      setImageAsFile(compressedFile)
    } catch (error) {
      console.log(error);
    }
  }

  const generateImageId = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  const handleSubmit = (event) => {
    event.preventDefault()

    db.collection('contacts').add({
      name,
      phone,
      mail,
      imageAsUrl
    })
    .then(() => {
      alert("Data added successfully")
      resetForm()
    })
    .catch((error) => {
      alert(error.message)  
    })
  }

  useEffect(()=> {
    if(imageAsFile === '' ) {
      console.error(`not an image, the image file is a ${typeof(imageAsFile)}`)
    } else {
      const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(imageAsFile)

      uploadTask.on('state_changed', 
      (snapshot) => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadState(Math.round(percentage))
      }, (err) => {
        //catches the errors
        console.log(err)
      }, () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage.ref('images').child(imageAsFile.name).getDownloadURL()
        .then(fireBaseUrl => {
          setImageAsUrl(fireBaseUrl)
        })
      })
    }

    
  }, [imageAsFile])

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
        
        <img src={imageAsUrl} width="100%" accept="image/jpeg, image/png" id="payImg"></img>
        <p>{uploadState !== 0 && uploadState}</p>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default App;
