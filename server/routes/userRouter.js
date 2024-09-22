import {Router} from 'express'
import { getChannel, changePassword, getUser, loginUser,logoutUser,signupUser, update,getUserById,
        likeVideo, unlikeVideo, dislikeVideo, undislikeVideo, subscribe, unsubscribe,deleteUser,googleAuth} from '../controller/userController.js'
import verifyJWT from '../middleware/authMiddleware.js'

const router = Router()

router.post('/signup',signupUser)
router.post('/login',loginUser)
router.post('/logout',verifyJWT, logoutUser)
router.delete('/delete/:id',verifyJWT, deleteUser)
router.get('/getUser',verifyJWT, getUser)
router.put('/changePassword',verifyJWT, changePassword)
router.put('/update',verifyJWT, update)
router.get('/getChannel/:userName',verifyJWT, getChannel)
router.get('/find/:id', getUserById)
router.put('/sub/:userId',verifyJWT, subscribe)
router.put('/unsub/:userId',verifyJWT, unsubscribe)
router.put('/likeVideo/:videoId',verifyJWT, likeVideo)
router.put('/dislikeVideo/:videoId',verifyJWT, dislikeVideo)
router.post('/unlikeVideo/:videoId',verifyJWT, unlikeVideo)
router.post('/undislikeVideo/:videoId',verifyJWT, undislikeVideo)
router.post('/google', googleAuth)

export default router