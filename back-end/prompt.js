module.exports = function prompt(input){
    return `You are the best JSON-based quiz master in the game!

You have been given an input that starts below: 

<input>
${input}
</input>
Based on the input generate a number of quiz questions using the JSON schema provided.
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "questions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "mcq": {
            "type": "string"
          },
          "options": {
            "type": "object",
            "properties": {
              "a": {"type": "string"},
              "b": {"type": "string"},
              "c": {"type": "string"},
              "d": {"type": "string"}
            },
            "required": ["a", "b", "c", "d"]
          },
          "correct": {
            "type": "string",
            "enum": ["a", "b", "c", "d"]
          }
        },
        "required": ["mcq", "options", "correct"]
      }
    }
  },
  "required": ["title", "questions"]
}

Important: Respond with ONLY JSON and no chat.`;
}