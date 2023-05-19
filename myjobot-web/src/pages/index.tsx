import React, { useState } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { useUser } from "@supabase/auth-helpers-react";
import { streamOpenAIResponse } from "@/utils/openai";
import ReactMarkdown from "react-markdown";

const API_URL = "/api/chat";
const SYSTEM_MESSAGE = "You are YourJobot, a helpful AI developed by you and powered by state-of-the-art machine learning models."

export default function Home() {

  const user = useUser();
  
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    {role: "system", content: SYSTEM_MESSAGE},
  ]);

  const sendRequest = async () => {

    if(!user) {
      console.log("User login");
      
      alert("Please log in before sending a message");
    }

    if (!userMessage) {
      console.log("User sent message");
      
      alert("Please enter a message before you hit send");
    }


    const oldUserMessage = userMessage;
    const oldMessages = messages;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    setMessages(updatedMessages);
    setUserMessage("");

    try {
      console.log("Getting into try");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          stream: true,
        }),
      });


      if (response.status !== 200) {
        throw new Error ('OpenAI API returned an error');
      }

      streamOpenAIResponse(response, ( newMessage: string ) => {
        console.log('newMessage:', newMessage);
        
        const updatedMessages2 = [...updatedMessages, { role: 'assistant',  'content': newMessage}]
        setMessages(updatedMessages2);
        
      });
    } catch(err) {
      if (err instanceof Error) {
        console.log(err);
        setUserMessage(oldUserMessage);
        setMessages(oldMessages);
        window.alert("Error:" + err.message);
      }
    }

  };

  return (
    <>
      <Head>
        <title>MyJobot - A chatgpt bot cloned</title>
      </Head>
      <div className="flex flex-col h-screen">

      <Navbar/>
      <div className="flex-1 overflow-y-scroll">
        <div className="w-full max-w-screen-md mx-auto px-4">
          {messages
            .filter((message) => message.role !== "system")
            .map((message, idx) => (
              <div key={idx} className="my-3">
                <div className="font-bold">
                  {message.role === "user" ? "You" : "Jobot"}
                </div>
                <div className="text-lg prose">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
        </div>
      </div>

        <div>
          <div className="w-full flex max-w-screen-md mx-auto px-4 pb-2">
            <textarea 
            value={userMessage} 
            onChange={e => setUserMessage(e.target.value)}
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
    </>
  )
}