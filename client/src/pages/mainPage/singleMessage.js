import React from "react";
import classNames from "classnames";
import { useAuthState } from "../../context/auth";
import { OverlayTrigger, Tooltip} from 'react-bootstrap'
import moment from 'moment'

export default function Message({ message}){
    const {user} = useAuthState()
   
    const send = message.sender === user.username
     const to = !send
     console.log(user.username + message.sender);
    return(
     
        <OverlayTrigger
        placement={send ? 'left' :'right'}
        overlay={
          <Tooltip >
           {moment(message.createdAt).format('MMMM DD, YYYY @h:mm a')}
          </Tooltip>
        }
      >
          <div className= {classNames('d-flex my-2',{
            'ms-auto': send,
            'me-auto': to
        })}>
        <div className={classNames('py-1  px-3 rounded-pill',{
            'bg-primary': send,
            'bg-secondary': to

        })}>
            <p  className='text-white' key={message._id}> {message.body} </p>
        </div>
        
        </div>
      </OverlayTrigger>

      
    
    )
}