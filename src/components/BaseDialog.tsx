import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BaseDialog = ({ isOpen, onClose, children }: BaseDialogProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[51] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 z-[51] bg-white h-full w-full lg:w-1/2 shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="h-full overflow-y-scroll custom-scroll p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BaseDialog;
