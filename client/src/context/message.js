import React, {createContext,useReducer, useContext} from "react";


const MessageStateContext = createContext()
const  MessageDispatchContext = createContext()

const messageReducer = (state, action) =>{
    let Otherusers, userFound
    const {username,  messages,message } = action.payload
    switch(action.type){
        case 'SetUSERS':
            return{
                ...state,
                users: action.payload
            }
        case 'SetUserMessages':
          
             Otherusers = [...state.users]
              userFound = Otherusers.findIndex((u)=> u.username === username)
             Otherusers[userFound] = { ...Otherusers[userFound] , messages}
             return{
                 ...state,
                 users : Otherusers
             }
        case 'SetSelectedUser':
             Otherusers = state.users.map((user)=>({
                ...user,
                selected : user.username === action.payload
            }))

            return {
                ...state,
                users : Otherusers
            }
        case 'AddMessage':
            Otherusers = [...state.users]
            
             userFound = Otherusers.findIndex((u)=> u.username === username)
            message.reactions = []
             let NewUser = {
                 ...Otherusers[userFound],
                 messages: [message, ...Otherusers[userFound].messages]
             }
             Otherusers[userFound] = NewUser
             
             return {
                 ...state,
                 users : Otherusers,
             }




        default:
            throw new Error(`Unknown action type: ${action.type}`)           
    }
}

export const MessageProvider = ({ children }) =>{
    const [ state , dispatch] = useReducer(messageReducer,{users : null})
    return (
        <MessageDispatchContext.Provider value={dispatch}>
         <MessageStateContext.Provider value={state}>
             {children}
         </MessageStateContext.Provider>
        </MessageDispatchContext.Provider>
    )

}

export const useMessageState = () => useContext(MessageStateContext)
export const useMessageDispatch = () => useContext(MessageDispatchContext)