import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h2>Mini project</h2>
      <Button variant="ghost">Okay</Button>

      <UserButton/>
    </div>
  );
}
