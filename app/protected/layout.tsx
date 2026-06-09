import { CommandMenu } from "@/components/CommandMenu";
import { MenuTrigger } from "@/components/MenuTrigger";
import { Toaster } from "@/components/ui/sonner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MenuTrigger />
      <CommandMenu />
      {children}
      <Toaster />
    </>
  );
}