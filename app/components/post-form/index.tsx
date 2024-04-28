import { createPost, deletePost, getOwnPost, updatePost } from "./action";
// import ImageCropper from "@/app/components/image-cropper";
// import SubmitButton from "@/app/components/submit-button";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

export default async function PostForm({ editId }: { editId?: string }) {
  const oldPost = editId ? await getOwnPost(editId) : null;

  const defaultValue = oldPost
    ? {
        title: oldPost.title,
        body: oldPost.body,
      }
    : {
        title: "",
        body: "",
      };

  return (
    <div>
      <form action={editId ? updatePost.bind(null, editId) : createPost}>
        <div>
          {oldPost?.thumbnailURL && (
            <div>
              <input
                type="checkbox"
                id="thumbnail-action"
                name="thumbnail-action"
                value="delete"
                className="peer"
              />
              <label htmlFor="thumbnail-action">削除</label>
              <img
                className="peer-checked:hidden"
                src={oldPost.thumbnailURL}
                alt=""
              />
            </div>
          )}
          <input type="file" name="thumbnail" accept="images/png,images/jpeg" />
        </div>
        <label htmlFor="body">タイトル*</label>
        <input
          type="text"
          name="title"
          placeholder=""
          defaultValue={defaultValue.title}
          id="title"
          required
        />
        <label htmlFor="body">本文*</label>
        <textarea
          maxLength={140}
          name="body"
          placeholder=""
          defaultValue={defaultValue.body}
          id="body"
          required
        />
        <button>{editId ? "更新" : "作成"}</button>****
      </form>

      {editId && oldPost && (
        <form action={deletePost.bind(null, editId, oldPost.thumbnailURL)}>
          <button>記事を削除</button>
        </form>
      )}
    </div>
  );
}
