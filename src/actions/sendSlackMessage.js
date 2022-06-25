async function sendSlackMessage(message) {

  const { WebClient } = require('@slack/web-api');
  const web = new WebClient(global.SLACK_TOKEN);
  const conversationId = global.SLACK_CHANNEL_ID;


  // Post a message to the channel, and await the result.
  // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
  const result = await web.chat.postMessage({
    text: message,
    channel: conversationId,
  });

  // The result contains an identifier for the message, `ts`.
  console.log(`Successfully send message ${result.ts} in conversation ${conversationId}`);

};

module.exports = {
  sendSlackMessage
}
