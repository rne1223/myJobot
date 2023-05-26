import React, { useEffect, useRef } from 'react'
import Message from './Message';

type message = {
    role: string,
    content: string,
};

type AppProps = {
  history: Array<message>;
}; 

const MessageHistory = ({history}: AppProps) => {

    let messagesWindow = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if(messagesWindow?.current) {
            messagesWindow.current.scrollTop = messagesWindow.current.scrollHeight;
        }
    }, [history]);

  return (
    <div
    className='flex-1 overflow-y-auto py-2 px-2'
    ref={el => messagesWindow.current = el}
    >
        {history
        .filter(message => message.role !== "system")
        .map((message, idx) => (
            <Message key={idx} {...message} />
        ))}

    </div>
  )
}

export default MessageHistory;