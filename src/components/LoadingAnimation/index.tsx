export const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img
        src='/public/boarLogo.png'
        alt="Boar"
        className="w-48 h-auto m-0 animate-bounce"
      />
      <div className="text-3xl font-bold m-0">Loading...</div>
    </div>
  );
}