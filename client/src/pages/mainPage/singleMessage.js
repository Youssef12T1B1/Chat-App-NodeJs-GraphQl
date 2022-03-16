import React, { useState } from "react";
import classNames from "classnames";
import { useAuthState } from "../../context/auth";
import { gql, useMutation } from "@apollo/client"; 
import { Button, OverlayTrigger, Popover, Tooltip} from 'react-bootstrap'
import moment from 'moment'


const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']
 
const Message_Reaction = gql`
mutation reactMsg($id:ID!, $content:String!){
  reactMsg(id:$id, content:$content){
       _id 
  }
}


`



export default function Message({ message }){

    const {user} = useAuthState()
   const [showPopover , setShowPopover] = useState(false)
    const send = message.sender === user.username
     const to = !send

     const [reactToMsg] = useMutation(Message_Reaction,{
        onCompleted: (data)=>{
          setShowPopover(false)
        },
        onError: err=> console.log(err)
     })
     const reactMsg = (reaction)=>{
        
           reactToMsg({variables:{id:message._id, content:reaction}})
     }
     const reactionBtn = 
       (
        <OverlayTrigger
        trigger='click'
        placement="top"
        show={showPopover}
        onToggle={setShowPopover}
        transition={false}
        rootClose
        overlay={
          <Popover className="rounded-pill">
            <Popover.Body className=" d-flex py-1 px-0 align-items-center react_container">
            {reactions.map((reaction)=>(
               <Button variant="link" className="react_btn" onClick={()=>reactMsg(reaction)}>
                 {reaction}     
               </Button>
            ))}
            </Popover.Body>
          </Popover>
        }
        >
      <Button variant="link" className="px-2">
          <i className="far fa-smile"></i>
      </Button>
      </OverlayTrigger>
      
       )


    return(
     
      <div className= {classNames('d-flex my-2',{
        'ms-auto': send,
        'me-auto': to
    })}>

      { send && reactionBtn}
        <OverlayTrigger
        placement={send ? 'left' :'right'}
        overlay={
          <Tooltip>
           {moment(message.createdAt).format('MMMM DD, YYYY @h:mm a')}
          </Tooltip>
        }
        
      >
    
          
        <div className={classNames('py-1  px-3 rounded-pill',{
            'bg-primary': send,
            'bg-secondary': to

        })}>
          {message.reactions.length> 0 && (
            <div className="bg-secondary p-1 rounded-pill">

                  {message.reactions.map((r)=> r.content)}

            </div>
          )}
            <p  className='text-white' key={message._id}> {message.body} </p>
        </div>
        
      
      </OverlayTrigger>
     {to && reactionBtn }
      </div>
      
   
    )
}