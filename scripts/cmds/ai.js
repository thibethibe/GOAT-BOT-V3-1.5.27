const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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", //add your key here
});
const openai = new OpenAIApi(configuration);

module.exports = {
  config: {
    name: "ai",
    version: "1.1",
    author: "kivv",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: ""
    },
    longDescription: {
      vi: "",
      en: "AI powered by OpenAI"
    },
    category: "ai",
    guide: {
      en: "{p}{n} <<question>>",
    }
  },

  onStart: async function ({ event, message, getLang, usersData, api, args}) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const userMoney = await usersData.get(event.senderID, "money");
    if (userMoney < 50) return api.sendMessage("You don't have enough balance to use this command. This command costs $50.\n Check your bot balance by typing *bal.\n To earn balance, you can play games or claim daily rewards by typing *daily.\n Available games to play are *quiz and *play. ", event.threadID, event.messageID);
    else {
      usersData.set(event.senderID, {
        money: userData.money - 50,
        data: userData.data
      }); 
      if (args.length === 0) {
        message.reply(`Please ask a question or add some text.`);
        return;
      }
      if (args.length === 1) {
        message.reply(`Hi there! How can I help you?`);
        return;
      }

      try {
        let completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: args.join(" "),
          temperature: 0.7,
          max_tokens: 974,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        message.reply(completion.data.choices[0].text);
      } catch (error) {
        console.log(error);
        message.reply(`Something went wrong.`);
      }
    }
  }
};