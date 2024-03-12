import Divider from "@/components/divider/divider"
import Navbar from "@/components/navbar/navbar"
import useCheck from "@/utils/check"

export default function Layout({ children }: any) {
    return (
        <>
            <Navbar />
            <Divider />
            <main>{children}</main>
        </>
    )
}