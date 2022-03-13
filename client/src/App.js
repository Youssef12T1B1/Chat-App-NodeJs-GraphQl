import React from 'react';
import './App.scss';
import { Container} from 'react-bootstrap';
import ApolloProvider from './apollo';
import Register from './pages/register';
import { BrowserRouter,Routes ,Route } from 'react-router-dom';

import MainPage from './pages/main';
import Login from './pages/login';

function App() {



  return (
    <ApolloProvider>
      <BrowserRouter>
    <Container className='pt-5 '>
      <Routes>
  <Route path='/register' element={<Register/>}/>
  <Route exact path='/' element={<MainPage/>}/>
  <Route path='/login' element={<Login/>}/>
  </Routes>
    </Container>
    </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
