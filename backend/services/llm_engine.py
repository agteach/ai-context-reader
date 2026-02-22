import os
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()

class LLMEngine:
    def __init__(self):
        # Default to Groq for speed/cost, fallback to OpenAI
        if os.getenv("GROQ_API_KEY"):
            self.llm = ChatGroq(
                temperature=0, 
                model_name="mixtral-8x7b-32768",
                groq_api_key=os.getenv("GROQ_API_KEY")
            )
        else:
            self.llm = ChatOpenAI(
                model_name="gpt-3.5-turbo",
                temperature=0,
                openai_api_key=os.getenv("OPENAI_API_KEY")
            )

    def generate_response(self, prompt, context):
        system_prompt = (
            "You are a helpful AI document assistant. "
            "Use the provided context to answer questions accurately. "
            "If the answer isn't in the context, use your general knowledge but mention it's not in the document."
        )
        
        full_query = f"Context: {context}

Question: {prompt}"
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=full_query)
        ]
        
        response = self.llm.invoke(messages)
        return response.content