import Head from "next/head";
import Navbar from "../components/Navbar";
import { useOpenAIMessages } from "../utils/openai";
import MessageHistory from "../components/MessageHistory";
import MessageInput from "../components/MessageInput";


export default function Home() {

  const {history, sending, sendMessages} = useOpenAIMessages();

  return (
    <>
      <Head>
        <title>MyJobot - A chatgpt bot cloned</title>
      </Head>
      <div className="flex flex-col h-screen">
        <Navbar/>
        <MessageHistory history={history}/>
        <MessageInput sendMessages={sendMessages} sending={sending}/>
      </div> 
    </>
  )
}