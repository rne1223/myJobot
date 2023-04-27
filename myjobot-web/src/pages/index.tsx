import React, { useState } from "react";

const API_URL = "https://api.openai.com/v1/chat/completions";
const SYSTEM_MESSAGE = "You are YourJobot, a helpful AI developed by you and powered by state-of-the-art machine learning models."

export default function Home() {
  
  const [apiKey, setApiKey] = useState("");
  const [botMessage, setBotMessage] = useState("");

  const sendRequest = async () => {

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: SYSTEM_MESSAGE},
                   { role: "user", content: "Hello! Please introduce yourself" }
                  ],
      }),
    });

    const resJson = await response.json();
    console.log(resJson);

    setBotMessage(resJson.choices[0].message.content);
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

    {/* Button "Send Request"*/}
    <div className="p-4">
      <button 
      onClick={sendRequest}
      className="border rounded-md p-2 bg-blue-500 hover:bg-blue-600 text-white">
        Send Request 
      </button>
    </div>

    {/* Display Message */}
    <div className="text-lg mt-4">{botMessage}</div>

  </div>
  )
}