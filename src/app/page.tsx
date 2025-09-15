import { getPublicCSVs } from "@/lib/getPublicCSVs";
import HomePageClient from "./HomePageClient";

export default async function Page() {
  const publicCSVs = getPublicCSVs(); // runs only on server

  return <HomePageClient publicCSVs={publicCSVs} />;
}
