import Image from "next/image";
import globe from "../assets/Icon/language-svgrepo-com.svg";
import bell from "../assets/Icon/bell.svg";
import user from "@/assets/user.svg";

/**
 * Main top header
 */
export default function AppHeader() {
    return (
        <header className="flex items-center h-16 px-8 bg-[#18191A] border-b border-[#242526]">
            {/* <Image src={logo} alt="SAGER Logo" className="h-10 w-auto" priority /> */}
            <div className="text-2xl font-bold text-white">Drone Tracker</div>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
                <button title="Notifications">
                    <Image src={bell} alt="Notifications" width={24} height={24} />
                </button>
                <button title="Languages">
                    <Image src={globe} alt="Languages" width={24} height={24} />
                </button>
                <div className="flex items-center gap-2 ml-6">
                    {/* <Image src={user} alt="User" width={32} height={32} className="rounded-full" /> */}
                    <div>
                        <div className="text-sm font-semibold">Hello, Mohammed Omar</div>
                        <div className="text-xs text-[#4ADE80]">Technical Support</div>
                    </div>
                </div>
            </div>
        </header>
    );
}