
const { keith } = require("../keizzah/keith");
const ai = require('unlimited-ai');
const fs = require('fs');

// Function to write conversation history to the store.json file
const writeConversationToFile = (conversation) => {
  // Read the existing conversation history from 'store.json'
  fs.readFile('store.json', 'utf8', (err, data) => {
    let conversationHistory = [];

    // If there's no error and data exists, parse it as JSON
    if (!err && data) {
      try {
        conversationHistory = JSON.parse(data);
      } catch (e) {
        console.error("Error parsing conversation history:", e);
      }
    }

    // Add the new conversation to the history
    conversationHistory.push(conversation);

    // Write the updated conversation history back to 'store.json'
    fs.writeFile('store.json', JSON.stringify(conversationHistory, null, 2), (err) => {
      if (err) {
        console.error("Error writing to store.json:", err);
      }
    });
  });
};

keith({
  nomCom: "gp",
  aliases: ["gpt4", "ai"],
  reaction: '⚔️',
  categorie: "search"
}, async (context, message, params) => {
  const { repondre, arg } = params;
  const alpha = arg.join(" ").trim();

  // If no song name or text is provided, return an error
  if (!alpha) {
    return repondre("Please provide a song name.");
  }

  const text = alpha; // The text to be sent for processing by AI

  try {
    const model = 'gpt-4-turbo-2024-04-09'; // Specify the model to use for AI

    const messages = [
      { role: 'user', content: text },
      { role: 'system', content: 'You are an assistant in WhatsApp. You are called Keith. You respond to user commands.' }
    ];

    // Generate AI response
    const response = await ai.generate(model, messages);

    // Send the AI response back to the user
    await repondre(response);

    // Prepare the conversation object to store
    const conversation = {
      user: text,
      ai: response
    };

    // Write the conversation to the file
    writeConversationToFile(conversation);

  } catch (error) {
    console.error("Error generating AI response:", error);
    await repondre("Sorry, I couldn't process your request.");
  }
});
