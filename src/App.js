import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Admin from "./components/Admin";
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
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
