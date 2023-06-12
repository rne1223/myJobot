import { createParser } from "eventsource-parser";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@supabase/auth-helpers-react";


type Message = {
    role: string,
    content: string,
};

async function* streamAsyncIterable(stream:ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

/* Sends a request to the OpenAI API to generate a text completion for 
the given body and returns a readable stream of encoded text data */
export const OpenAIStream = async (body:String) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify(body),
  });


  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event:any) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      if (res.body) {
        for await (const chunk of streamAsyncIterable(res.body)) {
          parser.feed(decoder.decode(chunk));
        }
      } else {
        console.log("res.body is null");
      }
    },
  });

  return stream;
};

export async function streamOpenAIResponse(response: Response, callback: Function ) {

  const reader = response?.body?.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let text = "";
  let isFirst = true;

  while (!done) {
    if(reader) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      text += chunkValue;
      callback(text, isFirst);
      isFirst = false;
    }
  }
}

export async function postOpenAIMessages(messages:Array<Message>) {

      return await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages,
          stream: true,
        }),
      });
}

const SYSTEM_MESSAGE = "You are YourJobot, a helpful AI developed by you and powered by state-of-the-art machine learning models."

export function useOpenAIMessages() {
  const [history, setHistory] = useState<Message[]>([
    { role: "system", content:SYSTEM_MESSAGE },
  ]);

  const [sending, setSending] = useState(false);
  const user = useUser();

  const sendMessages = async (newMessages: Message[]) => {
    if (!user) {
      toast.error("You must be logged in to send a message");
    }

    const oldHistory = history;
    const newHistory = [...history, ...newMessages];
    setSending(true);
    setHistory(newHistory);

    const response = await postOpenAIMessages(newHistory);

    if(!response.ok || !response.body){
      setSending(false);
      setHistory(oldHistory);
      toast.error("Failed to send:" + response.statusText);
    }

    await streamOpenAIResponse(response, (content:string) => {
      setHistory([...newHistory, {role: "assistant", content}]);
    });

    setSending(false);
    return true;
  };

  return {history, setHistory, sending, sendMessages};
}