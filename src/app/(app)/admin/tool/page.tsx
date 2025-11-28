import { Tool } from "@/features/tool";

export default function ToolPage() {
    return (
        <div className="w-full bg-gray-50 p-4 md:p-8 flex items-center justify-center">
            <div className="w-full max-w-5xl">
                <Tool />
            </div>
        </div>
    );
}