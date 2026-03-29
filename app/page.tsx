import AuthPage from "./components/rootpage/leftpanel";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <AuthPage />;
    </Suspense>
  );
}
