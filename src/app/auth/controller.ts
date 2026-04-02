import type { Request, Response } from "express";
import { createHmac, randomBytes } from "node:crypto";
import { signupPayloadModel } from "./models";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../../db/schema";
class AuthenticationController {
  public async handleSignup(req: Request, res: Response) {
    const validationResult = await signupPayloadModel.safeParseAsync(req.body);
    if (validationResult.error)
      return res.status(400).json({
        message: "Body validation failed:",
        error: validationResult.error.issues,
      });
    const { firstName, lastName, email, password } = validationResult.data;
    const userEmailResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (userEmailResult.length > 0)
      return res.status(400).json({
        error: "duplicate entry",
        message: `user with email ${email} already exists`,
      });
    const salt = randomBytes(32).toString("hex");
    // created salt cuz it doesnt match with rainbow tables
    const hash = createHmac("sha256", salt).update(password).digest("hex");

    const result = await db
      .insert(usersTable)
      .values({
        firstName,
        lastName,
        email,
        password: hash,
        salt,
      })
      .returning({ id: usersTable.id });
    return res.status(201).json({
      message: "user has been created successfully",
      data: { id: result[0]?.id },
    });
  }
}
export default AuthenticationController;
