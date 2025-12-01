import LoginForm from "./login/page";
export default function Home() {
  return (
   <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join us today and get started</p>
        </div>
        <LoginForm />
      </div>
    </main>
  
  );
}
