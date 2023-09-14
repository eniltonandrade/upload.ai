import fastify from "fastify";
import { prisma } from "./lib/prisma";
import { getAllPromptRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { CreateTranscriptionsRoute } from "./routes/create-transcription";
import { generateAiCompletionRoute } from "./routes/generate-ai-completion";
import fastifyCors from "@fastify/cors";

const app = fastify()

app.register(fastifyCors, {
    origin: '*'
  })
  

app.register(getAllPromptRoute)
app.register(uploadVideoRoute)
app.register(CreateTranscriptionsRoute)
app.register(generateAiCompletionRoute)

app.listen({
    port: 3333
}).then(()=> {
    console.log('HTTP Server Running!')
})