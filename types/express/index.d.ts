import express from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
        file?: {
            path: string
        }
        // files?: File[]
    }
  }
}
