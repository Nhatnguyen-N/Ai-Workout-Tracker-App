import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

// const response = openai.responses.create({
//   model: "gpt-4o-mini",
//   input: "write a haiku about ai",
//   store: true,
// });

// response.then((result) => console.log(result.output_text));

export async function POST(request: Request) {
  const { exerciseName } = await request.json();
  if (!exerciseName) {
    return Response.json(
      { error: "Exercise name is required" },
      { status: 404 }
    );
  }
  const prompt = `
  You are fitness coach.
  you are given an exercise, provide clear instructions on how to perform the execise. Include if any equipment is required.
  Explain the exercise in detail and for a beginner.

  The exercise name is: ${exerciseName}

  Keep it short and concise. Use markdown formatting.

  Use the following format:

  ## Equipment Required

  ## Instructions

  ### Tips

  ### Variations

  ### Safety

  keep spacing between the headings and the content.

  Always use headings and subheadings.
  `;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    console.log(response);

    return Response.json({ message: response.choices[0].message.content });
  } catch (error) {
    console.error("Error fetching AI guidance:", error);
    return Response.json(
      { error: "Error fetching AI guidance" },
      { status: 500 }
    )
  }
};