import { Link } from "~/components/Link";

const Page = () => {
  return (
    <div>
      <p>
        <Link href="/auth/sign-in">Sign in</Link>
      </p>
      <p>
        <Link href="/auth/sign-up">Sign up</Link>
      </p>
    </div>
  );
};

export default Page;
