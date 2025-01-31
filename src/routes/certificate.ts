import { Router } from "express";
import protectRoute from "../middleware/auth";
import { createCertificate,getCertificates,getCertificateById,deleteCertificate } from "../controllers/certificate.controller";

const router = Router();
router.post('/create',protectRoute(),createCertificate);
router.get('/:userId',protectRoute(),getCertificates);

router.get('/:id',protectRoute(),getCertificateById);

router.delete('/:id)',protectRoute(),deleteCertificate);

export default router
