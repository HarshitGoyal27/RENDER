/* eslint-disable no-undef */
const Router = require('express')
// const{} = require('../middlewares/auth/auth.middleware');
const  SAPController = require('../controller/sapController');
const router = Router();
router.use(Router.json());
router.post('/sap/candidates',SAPController.getSAPCandidates);
module.exports=router;
