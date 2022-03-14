import React  ,{useEffect} from 'react';
import {gql, useLazyQuery} from '@apollo/client'
import { Col} from 'react-bootstrap'
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

export default function Messages({}){
  const Dispatch = useMessageDispatch()
  const {users} = useMessageState()
  const selectedUser = users?.find((u)=> u.selected === true )
  const messages = selectedUser?.messages

const [getMessage ,{loading:messagesLoading, data:messagesData}]= useLazyQuery(GetMessages)

useEffect(()=>{
  if(selectedUser && !selectedUser.messages){
       getMessage({ variables:{sender: selectedUser.username}})
  }
},[selectedUser])


useEffect(()=>{
  if(messagesData){
    Dispatch({type:'SeUserMessages', payload:{
     username: selectedUser.username ,
     messages : messagesData.getMessage

    }})
  }
},[messagesData])

let Display_messages

if(!messages && !messagesLoading){
  Display_messages = <p>Select a Friend</p>
}else if (messages?.length === 0){
  Display_messages = <p>Start a conversations ..</p>
}else if (messages?.length >0){
  Display_messages = messages.map((m)=>(
   <Message key={m._id} message = {m}/>
  ))
}else if(messagesLoading){
  Display_messages = <p>Loading..</p>
}
else{
  Display_messages = <p>Messages</p>
}

    return(
        <Col xs={8} className='msgs-Col d-flex flex-column'>
        {Display_messages}
        </Col>
    )
}
