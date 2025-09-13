import Question from "../models/Question.js";
import Session from "../models/Session.js";


//@desc Add additional Questions to an Existing session
//@routes POST /api/questions/add
//@access Private

export const addQuestionToSesion=async(req,res)=>{
    try{
        const {sessionId,questions}=req.body;
        if (!sessionId || !questions || !Array.isArray(questions)){
            return res.status(400).json({message:"Invalid input data"});
        }

        const session = await Session.findById(sessionId);

        if(!session){
            return res.status(404).json({message:"Session not found"});
        }

        //Create new  questions
        const createdQuestions = await Question.insertMany(
            questions.map((q)=>({
            session:sessionId,
            question:q.question,
            answer:q.answer,
        }))
        );

        //Update session to include new QuestionIDs

        session.questions.push(...createdQuestions.map((q)=>q._id))
        await session.save();
        res.status(201).json(createdQuestions);
    }catch(err){
        res.status(500).json({message:"Server Error"});
    }
}



//@desc Pin or unpin a question
//@routes POST /api/questions/:id/pin
//@access Private

export const togglePinQuestion =async(req,res)=>{
    try{
        const question = await Question.findById(req.params.id);
        if(!question){
            return res
            .status(404)
            .json({success:false,message:"Question not found"});
        }

        question.isPinned = !question.isPinned;
        await question.save();

        res.status(200).json({success:true,question});
    }catch(err){
        res.status(500).json({message:"Server Error"});
    }
}

//@desc Update a note for a question
//@routes POST /api/questions/:id/note
//@access Private

export const updateQuestionNote = async (req,res)=>{
      try{
        const {note}=req.body;
        const question = await Question.findById(req.params.id);

        if(!question){
            return res
            .status(404)
            .json({success:false,message:"Question not found"});
        }

        question.note = note || "";
        await question.save();
        res.status(200).json({success:true,question});
    }catch(err){
        res.status(500).json({message:"Server Error"});
    }
}

