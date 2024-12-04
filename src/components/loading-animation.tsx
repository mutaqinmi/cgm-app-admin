export default function LoadingAnimation() {
    return <div className="w-screen h-screen flex flex-col justify-center items-center gap-4 bg-white z-50 fixed top-0 left-0">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        <div>
            <span className="mr-2">Tunggu sebentar</span>
            <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">.</span>
            <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">.</span>
            <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">.</span>
        </div>
    </div>
}