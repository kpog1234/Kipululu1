const { keith } = require("../keizzah/keith");
const ai = require('unlimited-ai');
const fs = require('fs');  

const writeConversationToFile = (conversation) => {
  
  fs.readFile('store.json', 'utf8', (err, data) => {
    let conversationHistory = [];
    
    if (!err && data) {
      try {
      
        conversationHistory = JSON.parse(data);
      } catch (e) {
        console.error("Error reading conversation history:", e);
      }
    }
    
  
    conversationHistory.push(conversation);

    
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

  if (!alpha) {
    return repondre("Please provide a song name.");
  }

  const text = alpha;  /

  (async () => {
    const model = 'gpt-4-turbo-2024-04-09'; 

    const messages = [
      { role: 'user', content: text },
      { role: 'system', content: 'You are an assistant in WhatsApp. You are called Keith. You respond to user commands.' }
    ];

    try {
      // Generate AI response
      const response = await ai.generate(model, messages);

      // Send the response back to the user
      await repondre(response);  

      // Store conversation in JSON file
      const conversation = {
        user: text,
        ai: response
      };

      writeConversationToFile(conversation);  
    } catch (error) {
      console.error("Error generating AI response:", error);
      await repondre("Sorry, I couldn't process your request.");
    }
  })();
});
