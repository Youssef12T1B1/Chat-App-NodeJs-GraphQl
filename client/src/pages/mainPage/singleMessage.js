import React from "react";
import classNames from "classnames";
import { useAuthState } from "../../context/auth";

export default function Message({key, message}){
    const {user} = useAuthState()
    const send = message.sender === user.username
     const to = !send

    return(
        <div className= {classNames('d-flex my-2',{
            'ms-auto': send,
            'me-auto': to
        })}>
        <div className={classNames('py-2 px-3 ml-right rounded-pill',{
            'bg-primary': send,
            'bg-secondary': to

        })}>
            <p  className='text-white' key={key}>{message.body} </p>
        </div>
        
        </div>
    )
}