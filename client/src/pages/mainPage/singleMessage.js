import React, { useState } from "react";
import classNames from "classnames";
import { useAuthState } from "../../context/auth";
import { Button, OverlayTrigger, Popover, Tooltip} from 'react-bootstrap'
import moment from 'moment'

const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']

export default function Message({ message }){

    const {user} = useAuthState()
   const [showPopover , setShowPopover] = useState(false)
    const send = message.sender === user.username
     const to = !send

     const reactMsg = (reaction)=>{
           console.log(`reaction ${reaction} to message:`);
     }
     const reactionBtn = 
       (
        <OverlayTrigger
        trigger='click'
        placement="top"
        show={showPopover}
        onToggle={setShowPopover}
        transition={false}
        overlay={
          <Popover className="rounded-pill">
            <Popover.Body>
            {reactions.map((reaction)=>(
               <Button variant="link" className="react_btn" key={message._id} onClick={reactMsg(reaction)}>
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
            <p  className='text-white' key={message._id}> {message.body} </p>
        </div>
        
      
      </OverlayTrigger>
     {to && reactionBtn }
      </div>
      
   
    )
}