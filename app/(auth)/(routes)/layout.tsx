export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full flex h-screen  items-center justify-center bg-[url(./assets/img/bg_auth.jpg)] bg-cover ">
      <div className="w-full max-w-md justify-center flex">{children}</div>
    </div>
  )
}