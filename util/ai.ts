import { OpenAI } from 'langchain/llms/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { PromptTemplate } from 'langchain/prompts'
import { Document } from 'langchain/document'
import { loadQARefineChain } from 'langchain/chains'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import z from 'zod'

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z.string().describe('The mood of the person who wrote the journal entry.'),
    subject: z.string().describe('The subject of the journal entry.'),
    negative: z.boolean().describe('Is the journal entry negative? (i.e does it contain negative emotions?'),
    summary: z.string().describe('Quick summary of the entire entry.'),
    color: z.string().describe('a hexadecimal color code that represents the mood of the entry. Example #0101fe for blue'),
    sentimentScore: z.number().describe('sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative')
  })
)

const getPrompt = async (content: string) => {
  const format_instructions = parser.getFormatInstructions()

  const prompt = new PromptTemplate({
    template: `Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n {format_instructions}\n{entry}`,
    inputVariables: ['entry'],
    partialVariables: { format_instructions }
  })

  const input = await prompt.format({
    entry: content
  })


  return input
}

export const analyse = async (content: string) => {
  const input = await getPrompt(content)
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' }) // temperature 0 means more factual and less creative
  const result = await model.call(input)


  try {
    return parser.parse(result)
  } catch (e) {
    console.log(e)
  }
}

/**
* this is a function
* @param {string} question - the question to ask
* @param {string} entries - the entries to ask the question to, entries indexed in memory db
* @returns {langchangedoc} - returns a langchain doc
*/

// index  entries everytime we save in planetscale db, save them in memory db
export const qa = async (question, entries) => {
  const docs = entries.map(entry => {
    return new Document({
      pageContent: entry.content,
      metadata: { id: entry.id, createdAt: entry.createdAt, }
    })
  })

  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
  const chain = loadQARefineChain(model, docs)
  const embeddings = new OpenAIEmbeddings()
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings)
  const relevantDocs = await store.similaritySearch(question)

  console.log(relevantDocs)
  const res = await chain.call({
    input_documents: relevantDocs,
    question,
  })

  return res.output_text
}
