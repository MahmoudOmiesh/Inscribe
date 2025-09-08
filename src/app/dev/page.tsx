import { notFound } from "next/navigation";
import { Testing } from "./testing";

export default function Dev() {
  const env = process.env.NODE_ENV;
  const isDev = env === "development";

  if (!isDev) {
    notFound();
  }

  return (
    <div className="grid min-h-screen place-items-center">
      <Testing />
    </div>
  );
}
