import express from 'express'
import verifyJWT from '../middleware/authMiddleware.js'
import { addComment,deleteComment ,editComment, getComments} from '../controller/commentController.js'

const router = express.Router()

router.post('/add/:videoId', verifyJWT, addComment)
router.put('/edit/:id', verifyJWT, editComment)
router.delete('/delete/:id', verifyJWT, deleteComment)
router.get('/getComments/:videoId',  getComments)

export default router