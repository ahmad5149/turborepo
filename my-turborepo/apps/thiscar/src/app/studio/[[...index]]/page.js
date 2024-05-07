"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
//added to open studio
export default function Studio() {
    return <NextStudio config={config} />;
}
