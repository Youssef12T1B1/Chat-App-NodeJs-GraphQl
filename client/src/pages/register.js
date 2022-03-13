import React,{useState}  from "react";
import {Row, Col, Form, Button } from 'react-bootstrap';
import { gql, useMutation } from '@apollo/client';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';



const ADD_User = gql`
  mutation addUser($username: String!,$email: String!,$password: String! ,$confirmPassword: String!) {
    addUser(username: $username, email:$email, password:$password, confirmPassword:$confirmPassword ) {
      username
      createdAt
    }
  }
`;




export default function Register(props){
    const [variables, setVariables] = useState({
        username :'',
        email :'',
        password :'',
        confirmPassword :''
    
      })

      const [errors, setErrors] = useState({})
      const navigate = useNavigate();


      const [AddUser, { loading}] = useMutation(ADD_User ,{
          update(_, __){
           
            navigate('/login');
          },
          onError(err){
            setErrors(err.graphQLErrors[0].extensions.errors)
             
                 
  
                
                
           
         
          }
      });

      const RegisterForm= e =>{
        e.preventDefault()
        AddUser({variables})
     } 
     const ResetFrom = e=>{
       Form.Control.value =''
     }
         
    return(
        
     <Row className='bg-white py-5 justify-content-center'>
     <Col className='col-sm-8 clo-md-6 col-lg-4'>
    
     <h1 className='text-center'>Auhtenticate</h1>
     <Form onSubmit={RegisterForm}>
  <Form.Group className="mb-3" >
  
    <Form.Control className={errors.username && 'is-invalid '} 
    type="text"
    placeholder={errors.username ? errors.username : "Enter Username" }
     value={variables.username} 
     onChange={e=>setVariables({...variables, username: e.target.value})} />
  </Form.Group>
  <Form.Group className="mb-3" >

    <Form.Control type="email"  className={errors.email && 'is-invalid '} 
    placeholder={errors.email ? errors.email : "Enter E-mail" } 
    value={variables.email} 
    onChange={e=>setVariables({...variables, email: e.target.value})}  />
  </Form.Group>
  <Form.Group className="mb-3" >

    <Form.Control type="password"  className={errors.password && 'is-invalid '} 
    placeholder={errors.password ? errors.password : "Enter Password" }
    value={variables.password} 
    onChange={e=>setVariables({...variables, password: e.target.value})} />
  </Form.Group>
  <Form.Group className="mb-3" >
    <Form.Control type='password' className={errors.confirmPassword && 'is-invalid '} 
     placeholder={errors.confirmPassword ? errors.confirmPassword : "Confirm Password" }
     value={variables.confirmPassword} 
    onChange={e=>setVariables({...variables, confirmPassword: e.target.value})} />
  </Form.Group>
  <div className='text-center '>
    <Button   className='text-white' variant="success" type="submit" onClick={ResetFrom} disabled={loading}>
     {loading ? 'Loading...': 'Register'}
    </Button>
    <br/>
    <small>Already Have an Account? <Link to='/login'>Login</Link> </small>
  </div>


</Form>

     </Col>
   </Row>
    )
}