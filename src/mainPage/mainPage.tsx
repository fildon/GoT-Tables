import React from "react";
import { CharacterTable } from "../characterTable/characterTable";

export const MainPage = (): JSX.Element => {
  return (
    <>
      <header className="banner">
        <div className="bannerContent">
          <h1>🪑 GoT Tables?</h1>
        </div>
      </header>
      <section>
        <h2>Characters</h2>
        <article>
          <CharacterTable />
        </article>
      </section>
    </>
  );
};
