import { Router } from 'express';
import { getAllQuests, createQuest, getQuestById, updateQuest, deleteQuest } from '../controllers/questController.js';
import {getUserProgress,createOrUpdateProgress,getUserProgressPercentage} from '../controllers/progressController.js';

const router = Router();

router.get('/getQuest', getAllQuests);
router.post('/createQuest', createQuest);

router.get('/getUserProgress', getUserProgress);
router.post('/createOrUpdateProgress', createOrUpdateProgress);
router.get('/getUserProgressPercentage', getUserProgressPercentage);

router.get('/:id', getQuestById);
router.put('/:id', updateQuest);
router.delete('/:id', deleteQuest);


export default router;
