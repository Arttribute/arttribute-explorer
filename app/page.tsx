// "use client";
import { Metadata } from "next";
import Image from "next/image";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { UserNav } from "@/components/user-nav";
import { taskSchema } from "../data/schema";
import Cookie from "js-cookie";
import ky from "ky";

const apiURL = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000";
const api = ky.extend({
  prefixUrl: apiURL,
  hooks: {
    beforeRequest: [
      (request) => {
        const accessToken = Cookie.get("accessToken");
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
  },
});

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(path.join(process.cwd(), "/data/tasks.json"));

  const tasks = JSON.parse(data.toString());

  const results = await Promise.allSettled([
    api.get("v1/certificates", {}).json<any>(),
    api.get("v1/requests/received", {}).json<any>(),
  ]);

  const [certificates, requests] = map(results, (res) => {
    if (res.status == "fulfilled") {
      //   console.log(res.value);
      return res.value;
    }
    // console.log(res);
  });

  const sortedCerts = sortBy(
    map(certificates ?? [], (cert) => {
      cert = mapKeys(cert, (value, key) => {
        if (key == "description") {
          return "title";
        }
        return key;
      });
      cert = mapValues(cert, (value, key) => {
        if (key == "id") {
          return value.split("-")[0];
        }
        return value;
      });
      return merge(cert, { status: "", label: "", priority: "" });
    }),
    (event) => {
      return new Date(event.created);
    }
  );
  console.log(sortedCerts);

  return sortedCerts;

  return z.array(taskSchema).parse(tasks);
}

import Link from "next/link";
import {
  compact,
  flatMap,
  map,
  mapKeys,
  mapValues,
  merge,
  sortBy,
} from "lodash";

export const metadata: Metadata = {
  title: "Arttribute Explorer",
  description:
    "Arttribute enables fair and transaparent use of art in the realm of genereative AI",
};

export default async function DashboardPage() {
  const tasks = await getTasks();

  return (
    <>
      <div className="md:hidden"></div>
      <div className="flex flex-col md:flex">
        <div className="fixed top-0 left-0 right-0 z-10 bg-white">
          <div className="border-b">
            <div className="flex h-16 items-center lg:px-8">
              <Logo text="Arttribute Explorer" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16"></div>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Track how your work is being used
            </h2>
            <p className="text-muted-foreground">
              Enter your Item&apos;s or Collection&apos;s id to see all
              attributions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
