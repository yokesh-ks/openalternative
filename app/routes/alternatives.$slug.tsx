import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { MoveRightIcon } from "lucide-react"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Button } from "~/components/Button"
import { Card } from "~/components/Card"
import { Favicon } from "~/components/Favicon"
import { Grid } from "~/components/Grid"
import { H3 } from "~/components/Heading"
import { Intro } from "~/components/Intro"
import { ToolRecord } from "~/components/records/ToolRecord"
import { AlternativeOne, alternativeOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: (data?: { alternative: AlternativeOne }) => {
    if (!data?.alternative) return <BackButton to="/" />

    const { slug, name } = data.alternative

    return <BreadcrumbsLink to={`/alternatives/${slug}`} label={name} />
  },
}

export const meta: MetaFunction<typeof loader> = ({ matches, data }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const alternative = await prisma.alternative.findUniqueOrThrow({
      where: { slug },
      include: alternativeOnePayload,
    })

    const meta = {
      title: `Best Open Source ${alternative.name} Alternatives`,
      description: `A collection of the best open source ${alternative.name} alternatives. Find the best alternatives for ${alternative.name} that are open source and free to use/self-hostable.`,
    }

    return json({ meta, alternative }, { headers: JSON_HEADERS })
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function AlternativesPage() {
  const { meta, alternative } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro
        title={meta.title}
        description={`Find the best alternatives to ${alternative.name} that are open source and free to use/self-hostable.`}
      />

      <Grid>
        <Card className="group bg-background" asChild>
          <Link to={alternative.website} target="_blank" rel="noopener noreferrer nofollow">
            <Card.Header>
              <Favicon src={alternative.faviconUrl} title={alternative.name} />

              <H3 className="truncate">{alternative.name}</H3>
            </Card.Header>

            {alternative.description && (
              <p className="relative -tracking-0.5 line-clamp-4 text-sm/normal text-secondary">
                {alternative.description}
              </p>
            )}

            <Button
              variant={alternative.website.includes("go.") ? "fancy" : "primary"}
              size="md"
              className="mt-auto pointer-events-none"
              suffix={<MoveRightIcon className="duration-150 group-hover:translate-x-0.5" />}
              asChild
            >
              <span>Visit Website</span>
            </Button>
          </Link>
        </Card>

        {alternative.tools.map(({ tool }) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!alternative.tools?.length && (
          <p className="col-span-full">No Open Source alternatives found.</p>
        )}
      </Grid>

      <BackButton to="/alternatives" />
    </>
  )
}
