import { connectToDB } from '@utils/database';
import Prompt from '@models/prompt';

//GET 
export const GET = async(request , {params}) => {
    try {
        await connectToDB();

        const prompt = await Prompt.findById(params.id).populate('creator');

        if(!prompt) return new Response("Prompt Not Found !" , { status : 404})
        return new Response(JSON.stringify(prompt) , {status : 200}) 

    } catch (error) {
        return new Response("Failed To Fetch All The Prompts" , {status : 500});
    }
}

//Update
export const PATCH = async (request , {params}) => {
    const { prompt , tag } = await request.json();

    try {
        await connectToDB();
        const existingPrompt = await Prompt.findById(params.id);
        if(!existingPrompt) return new Response ("Prompts Not Exists !" , {status : 404});
        
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();
        
        return new Response(JSON.stringify(existingPrompt) , {status : 200});
    } catch (error) {
        return new Response("Failed To Update Prompt", {status : 500});  
    }
}

//Delete 
export const DELETE = async (request , {params}) =>{
    try {
        await connectToDB();

        await Prompt.findByIdAndRemove(params.id);
        
        return new Response("Prompt deleted successfully" , {status : 200});
    } catch (error) {
        return new Response("Failed to delete prompt" , {status : 500});
    }
}