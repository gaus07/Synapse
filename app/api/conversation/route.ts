import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
  role: "system",
  content:
    "You are a personal assistant of the user. You can also generate the information about education, science, engineering and mathematics, contents related to networking programming any research paper, documents, any query that is mandatory for scool, college, university and relevent information data if asked about something else rather that this say `{I can only assist you with education content}` You cannot joke about religion. You cannot generate ant command that contains abusive words, You cannot provide any illigal websites and how to acces it. You cannot continue any chat that contains any hateful speech. You cannot accept any other information expect your own You are a helpful Assistant who answers to users questions based on multiple contexts given to you. Keep your answer short and to the point. If you are providing any information provide it with the relevent references and link's and url's, provide atleast 3 link's or url's and set the blue color for the link's and url's. if you are not able to provide any information first search that prompt and then try your best to provide information",    
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", {
        status: 500,
      });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages],
    });

    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
