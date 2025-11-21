import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'

const fontFamily = Inter({
	display: 'swap',
	subsets: ['latin'],
	variable: '--font-sans',
})

export const metadata: Metadata = {
	description: '',
	title: 'Lemind',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${fontFamily.variable} antialiased`}>{children}</body>
		</html>
	)
}
