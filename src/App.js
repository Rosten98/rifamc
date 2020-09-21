import React, { useEffect, useState } from "react";
import { db, storage } from "./firebase";
import imageCompression from 'browser-image-compression';
import './App.css'
import Error from "./components/Error";
import Alert from "./components/Alert";
const App = () => {
  const [name, setName] = useState("");
  const [isNameValid, setIsNameValid] = useState(false)
  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false)
  const [mail, setMail] = useState("");
  const [isMailValid, setIsMailValid] = useState(false)
  const [group, setGroup] = useState("");
  const [numbers, setNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [isNumberValid, setIsNumberValid] = useState(false)
  const [imageAsFile, setImageAsFile] = useState('');
  const [imageAsUrl, setImageAsUrl] = useState('');
  // const [isUrl, setIsUrl] = useState(false)
  const [uploadState, setUploadState] = useState(0);

  const validateName = (event) => {
    const inputName = event.target.value
    const re = /^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$/
    setName(inputName);
    if(re.test(inputName)){
      setIsNameValid(true)
    } else {
      setIsNameValid(false)
    }
  };

  const validatePhone = (event) => {
    const inputPhone = event.target.value
    const re = /^\d{10}$/
    setPhone(inputPhone)
    if(re.test(inputPhone)){
      setIsPhoneValid(true)
    } else {
      setIsPhoneValid(false)
    }
  };

  const validateMail = (event) => {
    const inputMail = event.target.value
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    setMail(inputMail);
    if(re.test(inputMail.toLowerCase())){
      setIsMailValid(true)
    } else {
      setIsMailValid(false)
    }
  };

  const resetForm = () => {
    setName("")
    setPhone("")
    setMail("")
    setGroup("")
    setSelectedNumbers([])
    setImageAsFile("")
    setImageAsUrl("")
    setUploadState(0)
    const imageInput = document.getElementById('payImg')
    imageInput.value = null
    const selNumbers = document.getElementById('selNumbers')
    selNumbers.value = null
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
  
  const handleNumbers = (e) => {
    console.log(e.target.value)
    const numbersSelected = e.target.value.replace(/\s/g, '').split(',')
    let aSelectedNumbers = []
    numbersSelected.forEach( number => {
      if(isNaN(number) || number === ""){
        setIsNumberValid(false)
      } else {
        setIsNumberValid(true)
      }
      aSelectedNumbers.push(number)
    })
    setSelectedNumbers(aSelectedNumbers)
    console.log(numbersSelected)
    console.log("Is valid number", isNumberValid)
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
      imageAsUrl,
      date: new Date().toLocaleString(),
      group,
      selectedNumbers,
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

  useEffect(()=> {
    db.collection('numbers').orderBy("number", "asc").get()
      .then((querySnapshot) => {
        let docs = []
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data().number);
          docs.push({id: doc.id, number: doc.data().number})
        });
        setNumbers(docs)
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
    }, [])

    // console.log(numbers)
    
    return (
    <div className="page">
      <main className="">
        <header>
          <img src={require('./assets/logo.jpg')} width="100px" className="logo" alt=""/>
          <h1> Rifa navideña Miles Christi </h1>
        </header>
          <form onSubmit={handleSubmit}>
            <section>
              <h3>Información básica</h3>
              <div className="basic-info">
                <label className="input-a">
                  Nombre completo
                  <br />
                  <input
                    placeholder="Nombre completo"
                    value={name}
                    onChange={(e) => validateName(e)}
                  />
                  {
                      name === "" ? 
                      <Alert alertMessage="Campo obligatorio"/> :
                      !isNameValid && <Error errorMesssage="El nombre no es correcto"/>
                  }
                <br />
                </label>
                <label className="input-b">
                  Celular o teléfono fijo
                  <br />
                  <input
                    placeholder="3320202020"
                    value={phone}
                    onChange={(e) => validatePhone(e)}
                  />
                  {
                      phone === "" ? 
                      <Alert alertMessage="Campo obligatorio"/> :
                      !isPhoneValid && <Error errorMesssage="El número no es correcto. Solo debe contener 10 dígitos sin espacios ni caracteres especiales."/>
                  }
                <br />
                </label>
                <label className="input-c">
                  Correo electrónico
                  <br />
                  <input
                    placeholder="nombre@mail.com"
                    value={mail}
                    onChange={(e) => validateMail(e)}
                  />
                  {
                      mail === "" ? 
                      <Alert alertMessage="Campo obligatorio"/> :
                      !isMailValid && <Error errorMesssage="El mail no es correcto"/>
                  }
                <br />
                </label> 
                <label className="input-d">
                  Grupo al que perteneces (si no perteneces a ninguno, dejalo en blanco)
                  <br />
                  <input
                    placeholder="P.e. JUCOC, Pulchritas, Formación para mujeres, etc"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                  />
                <br />
                </label>  
              </div>
              <hr/>
              <h3>Información sobre el boleto</h3>
              <div className="numbers-info">
                <div>
                  <label>
                    Sube la foto de tu pago
                    <input type="file" onChange={handleImageAsFile} id="inputImgUp"/>
                    {
                      imageAsUrl === "" ? 
                      <Alert alertMessage="Campo obligatorio"/> :
                      null
                    }
                  </label>
                  <button type="button" onClick={() => document.getElementById('inputImgUp').click()} className="btnUp">
                    <span>Subir foto</span>
                    <i className="fas fa-upload"></i>
                  </button>
                  {
                    uploadState !== 0 && <p className="progress">Subido {uploadState}%</p>
                  }
                  <img src={imageAsUrl} width="100%" accept="image/jpeg, image/png" id="payImg" alt=""></img>
                </div> 
                <div>
                  <label>Números disponibles</label>
                  <ul>
                    {
                        numbers.length > 0 && numbers.map((item,i) => {
                          return (
                            <li key={i}>{item.number}</li>
                          )
                        })
                    }
                  </ul>
                  <p>De los números disponibles, elige tantos como hayas pagado (si pagaste 3 elige 3) y escribelos en el siguiente recuadro separados por una coma.</p>
                  <label>
                    Escribe tus números
                    <br/>
                    <textarea onChange={handleNumbers} placeholder="100, 101, 102" id="selNumbers"></textarea>
                    {
                      selectedNumbers.length === 0 ? 
                      <Alert alertMessage="Campo obligatorio"/> :
                      !isNumberValid && <Error errorMesssage="Los numeros no están correctamente escritos, valide los siguientes datos: números separados por coma, números sin repetir"/>
                    }
                  </label>
                  <br />
                </div> 
              </div>
            </section>
            <footer>
              <button type="submit">
                <span>Enviar</span>
                <i className="fas fa-paper-plane"></i>
              </button>
            </footer>
          </form>
      </main>
    </div>
  );
}

export default App;
