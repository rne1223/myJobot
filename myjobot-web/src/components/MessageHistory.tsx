import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown';


export const MessageHistory = () => {

  return (
    <>
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
    </>
  );
}
