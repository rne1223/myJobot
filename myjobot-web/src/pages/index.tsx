import React, { useState } from "react";

const API_URL = "https://api.openai.com/v1/chat/completions";
const SYSTEM_MESSAGE = "You are YourJobot, a helpful AI developed by you and powered by state-of-the-art machine learning models."

export default function Home() {
  
  const [apiKey, setApiKey] = useState("");
  // const [botMessage, setBotMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    {role: "system", content: SYSTEM_MESSAGE},
  ]);
   
  const sendRequest = async () => {

    // Getting user message from textarea input
    const newMessage = {role: "user", content: userMessage};
    const newMessageHistory = [ ...messages, newMessage ];

    // Update Message History
    setMessages(newMessageHistory); 
    // Clear TextArea input
    setUserMessage(""); 

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: newMessageHistory 
      }),
    });

    const resJson = await response.json();
    console.log("responseJson", resJson);

    const newBotMessage = resJson.choices[0].message;
    const newMessages2 = [...newMessageHistory, newBotMessage];

    setMessages(newMessages2)
  };

  return (
  <div className="flex flex-col h-screen">
    {/* Navigation */}
    <nav className="shadow px-4 py-2 flex flex-row justify-between items-center"> 
      <div className="text-xl font-bold"> Jobot </div>

      {/* Api input */}
      <div>
        <input 
        type="password" 
        className="border p-1 rounded" 
        onChange={(e) => {setApiKey(e.currentTarget.value)}}
        value={apiKey}
        placeholder="Paste Api key here"/>
      </div>
    </nav>

    {/* Message History */}
    <div className="flex-1">
      <div className="w-full max-w-screen-md mx-auto px-4">
        {messages.map((message, idx) => (
          <div key={idx} className="mt-3">
            <div className="font-bold"> {message.role} </div>
            <div className="text-lg"> {message.content} </div>
          </div>
        ))}
      </div>
    </div>

    {/* Message Input */}
    <div>
      <div className="w-full flex max-w-screen-md mx-auto px-4 pb-2">
        <textarea value={userMessage} 
        onChange={e => {setUserMessage(e.target.value); } }
        className="border text-lg rounded-md p-1 flex-1" 
        rows={1}/>

        <button 
        onClick={sendRequest}
        className="bg-blue-500 hover:bg-blue-600 border rounded-md text-white text-lg w-20 p-1 ml-2">
          Send
        </button>
      </div>
    </div>

  </div>
  )
}