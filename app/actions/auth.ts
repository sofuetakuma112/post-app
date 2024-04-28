"use server";

import { auth } from "@clerk/nextjs/server";

export const authGuard = (): Promise<string> => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("You must be signed in to add an item to your cart");
  }

  return userId as unknown as Promise<string>;
};
