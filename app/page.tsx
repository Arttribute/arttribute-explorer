import { Metadata } from "next";
import Image from "next/image";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

import Link from "next/link";

export const metadata: Metadata = {
  title: "Arttribute",
  description:
    "Arttribute enables fair and transaparent use of art in the realm of genereative AI",
};

export default function DashboardPage() {
  return (
    <>
      <div className="md:hidden"></div>
      <div className="flex flex-col md:flex">
        <div className="fixed top-0 left-0 right-0 z-10 bg-white">
          <div className="border-b">
            <div className="flex h-16 items-center lg:px-8">
              <Logo text="Arttribute Explorer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
