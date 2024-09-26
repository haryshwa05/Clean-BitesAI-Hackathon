import HomePage from "@/components/HomePage/HomePage";
import Navbar from "@/components/Navbar/Navbar";
import UserDetails from "@/components/UserDetails/UserDetails";

export const metadata = {
  title: "Home Page",
  description: "This is the homepage of the app",
};


export default function Home() {
  return (
    <div className="">
      <HomePage />
    </div>
  );
}
