import type { Metadata } from "next";
import MozartContentfulPage from "@/components/products/MozartContentfulPage";

async function getMozartPage() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const token = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !token) {
    throw new Error("Missing Contentful environment variables");
  }

  const url =
  `https://cdn.contentful.com/spaces/${spaceId}` +
  `/environments/${process.env.CONTENTFUL_ENVIRONMENT || "master"}/entries` +
  `?access_token=${token}` +
  `&content_type=productPage` +
  `&limit=100`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Contentful request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  const entry = data.items.find(
    (item: any) =>
      item.fields?.Title === "Mozart Orchestrator" ||
      item.fields?.title === "Mozart Orchestrator"
  );

  if (!entry) {
    throw new Error("Mozart Orchestrator Contentful entry not found");
  }

  return entry.fields;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getMozartPage();

  return {
    title:
      page.metaTitle || "Mozart Orchestrator | Automation Anywhere",
    description:
      page.metaDescription ||
      "The Mozart Orchestrator manages decisions, dependencies, context, and exceptions, enabling AI agents to plan, reason, and collaborate across bots, systems, data, and human touchpoints—and deliver resiliency at enterprise scale.",
  };
}

export default async function MozartOrchestratorPage() {
  const page = await getMozartPage();

  return (
    <MozartContentfulPage
      html={page.html || ""}
      css={page.css || ""}
    />
  );
}