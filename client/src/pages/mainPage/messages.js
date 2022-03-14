import React  ,{useEffect, useState} from 'react';
import {gql, useLazyQuery, useMutation} from '@apollo/client'
import { Col, Form} from 'react-bootstrap'
import { useMessageDispatch, useMessageState } from '../../context/message';
import Message from './singleMessage';


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

const SendMessage = gql`
   mutation($receiver:String!,$body:String!){
    sendMessage( receiver:$receiver,body:$body){
      body
      sender
      createdAt
    }
   }

`

export default function Messages(){
  const Dispatch = useMessageDispatch()
  const {users} = useMessageState()
  const [body, setBody] = useState()
  const selectedUser = users?.find((u)=> u.selected === true )
  const messages = selectedUser?.messages

const [getMessage ,{loading:messagesLoading, data:messagesData}]= useLazyQuery(GetMessages)
const [sendMessage, {loading:sedloading}]= useMutation(SendMessage,{
  onCompleted: (data) =>Dispatch({type:'AddMessage', payload:{
     username: selectedUser.username,
     message : data.sendMessage
  }}),
  onError: err => console.log(err)
  
})

useEffect(()=>{
  if(selectedUser && !selectedUser.messages){
       getMessage({ variables:{sender: selectedUser.username}})
  }
},[selectedUser])


useEffect(()=>{
  if(messagesData){
    Dispatch({type:'SetUserMessages', payload:{
     username: selectedUser.username,
     messages : messagesData.getMessage

    }})
  }
},[messagesData])

const addMessage = (e)=>{
    e.preventDefault()
    if(body.trim() === '' || !selectedUser){
        return
    }
    setBody('')
    
    sendMessage( {variables: {receiver: selectedUser.username, body}})







}


let Display_messages

if(!messages && !messagesLoading){
  Display_messages = <p className='msg_p'>Select a Friend</p>
}else if (messages?.length === 0){
  Display_messages = <p className='msg_p'>Start a conversations ..</p>
}else if (messages?.length >0){
  Display_messages = messages.map((m)=>(
   <Message  message = {m}/>
  ))
}else if(messagesLoading){
  Display_messages = <p className='msg_p'>Loading..</p>
}
else{
  Display_messages = <p className='msg_p'>Messages</p>
}

    return(
        <Col xs={10} md={8}>
          <div  className='msgs-Col d-flex flex-column-reverse'> {Display_messages}</div>
       <div>
       <Form onSubmit={addMessage}>
            <Form.Group className='d-flex align-items-center'>
              <Form.Control
              type='text'
              className='rounded-pill bg-white border-0 p-2'
              placeholder='Type a message ..'
              value={body}
              onChange={(e)=> setBody(e.target.value)}/>
            <i className="fa-solid fa-paper-plane fa-2x ml-2" onClick={addMessage} role='button'></i>
            </Form.Group>
        </Form>
       </div>

        </Col>
    )
}
