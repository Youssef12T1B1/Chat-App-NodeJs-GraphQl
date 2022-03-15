import React  from 'react';
import {gql, useQuery} from '@apollo/client'
import { Col, Image} from 'react-bootstrap'
import Profile_Pic from '../Profile.png' 
import ClassNames from 'classnames'
import { useMessageDispatch, useMessageState } from '../../context/message';


const GetUsers =gql`
query {
  getUser {
      _id
      username
      email
      createdAt
      latestMessage{
        body
      }

    }

  }
`;

export default function Users({}){
  const Dispatch = useMessageDispatch()
  const {users} = useMessageState()
  const selectedUser = users?.find((u)=> u.selected === true )
    const { loading} = useQuery(GetUsers, {
        onCompleted: (data) => Dispatch({type: 'SetUSERS', payload:data.getUser}),
        onError: err => console.log(err)
    })  

    let Display_users 
if(!users || loading){
  Display_users  = <p>loading ..</p>
}else if(users.length === 0){
  Display_users  = <p>No users other than u buddy</p>
}else if(users.length > 0){
  Display_users  = users.map((user)=>{

  
   
    const selecteUser =  selectedUser?.username === user.username
  
      return(
    <div role='button' 
     className={ClassNames('dispaly_users d-flex justify-content-md-start p-3 ', {  'text-gray':selecteUser})}
      key={user.username} 
      onClick={()=> Dispatch({type:'SetSelectedUser', payload:user.username})}>

      <Image src={Profile_Pic} className="Profile_pic"></Image>
      <div className='d-none d-md-block ms-2' >
      <p className="text-success m-0">{user.username}</p>
      <p className={ClassNames('font-weight-light m-0', { 'text-white': selecteUser, 'text-black':!selecteUser})}>{user.latestMessage ? user.latestMessage.body : 'You are now connected'}</p>
      </div>
    </div>)
})}

    return(
       <Col className="p-0"  xs={2} md={4}>
   {Display_users}
   </Col>
    )
}
