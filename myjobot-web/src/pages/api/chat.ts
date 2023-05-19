import { OpenAIStream } from "@/utils/openai";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

async function handler(req: NextRequest, res: NextResponse) {
  
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const body = await req.json();

  body.model = "gpt-3.5-turbo";
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log(user, error);
  

  if (!user || error) {
    return new Response("Unauthorized", { status: 401 });
  }

  const stream = await OpenAIStream(body);

  return new Response(stream, { status: 200 });
}

export default handler;
