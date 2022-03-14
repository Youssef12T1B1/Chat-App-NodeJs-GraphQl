import React from "react";
import { Navbar ,Container,Nav,Row, Col} from 'react-bootstrap'
import {useAuthDispatch, useAuthState} from '../../context/auth'
import { useNavigate } from 'react-router-dom';
import Users from "./users"
import Messages from "./messages";





export default function MainPage(){
    const Dispatch = useAuthDispatch()
    const navigate = useNavigate();
    const {user} = useAuthState()
 

    const logout =()=>{
        Dispatch({ type: 'LOGOUT'})
        window.location.href = '/login'
    }
    //const [selectedUser, setSelectedUser] = useState()

    return(
 
  <React.Fragment>
    <Row>
  <Navbar  bg="dark" variant="dark" className="mb-2 " >
    <Container>
    <Navbar.Brand href="/">Home</Navbar.Brand>
    <Nav >
      {!user && <Nav.Link href="/login">Login</Nav.Link>}
      {!user && <Nav.Link href="/register">Register</Nav.Link>}
     {user && <Nav.Link onClick={logout}>Logout</Nav.Link>}
    </Nav>
    </Container>
  </Navbar>
  </Row>
  <Row >
  <Users />
  <Messages/>

  </Row>
  </React.Fragment>
       
       

 
    )
}