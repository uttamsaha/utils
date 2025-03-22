"use client";
import { CrosIcon, ToastTickIcon } from "@/assets/icons";
import { toast } from "sonner";

export const triggerToast = (msg, status = "success") => {
  toast.custom(
    (t) => (
      <div
        className={`flex toast_shadow m-w-[400px] md:min-w-[400px] w-full items-center h-[66px] pl-6 pr-4 rounded-[4px] relative md:right-4 ${
          status === "success"
            ? "bg-[#16A34A] text-white border-[#34D399]"
            : status === "failed"
            ? "bg-[#EF4444] text-white border-[#EF4444]"
            : ""
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <ToastTickIcon />
            <h4 className="m-0 text-base w-full leading-[22px] font-semibold">
              {msg}
            </h4>
          </div>
          <button onClick={() => toast.dismiss(t)}>
            <CrosIcon />
          </button>
        </div>
      </div>
    ),
    //! duration if needed 
    // { duration: 500000 } 
  );
};


//toaster
 <Toaster position="top-right"
            toastOptions={{
              unstyled: true,
            }}
          />
