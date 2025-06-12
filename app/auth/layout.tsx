const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-radial-[at_top] from-sky-400 via-sky-600 to-blue-800">
      {children}
    </div>
  );
};

export default AuthLayout;
