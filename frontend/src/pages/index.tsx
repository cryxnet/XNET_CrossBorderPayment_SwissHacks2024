import { Inter } from "next/font/google";
import data from "@/util/mock.json"
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const user = data.user
  return (
    <div className={"p-6"}>
      <p className={"text-4xl"}>Hello, {" " + user.first_name + " " + user.last_name}</p>
    </div>
  );
}
