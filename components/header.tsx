import { Button } from "@/components/ui/button";
import {
  SignedIn,
  UserButton,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <header>
      <span>ロゴ</span>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button variant="outline">ログイン</Button>
        </SignInButton>
        <SignUpButton>
          <Button>新規登録</Button>
        </SignUpButton>
      </SignedOut>
    </header>
  );
}
