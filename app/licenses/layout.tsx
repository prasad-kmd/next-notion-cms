import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Licenses",
  description:
    "Third-party libraries, fonts, and assets used in this platform.",
};

export default function LicensesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
