import React, { useState, useEffect} from "react";
import { Navbar ,Container,Nav,Row, Col, Image} from 'react-bootstrap'
import {gql, useQuery, useLazyQuery} from '@apollo/client'
import {useAuthDispatch, useAuthState} from '../context/auth'
import { useNavigate } from 'react-router-dom';

import Profile_Pic from './Profile.png' 

const GetUsers =gql`
query {
  getUser {
      username
      email
      createdAt
      latestMessage{
        body
      }

    }

  }
`;

const GetMessages = gql`
    query getMessage($sender: String!){
      getMessage(sender: $sender){
           _id
           body
           sender
           receiver
           createdAt
      }
    }

`;



export default function MainPage(){
    const Dispatch = useAuthDispatch()
    const navigate = useNavigate();
    const {user} = useAuthState()
    const [selectedUser, setSelectedUser] = useState()

    const logout =()=>{
        Dispatch({ type: 'LOGOUT'})
        navigate('/login');
    }
    const { loading, data,  error} = useQuery(GetUsers)  
    const [getMessage ,{loading:messagesLoading, data:messagesData}]= useLazyQuery(GetMessages)
  
   
    useEffect(()=>{
      if(selectedUser){
           getMessage({ variables:{sender: selectedUser}})
      }
   },[selectedUser])


   let Display_messages

if(!messagesData){
  Display_messages = <p>You are now Connected ..</p>
}else if (messagesData.getMessage.length === 0){
  Display_messages = <p>Start a conversations ..</p>
}else if (messagesData.getMessage.length >0){
  Display_messages = messagesData.getMessage.map((m)=>(
    <p key={m._id}>{m.body}</p>
  ))
}
// else {
//   Display_messages = <p>You are now Connected</p>
// }
 


let Display_users 
if(!data || loading){
  Display_users  = <p>loading ..</p>
}else if(data.getUser.length === 0){
  Display_users  = <p>No users other than u buddy</p>
}else if(data.getUser.length > 0){
  Display_users  = data.getUser.map((user)=>(
    <div className="d-flex p-3 " key={user.username} onClick={()=> setSelectedUser(user.username)}>
      <Image src={Profile_Pic} roundedCircle className="mr-2 " style={{width:50, height:50,objectFit:'cover'}}></Image>
      <div >
      <p className="text-success m-0">{user.username}</p>
      <p className="font-weight-light m-0">{user.latestMessage ? user.latestMessage.body : 'You are now connected'}</p>
      </div>
    </div>
  ))
 
}


    return(
 
  <React.Fragment>
  <Navbar  bg="dark" variant="dark" className="mb-2" >
    <Container>
    <Navbar.Brand href="/">Home</Navbar.Brand>
    <Nav className="me-auto">
      {!user && <Nav.Link href="/login">Login</Nav.Link>}
      {!user && <Nav.Link href="/register">Register</Nav.Link>}
     {user && <Nav.Link onClick={logout}>Logout</Nav.Link>}
    </Nav>
    </Container>
  </Navbar>

  <Row className="bg-white ">
   <Col className="p-0 bg-secondary" xs={4}>
   {Display_users}
   </Col>
   <Col xs={8}>
   {Display_messages}
   </Col>

  </Row>
  </React.Fragment>
       
       

 
    )
}