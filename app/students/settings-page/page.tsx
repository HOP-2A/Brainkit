"use client";
import StudentSideBar from "../_components/StudentSideBar";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <StudentSideBar />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          <div className="mt-4 h-[2px] bg-gray-300 rounded -mx-8" />
          <div className="flex items-strech ]">
            <div className="flex flex-col">
              <div className="w-[240px] h-[40px] px-10 text-gray-600 text-2xl mt-[30px] font-bold hover:bg-gray-300 hover:text-gray-600 rounded-lg">
                Profile <hr className="h-[2px] bg-gray-400 border-0" />
              </div>
              <div className="w-[240px] h-[40px] px-10 text-gray-600 text-2xl mt-[30px] font-bold hover:bg-gray-300 hover:text-gray-600 rounded-lg">
                Plan <hr className="h-[2px] bg-gray-400 border-0" />
              </div>
              <div className="w-[240px] h-[40px] px-10 text-gray-600 text-2xl mt-[30px] font-bold hover:bg-gray-300 hover:text-gray-600 rounded-lg">
                Edit Info <hr className="h-[2px] bg-gray-400 border-0" />
              </div>
              <div className="w-[240px] h-[40px] px-10 text-gray-600 text-2xl mt-[30px] font-bold hover:bg-gray-300 hover:text-gray-600 rounded-lg">
                Social <hr className="h-[2px] bg-gray-400 border-0" />
              </div>
              <div className="w-[240px] h-[40px] px-10 text-gray-600 text-2xl mt-[30px] font-bold hover:bg-gray-300 hover:text-gray-600 rounded-lg">
                Support <hr className="h-[2px] bg-gray-400 border-0" />
              </div>
              <div className="w-[240px] h-[40px] px-10 text-gray-600 text-2xl mt-[30px] font-bold hover:bg-gray-300 hover:text-gray-600 rounded-lg">
                Privacy <hr className="h-[2px] bg-gray-400 border-0" />
              </div>
            </div>
            <div className="w-[3px] bg-gray-300 mr-5 self-stretch" />
            <div className="flex w-full flex-col gap-5 mt-5 ml-[20px]">
              <div className="flex--1 h-[180px] rounded-lg border-2 border-gray-300 p-4">
                <div className="text-3xl font-bold">Profile </div>
                <div className="font-semibold mt-2">
                  Username: <span></span>
                </div>
                <div className="font-semibold mt-2">Email:</div>
                <div className="font-semibold mt-2">
                  Dashboard Layout: Student
                </div>
              </div>

              <div className="flex-1 h-[200px] rounded-lg border-2 border-gray-300 p-4">
                <div className="text-3xl font-bold">Plan</div>
                <div className="text-3xl mt-[5px] font-extrabold">
                  BrainKet{" "}
                  <span className="font-semibold text-3xl text-cyan-400">
                    Starter
                  </span>
                </div>
                <Button
                  className="w-[250px]  h-[50px] bg-[#FF7B25] text-white text-2xl font-bold py-4
                shadow-[0_8px_0_#B2571A] transition-all duration-200 ease-out
                hover:bg-[#FF8929] hover:brightness-110 hover:-translate-y-1
                hover:shadow-[0_12px_0_#B2571A] mt-[20px]"
                >
                  Upgrade NOW!!
                </Button>
              </div>

              <div className="flex--1 h-[230px] rounded-lg border-2 border-gray-300 p-4">
                <div className="text-3xl font-bold">Edit Profile</div>
                <div className="flex flex-col items-start gap-2 mt-4">
                  <button className="underline underline-offset-2 text-[20px] text-cyan-400">
                    Change Name
                  </button>
                  <button className="underline underline-offset-2 text-[20px] text-cyan-400">
                    Change Email
                  </button>
                  <button className="underline underline-offset-2 text-[20px] text-cyan-400">
                    Permanently Delete Account
                  </button>
                  <button className="underline underline-offset-2 text-[20px] text-cyan-400">
                    Change Name
                  </button>
                </div>
              </div>

              <div className="flex--1 h-[210px] rounded-lg border-2 border-gray-300 p-4">
                <div className="text-3xl font-bold">Social</div>
                <div className="flex flex-col items-start gap-2 mt-4">
                  <button className="underline underline-offset-2 text-[20px] text-cyan-400">
                    Twitter(@PlayBl)
                  </button>
                  <button className="underline underline-offset-2 text-[20px] text-cyan-400">
                    Instagram(@PlayBl)
                  </button>
                  <button className="underline underline-offset-2 text-[20px] text-cyan-400">
                    Facebook(@PlayBl)
                  </button>
                </div>
              </div>

              <div className="flex--1 h-[210px] rounded-lg border-2 border-gray-300 p-4">
                <div className="text-3xl font-bold">Support</div>
                <div className="flex flex-col items-start gap-2 mt-4">
                  <button className="underline underline-offset-2 text-[20px] text-cyan-400">
                    View Our Help Center
                  </button>
                  <button className="underline underline-offset-2 text-[20px] text-cyan-400">
                    Frequently Asked Questions
                  </button>
                  <button className="text-[20px] text-black">
                    Contact us at:
                    <span className="underline underline-offset-2 text-cyan-400">
                      {" "}
                      Contact Us@blooket.com
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex--1 h-[170px] rounded-lg border-2 border-gray-300 p-4">
                <div className="text-3xl font-bold">Privacy</div>
                <div className="flex flex-col items-start gap-2 mt-4">
                  <button className="underline underline-offset-2 text-[20px] text-cyan-400">
                    Privacy Policy
                  </button>
                  <button className="underline underline-offset-2 text-[20px] text-cyan-400">
                    Terms of Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
