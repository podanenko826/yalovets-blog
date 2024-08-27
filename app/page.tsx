export default function Home() {
    return (
        <main className="mt-4 p-5">
            {/* First heading */}
            <div className="min-w-screen px-[330px]">
                <h1 className="font-sans font-bold text-[25px] text-slate-500">
                    Welcome to Yalovets Blog
                </h1>
                <h1 className="mt-3 font-sans font-extrabold text-[38px] text-zinc-600">
                    Your launchpad for <br />
                    Amazon Web <br />
                    Services (AWS)
                </h1>
                <h2 className="mt-5">
                    By Ivan Yalovets. Since 2024, I published 0 articles.
                </h2>
                <button className="mt-7 px-8 py-[18px] rounded-[5px] bg-red-500 hover:bg-red-600 active:bg-black active:outline outline-2 outline-zinc-600 duration-75 text-white font-semibold">
                    Start Reading
                </button>
            </div>

            {/* Second heading */}
            <div className="min-w-screen h-52 px-[330px] bg-gray-100 mt-32"></div>
        </main>
    );
}
