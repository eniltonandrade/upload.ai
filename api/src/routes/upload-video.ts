import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { fastifyMultipart } from '@fastify/multipart'
import { prisma } from "../lib/prisma";
import path from "node:path";
import fs from "node:fs";
import { pipeline } from "node:stream";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";

const pump = promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance) {
    app.register(fastifyMultipart, {
        limits: {
            fieldSize: 1048576 * 25, // 25mb
        }
    })
    app.post('/videos', async (req: FastifyRequest, reply: FastifyReply) => {
       const data = await req.file()

       if(!data){
        return reply.status(400).send({
            error: 'Missing File Input'
        })
       }

       const extension = path.extname(data?.filename)

       if(extension !== '.mp3'){
        return reply.status(400).send({
            error: 'File format not supported'
        })
       }

       const fileBaseName = path.basename(data.filename, extension);

       const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;

       const uploadDestination = path.resolve(__dirname, '../../temp', fileUploadName)

       await pump(data.file, fs.createWriteStream(uploadDestination))

       const video = await prisma.video.create({
        data: {
            name: data.filename,
            path: uploadDestination
        }
       })

       return {
        video
       }

    })
    
}