import { authGuard } from "@/app/actions/auth";
import PostForm from "@/app/components/post-form";
import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Page({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const authorId = await authGuard();

  // Postがログインユーザーのものかチェック
  const post = await db.post.findUnique({
    where: {
      id,
      authorId,
    },
  });
  if (!post) {
    notFound();
  }

  return <PostForm editId={id} />;
}
