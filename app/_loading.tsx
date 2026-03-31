import { LineLoader } from "@/app/components/reusables/line_loader";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LineLoader className="scale-125" />
    </div>
  );
}
