const OpenAIObject = require("openai");
const prompt = require("./prompt");
const openai = new OpenAIObject();
module.exports = async function openAiRequest(input){
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt(input) }],
        model: "gpt-3.5-turbo",
    });
    return completion;   
}