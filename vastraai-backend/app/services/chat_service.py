from google import genai

from app.utils.config import settings

client = genai.Client(api_key=settings.gemini_api_key)


async def generate_chat_reply(messages) -> str:

    conversation = []

    for msg in messages:
        role = msg.role if hasattr(msg, "role") else msg["role"]
        content = msg.content if hasattr(msg, "content") else msg["content"]

        conversation.append(
            f"{role.upper()}: {content}"
        )

    prompt = f"""
You are VastraAI, a professional fashion stylist.

Rules:
- Remember previous messages.
- Use conversation context.
- Answer as a fashion stylist.
- Keep answers concise and practical.

Conversation:

{chr(10).join(conversation)}

ASSISTANT:
"""

    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
    )

    return response.text