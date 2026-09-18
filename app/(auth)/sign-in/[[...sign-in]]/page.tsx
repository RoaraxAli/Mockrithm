import { SignIn } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-6rem)] py-10">
      <SignIn routing="path" path="/sign-in" />
    </div>
  );
};

export default Page;
