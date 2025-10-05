import { motion, AnimatePresence } from "motion/react";
import { useContext } from "react";
import { AlertContext } from "./AlertProvider";
import { Util } from "@/Util/util";

export default function Alert() {
  const AlertData = useContext(AlertContext);

  return (
    <>
      <div className={`bg-black w-full h-full fixed  top-0 z-60 ${AlertData.showing ? "opacity-65" : "opacity-0"}`} style={{
        display: AlertData.showing ? "" : "none"
      }}
      onClick={() => AlertData.setShowing(false)}
      >

      </div>
      <AnimatePresence>
        {AlertData.showing == true && (
          <motion.div
            initial={{ y: -200 }}
            animate={{ y: 0 }}
            exit={{ y: -200 }}
            transition={{ duration: 0.5 }}
            className=" flex fixed flex-col items-center gap-2 z-[80] outline-1 outline-border top-1 left-1/2 transform -translate-x-1/2 p-4 bg-panel1  rounded-md max-w-100 w-[80%]">
            <h1 className="text-lg font-semibold text-title ">{AlertData.title}</h1>
            <h1 className="text-md text-subtext2 text-center ">
              {Util.capFirst(AlertData.message)}
            </h1>
            <div className="flex justify-center  w-full">
              <button
                className="mt-2 bg-btn text-btn-text font-medium text-sm p-1 rounded-md pl-2 pr-2 hover:cursor-pointer w-full"
                onClick={() => {
                  AlertData.setShowing(false);
                }}>
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
