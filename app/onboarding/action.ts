"use server";

import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { authGuard } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";

const UserSchema = z.object({
  name: z.string().max(240),
});

export const createUser = async (formData: FormData) => {
  "use server";

  const id = await authGuard();
  const validatedData = UserSchema.parse({
    name: formData.get("name"),
  });

  const data: Prisma.UserUncheckedCreateInput = {
    name: validatedData.name,
    id,
  };

  // DBにユーザーを作成
  await db.user.create({
    data,
  });

  // Clerkのユーザーメタデータにオンボーディング完了ステータスをセット
  await clerkClient.users.updateUserMetadata(id, {
    publicMetadata: {
      onboarded: true,
    },
  });

  // キャッシュをクリア
  revalidatePath("/");

  // トップページへリダイレクト
  redirect("/");
};
