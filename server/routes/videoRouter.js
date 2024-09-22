import express from 'express'
import verifyJWT from '../middleware/authMiddleware.js'
import { addVideo ,updateVideo,deleteVideo,getVideo,addView,trend,
    random,getByTag,search,sub} from '../controller/videoController.js'

const router = express.Router()

router.post('/add', verifyJWT,addVideo)
router.put('/update/:id', verifyJWT, updateVideo)
router.delete('/delete/:id', verifyJWT, deleteVideo)
router.get('/find/:id', getVideo)
router.put('/view/:id', addView)
router.get('/trend', trend)
router.get('/sub', verifyJWT, sub)
router.get('/random', random)
router.get('/tags',getByTag)
router.get('/search', search)

export default router