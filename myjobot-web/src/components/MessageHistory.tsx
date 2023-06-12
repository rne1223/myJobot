import React, { useEffect, useRef } from 'react'
import MessageEl from './Message';

type Message = {
    role: string,
    content: string,
};

type MessageHistoryProps = {
  history: Array<Message>;
}; 

const MessageHistory = ({history: messages}: MessageHistoryProps) => {


    let messagesWindow = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if(messagesWindow?.current) {
            messagesWindow.current.scrollTop = messagesWindow.current.scrollHeight;
        }
    }, [messages]);

  return (
    <div
      className='flex-1 overflow-y-auto py-2 px-2'
     ref={el => messagesWindow.current = el}
     >
      { messages
        .filter(message => message.role !== "system")
        .map((message, idx) => <MessageEl key={idx} {...message} /> )}

    </div>
  )
}

export default MessageHistory;