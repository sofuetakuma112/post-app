import { db } from "@/lib/prisma";
import Link from "next/link";

export default async function Page() {
  const posts = await db.post.findMany();

  return (
    <div>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>記事はありません</p>
      )}
    </div>
  );
}
