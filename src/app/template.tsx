"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// template.tsx remounts on every navigation. Only fade in on client-side
// route changes — never on the very first page load, where an opacity:0
// start would delay first paint (worse on slow devices/connections, where
// the whole page can appear blank for a noticeable stretch).
let hasMountedBefore = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const [isFirstMount] = useState(() => !hasMountedBefore);
  useEffect(() => {
    hasMountedBefore = true;
  }, []);

  return (
    <motion.div
      initial={isFirstMount ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
