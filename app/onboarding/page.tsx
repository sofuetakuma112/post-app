import { createUser } from "./action";

export default async function UserForm() {
  return (
    <form action={createUser}>
      <label htmlFor="name">名前</label>
      <input type="text" id="name" defaultValue="" required name="name" />
      <button>作成</button>
    </form>
  );
}
