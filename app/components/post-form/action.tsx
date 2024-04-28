"use server";

import { authGuard } from "@/app/actions/auth";
import { db } from "@/lib/prisma";
import { putImage, deleteImage } from "@/lib/storage";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const PostSchema = z.object({
  title: z.string().max(30),
  body: z.string().max(140),
});

export const createPost = async (formData: FormData) => {
  const authorId = await authGuard();
  const id = randomUUID();
  const validatedData = PostSchema.parse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  const newData: Prisma.PostUncheckedCreateInput = {
    ...validatedData,
    id,
    authorId,
  };

  const thumbnailFile = formData.get("thumbnail") as File;

  if (thumbnailFile) {
    newData.thumbnailURL = await putImage(
      formData,
      `posts/${id}/thumbnail.png`
    );
  }

  await db.post.create({
    data: newData,
  });

  revalidatePath("/");
  redirect("/");
};

export const updatePost = async (id: string, formData: FormData) => {
  const authorId = await authGuard();
  const validatedData = PostSchema.parse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  const newData: Prisma.PostUncheckedUpdateInput = {
    title: validatedData.title,
    body: validatedData.body,
  };

  const thumbnailFile = formData.get("thumbnail") as File;
  const thumbnailAction = formData.get("thumbnail-action") as string;
  const imagePath = `posts/${id}/thumbnail.png`;

  if (thumbnailAction === "delete") {
    newData.thumbnailURL = null;
    await deleteImage(imagePath);
  } else if (thumbnailFile) {
    newData.thumbnailURL = await putImage(formData, imagePath);
  }

  await db.post.update({
    where: {
      id,
      authorId,
    },
    data: newData,
  });

  revalidatePath("/");
};

export const deletePost = async (id: string, imageURL?: string | null) => {
  const uid = await authGuard();

  await db.post.delete({
    where: {
      id,
      authorId: uid,
    },
  });

  if (imageURL) {
    deleteImage(imageURL.replace(process.env.IMAGE_HOST_URL as string, ""));
  }

  revalidatePath("/");
  redirect("/");
};

export const getOwnPost = async (editId: string) => {
  const uid = await authGuard();

  return db.post.findUnique({
    where: {
      id: editId,
      authorId: uid,
    },
  });
};
