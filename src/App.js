import React, { useEffect, useState } from "react";
import { db, storage } from "./firebase";
import imageCompression from 'browser-image-compression';
import './App.css'
import Error from "./components/Error";
import Alert from "./components/Alert";
const App = () => {
  const [firstName, setFirstName] = useState("");
  const [isFirstNameValid, setIsFirstNameValid] = useState(false)
  const [lastName, setLastName] = useState("");
  const [isLastNameValid, setIsLastNameValid] = useState(false)
  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false)
  const [localPhone, setLocalPhone] = useState("");
  const [isLocalPhoneValid, setIsLocalPhoneValid] = useState(false)
  const [mail, setMail] = useState("");
  const [isMailValid, setIsMailValid] = useState(false)
  const [group, setGroup] = useState("Ninguno");
  const [numbers, setNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [imageAsFile, setImageAsFile] = useState('');
  const [imageAsUrl, setImageAsUrl] = useState('');
  // const [isUrl, setIsUrl] = useState(false)
  const [uploadState, setUploadState] = useState(0);
  const [paymentType, setPaymentType] = useState("Oxxo")
  const [ticketNumber, setTicketNumber] = useState("")
  const [isTicketValid, setIsTicketValid] = useState(false)
  const [payValue, setPayValue] = useState("")
  const [isPayValid, setIsPayValid] = useState(false)

  const [alertMessage, setAlertMessage] = useState("")

  const validateName = (event) => {
    const inputName = event.target.value
    const re = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/
    setFirstName(inputName);
    if(re.test(inputName)){
      setIsFirstNameValid(true)
    } else {
      setIsFirstNameValid(false)
    }
  };

  const validateLastName = (event) => {
    const inputName = event.target.value
    const re = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/
    setLastName(inputName);
    if(re.test(inputName)){
      setIsLastNameValid(true)
    } else {
      setIsLastNameValid(false)
    }
  }

  const validateLocalPhone = (event) => {
    const inputPhone = event.target.value
    const re = /^\d{10}$/
    setLocalPhone(inputPhone)
    if(re.test(inputPhone)){
      setIsLocalPhoneValid(true)
    } else {
      setIsLocalPhoneValid(false)
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

  const validateTicketnumber = (event) => {
    const inputTicket = event.target.value
    const re = /^\d+$/
    setTicketNumber(inputTicket)
    if(re.test(inputTicket)){
      setIsTicketValid(true)
    } else {
      setIsTicketValid(false)
    }    
  }

  const validatePayValue = (event) => {
    const inputTicket = event.target.value
    const re = /^\d+(\.\d+)?$/
    setPayValue(inputTicket)
    if(re.test(inputTicket)){
      setIsPayValid(true)
    } else {
      setIsPayValid(false)
    }    
  }

  const resetForm = () => {
    if(imageAsUrl !== ''){
      const imageInput = document.getElementById('payImg')
      imageInput.value = null
    }
    setFirstName("")
    setLastName("")
    setPhone("")
    setLocalPhone("")
    setMail("")
    setGroup("")
    setSelectedNumbers([])
    setImageAsFile("")
    setImageAsUrl("")
    setPaymentType("")
    setPayValue("")
    setTicketNumber("")
    setUploadState(0)
    updateNumbers()
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

  const handleCheckboxes = (event) => {
    const isNumberSelected = event.target.checked
    const numberSel = event.target.value

    if(isNumberSelected){
      setSelectedNumbers(prevState => 
        [
          ...prevState,
          numberSel
        ]
      )
    } else {
      setSelectedNumbers(prevState => prevState.filter(number => number !== numberSel))
    }
  }
  
  const generateImageId = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  const updateNumbersFromDB = (selectedNumbers) => {
    const error = ""
    selectedNumbers.forEach(number => {
      const numberid = db.collection("numbers").doc(number)
      numberid.update({
        selected: true
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        error = "Hubo un error al enviar el formulario, vuelve a intentarlo"
        console.error("Error removing document: ", error);
      });
    })

   if(error !== "")
      return error
    else 
      return "OK"
  }
  
  const insertContactInDB = (newContact) => {
    db.collection('contacts').add(newContact)
    .then(() => {
      alert("Formulario enviado con éxito")
      resetForm()
    })
    .catch((error) => {
      console.log(error.message) 
      setAlertMessage("Hubo un error al enviar el formulario, vuelve a intentarlo")
    })
  }
  
  const handleSubmit = (event) => {
    event.preventDefault()
    if(firstName === '' || lastName === '' || phone === '' || localPhone === '' || mail === '' || imageAsUrl === '' || selectedNumbers.length === 0 || ticketNumber === '' || payValue === '') {
      setAlertMessage("Completa todos los campos antes de enviar")
    } else if (!isFirstNameValid || !isLastNameValid || !isLocalPhoneValid || !isMailValid || !isPayValid || !isPhoneValid || !isTicketValid ) {
      setAlertMessage("Existen algunos campos con error, corrigelos y vuelve a intentar enviar el formulario")
    } else {
      setAlertMessage("")
      const newContact = {
        firstName,
        lastName,
        phone,
        localPhone,
        mail,
        imageAsUrl,
        date: new Date().toLocaleString(),
        group,
        selectedNumbers,
        paymentType,
        ticketNumber,
        payValue
      }
      console.log(newContact)
      let error = updateNumbersFromDB(newContact.selectedNumbers)
      if(error === "OK"){
        insertContactInDB(newContact)
      } else {
        setAlertMessage(error)
      }
    }
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
  
  const updateNumbers = () => {
    db.collection('numbers').orderBy("number", "asc").get()
      .then((querySnapshot) => {
        let docs = []
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data().number, doc.data().selected);
          if(!doc.data().selected)
            docs.push({id: doc.id, number: doc.data().number})
        });
        setNumbers(docs)
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  }

  useEffect(()=> {
    updateNumbers()
  }, [])
    
  return (
    <div className="page">
      <main className="">
        <header>
          <img src={require('./assets/full-ogo.jpg')} width="100%" className="logo" alt=""/>
          <img src={require('./assets/title.jpeg')} width="100%" className="logo" alt=""/>
          {/* <h1> Rifa navideña Miles Christi </h1> */}
        </header>
        <form onSubmit={handleSubmit}>
          <section>
            <h3>Información personal</h3>
            <div className="basic-info">
              <label className="input-a">
                Nombres
                <br />
                <input
                  placeholder="Nombres"
                  value={firstName}
                  onChange={(e) => validateName(e)}
                />
                {
                    firstName === "" ? 
                    <Alert alertMessage="Campo obligatorio"/> :
                    !isFirstNameValid && <Error errorMesssage="El nombre no es correcto"/>
                }
              <br />
              </label>
              <label className="input-aa">
                Apellidos
                <br />
                <input
                  placeholder="Apellidos"
                  value={lastName}
                  onChange={(e) => validateLastName(e)}
                />
                {
                    lastName === "" ? 
                    <Alert alertMessage="Campo obligatorio"/> :
                    !isLastNameValid && <Error errorMesssage="El apellido no es correcto"/>
                }
              <br />
              </label>
              <label className="input-b">
                Celular (a 10 numeros)
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
              <label className="input-bb">
                Teléfono fijo (a 10 numeros)
                <br />
                <input
                  placeholder="3320202020"
                  value={localPhone}
                  onChange={(e) => validateLocalPhone(e)}
                />
                {
                    localPhone === "" ? 
                    <Alert alertMessage="Campo obligatorio"/> :
                    !isLocalPhoneValid && <Error errorMesssage="El número no es correcto. Solo debe contener 10 dígitos sin espacios ni caracteres especiales."/>
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
                Grupo al que perteneces
                <br />
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                    >
                  <option value="Niguno">Ninguno </option>
                  <option value="Jóvenes con Orgullo Católico ">Jóvenes con Orgullo Católico </option>
                  <option value="Tota Pulchra Guadalupe">Tota Pulchra Guadalupe</option>
                  <option value="Formación mujeres">Formación mujeres</option>
                  <option value="Formación para jóvenes">Formación para jóvenes</option>
                  <option value="Formación hombres">Formación hombres</option>
                  <option value="Grupo de acólitos San Miguel Arcángel">Grupo de acólitos San Miguel Arcángel</option>
                  <option value="Ponencias católicas">Ponencias católicas Jóvenes</option>
                  <option value="Ponencias católicas">Ponencias católicas Matrimonios</option>
                  <option value="Los Tesoros de la Fe">Los Tesoros de la Fe</option>
                  <option value="El Faro">El Faro</option>
                  <option value="Coro Benedicto XVI">Coro Benedicto XVI</option>
                  <option value="Pulchritas de María">Pulchritas de María</option>
                  <option value="Grupos de Perseverancia ">Grupos de Perseverancia </option>
                  <option value="Ejercicios Espirituales Ignacianos">Ejercicios Espirituales Ignacianos</option>
                  <option value="Café post Ejercicios">Café post Ejercicios</option>
                  <option value="Otro">Otro</option>
                </select>
                {/* <input
                  placeholder="P.e. JUCOC, Pulchritas, Formación para mujeres, etc"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                /> */}
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
                {
                  imageAsUrl ? 
                    <img src={imageAsUrl} width="100%" accept="image/jpeg, image/png" id="payImg" alt=""></img>
                  :
                    <div className="img-placeholder">
                      <i className="far fa-image"></i>
                    </div>
                }
              </div> 
              <div>
                <label>
                  Pago hecho en
                  <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                    >
                    <option value="Oxxo">Oxxo</option>
                    <option value="Transferencia bancaria">Transferencia bancaria</option>
                  </select>
                <br/>
                </label>
                <label>
                  Número de comprobante
                  <br />
                  <input
                    placeholder="101010101010"
                    value={ticketNumber}
                    onChange={(e) => validateTicketnumber(e)}
                  />
                  {
                      ticketNumber === "" ? 
                      <Alert alertMessage="Campo obligatorio"/> :
                      !isTicketValid && <Error errorMesssage="El ticket no es correcto"/>
                  }
                <br />
                </label> 
                <label>
                  Cantidad depositada (en pesos MXN)
                  <br />
                  <input
                    placeholder="2000"
                    value={payValue}
                    onChange={(e) => validatePayValue(e)}
                  />
                  {
                      payValue === "" ? 
                      <Alert alertMessage="Campo obligatorio"/> :
                      !isPayValid && <Error errorMesssage="El número no es correcto"/>
                  }
                <br />
                </label>
                <p>De los números disponibles, elige tantos como hayas pagado (Ejemplo: si pagaste 3 elige 3)</p>
                <label>Lista de números disponibles</label>
                <ul>
                  {
                      numbers.length > 0 && numbers.map((item,i) => {
                        return (
                          <li key={i}>
                            <input type="checkbox" onChange={(e) => handleCheckboxes(e)} value={item.number}/>
                            <span>{item.number}</span>
                          </li>
                        )
                      })
                  }
                </ul>
                <label>
                {
                  selectedNumbers.length === 0 &&
                  <Alert alertMessage="Campo obligatorio"/> 
                }
                </label>
                <br />
              </div> 
            </div>
          </section>
          <footer>
                <br/>
                {
                  alertMessage !== "" &&
                  <Alert alertMessage={alertMessage}/> 
                }
          
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
