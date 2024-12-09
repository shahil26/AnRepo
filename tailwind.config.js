import withMT from "@material-tailwind/react/utils/withMT";
 
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkmode: "class",
  theme: {
    screens: {
      'mobile': '780px',
      'laptop': '1000px',
    },
    extend: {},
  },
  plugins: [],
});

