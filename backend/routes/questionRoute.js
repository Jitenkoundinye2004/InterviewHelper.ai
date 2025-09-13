import express from "express"

import {togglePinQuestion,updateQuestionNote,addQuestionToSesion} from '../controllers/questionController.js'

import {protect} from "../middleware/authMiddleware.js"

const router  =express.Router();

router.post('/add',protect,addQuestionToSesion)
router.post('/:id/pin',protect,togglePinQuestion)
router.post('/:id/note',protect,updateQuestionNote)

export default router;