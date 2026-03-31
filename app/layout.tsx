import GlobalProfileGuard from "./components/reusables/profile_guard";
import ProvideWrapper from "./components/reusables/provider_wrapper";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        <ProvideWrapper>
          <GlobalProfileGuard>{children}</GlobalProfileGuard>
        </ProvideWrapper>
      </body>
    </html>
  );
}
