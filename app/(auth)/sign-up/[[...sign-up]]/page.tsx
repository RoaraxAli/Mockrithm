import { SignUp } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-6rem)] py-10">
      <SignUp routing="path" path="/sign-up" />
    </div>
  );
};

export default Page;
