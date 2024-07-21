import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcrypt";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { categories, otps, users, usersToCategories } from "~/server/db/schema";
import { redirect } from "next/navigation";
import { createSession } from "~/lib/session";
const signUpFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

const generateOtp = (limit: number) => {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < limit; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(signUpFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;
      const emailAlreadyInDb = await ctx.db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
      });
      if (emailAlreadyInDb) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "email already taken",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = (
        await ctx.db
          .insert(users)
          .values({
            name,
            email: email.toLowerCase(),
            passwordHash: hashedPassword,
          })
          .returning({ id: users.id })
      )[0];

      if (!newUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Couldn't create new User",
        });
      }

      const otp = generateOtp(8);
      const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

      const newOtp = (
        await ctx.db
          .insert(otps)
          .values({
            value: otp,
            userId: newUser.id,
            expiredAt,
          })
          .returning()
      )[0];

      if (!newOtp) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Couldn't create One time password",
        });
      }

      // Send Mail
      // Couldn't find any free smtp server

      return {
        message: "User created successfully!",
      };
    }),

  verify: publicProcedure
    .input(z.object({ otp: z.string().length(8), email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const foundUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
        with: {
          otp: true,
        },
      });

      if (!foundUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Couldn't find user associated with given email",
        });
      }

      const expectedOtp = foundUser.otp?.value;

      // OTP Validation Goes here
      // check expectedOtp === otp
      // and expectedOtp.expiredAt > date.now()

      console.log("Skipping otp check");

      await ctx.db
        .update(users)
        .set({ verified: true })
        .where(eq(users.id, foundUser.id));

      return {
        message: "User Verified successfully!",
      };
    }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(8) }))
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const foundUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
      });
      if (!foundUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email not registered",
        });
      }

      const passwordHashMatched = await bcrypt.compare(
        password,
        foundUser.passwordHash,
      );

      if (!passwordHashMatched) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Password not correct",
        });
      }
      const session = await createSession(foundUser.id.toString());

      return {
        session,
      };
    }),

  getSelectedCategories: privateProcedure.query(async ({ ctx }) => {
    const userWithCategories = await ctx.db.query.users.findFirst({
      with: {
        usersToCategories: true,
      },
    });
    if (!userWithCategories) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Couldn't find user",
      });
    }
    console.log({ userWithCategories });
    return { selectedCategories: userWithCategories.usersToCategories };
  }),

  selectCategory: privateProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input),
      });

      if (!category) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invaild category id provided",
        });
      }

      const returned = await ctx.db
        .insert(usersToCategories)
        .values({
          userId: ctx.user.id,
          categoryId: category.id,
        })
        .returning({ id: usersToCategories.categoryId });

      return { updatedId: returned[0]?.id };
    }),

  deSelectCategory: privateProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const deletedIds = await ctx.db
        .delete(usersToCategories)
        .where(
          and(
            eq(usersToCategories.categoryId, input),
            eq(usersToCategories.userId, ctx.user.id),
          ),
        )
        .returning({ id: usersToCategories.categoryId });

      return { affectedIds: deletedIds.map((e) => e.id) };
    }),
});
