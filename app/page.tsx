import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import Cta from "@/components/CTA";
import { recentSessions } from "@/constants";
import { getAllCompanions, getRecentSessions } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import React from "react";

const Page = async () => {

  const companions = await getAllCompanions({ limit: 3 })
  const recentSessionsCompanions =  await getRecentSessions(10) 
  return (
    <main className="text-2xl">
      <h1 className="text-2xl">Popular Companions</h1>

      <section className="home-section">
        {
          companions?.map((companion) => {
            return <CompanionCard
            {...companion}
            key={companion.id}
            color={getSubjectColor(companion.subject)}
            />
          })
        }
      </section>
      <section className="home-section">
        <CompanionsList 
        title="Recently completed sessions"
        companions={recentSessionsCompanions}
        classNames="w-2/3 max-lg:w-full"
        />
        <Cta />
      </section>
    </main>
  );
};

export default Page;
