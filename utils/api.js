export const sendChatMessage = async (message) => {
  try {
    const res = await fetch("http://172.168.17.209:8080/api/gemini/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    return data.data; // ApiResponse<String>
  } catch (err) {
    console.log("Chat API Error:", err);
    return "Server error. Try again.";
  }
};
