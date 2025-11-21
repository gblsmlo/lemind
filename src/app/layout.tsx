import type { Metadata } from "next";
import "./globals.css";
import { fontFamily } from "../shared/font-family";

export const metadata: Metadata = {
	title: "Lemind",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${fontFamily.variable} antialiased`}>{children}</body>
		</html>
	);
}
