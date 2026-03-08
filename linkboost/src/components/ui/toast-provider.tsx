import * as React from "react";
import { Toaster } from "sonner";

const ToastProvider: React.FC = () => (
  <Toaster
    theme="dark"
    position="bottom-right"
    toastOptions={{
      style: {
        background: "#1A1A1F",
        border: "1px solid #27272A",
        color: "#FAFAFA",
        fontSize: "14px",
      },
      className: "linkboost-toast",
    }}
    richColors
    closeButton
  />
);

ToastProvider.displayName = "ToastProvider";

export { ToastProvider };
