
import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({children})=>{
    const [messages,setMessages] = useState([]);
    const [users,setUsers] = useState([]);
    // jisse chahte hai hum chat karana 
    const [selectedUser,setSelectedUser] = useState(null);
    const [unseenMessages,setUnseenMessages] = useState({})
    const {socket,axios} = useContext(AuthContext)

    // function to get all users for sidebar
    const getUsers = async()=>{
        try {
           const {data} = await axios.get('/api/messages/users');
           console.log("checking",data);
           if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages)
           }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // function to get messages for selected user
    const getMessages = async (userId)=>{
        try {
           const {data} = await axios.get(`/api/messages/${userId}`)
           console.log("data",data);
           if(data.success){
            setMessages(data.messages)
           }
        } catch (error) {
            toast.error(error.message)
        }
    }
    
    // function to send message to selected user
    const sendMessage = async(messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
            console.log("checking",data.messages);
            if(data.success){
                setMessages((prev)=>[...prev,data.messages]);
            }else{
                toast.error(error.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // function to subscribe to messages for selected user
    const subscribeToMessages = async()=>{
        if(!socket) return;
        socket.on("newMessage",(newMessage)=>{
            console.log("NewMessage",newMessage)
            if(selectedUser && newMessage.senderId===selectedUser._id){
                newMessage.seen=true;
                setMessages((prev)=>[...prev,newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            // else{
            //     setUnseenMessages((prevUnseenMessages)=>({
            //         ...prevUnseenMessages,[newMessage.senderId]:prevUnseenMessages[newMessage.senderId]?prevUnseenMessages[newMessage.senderId]+1:1
            //     }))
            // }
        })
    }
    // function to unsubscribe from messages
    const unsubscribeFromMessages = ()=>{
        if(socket)socket.off("newMessage")
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=>unsubscribeFromMessages();
    },[socket,selectedUser])
    const value = {
        messages, users, selectedUser, getUsers, setMessages, getMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages
    }
    return(
    <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
    )
}