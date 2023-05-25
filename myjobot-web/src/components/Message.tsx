import ReactMarkdown from "react-markdown";
import Image from "next/image";

const Message = ({ role , content }: {role:string, content:string} ) => {
  return (
    <div className="my-4 mx-auto flex w-full max-w-4xl ">
      <Image
        src={role === "user" ? "/profile_placeholder.png" : "/jobot.jpg"}
        height={40}
        width={40}
        alt="Avatar"
        className="self-start rounded-full"
        unoptimized
      />
      <div className="flex-1 overflow-x-hidden pl-2">
        <div>
          <span className="text-base font-medium">
            {role === "user" ? "You " : "Jobot "}
          </span>
        </div>

        <div className="text-lg prose">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Message;