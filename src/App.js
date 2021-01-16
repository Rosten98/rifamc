import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Admin from "./components/Admin";
// import Aviso from "./components/Aviso";
import Form from "./components/Form";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/participantes">
          <Admin/>
        </Route>
        <Route path="/">
          <Form />
          {/* <Aviso/> */}
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
