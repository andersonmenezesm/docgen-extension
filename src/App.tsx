import { Toaster } from "sonner";
import { Wrapper } from "./components/app/wrapper";

export function App() {
  return (
    <>
      <Wrapper />
      <Toaster richColors position="bottom-center" />
    </>
  );
}
