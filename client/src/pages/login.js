import React,{useState}  from "react";
import {Row, Col, Form, Button } from 'react-bootstrap';
import { gql, useLazyQuery } from '@apollo/client';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const LoginUser = gql`
query login($username: String!,$password: String!) {
    login(username: $username, password:$password) {
      username
      token

    }
  }
`;




export default function Login(props){
    const [variables, setVariables] = useState({
        username :'',
        password :''
    
      })

      const [errors, setErrors] = useState({})
      const navigate = useNavigate();

      const [Login, { loading}] = useLazyQuery(LoginUser ,{
     
          onError(err){
            setErrors(err.graphQLErrors[0].extensions.errors)             
          },
          onCompleted(data){ 
              localStorage.setItem('token', data.login.token)
              navigate('/');

          }
          

      });

      const LoginForm= e =>{
        e.preventDefault()
        Login({variables});
     } 
         
    return(
        
     <Row className='bg-white py-5 justify-content-center'>
     <Col className='col-sm-8 clo-md-6 col-lg-4'>
    
     <h1 className='text-center'>Auhtenticate</h1>
     <Form onSubmit={LoginForm}>
  <Form.Group className="mb-3" >
  
    <Form.Control className={errors.username && 'is-invalid '} 
    type="text"
    placeholder={errors.username ? errors.username : "Enter Username" }
     value={variables.username} 
     onChange={e=>setVariables({...variables, username: e.target.value})} />
  </Form.Group>



  <Form.Group className="mb-3" >

    <Form.Control type="password"  className={errors.password && 'is-invalid '} 
    placeholder={errors.password ? errors.password : "Enter Password" }
    value={variables.password}
    onChange={e=>setVariables({...variables, password: e.target.value})} />
  </Form.Group>

  <div className='text-center '>
    <Button   className='text-white' variant="success" type="submit" disabled={loading}>
     {loading ? 'Loading...': 'Login'}
    </Button>
    <br/>
    <small>New To The Chat App ? <Link to='/register'>Register</Link> </small>
  </div>


</Form>

     </Col>
   </Row>
    )
}