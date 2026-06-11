export async function sendChatMessage(messages: any[], profile: any) {
  const message = messages[messages.length - 1]?.content;

  const response = await fetch(
    "https://vastraai-4.onrender.com/chat",
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