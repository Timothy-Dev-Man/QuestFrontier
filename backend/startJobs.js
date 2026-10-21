import { startCronJob } from "./src/jobs/deadline.job";
import express from 'express';


export function startJob() {
    console.info("Background job startup requested")
    startCronJob()
}