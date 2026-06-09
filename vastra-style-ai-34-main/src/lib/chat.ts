export async function sendChatMessage(messages: any[], profile: any) {
  const message = messages[messages.length - 1]?.content;

  const response = await fetch(
    "http://127.0.0.1:8000/chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Chat request failed");
  }

  return await response.json();
}