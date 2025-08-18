import Testing from "./testing";

export default function Home() {
  return (
    <div className="grid flex-1 place-items-center">
      <div className="w-full max-w-2xl">
        <div className="bg-card">
          <Testing />
        </div>
      </div>
    </div>
  );
}
