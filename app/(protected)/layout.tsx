import Navbar from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-radial-[at_top] from-sky-400 via-sky-600 to-blue-800">
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
