import { roomSchema } from "@/server/schema";
import * as z from "zod";

export type Room = z.output<typeof roomSchema>;
