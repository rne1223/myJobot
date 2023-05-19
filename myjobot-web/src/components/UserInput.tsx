import React, { useState } from 'react'


export default function UserInput() {

  const [userMessage, setUserMessage] = useState("")

  return (
    <>

        <div>
          <div className="w-full flex max-w-screen-md mx-auto px-4 pb-2">
            <textarea 
            value={userMessage} 
            onChange={e => setUserMessage(e.target.value)}
            className="border text-lg rounded-md p-1 flex-1" 
            rows={1}/>

            <button 
            // onClick={sendRequest}
            className="bg-blue-500 hover:bg-blue-600 border rounded-md text-white text-lg w-20 p-1 ml-2">
              Send
            </button>
          </div>
        </div>
    </>
  )
}
