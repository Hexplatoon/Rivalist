import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}