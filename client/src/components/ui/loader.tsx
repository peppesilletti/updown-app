import logo from "@/assets/logo.webp";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen rounded-full">
      <motion.img
        src={logo}
        alt="Loading..."
        className="w-32 h-32 rounded-full"
        animate={{
          rotate: 360,
          filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"],
          opacity: [1, 0.5, 1],
        }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        style={{ filter: "hue-rotate(330deg)" }}
      />
    </div>
  );
};

export default Loader;
