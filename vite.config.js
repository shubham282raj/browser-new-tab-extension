import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  return {
    base: mode === "ghpages" ? "/repo-name/" : "/", // change repo-name to your GitHub repo name
    plugins: [react(), tailwindcss()],
  };
});
