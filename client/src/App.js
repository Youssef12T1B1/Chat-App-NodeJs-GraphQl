import React from 'react';
import './App.scss';
import { Container} from 'react-bootstrap';
import ApolloProvider from './apollo';

import { BrowserRouter,Routes , Route} from 'react-router-dom';
import Register from './pages/register';
import MainPage from './pages/mainPage/main';
import Login from './pages/login';

import {AuthProvider} from './context/auth'
import {MessageProvider} from './context/message'
import DynamicRoute from './DynamicRoute'

function App() {




  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
        <BrowserRouter>
        <Container className='pt-5 '>
           <Routes>

           <Route exact path='/' element={<DynamicRoute authenticated/>} >
            <Route exact path='/' element={<MainPage/>}/>
           </Route>

          <Route exact path='/register' element={<DynamicRoute guest/>} >
            <Route exact path='/register' element={<Register/>}/>
          </Route>
         
          <Route exact path='/login' element={<DynamicRoute guest/>} >
              <Route exact path='/login' element={<Login/>} />
          </Route>
         
           </Routes>
        </Container>
      </BrowserRouter>
      </MessageProvider>
    </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
