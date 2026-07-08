export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-0">
      <div className="text-center px-6">
        <h1 className="text-8xl font-extrabold text-[#0b2e6f] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
    </div>
  );
}
