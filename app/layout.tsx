import GlobalProfileGuard from "./components/reusables/profile_guard";
import ProvideWrapper from "./components/reusables/provider_wrapper";
import QueryProvider from "./contexts/query_provider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        <QueryProvider>
          <ProvideWrapper>
            <GlobalProfileGuard>{children}</GlobalProfileGuard>
          </ProvideWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
