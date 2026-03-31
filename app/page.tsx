import { LineLoader } from "./components/reusables/line_loader";
import AuthPage from "./components/rootpage/leftpanel";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<LineLoader className="scale-125" />}>
      <AuthPage />;
    </Suspense>
  );
}
