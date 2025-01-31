import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { Certificate } from "../entity/certificate.entity";
import { UserInfo } from "../entity/user.entity";

export const createCertificate = async (req: Request, res: Response) => {
    const { userId, courseName } = req.body;

    const userRepo = AppDataSource.getRepository(UserInfo);
    const certificateRepo = AppDataSource.getRepository(Certificate);

    try {
        const user = await userRepo.findOne({ where: { id: userId } });
        console.log("User found:", user);
                if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const certificate = new Certificate();
        certificate.user = user;
        certificate.courseName = courseName;
                await certificateRepo.save(certificate);
        return res.status(201).json({
            id: certificate.id,
            userId: certificate.user.id,
            courseName: certificate.courseName,
            createdAt: certificate.createdAt.toISOString(),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const getCertificates = async (req: Request, res: Response) => {
    try {
        const certificateRepo = AppDataSource.getRepository(Certificate);
        const certificates = await certificateRepo.find();
        return res.status(200).json({ message: "All certificates retrieved successfully.", data: certificates });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching data", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

export const getCertificateById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const certificateRepo = AppDataSource.getRepository(Certificate);
        const certificate = await certificateRepo.findOne({ where: { id } });

        if (!certificate) {
            return res.status(404).json({ message: "Certificate not found" });
        }
        return res.status(200).json({ message: "Certificate retrieved successfully.", data: certificate });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching data", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

export const deleteCertificate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const certificateRepo = AppDataSource.getRepository(Certificate);
        const deleteResult = await certificateRepo.delete(id);

        if (deleteResult.affected === 0) {
            return res.status(404).json({ message: "Certificate not found" });
        }
        return res.status(200).json({ message: "Certificate successfully deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting data", error: error instanceof Error ? error.message : "Unknown error" });
    }
};
